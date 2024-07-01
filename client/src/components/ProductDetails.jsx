import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductDetails() {
  const { id, category } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/categories/${category}/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product: ", error);
      }
    };
    fetchProduct();
  }, [id, category]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="mb-4">Product Detail</h1>
      <div className="card w-50">
        <div className="card-body">
          <h5 className="card-title text-center">{product.productName}</h5>
          <p className="card-text text-left">Price: ${product.price}</p>
          <p className="card-text text-left">
            Rating: {product.rating || "N/A"}
          </p>
          <p className="card-text text-left">Discount: {product.discount}%</p>
          <p className="card-text text-left">
            Availability: {product.availability}
          </p>
          <p className="card-text text-left">Category: {product.category}</p>
          <p className="card-text text-left">Company: {product.company}</p>
          <p className="card-text text-left">Product ID: {id}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
