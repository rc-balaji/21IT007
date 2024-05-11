// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Define the ProductDetails component
function ProductDetails() {
  // Define state variables
  const { id } = useParams();
  const [product, setProduct] = useState({});

  // Fetch product details based on ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/categories/phones/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product: ", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Check if the image URL is available and if not provide a default placeholder
  const imageUrl = product.image ? product.image : "placeholder-image-url.jpg";

  // Return JSX for product details page
  return (
    <div className="card">
      {/* Conditional rendering of the product image */}
      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.productName || "Product Image"}
      />
      <div className="card-body">
        {/* Product name */}
        <h5 className="card-title">{product.productName}</h5>
        {/* Product price */}
        <p className="card-text">Price: ${product.price}</p>
        {/* Product rating */}
        <p className="card-text">Rating: {product.rating || "N/A"}</p>
        {/* Product discount */}
        <p className="card-text">Discount: {product.discount}%</p>
        {/* Product availability */}
        <p className="card-text">Availability: {product.availability}</p>
      </div>
    </div>
  );
}

export default ProductDetails;
