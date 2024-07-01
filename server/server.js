const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const TOKEN = process.env.TOKEN;

app.use(cors());

const productDetailsCache = new Map();

app.get("/categories/:categoryname/products", async (req, res) => {
  const { categoryname } = req.params;
  const { company, n, sort, order } = req.query;

  const topN = parseInt(n, 10);

  try {
    const companyProducts = await fetchProductsFromAPI(
      company,
      categoryname,
      topN,
      1,
      10000
    );
    if (companyProducts.error) {
      return res.status(403).json({ error: companyProducts.error });
    }

    let products = companyProducts;

    if (sort && ["price", "rating", "discount"].includes(sort)) {
      products.sort(
        (a, b) => (a[sort] - b[sort]) * (order === "desc" ? -1 : 1)
      );
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

const generateProductId = (company, productName) => {
  if (productName && company) {
    return `${company}-${productName.replace(/\s+/g, "-")}-${Date.now()}`;
  } else {
    console.error("Invalid product or product name:", productName);
    return `${company}-undefined-product-${Date.now()}`;
  }
};

async function fetchProductsFromAPI(
  company,
  category,
  topN,
  minPrice,
  maxPrice
) {
  const url = `http://localhost:3000/test/companies/${company}/categories/${category}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data.map((product) => {
      const productId = generateProductId(company, product.productName);
      productDetailsCache.set(productId, product);
      return { ...product, id: productId };
    });
  } catch (error) {
    console.error("Error fetching products from API:", error.message);
    if (error.message.includes("403")) {
      return { error: "Forbidden access to the API" };
    }
    return [];
  }
}

app.get("/categories/:categoryname/products/:productid", (req, res) => {
  const { productid } = req.params;
  if (productDetailsCache.has(productid)) {
    res.json(productDetailsCache.get(productid));
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
