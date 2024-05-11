const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE1NDI3NzcyLCJpYXQiOjE3MTU0Mjc0NzIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjlmZDkyMTdiLWQxOGItNDFhYS05MDg2LTc0NTUzYjk4MDU3MiIsInN1YiI6InJjYmFsYWppMjAwM0BnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJOR1BJVCIsImNsaWVudElEIjoiOWZkOTIxN2ItZDE4Yi00MWFhLTkwODYtNzQ1NTNiOTgwNTcyIiwiY2xpZW50U2VjcmV0IjoiV3FhVlR6RHREeWxhWXJDZCIsIm93bmVyTmFtZSI6IkJhbGFqaSIsIm93bmVyRW1haWwiOiJyY2JhbGFqaTIwMDNAZ21haWwuY29tIiwicm9sbE5vIjoiMjFJVDAwNyJ9.hyNm-LSTJx6wG8lSSv0t1-Cn9I9S2vV8SRIQvpa5Ixg";
const productDetailsCache = new Map();

// Generate a unique identifier for each product
const generateProductId = (company, product) => {
  if (product && product.name) {
    return `${company}-${product.name.replace(/\s+/g, "-")}-${Date.now()}`;
  } else {
    console.error("Invalid product or product name:", product);
    return `${company}-undefined-product-${Date.now()}`;
  }
};

// Fetch products from external API
async function fetchProductsFromAPI(
  company,
  category,
  topN,
  minPrice,
  maxPrice
) {
  const url = `http://20.244.56.144/test/companies/${company}/categories/${category}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    const data = await response.json();
    // Generate unique IDs and cache product details
    return data.map((product) => {
      const productId = generateProductId(company, product);
      productDetailsCache.set(productId, product);
      return { ...product, id: productId };
    });
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

app.use(cors());
// GET products within a category with sorting and pagination
app.get("/categories/:categoryname/products", async (req, res) => {
  const { categoryname } = req.params;
  const { n, page, sort, order } = req.query;

  const topN = parseInt(n, 10) || 10;
  const currentPage = parseInt(page, 10) || 1;
  const sortOrder = order === "desc" ? -1 : 1;

  // Request data from all companies
  const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
  let products = [];

  try {
    for (const company of companies) {
      const companyProducts = await fetchProductsFromAPI(
        company,
        categoryname,
        topN,
        1,
        10000
      ); // Use actual min and max price if needed
      products = products.concat(companyProducts);
    }

    // Sorting based on query parameters
    if (sort && ["price", "rating", "company", "discount"].includes(sort)) {
      products.sort((a, b) => (a[sort] - b[sort]) * sortOrder);
    }

    // Implement pagination if n exceeds 10
    if (topN > 10) {
      const startIndex = (currentPage - 1) * topN;
      const endIndex = startIndex + topN;
      products = products.slice(startIndex, endIndex);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET details of a specific product
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
