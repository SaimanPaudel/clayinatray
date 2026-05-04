import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import Navbar from "./Navbar";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const products = [
  {
    id: 1,
    category: 'PAINTINGS',
    title: 'Abstract Coastal Dreams',
    description: 'Original acrylic painting inspired by South Golden Beach sunsets. Features dreamy brushstrokes in soft...',
    price: 850,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
  },
  {
    id: 2,
    category: 'CERAMICS',
    title: 'Ceramic Expression',
    description: 'Hand-crafted ceramic art piece featuring bold line work and organic forms. A unique statement piece that tells...',
    price: 420,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  },
  {
    id: 3,
    category: 'DRAWINGS',
    title: 'Abstract Forms',
    description: 'Bold charcoal drawing on paper exploring organic shapes and fluid lines. Captures spontaneous creativi...',
    price: 650,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
  },
  {
    id: 4,
    category: 'COLLABORATIVE',
    title: 'Community Art Collaboration',
    description: 'Collaborative outdoor painting created during community art sessions. Each piece is unique and...',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=600&q=80',
  },
];

// ✅ FIXED: Changed prop from addToCart to { cart, setCart } to match what App.jsx passes
export default function Products({ cart, setCart }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState({});

  const handleAddToCart = async (product) => {
    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, title: product.title, price: product.price, quantity: 1 }),
      });
    } catch {
      // Demo mode — backend not running
    }

    // ✅ FIXED: Use setCart correctly (was calling addToCart which didn't exist)
    if (typeof setCart === 'function') {
      setCart(prev => [...prev, { ...product, type: 'product' }]);
    }

    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1800);
  };

  return (
    <div className="products-page">
      {/* ✅ FIXED: Navbar now renders with cart count */}
      <Navbar cartCount={cart ? cart.length : 0} />

      <div className="products-hero">
        <h1>Original Artwork Collection</h1>
        <p>Explore Jolene's original artworks for sale. Each piece is unique and captures the creative spirit of South Golden Beach and the coastal lifestyle.</p>
      </div>

      <div className="products-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-img-wrap">
              <img src={p.image} alt={p.title} />
            </div>
            <div className="product-card-body">
              <span className="product-category">{p.category}</span>
              <h3 className="product-title">{p.title}</h3>
              <p className="product-desc">{p.description}</p>
              <div className="product-footer">
                <span className="product-price">${p.price}</span>
                <button
                  className={`product-add-btn ${added[p.id] ? 'added' : ''}`}
                  onClick={() => handleAddToCart(p)}
                >
                  {added[p.id] ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="products-about">
        <h2>About Jolene's Art</h2>
        <div className="products-about-grid">
          <div>
            <h4>Original Artworks</h4>
            <p>Each piece is an original creation by Jolene, not a reproduction</p>
          </div>
          <div>
            <h4>Coastal Inspired</h4>
            <p>Art inspired by the natural beauty of South Golden Beach</p>
          </div>
          <div>
            <h4>Unique</h4>
            <p>Each artwork is one-of-a-kind - own something truly special</p>
          </div>
        </div>
      </div>
    </div>
  );
}