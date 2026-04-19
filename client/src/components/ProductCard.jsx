import { useState } from "react";
import axios from "axios";

export default function ProductCard({ product, setPage, setCartCount }) {
  const [adding, setAdding] = useState(false);

  const addToCart = () => {
    setAdding(true);
    axios
      .post("http://localhost:5000/api/cart", { productId: product.id })
      .then((res) => {
        // Update cart count in navbar
        const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
        setAdding(false);
        // Navigate to cart page
        setPage("cart");
      })
      .catch((err) => {
        console.error("Add to cart failed:", err);
        setAdding(false);
      });
  };

  return (
    <div className="card">
      <img src={product.image} alt={product.title} />
      <div className="card-content">
        <div className="category">{product.category}</div>
        <div className="title-text">{product.title}</div>
        <div className="desc">{product.description}</div>
        <div className="bottom">
          <div className="price">${product.price}</div>
          <button onClick={addToCart} disabled={adding}>
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}