import React from "react";
import { FaShoppingCart, FaUserCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => navigate("/")}>
        Clay in a Tray
      </h2>

      <ul className="nav-links">
        <li>Home</li>
        <li>About Us</li>
        <li>Gallery</li>
        <li
          className="active"
          onClick={() => navigate("/accommodation")}
        >
          Accommodation
        </li>
        <li>Products</li>
        <li>Contacts</li>
      </ul>

      <div className="nav-icons">
        <FaShoppingCart />
        <FaBars />
        <FaUserCircle className="profile-icon" />
      </div>
    </nav>
  );
};

export default Navbar;