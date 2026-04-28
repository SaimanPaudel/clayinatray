import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Accommodation.css";
import Navbar from "./Navbar";

const properties = [
  {
    slug: 'upstairs-retreat',
    badge: 'Pet Friendly',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    location: 'South Golden Beach, Byron Bay, NSW',
    title: 'South Golden Beach House - Upstairs Retreat',
    guests: 6,
    beds: 2,
    baths: 1,
    description: 'An original Byron Bay Aussie Beach House seconds from the sand. Family & Pet Friendly. Sleeps 6',
    price: 180,
    rating: 4.96,
    reviews: 189,
  },
  {
    slug: 'ground-floor-apartment',
    badge: 'Pet Friendly',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    location: 'South Golden Beach, Byron Bay, NSW',
    title: 'South Golden Sea Shack - Ground Floor Apartment',
    guests: 5,
    beds: 2,
    baths: 1,
    description: 'Just steps from beautiful South Golden Beach. Entire Sea Shack Apartment with industrial-Moroccan charm',
    price: 165,
    rating: 4.94,
    reviews: 167,
  },
];

// ✅ FIXED: Now accepts cart and setCart props, and renders Navbar
export default function Accommodation({ cart, setCart }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState({});

  const toggleSave = (slug, e) => {
    e.stopPropagation();
    setSaved(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <div className="accom-page">
      {/* ✅ FIXED: Navbar now renders with cart count */}
      <Navbar cartCount={cart ? cart.length : 0} />

      <div className="accom-search-bar">
        <span className="accom-search-icon">🔍</span>
        <input type="text" placeholder="Search South Golden Beach" />
      </div>

      <div className="accom-hero">
        <h1>South Golden Beach Properties</h1>
        <p>Experience the perfect blend of beachside living and artistic charm. Both properties are steps from beautiful South Golden Beach in Byron Bay's Northern Rivers region.</p>
      </div>

      <div className="accom-grid">
        {properties.map(p => (
          <div key={p.slug} className="accom-card" onClick={() => navigate(`/accommodation/${p.slug}`)}>
            <div className="accom-card-img-wrap">
              <span className="accom-badge">{p.badge}</span>
              <button className="accom-save-btn" onClick={e => toggleSave(p.slug, e)}>
                {saved[p.slug] ? '❤️' : '🤍'}
              </button>
              <img src={p.image} alt={p.title} />
              <div className="accom-rating-bubble">⭐ {p.rating}</div>
            </div>
            <div className="accom-card-body">
              <p className="accom-card-location">{p.location}</p>
              <h3 className="accom-card-title">{p.title}</h3>
              <div className="accom-card-meta">
                <span>👥 {p.guests} guests</span>
                <span>🛏 {p.beds} beds</span>
                <span>🛁 {p.baths} bath</span>
              </div>
              <p className="accom-card-desc">{p.description}</p>
              <div className="accom-card-footer">
                <span className="accom-price"><strong>${p.price}</strong> / night</span>
                <span className="accom-footer-rating">⭐ {p.rating} ({p.reviews})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="accom-why">
        <h2>Why Stay at South Golden Beach?</h2>
        <div className="accom-why-grid">
          <div>
            <h4>Steps from the Sand</h4>
            <p>Wake up and be on the beach within minutes – perfect for morning swims and sunset walks</p>
          </div>
          <div>
            <h4>Pet &amp; Family Friendly</h4>
            <p>Bring the whole family including furry friends for a true home-away-from-home experience</p>
          </div>
          <div>
            <h4>Local Living</h4>
            <p>Experience Byron Bay like a local with cafés, markets, and hidden beaches nearby</p>
          </div>
        </div>
      </div>
    </div>
  );
}