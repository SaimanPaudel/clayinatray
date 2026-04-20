import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Accommodation.css";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
  { name: "Gallery", path: "/gallery" },
  { name: "Accommodation", path: "/accommodation" },
  { name: "Products", path: "/products" },
  { name: "Contacts", path: "/contacts" },
];

const properties = [
  {
    id: 1,
    name: "South Golden Beach House",
    location: "South Golden Beach, Byron Bay",
    guests: 6,
    beds: 2,
    baths: 1,
    price: 180,
    tag: "Pet Friendly",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&q=80",
    description:
      "A light-filled upstairs retreat with original artworks, sea breezes, and an easy walk to the sand.",
  },
  {
    id: 2,
    name: "South Golden Sea Shack",
    location: "South Golden Beach, Byron Bay",
    guests: 5,
    beds: 2,
    baths: 1,
    price: 165,
    tag: "Family Stay",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80",
    description:
      "A relaxed ground-floor apartment with coastal character, handcrafted details, and space to unwind.",
  },
];

const features = [
  {
    title: "Steps from the Sand",
    body: "Start your day with a quick stroll to South Golden Beach for a swim, coffee, or sunset walk.",
  },
  {
    title: "Creative Coastal Interiors",
    body: "Each stay is styled with original art, ceramics, and warm details inspired by Jolene's studio.",
  },
  {
    title: "Relaxed Local Living",
    body: "Stay close to Byron Bay while enjoying a quieter beachside rhythm with markets and cafes nearby.",
  },
];

export default function Accommodation({ cart = [], setCart }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return properties;

    return properties.filter((property) =>
      `${property.name} ${property.location} ${property.description} ${property.tag}`
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery]);

  const addToCart = (property) => {
    if (!setCart) return;
    setCart((prev) => [...prev, { ...property, type: "accommodation" }]);
  };

  return (
    <div className="accommodation-page">
      <nav className="stay-navbar">
        <button
          type="button"
          className="stay-navbar__logo"
          onClick={() => navigate("/")}
        >
          Clay in a Tray
        </button>

        <ul className="stay-navbar__links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `stay-navbar__link ${isActive ? "stay-navbar__link--active" : ""}`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="stay-navbar__icons">
          <button
            type="button"
            className="stay-navbar__icon"
            onClick={() => navigate("/cart")}
          >
            🛒 <span>({cart.length})</span>
          </button>
          <button type="button" className="stay-navbar__icon" aria-label="Menu">
            ☰
          </button>
          <button
            type="button"
            className="stay-navbar__icon stay-navbar__icon--avatar"
            onClick={() => navigate("/profile")}
            aria-label="Profile"
          >
            👤
          </button>
        </div>
      </nav>

      <header className="stay-hero">
        <div className="stay-hero__overlay">
          <p className="stay-hero__eyebrow">Beachside Retreats</p>
          <h1>Stay by the ocean, surrounded by art.</h1>
          <p className="stay-hero__copy">
            Discover two welcoming South Golden Beach stays designed for slow mornings,
            creative afternoons, and easy coastal evenings.
          </p>
        </div>
      </header>

      <section className="stay-search">
        <input
          type="text"
          placeholder="Search South Golden Beach"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </section>

      <section className="stay-content">
        <div className="stay-section-heading">
          <h2>Available Accommodation</h2>
          <p>
            Each property blends beach-house comfort with Clay in a Tray's creative spirit.
          </p>
        </div>

        <div className="stay-grid">
          {filteredProperties.map((property) => (
            <article key={property.id} className="stay-card">
              <div className="stay-card__image-wrap">
                <img src={property.image} alt={property.name} className="stay-card__image" />
                <span className="stay-card__tag">{property.tag}</span>
              </div>

              <div className="stay-card__body">
                <p className="stay-card__location">{property.location}</p>
                <h3>{property.name}</h3>
                <div className="stay-card__meta">
                  <span>👥 {property.guests} guests</span>
                  <span>🛏 {property.beds} beds</span>
                  <span>🚿 {property.baths} bath</span>
                </div>
                <p className="stay-card__description">{property.description}</p>

                <div className="stay-card__footer">
                  <div>
                    <strong>${property.price}</strong>
                    <span> / night</span>
                  </div>
                  <button type="button" onClick={() => addToCart(property)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stay-features">
        <h2>Why guests love staying here</h2>
        <div className="stay-features__grid">
          {features.map((feature) => (
            <article key={feature.title} className="stay-feature">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
