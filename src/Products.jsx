import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import Navbar from "./Navbar";

const products = [
  {
    id: 1,
    title: "Coastal Bloom",
    medium: "Acrylic on canvas",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
    description:
      "A soft layered piece inspired by sea air, pastel skies, and early light over South Golden Beach.",
  },
  {
    id: 2,
    title: "Saltwater Lines",
    medium: "Mixed media",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&q=80",
    description:
      "An expressive abstract work balancing texture, line, and movement from the coastline.",
  },
  {
    id: 3,
    title: "Earth Vessel",
    medium: "Handmade ceramic",
    price: 145,
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&q=80",
    description:
      "A one-off ceramic piece shaped by hand and finished with a warm natural glaze.",
  },
];

export default function Products({ cart = [], setCart }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  const addToCart = (product) => {
    if (!setCart) return;
    setCart((prev) => [...prev, { ...product, type: "product" }]);
  };

  return (
    <div className="products-page">
      <Navbar cartCount={cart.length} />

      <header className="products-hero">
        <p className="products-hero__eyebrow">Original Artwork Collection</p>
        <h1>Bring a piece of the studio home.</h1>
        <p className="products-hero__copy">
          Browse a curated collection of original artwork and handmade ceramics inspired
          by South Golden Beach and Byron Bay's coastal rhythm.
        </p>
      </header>

      <section className="products-grid">
        {products.map((product) => (
          <article
            key={product.id}
            className={`product-card ${selectedId === product.id ? "product-card--active" : ""}`}
            onMouseEnter={() => setSelectedId(product.id)}
            onMouseLeave={() => setSelectedId(null)}
          >
            <img src={product.image} alt={product.title} className="product-card__image" />
            <div className="product-card__body">
              <p className="product-card__medium">{product.medium}</p>
              <h2>{product.title}</h2>
              <p className="product-card__description">{product.description}</p>
              <div className="product-card__footer">
                <strong>${product.price}</strong>
                <button type="button" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
