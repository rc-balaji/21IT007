// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard.jsx"; // Create a separate component for product card

// Define the ProductList component
function ProductList() {
  // Define state variables
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState("AMZ");
  const [category, setCategory] = useState("Phone");
  const [n, setN] = useState(20);
  const [sort, setSort] = useState("price");
  const [order, setOrder] = useState("asc");

  // Array of companies and categories
  const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
  const categories = [
    "Phone",
    "Computer",
    "TV",
    "Earphone",
    "Tablet",
    "Charger",
    "Mouse",
    "Keypad",
    "Bluetooth",
    "Pendrive",
    "Remote",
    "Speaker",
    "Headset",
    "Laptop",
    "PC",
  ];

  // Fetch products based on selected criteria
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/categories/${category}/products`,
          {
            params: { n, company, sort, order },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchProducts();
  }, [category, n, company, sort, order]);

  // Return JSX for product list page
  return (
    <div>
      {/* Filters and sorting options */}
      <div className="mb-3">
        {/* Dropdown for company selection */}
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="form-select"
        >
          {companies.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>
        {/* Dropdown for category selection */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {/* Input for number of products to display */}
        <input
          type="number"
          value={n}
          onChange={(e) => setN(e.target.value)}
          className="form-control"
        />
        {/* Dropdown for sorting */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="form-select"
        >
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="discount">Discount</option>
        </select>
        {/* Dropdown for sorting order */}
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="form-select"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {/* Product cards */}
      <div className="row">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
