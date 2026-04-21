import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Home from './Home';
import Cart from './Cart';
import Contact from './Contact';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Signup from './Signup';
import AboutUs from "./AboutUs";
import Gallery from "./Gallery";
import Accommodation from "./Accommodation";
import Products from "./Products";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

        <Route path="/about-us" element={<AboutUs cart={cart} />} />
        <Route path="/gallery" element={<Gallery cart={cart} />} />
        <Route
          path="/accommodation"
          element={<Accommodation cart={cart} setCart={setCart} />}
        />
        <Route
          path="/products"
          element={<Products cart={cart} setCart={setCart} />}
        />
        <Route path="/contacts" element={<Contact />} />

        <Route path="/profile" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
