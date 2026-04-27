import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from './Home';
import Cart from './Cart';
import Contact from './Contact';
import Login from './Login';
import ForgotPassword from './ForgotPassword';

const Placeholder = ({ title }) => (
  <div style={styles.page}>
    <h2>{title} Page</h2>
    <p>This page is under construction.</p>
  </div>
);

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

        <Route path="/about-us" element={<Placeholder title="About Us" />} />
        <Route path="/gallery" element={<Placeholder title="Gallery" />} />
        <Route path="/accommodation" element={<Placeholder title="Accommodation" />} />
        <Route path="/products" element={<Placeholder title="Products" />} />
        <Route path="/contacts" element={<Contact />} />

        <Route path="/profile" element={<Placeholder title="Profile" />} />
        <Route path="/login" element={<Placeholder title="Login" />} />
        <Route path="/signup" element={<Placeholder title="Signup" />} />
      </Routes>
    </Router>
  );
}

export default App;

const styles = {
  page: {
    fontFamily: "'Georgia', serif",
    background: "#f5f0eb",
    minHeight: "100vh",
    padding: "40px",
    color: "#2c2c2c",
  },
};