import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./App.css";
import "./Cart.css";
import Navbar from "./Navbar";

// ─── REPLACE WITH YOUR STRIPE PUBLISHABLE KEY ────────────────────────────────
const STRIPE_PUBLISHABLE_KEY = "pk_live_XXXXXXXXXXXXXXXXXXXXXXXX";
// ─────────────────────────────────────────────────────────────────────────────

// ─── REPLACE WITH YOUR BACKEND ENDPOINT ──────────────────────────────────────
const BACKEND_URL = "https://your-backend.com/create-payment-intent";
// ─────────────────────────────────────────────────────────────────────────────

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
const SERVICE_FEE_RATE = 0.14;

// ── SVG Logos ─────────────────────────────────────────────────────────────────
const ApplePayLogo = () => (
  <svg viewBox="0 0 165.521 105.965" xmlns="http://www.w3.org/2000/svg" width="52" height="33">
    <path fill="#fff" d="M150.698 0H14.823C6.634 0 0 6.634 0 14.823v76.319c0 8.189 6.634 14.823 14.823 14.823H150.698c8.189 0 14.823-6.634 14.823-14.823V14.823C165.521 6.634 158.887 0 150.698 0z"/>
    <path d="M43.513 36.945c1.799-2.257 3.02-5.338 2.686-8.459-2.599.133-5.779 1.721-7.644 3.978-1.676 1.934-3.154 5.072-2.763 8.055 2.9.224 5.855-1.431 7.721-3.574zM46.169 41.239c-4.261-.254-7.894 2.419-9.924 2.419-2.052 0-5.148-2.293-8.518-2.23-4.388.063-8.457 2.547-10.703 6.516-4.578 7.94-1.199 19.71 3.243 26.174 2.165 3.178 4.769 6.677 8.2 6.548 3.243-.127 4.516-2.102 8.456-2.102 3.94 0 5.085 2.102 8.519 2.039 3.56-.064 5.789-3.178 7.954-6.356 2.48-3.622 3.497-7.116 3.561-7.307-.065-.064-6.871-2.673-6.934-10.548-.063-6.611 5.403-9.726 5.657-9.917-3.116-4.578-7.954-5.086-9.511-5.236z"/>
    <path d="M78.449 32.17c9.552 0 16.205 6.588 16.205 16.172 0 9.616-6.793 16.237-16.44 16.237h-10.58v16.807H60.47V32.17zm-10.815 26.244h8.772c6.652 0 10.436-3.576 10.436-9.84 0-6.265-3.784-9.808-10.404-9.808h-8.804zM96.911 73.145c0-6.329 4.851-10.229 13.462-10.709l9.925-.613v-2.79c0-4.021-2.712-6.329-7.243-6.329-4.275 0-6.955 2.035-7.594 5.131h-6.697c.384-6.265 5.747-10.869 14.548-10.869 8.548 0 13.91 4.5 13.91 11.549v24.871h-6.489v-5.94h-.16c-1.919 4.021-6.105 6.553-10.9 6.553-6.777 0-11.762-4.148-11.762-10.854zm23.387-3.225v-2.854l-8.932.549c-4.467.288-6.985 2.275-6.985 5.387 0 3.177 2.614 5.259 6.601 5.259 5.172 0 9.316-3.561 9.316-8.341zM133.372 96.581c-1.536 4.883-5.363 6.887-11.336 6.887-.448 0-1.44-.064-1.664-.096v-5.195c.256.032.832.064 1.12.064 2.776 0 4.34-.991 5.267-3.785l.576-1.791L115.58 48.165h7.307l8.229 26.916h.128l8.229-26.916h7.115z"/>
  </svg>
);

const GooglePayLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="58" height="24" viewBox="0 0 58 24">
    <path fill="#4285F4" d="M26.26 12.185c0 3.396-2.61 5.908-5.812 5.908s-5.812-2.512-5.812-5.908c0-3.42 2.61-5.908 5.812-5.908s5.812 2.488 5.812 5.908zm-2.544 0c0-2.124-1.536-3.576-3.268-3.576s-3.268 1.452-3.268 3.576c0 2.1 1.536 3.576 3.268 3.576s3.268-1.5 3.268-3.576z"/>
    <path fill="#EA4335" d="M38.394 12.185c0 3.396-2.61 5.908-5.812 5.908s-5.812-2.512-5.812-5.908c0-3.396 2.61-5.908 5.812-5.908s5.812 2.488 5.812 5.908zm-2.544 0c0-2.124-1.536-3.576-3.268-3.576s-3.268 1.452-3.268 3.576c0 2.1 1.536 3.576 3.268 3.576s3.268-1.5 3.268-3.576z"/>
    <path fill="#FBBC05" d="M49.974 6.612v10.752c0 4.428-2.604 6.24-5.688 6.24-2.904 0-4.644-1.944-5.304-3.54l2.22-.924c.408.972 1.404 2.124 3.084 2.124 2.016 0 3.264-1.248 3.264-3.6v-.888h-.084c-.6.744-1.764 1.392-3.228 1.392-3.072 0-5.88-2.676-5.88-6.12 0-3.468 2.808-6.168 5.88-6.168 1.44 0 2.628.648 3.228 1.368h.084V6.612zm-2.34 5.532c0-2.076-1.38-3.6-3.144-3.6-1.788 0-3.288 1.524-3.288 3.6 0 2.052 1.5 3.552 3.288 3.552 1.764 0 3.144-1.5 3.144-3.552z"/>
    <path fill="#4285F4" d="M54.486 1.272V17.76h-2.484V1.272z"/>
    <path fill="#34A853" d="M63.41 13.98l1.98 1.32c-.636.948-2.172 2.592-4.824 2.592-3.288 0-5.748-2.544-5.748-5.908 0-3.516 2.484-5.908 5.46-5.908 3 0 4.464 2.436 4.944 3.756l.264.66-7.74 3.204c.588 1.164 1.512 1.752 2.82 1.752 1.308 0 2.22-.648 2.844-1.468zm-6.072-2.088l5.172-2.148c-.288-.72-1.14-1.224-2.148-1.224-1.284 0-3.072 1.14-3.024 3.372z"/>
    <path fill="#4285F4" d="M8.232 10.68V8.184H16.2c.084.432.12.948.12 1.5 0 1.872-.504 4.188-2.136 5.82-1.584 1.656-3.612 2.544-6.3 2.544C3.504 18.048 0 14.652 0 10.272S3.504 2.496 7.884 2.496c2.748 0 4.704 1.08 6.168 2.484l-1.74 1.74c-1.056-1.008-2.496-1.788-4.428-1.788-3.612 0-6.444 2.916-6.444 6.54s2.832 6.54 6.444 6.54c2.34 0 3.672-.948 4.524-1.8.696-.696 1.152-1.692 1.332-3.048z"/>
  </svg>
);

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState(
    cart.reduce((acc, _, i) => ({ ...acc, [i]: 1 }), {})
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prButtonRef = useRef(null);

  const subtotal = cart.reduce((sum, item, i) => sum + item.price * (quantities[i] || 1), 0);
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  // ── Stripe Payment Request ────────────────────────────────────────────────
  useEffect(() => {
    if (!showCheckout || total === 0) return;
    let pr;
    (async () => {
      const stripe = await stripePromise;
      pr = stripe.paymentRequest({
        country: "AU",
        currency: "aud",
        total: { label: "Clay in a Tray", amount: total * 100 },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      const result = await pr.canMakePayment();
      if (result) {
        setPaymentRequest(pr);
        pr.on("paymentmethod", async (ev) => {
          setLoading(true);
          try {
            const res = await fetch(BACKEND_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: total * 100, currency: "aud" }),
            });
            const { clientSecret } = await res.json();
            const stripe2 = await stripePromise;
            const { paymentIntent, error: confirmError } = await stripe2.confirmCardPayment(
              clientSecret,
              { payment_method: ev.paymentMethod.id },
              { handleActions: false }
            );
            if (confirmError) { ev.complete("fail"); setError(confirmError.message); setLoading(false); return; }
            if (paymentIntent.status === "requires_action") {
              const { error: actionError } = await stripe2.confirmCardPayment(clientSecret);
              if (actionError) { ev.complete("fail"); setError(actionError.message); setLoading(false); return; }
            }
            ev.complete("success");
            setPaymentMethod(result.applePay ? "Apple Pay" : "Google Pay");
            setPaymentDone(true);
          } catch { ev.complete("fail"); setError("Payment failed. Please try again."); }
          setLoading(false);
        });
      }
    })();
    return () => { if (pr) pr.off("paymentmethod"); };
  }, [showCheckout, total]);

  // ── Mount Stripe PR button ────────────────────────────────────────────────
  useEffect(() => {
    if (!paymentRequest || !prButtonRef.current) return;
    prButtonRef.current.innerHTML = "";
    (async () => {
      const stripe = await stripePromise;
      const elements = stripe.elements();
      const button = elements.create("paymentRequestButton", {
        paymentRequest,
        style: { paymentRequestButton: { height: "52px", borderRadius: "12px" } },
      });
      button.mount(prButtonRef.current);
    })();
  }, [paymentRequest, showCheckout]);

  // ── Card pay ─────────────────────────────────────────────────────────────
  const handleCardPay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total * 100, currency: "aud" }),
      });
      const { clientSecret } = await res.json();
      const stripe = await stripePromise;
      const { error: confirmError } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: { return_url: window.location.origin + "/success" },
      });
      if (confirmError) setError(confirmError.message);
    } catch { setError("Payment failed. Please try again."); }
    setLoading(false);
  };

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const updateQty = (index, delta) =>
    setQuantities((p) => ({ ...p, [index]: Math.max(1, (p[index] || 1) + delta) }));

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    setQuantities((prev) => {
      const next = {};
      updated.forEach((_, i) => { next[i] = prev[i < index ? i : i + 1] || 1; });
      return next;
    });
  };

  const clearCart = () => { setCart([]); setQuantities({}); };

  const closeModal = () => {
    setShowCheckout(false);
    setPaymentDone(false);
    setPaymentRequest(null);
    setError(null);
  };

  return (
    <div style={styles.page}>

      {/* ── NAVBAR — exact same component as Home.jsx ── */}
      <Navbar cartCount={cart.length} />

      {/* ── MAIN CONTENT ── */}
      <div style={styles.container}>
        <h2 style={styles.title}>Shopping Cart</h2>

        <div style={styles.layout}>

          {/* Left — items */}
          <div style={styles.itemsCol}>
            {cart.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ marginBottom: 20, color: "#666" }}>Your cart is empty.</p>
                <button className="btn-primary" onClick={() => navigate("/")}>
                  Browse Properties
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} style={styles.card}>
                  <img src={item.image} alt={item.name} style={styles.cardImg} />
                  <div style={styles.cardInfo}>
                    <div style={styles.cardTop}>
                      <div>
                        <h3 style={styles.cardName}>{item.name}</h3>
                        <span style={styles.cardTag}>Product</span>
                      </div>
                      <button style={styles.removeBtn} onClick={() => removeItem(index)} title="Remove">
                        🗑
                      </button>
                    </div>
                    <div style={styles.qtyRow}>
                      <span style={styles.qtyLabel}>Quantity:</span>
                      <button style={styles.qtyBtn} onClick={() => updateQty(index, -1)}>−</button>
                      <span style={styles.qtyVal}>{quantities[index] || 1}</span>
                      <button style={styles.qtyBtn} onClick={() => updateQty(index, 1)}>+</button>
                    </div>
                    <p style={styles.cardPrice}>
                      ${(item.price * (quantities[index] || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right — order summary */}
          {cart.length > 0 && (
            <div style={styles.summary}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>
              <div style={styles.summaryRow}>
                <span>Subtotal</span><span>${subtotal.toLocaleString()}.00</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Service fee</span><span>${serviceFee.toLocaleString()}.00</span>
              </div>
              <hr style={styles.summaryDivider} />
              <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
                <span>Total</span><span>${total.toLocaleString()}.00</span>
              </div>

              <button className="btn-primary" style={styles.checkoutBtn} onClick={() => setShowCheckout(true)}>
                💳 Proceed to Checkout
              </button>
              <button style={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
              <p style={styles.secureNote}>All transactions are secure and encrypted</p>
            </div>
          )}
        </div>
      </div>

      {/* ── CHECKOUT MODAL ── */}
      {showCheckout && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Payment</h3>
              <button style={styles.modalClose} onClick={closeModal}>✕</button>
            </div>

            {paymentDone ? (
              <div style={styles.successBox}>
                <div style={styles.successIcon}>✓</div>
                <h3 style={{ margin: "0 0 8px", color: "#1a1a1a" }}>Payment Successful!</h3>
                <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: 6 }}>
                  Thank you for your purchase via {paymentMethod}.
                </p>
                <p style={{ color: "#c0533a", fontWeight: 700, fontSize: "1.2rem", marginBottom: 24 }}>
                  ${total.toLocaleString()}.00 paid
                </p>
                <button className="btn-primary" style={{ width: "100%" }}
                  onClick={() => { closeModal(); clearCart(); navigate("/"); }}>
                  Back to Home
                </button>
              </div>
            ) : (
              <>
                <div style={styles.amountBox}>
                  <p style={styles.amountLabel}>Total Amount</p>
                  <p style={styles.amountValue}>${total.toLocaleString()}.00</p>
                </div>

                <p style={styles.methodLabel}>Select Payment Method</p>

                {error && <p style={styles.errorBox}>{error}</p>}

                {paymentRequest ? (
                  <div ref={prButtonRef} style={{ marginBottom: 12 }} />
                ) : (
                  <>
                    <button style={styles.payApple} disabled><ApplePayLogo /></button>
                    <button style={styles.payGoogle} disabled>
                      <GooglePayLogo />
                      <span style={{ marginLeft: 10, fontWeight: 600 }}>Pay with Google Pay</span>
                    </button>
                  </>
                )}

                <button style={styles.payCard} onClick={handleCardPay} disabled={loading}>
                  {loading ? "Processing..." : "💳  Pay with Card"}
                </button>

                <p style={styles.modalSecure}>🔒 Your payment information is secure and encrypted</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Clay in a Tray · South Golden Beach, Byron Bay, NSW</p>
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
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "32px 24px 60px",
  },
  title: {
    fontSize: "1.7rem",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: 28,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 28,
    alignItems: "start",
  },
  itemsCol: { display: "flex", flexDirection: "column", gap: 16 },
  emptyState: {
    background: "#fffaf6",
    border: "1px solid #ebe3db",
    borderRadius: 20,
    padding: 48,
    textAlign: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },

  /* Cart card — matches property-card aesthetic */
  card: {
    background: "#fff",
    border: "1px solid #ebe3db",
    borderRadius: 20,
    padding: 20,
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },
  cardImg: { width: 110, height: 90, objectFit: "cover", borderRadius: 12, flexShrink: 0 },
  cardInfo: { flex: 1 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  cardName: { fontSize: "1rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" },
  cardTag: {
    display: "inline-block", background: "#eaf4f6", color: "#3a7a8c",
    fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px",
    borderRadius: 999, fontFamily: "sans-serif",
  },
  removeBtn: {
    background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem",
    color: "#aaa", padding: 4, borderRadius: 6, transition: "color 0.2s",
  },
  qtyRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  qtyLabel: { fontSize: "0.88rem", color: "#555" },
  qtyBtn: {
    width: 30, height: 30, border: "1px solid #ddd", background: "#fffaf6",
    borderRadius: 8, cursor: "pointer", fontSize: "1rem",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#333",
  },
  qtyVal: { fontSize: "1rem", fontWeight: 600, minWidth: 24, textAlign: "center", color: "#1a1a1a" },
  cardPrice: { fontSize: "1.2rem", fontWeight: 700, color: "#c0533a", margin: 0 },

  /* Summary panel */
  summary: {
    background: "#fff",
    border: "1px solid #ebe3db",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 84,
  },
  summaryTitle: { fontSize: "1.15rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 20px" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "0.93rem", color: "#555", marginBottom: 12 },
  summaryDivider: { border: "none", borderTop: "1px solid #eee", margin: "16px 0" },
  summaryTotal: { fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 20 },
  checkoutBtn: { width: "100%", marginBottom: 12, minWidth: "unset" },
  clearBtn: {
    width: "100%", background: "#fffaf6", color: "#2c2c2c",
    border: "1px solid #ddd3ca", borderRadius: 16, padding: 14,
    fontSize: "0.95rem", fontWeight: 600, fontFamily: "'Georgia', serif",
    cursor: "pointer", marginBottom: 16,
  },
  secureNote: { textAlign: "center", fontSize: "0.78rem", color: "#aaa", fontFamily: "sans-serif" },

  /* Modal */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
  },
  modal: {
    background: "#fff", borderRadius: 20, padding: 32, width: "100%",
    maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: "1.3rem", fontWeight: 600, color: "#1a1a1a", margin: 0 },
  modalClose: {
    background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer",
    color: "#888", padding: "4px 8px", borderRadius: 6,
  },
  amountBox: {
    background: "#f0f5f8", borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 24,
  },
  amountLabel: { fontSize: "0.88rem", color: "#888", margin: "0 0 6px", fontFamily: "sans-serif" },
  amountValue: { fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", margin: 0 },
  methodLabel: { fontSize: "0.95rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 14 },
  errorBox: {
    background: "#fef2f2", color: "#c0533a", border: "1px solid #fca5a5",
    borderRadius: 8, padding: "10px 14px", fontSize: "0.88rem",
    fontFamily: "sans-serif", marginBottom: 14,
  },
  payApple: {
    width: "100%", background: "#000", color: "#fff", border: "none",
    borderRadius: 12, padding: "14px 16px", cursor: "pointer",
    marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center",
  },
  payGoogle: {
    width: "100%", background: "#fff", color: "#1a1a1a", border: "1px solid #ddd",
    borderRadius: 12, padding: "14px 16px", cursor: "pointer",
    marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "sans-serif",
  },
  payCard: {
    width: "100%", background: "#3a7a8c", color: "#fff", border: "none",
    borderRadius: 12, padding: 16, fontSize: "1rem", fontWeight: 600,
    cursor: "pointer", marginBottom: 20, display: "flex",
    alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "sans-serif",
  },
  modalSecure: { textAlign: "center", fontSize: "0.8rem", color: "#999", fontFamily: "sans-serif", paddingTop: 16, borderTop: "1px solid #eee" },
  successBox: { textAlign: "center", padding: "20px 0" },
  successIcon: {
    width: 64, height: 64, background: "#3a7a8c", color: "#fff",
    borderRadius: "50%", fontSize: "2rem", display: "flex",
    alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
  },
  footer: { textAlign: "center", padding: "28px 20px 36px", borderTop: "1px solid #e8e2db", marginTop: 8 },
  footerText: { color: "#888", fontSize: "0.9rem", margin: 0 },
};