import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const properties = [
  {
    id: 1,
    name: "South Golden Beach House - Upstairs Retreat",
    location: "South Golden Beach, Byron Bay, NSW",
    guests: 6,
    beds: 2,
    baths: 1,
    price: 180,
    rating: 4.96,
    reviews: 189,
    tag: "Pet Friendly",
    description:
      "An original Byron Bay Aussie Beach House seconds from the sand. Family & Pet Friendly. Sleeps 6",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
  },
  {
    id: 2,
    name: "South Golden Sea Shack - Ground Floor Apartment",
    location: "South Golden Beach, Byron Bay, NSW",
    guests: 5,
    beds: 2,
    baths: 1,
    price: 165,
    rating: 4.94,
    reviews: 167,
    tag: "Pet Friendly",
    description:
      "Just steps from beautiful South Golden Beach. Entire Sea Shack Apartment with industrial-Moroccan charm",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  },
];

const features = [
  {
    title: "Steps from the Beach",
    desc: "Wake up and be on South Golden Beach within minutes for morning swims and sunset walks",
  },
  {
    title: "Pet & Family Friendly",
    desc: "Bring the whole family including furry friends - both properties welcome pets",
  },
  {
    title: "Local Lifestyle",
    desc: "Experience Byron Bay like a local with cafés, markets, and hidden beaches nearby",
  },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
  { name: "Gallery", path: "/gallery" },
  { name: "Accommodation", path: "/accommodation" },
  { name: "Products", path: "/products" },
  { name: "Contacts", path: "/contacts" },
];

