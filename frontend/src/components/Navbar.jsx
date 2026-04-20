import { FaShoppingCart, FaBars, FaUserCircle } from "react-icons/fa";

export default function Navbar({ page, setPage, cartCount }) {
  return (
    <div className="navbar">
      <div className="logo" onClick={() => setPage("products")} style={{ cursor: "pointer" }}>
        Clay in a Tray
      </div>

      <div className="nav-links">
        <a onClick={() => setPage("products")}>Home</a>
        <a>About Us</a>
        <a>Gallery</a>
        <a>Accommodation</a>
        <a className={page === "products" ? "active" : ""} onClick={() => setPage("products")}>Products</a>
        <a>Contacts</a>
      </div>

      <div className="nav-icons">
        <div className="cart-icon-wrapper" onClick={() => setPage("cart")}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
        </div>
        <FaBars />
        <FaUserCircle className="profile-icon" />
      </div>
    </div>
  );
}