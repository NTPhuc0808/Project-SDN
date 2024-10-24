import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img
        src={
          product.images && product.images.length > 0
            ? product.images[0].url
            : "placeholder.jpg"
        }
        alt={product.name}
      />
      <p>{product.name}</p>
      <div>
        <Rating {...options} />
        <span className="productCardSpan">
          {" "}({product.numOfReviews || 0} Reviews)
        </span>
      </div>
      <span>{`${product.price?.toLocaleString('vi-VN')} VND`}</span>
    </Link>
  );
};

export default ProductCard;