export default function Home({ cart, setCart }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [liked, setLiked] = useState({});
  const [activeNav, setActiveNav] = useState("Home");

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = (property) => {
    setCart((prev) => [...prev, property]);
  };

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return properties;

    return properties.filter((p) =>
      `${p.name} ${p.location} ${p.description} ${p.tag}`
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery]);

  return (
    <div style={styles.page}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.navLogo}>Clay in a Tray</div>

          <ul style={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <button
                  className={`nav-link ${activeNav === link.name ? "active" : ""}`}
                  onClick={() => {
                    setActiveNav(link.name);
                    navigate(link.path);
                  }}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div style={styles.navIcons}>
            <button
              className="icon-btn"
              style={styles.iconBtn}
              onClick={() => navigate("/cart")}
            >
              🛒 <span style={styles.cartCount}>({cart.length})</span>
            </button>

            <button className="icon-btn" style={styles.iconBtn}>
              ☰
            </button>

            <button
              className="icon-avatar"
              style={styles.iconAvatar}
              onClick={() => navigate("/profile")}
            >
              👤
            </button>
          </div>
        </div>
      </nav>

      {/* SEARCH */}
      <div style={styles.searchBarWrap}>
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search South Golden Beach"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* HERO */}
      <section style={styles.heroSection}>
        <div style={styles.heroWrapper}>
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80"
            alt="South Golden Beach"
            style={styles.heroImage}
          />
        </div>
      </section>

      {/* WELCOME */}
      <section style={styles.welcomeWrapper}>
        <div className="welcome-card" style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>Welcome to Clay in a Tray</h1>
          <p style={styles.welcomeSub}>
            South Golden Beach · Byron Bay · Northern Rivers
          </p>

          <div style={styles.welcomeBtns}>
            <button
              className="btn-primary"
              onClick={() =>
                document
                  .getElementById("properties-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Properties
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigate("/gallery")}
            >
              Explore Gallery
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.featuresGrid}>
        {features.map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* PROPERTIES */}
      <section id="properties-section" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Beach Houses</h2>
          <button className="view-all-btn">View All Details →</button>
        </div>

        <div style={styles.propertyGrid}>
          {filteredProperties.map((p) => (
            <div key={p.id} className="property-card" style={styles.propertyCard}>
              <div style={styles.propertyImgWrapper}>
                <img src={p.image} alt={p.name} style={styles.propertyImg} />
                <span style={styles.petTag}>{p.tag}</span>

                <button
                  className="heart-btn"
                  style={styles.heartBtn}
                  onClick={() => toggleLike(p.id)}
                >
                  {liked[p.id] ? "❤️" : "🤍"}
                </button>

                <div style={styles.ratingBadge}>⭐ {p.rating}</div>
              </div>

              <div style={styles.propertyInfo}>
                <p style={styles.propertyLocation}>{p.location}</p>
                <h3 style={styles.propertyName}>{p.name}</h3>

                <div style={styles.propertyMeta}>
                  <span>👥 {p.guests} guests</span>
                  <span>🛏 {p.beds} beds</span>
                  <span>🚿 {p.baths} bath</span>
                </div>

                <p style={styles.propertyDesc}>{p.description}</p>

                <hr style={styles.divider} />

                <div style={styles.propertyFooter}>
                  <div>
                    <strong style={styles.priceText}>${p.price}</strong>
                    <span style={styles.perNight}> / night</span>
                  </div>

                  <div style={styles.footerRight}>
                    <span style={styles.propertyRating}>
                      ⭐ {p.rating} ({p.reviews})
                    </span>

                    <button
                      className="small-btn-primary"
                      onClick={() => addToCart(p)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div style={styles.emptyState}>No properties match your search.</div>
        )}
      </section>

      {/* HOST */}
      <section style={styles.section}>
        <div style={styles.hostCard}>
          <div style={styles.avatarWrapper}>
            <img
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80"
              alt="Host Jolene"
              style={styles.hostImage}
            />
          </div>

          <div style={styles.hostContent}>
            <h3 style={styles.hostName}>Hosted by Jolene</h3>
            <p style={styles.hostJoined}>Joined 2019</p>
            <p style={styles.hostBio}>
              Creative soul living in South Golden Beach. I love sharing the
              beauty and laid-back lifestyle of the Northern Rivers with guests
              from around the world. When I'm not hosting, you'll find me
              surfing, creating art, or exploring hidden beaches with my dog.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2024 Clay in a Tray · South Golden Beach, Byron Bay, NSW
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: "#f5f0eb",
    minHeight: "100vh",
    color: "#2c2c2c",
  },

  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#f5f0eb",
    borderBottom: "1px solid #e8e2db",
  },

  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    minHeight: 72,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },

  navLogo: {
    color: "#3a7a8c",
    fontSize: "1.7rem",
    fontStyle: "italic",
    fontWeight: 600,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    listStyle: "none",
    margin: 0,
    padding: 0,
    flex: 1,
    flexWrap: "wrap",
  },

  navIcons: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexShrink: 0,
  },

  iconBtn: {
    border: "1px solid #ddd3ca",
    background: "#fffaf6",
    borderRadius: 999,
    height: 38,
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    color: "#3a3a3a",
  },

  cartCount: {
    fontWeight: 600,
  },

  iconAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid #ddd3ca",
    background: "#fffaf6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  searchBarWrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "18px 24px 8px",
  },

  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fffaf6",
    border: "1px solid #e4ddd5",
    borderRadius: 999,
    padding: "14px 18px",
  },

  searchIcon: {
    color: "#aaa",
    fontSize: "1rem",
  },

  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "0.98rem",
    width: "100%",
    background: "transparent",
    color: "#333",
    fontFamily: "'Georgia', serif",
  },

  heroSection: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 24px 0",
  },

  heroWrapper: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  heroImage: {
    width: "100%",
    height: 500,
    objectFit: "cover",
    display: "block",
  },

  welcomeWrapper: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "28px 24px 22px",
  },

  welcomeCard: {
    textAlign: "center",
  },

  welcomeTitle: {
    fontSize: "4rem",
    fontWeight: 400,
    margin: "0 0 14px",
    color: "#1f1f1f",
    lineHeight: 1.1,
  },

  welcomeSub: {
    color: "#7f7f84",
    fontSize: "1.15rem",
    marginBottom: 34,
    letterSpacing: "0.02em",
  },

  welcomeBtns: {
    display: "flex",
    gap: 24,
    justifyContent: "center",
    flexWrap: "wrap",
  },

  featuresGrid: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 24px 36px",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 22,
  },

  featureCard: {
    background: "#fffaf6",
    border: "1px solid #ebe3db",
    borderRadius: 20,
    padding: "24px 22px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },

  featureTitle: {
    fontSize: "1.15rem",
    fontWeight: 600,
    margin: "0 0 10px",
    color: "#1a1a1a",
  },

  featureDesc: {
    color: "#666",
    fontSize: "0.94rem",
    lineHeight: 1.65,
    margin: 0,
  },

  section: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 24px 42px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },

  sectionTitle: {
    fontSize: "1.7rem",
    fontWeight: 600,
    margin: 0,
    color: "#1a1a1a",
  },

  propertyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 24,
  },

  propertyCard: {
    background: "#fff",
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid #ebe3db",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  propertyImgWrapper: {
    position: "relative",
    height: 280,
    overflow: "hidden",
  },

  propertyImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  petTag: {
    position: "absolute",
    top: 14,
    left: 14,
    background: "#3a7a8c",
    color: "#fff",
    fontSize: "0.78rem",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 999,
  },

  heartBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1px solid #e5ddd5",
    background: "rgba(255,255,255,0.95)",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  ratingBadge: {
    position: "absolute",
    bottom: 12,
    right: 14,
    background: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    padding: "5px 12px",
    fontSize: "0.84rem",
    fontWeight: 600,
    color: "#2c2c2c",
  },

  propertyInfo: {
    padding: "22px 24px 24px",
  },

  propertyLocation: {
    color: "#888",
    fontSize: "0.84rem",
    margin: "0 0 6px",
  },

  propertyName: {
    fontSize: "1.2rem",
    fontWeight: 600,
    margin: "0 0 12px",
    color: "#1a1a1a",
    lineHeight: 1.35,
  },

  propertyMeta: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    fontSize: "0.88rem",
    color: "#555",
    marginBottom: 12,
  },

  propertyDesc: {
    fontSize: "0.92rem",
    color: "#666",
    lineHeight: 1.65,
    margin: 0,
  },

  divider: {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "18px 0",
  },

  propertyFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },

  priceText: {
    color: "#c0533a",
    fontSize: "1.3rem",
  },

  perNight: {
    color: "#666",
    fontSize: "0.92rem",
  },

  footerRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },

  propertyRating: {
    color: "#555",
    fontSize: "0.92rem",
  },

  emptyState: {
    marginTop: 20,
    padding: 24,
    textAlign: "center",
    background: "#fffaf6",
    borderRadius: 18,
    border: "1px solid #ebe3db",
    color: "#666",
  },

  hostCard: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: 28,
    alignItems: "center",
    background: "#fff",
    border: "1px solid #ebe3db",
    borderRadius: 22,
    padding: 26,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  avatarWrapper: {
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    borderRadius: 18,
    background: "#e8e2db",
  },

  hostImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  hostContent: {
    minWidth: 0,
  },

  hostName: {
    fontSize: "1.45rem",
    fontWeight: 600,
    margin: "0 0 6px",
    color: "#1a1a1a",
  },

  hostJoined: {
    color: "#888",
    fontSize: "0.9rem",
    margin: "0 0 14px",
  },

  hostBio: {
    color: "#555",
    fontSize: "0.98rem",
    lineHeight: 1.75,
    margin: 0,
    maxWidth: "60ch",
  },

  footer: {
    textAlign: "center",
    padding: "28px 20px 36px",
    borderTop: "1px solid #e8e2db",
    marginTop: 8,
  },

  footerText: {
    color: "#888",
    fontSize: "0.9rem",
    margin: 0,
  },
};