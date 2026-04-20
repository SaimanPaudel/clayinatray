import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Products({ setPage, setCartCount }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">Original Artwork Collection</h2>
      <p className="page-subtitle">
        Explore Jolene's original artworks for sale. Each piece is unique and
        captures the creative spirit of South Golden Beach and the coastal
        lifestyle.
      </p>

      <div className="grid">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            setPage={setPage}
            setCartCount={setCartCount}
          />
        ))}
      </div>

      <div className="about-section">
        <div className="about-title">About Jolene's Art</div>
        <div className="about-grid">
          <div className="about-item">
            <h4>Original Artworks</h4>
            <p>Each piece is an original creation by Jolene, not a reproduction</p>
          </div>
          <div className="about-item">
            <h4>Coastal Inspired</h4>
            <p>Art inspired by the natural beauty of South Golden Beach</p>
          </div>
          <div className="about-item">
            <h4>Unique</h4>
            <p>Each artwork is one-of-a-kind — own something truly special</p>
          </div>
        </div>
      </div>
    </div>
  );
}