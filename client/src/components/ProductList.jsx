import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductList() {
  const initialCompany = localStorage.getItem("company") || "AMZ";
  const initialCategory = localStorage.getItem("category") || "Phone";
  const initialN = localStorage.getItem("n") || 20;
  const initialSort = localStorage.getItem("sort") || "price";
  const initialOrder = localStorage.getItem("order") || "asc";

  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState(initialCompany);
  const [category, setCategory] = useState(initialCategory);
  const [n, setN] = useState(initialN);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);

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
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchProducts();
  }, [category, n, company, sort, order]);

  useEffect(() => {
    localStorage.setItem("company", company);
  }, [company]);

  useEffect(() => {
    localStorage.setItem("category", category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem("n", n);
  }, [n]);

  useEffect(() => {
    localStorage.setItem("sort", sort);
  }, [sort]);

  useEffect(() => {
    localStorage.setItem("order", order);
  }, [order]);

  return (
    <div className="container">
      <h1 className="text-center mt-5 mb-4">E-Commerce Website</h1>
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">Category</label>
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
        </div>
        <div className="col-md-3">
          <label className="form-label">Company</label>
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
        </div>
        <div className="col-md-2">
          <label className="form-label">No of Products</label>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            className="form-control"
            min={0}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="form-select"
          >
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="discount">Discount</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Order</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="form-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className="row">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="col-md-4 mb-3">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-md-12 text-center mt-5">
            <h3>No Results Found</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
