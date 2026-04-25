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
  const isLoggedIn = Boolean(localStorage.getItem("loggedInUser"));
  const resolvedProfilePath = isLoggedIn ? "/profile" : profilePath;

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
          <button type="button" className="icon-btn" aria-label="Menu">
            ☰
          </button>
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
