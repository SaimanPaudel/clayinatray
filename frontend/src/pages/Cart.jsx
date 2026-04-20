import { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaTrash, FaCreditCard, FaApple } from "react-icons/fa";
import { SiGooglepay } from "react-icons/si";

export default function Cart({ setCartCount }) {
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchCart = () => {
    axios.get("http://localhost:5000/api/cart").then((res) => {
      setCart(res.data);
      const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = (productId, quantity) => {
    axios
      .put(`http://localhost:5000/api/cart/${productId}`, { quantity })
      .then((res) => {
        setCart(res.data);
        const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      });
  };

  const removeItem = (productId) => {
    axios
      .delete(`http://localhost:5000/api/cart/${productId}`)
      .then((res) => {
        setCart(res.data);
        const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      });
  };

  const clearCart = () => {
    axios.delete("http://localhost:5000/api/cart").then((res) => {
      setCart(res.data);
      setCartCount(0);
    });
  };

  const handleCheckout = (paymentMethod) => {
    axios
      .post("http://localhost:5000/api/checkout", { paymentMethod })
      .then(() => {
        setShowPayment(false);
        setShowSuccess(true);
        setCart([]);
        setCartCount(0);
        setTimeout(() => setShowSuccess(false), 3000);
      });
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const serviceFee = Math.round(subtotal * 0.14);
  const total = subtotal + serviceFee;

  return (
    <div style={{ background: "#f4efe9", minHeight: "100vh", padding: "30px 40px" }}>
      <h2 style={{ fontSize: "22px", fontFamily: "Georgia, serif", color: "#222", marginBottom: "24px" }}>
        Shopping Cart
      </h2>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

        {/* LEFT — Cart Items */}
        <div style={{ flex: 1 }}>
          {cart.length === 0 ? (
            <div style={{
              background: "white", borderRadius: "12px", padding: "60px 20px",
              textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.07)"
            }}>
              <FaShoppingCart style={{ fontSize: "48px", color: "#8a9aaa", marginBottom: "16px" }} />
              <p style={{ fontSize: "16px", color: "#555", marginBottom: "8px" }}>Your cart is empty</p>
              <span style={{ fontSize: "13px", color: "#999" }}>Add some products or book a room to get started</span>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} style={{
                background: "white", borderRadius: "12px", padding: "16px",
                display: "flex", alignItems: "center", gap: "16px",
                marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                position: "relative"
              }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "4px" }}>{item.title}</div>
                  <span style={{
                    fontSize: "11px", background: "#e8f0f7", color: "#3c5a6b",
                    padding: "2px 8px", borderRadius: "20px", display: "inline-block", marginBottom: "8px"
                  }}>Product</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#555", marginBottom: "6px" }}>
                    <span>Quantity:</span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      style={{
                        background: "#f0f0f0", color: "#333", border: "none",
                        width: "26px", height: "26px", borderRadius: "4px",
                        fontSize: "16px", cursor: "pointer"
                      }}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      style={{
                        background: "#f0f0f0", color: "#333", border: "none",
                        width: "26px", height: "26px", borderRadius: "4px",
                        fontSize: "16px", cursor: "pointer"
                      }}
                    >+</button>
                  </div>
                  <div style={{ color: "#c65d3b", fontWeight: "bold", fontSize: "15px" }}>
                    ${item.price * item.quantity}
                  </div>
                </div>
                <FaTrash
                  onClick={() => removeItem(item.productId)}
                  style={{ color: "#aaa", cursor: "pointer", fontSize: "16px", position: "absolute", top: "16px", right: "16px" }}
                />
              </div>
            ))
          )}
        </div>

        {/* RIGHT — Order Summary */}
        {cart.length > 0 && (
          <div style={{
            width: "280px", background: "white", borderRadius: "12px",
            padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", flexShrink: 0
          }}>
            <h3 style={{ fontSize: "16px", fontFamily: "Georgia, serif", marginBottom: "16px", color: "#222" }}>
              Order Summary
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555", marginBottom: "10px" }}>
              <span>Subtotal</span><span>${subtotal}.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#555", marginBottom: "10px" }}>
              <span>Service fee</span><span>${serviceFee}.00</span>
            </div>
            <div style={{ borderTop: "1px solid #eee", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "16px", color: "#222", marginBottom: "20px" }}>
              <span>Total</span><span>${total}.00</span>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              style={{
                width: "100%", background: "#c65d3b", color: "white", border: "none",
                padding: "12px", borderRadius: "8px", fontSize: "14px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px"
              }}
            >
              <FaCreditCard /> Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              style={{
                width: "100%", background: "white", color: "#333",
                border: "1px solid #ddd", padding: "10px", borderRadius: "8px",
                fontSize: "14px", cursor: "pointer", marginBottom: "12px"
              }}
            >
              Clear Cart
            </button>
            <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center" }}>
              All transactions are secure and encrypted
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "380px", maxWidth: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", color: "#222" }}>Payment</h3>
              <span onClick={() => setShowPayment(false)} style={{ cursor: "pointer", fontSize: "18px", color: "#888" }}>✕</span>
            </div>
            <div style={{ background: "#f0f6ff", borderRadius: "10px", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
              <p style={{ fontSize: "13px", color: "#777", marginBottom: "4px" }}>Total Amount</p>
              <h2 style={{ fontSize: "28px", color: "#222" }}>${total}.00</h2>
            </div>
            <p style={{ fontSize: "14px", color: "#444", marginBottom: "12px" }}>Select Payment Method</p>
            <button onClick={() => handleCheckout("apple")} style={{
              width: "100%", background: "#000", color: "white", padding: "14px",
              borderRadius: "10px", fontSize: "15px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "10px", marginBottom: "10px", border: "none"
            }}>
              <FaApple /> Pay with Apple Pay
            </button>
            <button onClick={() => handleCheckout("google")} style={{
              width: "100%", background: "white", color: "#333", padding: "14px",
              borderRadius: "10px", fontSize: "15px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "10px", marginBottom: "10px", border: "1px solid #ddd"
            }}>
              <SiGooglepay /> Pay with Google Pay
            </button>
            <button onClick={() => handleCheckout("card")} style={{
              width: "100%", background: "#3c6e8a", color: "white", padding: "14px",
              borderRadius: "10px", fontSize: "15px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "10px", marginBottom: "14px", border: "none"
            }}>
              <FaCreditCard /> Pay with Card
            </button>
            <div style={{
              background: "#fffbea", border: "1px solid #f0d060", borderRadius: "8px",
              padding: "12px", display: "flex", gap: "10px", fontSize: "12px",
              color: "#7a6000", marginBottom: "14px"
            }}>
              <span>⚠</span>
              <div>
                <strong style={{ display: "block", marginBottom: "2px" }}>Demo Payment</strong>
                <p>This is a demonstration of the payment flow. No actual payment will be processed.</p>
              </div>
            </div>
            <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center" }}>
              🔒 Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{
            background: "white", borderRadius: "16px", padding: "48px 32px",
            width: "360px", maxWidth: "90%", textAlign: "center"
          }}>
            <div style={{
              fontSize: "32px", color: "#22c55e", border: "3px solid #22c55e",
              borderRadius: "50%", width: "72px", height: "72px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px"
            }}>✔</div>
            <h3 style={{ fontSize: "20px", color: "#222", marginBottom: "8px" }}>Payment Successful!</h3>
            <p style={{ fontSize: "14px", color: "#777", marginBottom: "16px" }}>Your booking has been confirmed</p>
            <div style={{
              background: "#f0fdf4", border: "1px solid #86efac",
              color: "#16a34a", fontSize: "13px", padding: "10px 16px", borderRadius: "8px"
            }}>
              Confirmation email sent to your inbox
            </div>
          </div>
        </div>
      )}
    </div>
  );
}