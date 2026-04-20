import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Products.css";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
  { name: "Gallery", path: "/gallery" },
  { name: "Accommodation", path: "/accommodation" },
  { name: "Products", path: "/products" },
  { name: "Contacts", path: "/contacts" },
];

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
      <nav className="products-navbar">
        <button
          type="button"
          className="products-navbar__logo"
          onClick={() => navigate("/")}
        >
          Clay in a Tray
        </button>

        <ul className="products-navbar__links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `products-navbar__link ${isActive ? "products-navbar__link--active" : ""}`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="products-navbar__icons">
          <button
            type="button"
            className="products-navbar__icon"
            onClick={() => navigate("/cart")}
          >
            🛒 <span>({cart.length})</span>
          </button>
          <button type="button" className="products-navbar__icon" aria-label="Menu">
            ☰
          </button>
          <button
            type="button"
            className="products-navbar__icon products-navbar__icon--avatar"
            onClick={() => navigate("/profile")}
            aria-label="Profile"
          >
            👤
          </button>
        </div>
      </nav>

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
