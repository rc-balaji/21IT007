import React from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // eslint-disable-next-line react/prop-types
    navigate(`/product/${product.category}/${product.id}`);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{product.productName}</Card.Title>
        <Card.Text>Price: ${product.price}</Card.Text>
        <Button variant="primary" onClick={handleViewDetails}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
