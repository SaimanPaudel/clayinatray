import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
  { name: "Gallery", path: "/gallery" },
  { name: "Accommodation", path: "/accommodation" },
  { name: "Products", path: "/products" },
  { name: "Contacts", path: "/contacts" },
];

export default function Navbar({ cartCount = 0, profilePath = "/profile" }) {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(
    localStorage.getItem("loggedInUser") || localStorage.getItem("user")
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";
  const resolvedProfilePath = isLoggedIn ? "/profile" : profilePath;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="site-navbar-shell">
      <nav className="site-navbar">
        <button
          type="button"
          className="site-navbar__logo"
          onClick={() => navigate("/")}
        >
          Clay in a Tray
        </button>

        <ul className="site-navbar__links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `site-navbar__link ${isActive ? "site-navbar__link--active" : ""}`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="site-navbar__icons">
          <button
            type="button"
            className="icon-btn"
            onClick={() => navigate("/cart")}
          >
            🛒 <span>({cartCount})</span>
          </button>

          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              ☰
            </button>

            {menuOpen && (
  <div style={dropdownStyles.menu}>
    
    {isAdmin && (
  <button style={dropdownStyles.item} onClick={() => handleMenuClick("/admin/messages")}>
    📬 Messages
  </button>
)}

    {isAdmin && (
      <button
        style={dropdownStyles.item}
        onClick={() => handleMenuClick("/admin/bookings")}
      >
        🛠️ Manage Bookings
      </button>
    )}
    {isAdmin && (
      <button
        style={dropdownStyles.item}
        onClick={() => handleMenuClick("/admin/users")}
      >
        👥 Manage Users
      </button>
    )}
    <button
      style={dropdownStyles.item}
      onClick={() => handleMenuClick("/my-bookings")}
    >
      📋 My Bookings
    </button>
    <button
      style={dropdownStyles.item}
      onClick={() => handleMenuClick("/my-history")}
    >
      🕘 My History
    </button>
  </div>
)}
          </div>

          <button
            type="button"
            className="icon-btn site-navbar__avatar"
            onClick={() => navigate(resolvedProfilePath)}
            aria-label="Profile"
          >
            👤
          </button>
        </div>
      </nav>
    </div>
  );
}

const dropdownStyles = {
  menu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    border: "1px solid #ebe3db",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    padding: 6,
    minWidth: 180,
    zIndex: 100,
  },
  item: {
    display: "block",
    width: "100%",
    background: "transparent",
    border: "none",
    padding: "10px 14px",
    fontSize: "0.92rem",
    color: "#2c2c2c",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: 8,
    fontFamily: "'Georgia', serif",
    transition: "background 0.15s",
  },
};