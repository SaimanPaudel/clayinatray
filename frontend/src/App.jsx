import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import "./styles.css";

function App() {
  const [page, setPage] = useState("products");
  const [cartCount, setCartCount] = useState(0);

  // Refresh cart count whenever page changes
  useEffect(() => {
    axios.get("http://localhost:5000/api/cart")
      .then((res) => {
        const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      })
      .catch(() => setCartCount(0));
  }, [page]);

  return (
    <>
      <Navbar page={page} setPage={setPage} cartCount={cartCount} />
      {page === "products"
        ? <Products setPage={setPage} setCartCount={setCartCount} />
        : <Cart setCartCount={setCartCount} />
      }
    </>
  );
}

export default App;