import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import "./App.css";
import "./Cart.css";
import Navbar from "./Navbar";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/api$/, "");

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
const SERVICE_FEE_RATE = 0.14;

const TABS = ["Wallet", "PayPal"];

// ── Save booking OR order to DB ───────────────────────────────────────────────
async function saveOrderToDB({ cart, quantities, subtotal, serviceFee, total, method }) {
  const hasAccommodation = cart.some((item) => item.type === "accommodation");
  const token = localStorage.getItem("token");

  if (hasAccommodation) {
    // Accommodation booking flow
    if (!token) return null;
    const res = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.map((item, i) => ({
          name: item.name,
          price: item.price,
          quantity: quantities[i] || 1,
          image: item.image,
          propertyId: item.propertyId || item.name,
        })),
        subtotal,
        serviceFee,
        totalPrice: total,
        paymentMethod: method,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to save booking");
    }
    return { type: "booking", data: await res.json() };
  } else {
    // Product purchase flow
    const res = await fetch(`${BACKEND_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        items: cart.map((item, i) => ({
          name: item.name,
          price: item.price,
          quantity: quantities[i] || 1,
          image: item.image,
        })),
        subtotal,
        serviceFee,
        amount: total,        // ← matches Order model field name
        paymentMethod: method,
        status: "paid",
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to save order");
    }
    return { type: "order", data: await res.json() };
  }
}

// ── PayPal button wrapper ─────────────────────────────────────────────────────
function PayPalTabContent({ total, onSuccess, onError, onCancel }) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0", color: "#888", fontFamily: "sans-serif", fontSize: "0.9rem" }}>
        Loading PayPal...
      </div>
    );
  }

  if (isRejected) {
    return (
      <div style={{ textAlign: "center", padding: "16px", color: "#c0533a", fontFamily: "sans-serif", fontSize: "0.88rem", background: "#fef2f2", borderRadius: 8 }}>
        Failed to load PayPal. Please check your Client ID or try refreshing.
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal", height: 48 }}
      forceReRender={[total]}
      createOrder={(data, actions) =>
        actions.order.create({
          purchase_units: [{ amount: { value: total.toFixed(2), currency_code: "AUD" }, description: "Clay in a Tray Order" }],
        })
      }
      onApprove={async (data, actions) => {
        try {
          const details = await actions.order.capture();
          onSuccess(details);
        } catch (err) {
          onError(err);
        }
      }}
      onError={(err) => { console.error("PayPal error:", err); onError(err); }}
      onCancel={onCancel}
    />
  );
}

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState(
    cart.reduce((acc, _, i) => ({ ...acc, [i]: 1 }), {})
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [activeTab, setActiveTab] = useState("Wallet");

  // ── Test mode ──────────────────────────────────────────────────────────────
  const [testMode, setTestMode] = useState(false);

  // Stripe wallet state
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [walletAvailable, setWalletAvailable] = useState(false);
  const prButtonRef = useRef(null);

  // Loading / error state
  const [cardLoading, setCardLoading] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cart.reduce((sum, item, i) => sum + item.price * (quantities[i] || 1), 0);
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  // ── Handle success for any payment method ─────────────────────────────────
  const handlePaymentSuccess = async (method) => {
    try {
      const result = await saveOrderToDB({ cart, quantities, subtotal, serviceFee, total, method });
      setOrderType(result?.type || "order");
      setPaymentMethod(method);
      setPaymentDone(true);
    } catch (err) {
      setError("Payment succeeded but order could not be saved. Please contact support.");
      console.error(err);
    }
  };

  // ── Test mode instant success ─────────────────────────────────────────────
  const handleTestPay = async (method) => {
    setCardLoading(true);
    setError(null);
    try {
      await handlePaymentSuccess(`${method} (Test)`);
    } catch (err) {
      setError(err.message);
    }
    setCardLoading(false);
  };

  // ── Stripe wallet (Apple Pay / Google Pay) setup ──────────────────────────
  useEffect(() => {
    if (!showCheckout || total === 0 || testMode) return;

    let pr;
    let isMounted = true;

    (async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) return;

        pr = stripe.paymentRequest({
          country: "AU",
          currency: "aud",
          total: { label: "Clay in a Tray", amount: total * 100 },
          displayItems: [
            { label: "Subtotal", amount: subtotal * 100 },
            { label: "Service fee", amount: serviceFee * 100 },
          ],
          requestPayerName: true,
          requestPayerEmail: true,
        });

        const result = await pr.canMakePayment();
        if (!isMounted) return;

        if (result) {
          setPaymentRequest(pr);
          setWalletAvailable(true);

          pr.on("paymentmethod", async (ev) => {
            setCardLoading(true);
            setError(null);
            try {
              const res = await fetch(`${BACKEND_URL}/api/payment/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total * 100, currency: "aud" }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Failed to create payment intent");

              const stripe2 = await stripePromise;
              const { paymentIntent, error: confirmError } = await stripe2.confirmCardPayment(
                data.clientSecret,
                { payment_method: ev.paymentMethod.id },
                { handleActions: false }
              );

              if (confirmError) {
                ev.complete("fail");
                setError(confirmError.message);
                setCardLoading(false);
                return;
              }

              if (paymentIntent.status === "requires_action") {
                const { error: actionError } = await stripe2.confirmCardPayment(data.clientSecret);
                if (actionError) {
                  ev.complete("fail");
                  setError(actionError.message);
                  setCardLoading(false);
                  return;
                }
              }

              ev.complete("success");
              const method = result.applePay ? "Apple Pay" : "Google Pay";
              await handlePaymentSuccess(method);
            } catch (err) {
              ev.complete("fail");
              setError(err.message || "Payment failed. Please try again.");
            }
            setCardLoading(false);
          });
        } else {
          setPaymentRequest(null);
          setWalletAvailable(false);
        }
      } catch {
        setPaymentRequest(null);
        setWalletAvailable(false);
      }
    })();

    return () => {
      isMounted = false;
      if (pr) pr.off("paymentmethod");
    };
  }, [showCheckout, total, subtotal, serviceFee, testMode]);

  // ── Mount Stripe PR button ────────────────────────────────────────────────
  useEffect(() => {
    if (!paymentRequest || !prButtonRef.current) return;
    prButtonRef.current.innerHTML = "";
    (async () => {
      const stripe = await stripePromise;
      if (!stripe) return;
      const elements = stripe.elements();
      const button = elements.create("paymentRequestButton", {
        paymentRequest,
        style: { paymentRequestButton: { type: "default", theme: "dark", height: "52px" } },
      });
      button.mount(prButtonRef.current);
    })();
  }, [paymentRequest]);

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
    setWalletAvailable(false);
    setError(null);
    setActiveTab("Wallet");
    setTestMode(false);
    setOrderType(null);
  };

  return (
    <div style={styles.page}>
      <Navbar cartCount={cart.length} />

      <div style={styles.container}>
        <h2 style={styles.title}>Shopping Cart</h2>

        <div style={styles.layout}>
          {/* ── Items ── */}
          <div style={styles.itemsCol}>
            {cart.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ marginBottom: 20, color: "#666" }}>Your cart is empty.</p>
                <button className="btn-primary" onClick={() => navigate("/")}>Browse Properties</button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} style={styles.card}>
                  <img src={item.image} alt={item.name} style={styles.cardImg} />
                  <div style={styles.cardInfo}>
                    <div style={styles.cardTop}>
                      <div>
                        <h3 style={styles.cardName}>{item.name}</h3>
                        <span style={styles.cardTag}>
                          {item.type === "accommodation" ? "Accommodation" : "Product"}
                        </span>
                      </div>
                      <button style={styles.removeBtn} onClick={() => removeItem(index)} title="Remove">🗑</button>
                    </div>
                    <div style={styles.qtyRow}>
                      <span style={styles.qtyLabel}>Quantity:</span>
                      <button style={styles.qtyBtn} onClick={() => updateQty(index, -1)}>−</button>
                      <span style={styles.qtyVal}>{quantities[index] || 1}</span>
                      <button style={styles.qtyBtn} onClick={() => updateQty(index, 1)}>+</button>
                    </div>
                    <p style={styles.cardPrice}>${(item.price * (quantities[index] || 1)).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Order Summary ── */}
          {cart.length > 0 && (
            <div style={styles.summary}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>
              <div style={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toLocaleString()}.00</span></div>
              <div style={styles.summaryRow}><span>Service fee</span><span>${serviceFee.toLocaleString()}.00</span></div>
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

      {/* ── Checkout Modal ── */}
      {showCheckout && (
        <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "AUD", intent: "capture" }}>
          <div style={styles.overlay} onClick={closeModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

              {/* Header */}
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Payment</h3>
                <button style={styles.modalClose} onClick={closeModal}>✕</button>
              </div>

              {paymentDone ? (
                /* ── Success screen ── */
                <div style={styles.successBox}>
                  <div style={styles.successIcon}>✓</div>
                  <h3 style={{ margin: "0 0 8px", color: "#1a1a1a" }}>
                    {orderType === "booking" ? "Booking Submitted!" : "Order Placed!"}
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: 6 }}>
                    {orderType === "booking"
                      ? <><strong>{paymentMethod}</strong> — your booking is pending admin approval.</>
                      : <><strong>{paymentMethod}</strong> — your order has been received.</>}
                  </p>
                  <p style={{ color: "#c0533a", fontWeight: 700, fontSize: "1.2rem", marginBottom: 8 }}>
                    ${total.toLocaleString()}.00
                  </p>
                  {orderType === "booking" && (
                    <p style={{ color: "#888", fontSize: "0.82rem", marginBottom: 24, fontFamily: "sans-serif" }}>
                      You can track or cancel your booking under <strong>My Bookings</strong>.
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 10, marginTop: orderType !== "booking" ? 24 : 0 }}>
                    {orderType === "booking" ? (
                      <button className="btn-primary" style={{ flex: 1 }}
                        onClick={() => { closeModal(); clearCart(); navigate("/my-bookings"); }}>
                        My Bookings
                      </button>
                    ) : (
                      <button className="btn-primary" style={{ flex: 1 }}
                        onClick={() => { closeModal(); clearCart(); navigate("/"); }}>
                        Continue Shopping
                      </button>
                    )}
                    <button className="btn-secondary" style={{ flex: 1 }}
                      onClick={() => { closeModal(); clearCart(); navigate("/"); }}>
                      Back to Home
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Amount box */}
                  <div style={styles.amountBox}>
                    <p style={styles.amountLabel}>Total Amount</p>
                    <p style={styles.amountValue}>${total.toLocaleString()}.00</p>
                  </div>

                  {/* ── Test Mode Toggle ── */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: testMode ? "#fffbea" : "#f9f9f9",
                    border: `1px solid ${testMode ? "#f0d080" : "#eee"}`,
                    borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                    fontFamily: "sans-serif",
                  }}>
                    <span style={{ fontSize: "0.83rem", color: testMode ? "#7a5c00" : "#999" }}>
                      🧪 {testMode ? "Test mode on — no real charge" : "Test mode off — real payment"}
                    </span>
                    <button
                      onClick={() => setTestMode((t) => !t)}
                      style={{
                        background: testMode ? "#f0c000" : "#ddd",
                        border: "none", borderRadius: 20,
                        padding: "4px 14px", fontSize: "0.78rem",
                        fontWeight: 700, cursor: "pointer",
                        color: testMode ? "#3a2e00" : "#666",
                      }}
                    >
                      {testMode ? "ON" : "OFF"}
                    </button>
                  </div>

                  {/* Tabs — Wallet & PayPal only */}
                  <div style={styles.tabs}>
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
                        onClick={() => { setActiveTab(tab); setError(null); }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {error && <p style={styles.errorBox}>{error}</p>}

                  {/* ── Wallet tab ── */}
                  {activeTab === "Wallet" && (
                    <div style={styles.tabContent}>
                      {testMode ? (
                        <button style={styles.payBtn} disabled={cardLoading} onClick={() => handleTestPay("Wallet")}>
                          {cardLoading ? "Submitting..." : "🧪 Simulate Wallet Pay"}
                        </button>
                      ) : walletAvailable ? (
                        <div ref={prButtonRef} />
                      ) : (
                        <p style={styles.walletUnavailable}>
                          Apple Pay / Google Pay is not available on this device or browser.
                          Please use PayPal instead.
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── PayPal tab ── */}
                  {activeTab === "PayPal" && (
                    <div style={styles.tabContent}>
                      {testMode ? (
                        <button
                          style={{ ...styles.payBtn, background: "#0070ba" }}
                          disabled={cardLoading}
                          onClick={() => handleTestPay("PayPal")}
                        >
                          {cardLoading ? "Submitting..." : "🧪 Simulate PayPal Pay"}
                        </button>
                      ) : (
                        <PayPalTabContent
                          total={total}
                          onSuccess={async (details) => {
                            console.log("PayPal captured:", details.id);
                            await handlePaymentSuccess("PayPal");
                          }}
                          onError={() => setError("PayPal payment failed. Please try again.")}
                          onCancel={() => setError("PayPal payment was cancelled.")}
                        />
                      )}
                    </div>
                  )}

                  <p style={styles.modalSecure}>
                    🔒 Your payment information is secure and encrypted
                  </p>
                </>
              )}
            </div>
          </div>
        </PayPalScriptProvider>
      )}

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Clay in a Tray · South Golden Beach, Byron Bay, NSW</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Georgia', 'Times New Roman', serif", background: "#f5f0eb", minHeight: "100vh", color: "#2c2c2c" },
  container: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px 60px" },
  title: { fontSize: "1.7rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 28 },
  layout: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" },
  itemsCol: { display: "flex", flexDirection: "column", gap: 16 },
  emptyState: { background: "#fffaf6", border: "1px solid #ebe3db", borderRadius: 20, padding: 48, textAlign: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" },
  card: { background: "#fff", border: "1px solid #ebe3db", borderRadius: 20, padding: 20, display: "flex", gap: 20, alignItems: "flex-start", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" },
  cardImg: { width: 110, height: 90, objectFit: "cover", borderRadius: 12, flexShrink: 0 },
  cardInfo: { flex: 1 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  cardName: { fontSize: "1rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" },
  cardTag: { display: "inline-block", background: "#eaf4f6", color: "#3a7a8c", fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px", borderRadius: 999, fontFamily: "sans-serif" },
  removeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "#aaa", padding: 4, borderRadius: 6 },
  qtyRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  qtyLabel: { fontSize: "0.88rem", color: "#555" },
  qtyBtn: { width: 30, height: 30, border: "1px solid #ddd", background: "#fffaf6", borderRadius: 8, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" },
  qtyVal: { fontSize: "1rem", fontWeight: 600, minWidth: 24, textAlign: "center", color: "#1a1a1a" },
  cardPrice: { fontSize: "1.2rem", fontWeight: 700, color: "#c0533a", margin: 0 },
  summary: { background: "#fff", border: "1px solid #ebe3db", borderRadius: 20, padding: 28, boxShadow: "0 6px 18px rgba(0,0,0,0.05)", position: "sticky", top: 84 },
  summaryTitle: { fontSize: "1.15rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 20px" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "0.93rem", color: "#555", marginBottom: 12 },
  summaryDivider: { border: "none", borderTop: "1px solid #eee", margin: "16px 0" },
  summaryTotal: { fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 20 },
  checkoutBtn: { width: "100%", marginBottom: 12, minWidth: "unset" },
  clearBtn: { width: "100%", background: "#fffaf6", color: "#2c2c2c", border: "1px solid #ddd3ca", borderRadius: 16, padding: 14, fontSize: "0.95rem", fontWeight: 600, fontFamily: "'Georgia', serif", cursor: "pointer", marginBottom: 16 },
  secureNote: { textAlign: "center", fontSize: "0.78rem", color: "#aaa", fontFamily: "sans-serif" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal: { background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontSize: "1.3rem", fontWeight: 600, color: "#1a1a1a", margin: 0 },
  modalClose: { background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#888", padding: "4px 8px", borderRadius: 6 },
  amountBox: { background: "#f0f5f8", borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 24 },
  amountLabel: { fontSize: "0.88rem", color: "#888", margin: "0 0 6px", fontFamily: "sans-serif" },
  amountValue: { fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", margin: 0 },
  tabs: { display: "flex", gap: 6, marginBottom: 20, background: "#f5f0eb", borderRadius: 12, padding: 4 },
  tab: { flex: 1, padding: "9px 0", border: "none", borderRadius: 9, background: "transparent", fontSize: "0.88rem", fontWeight: 500, color: "#666", cursor: "pointer", fontFamily: "'Georgia', serif", transition: "all 0.2s" },
  tabActive: { background: "#fff", color: "#1a1a1a", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  tabContent: { marginBottom: 16 },
  errorBox: { background: "#fef2f2", color: "#c0533a", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: "0.88rem", fontFamily: "sans-serif", marginBottom: 14 },
  walletUnavailable: { color: "#666", fontSize: "0.88rem", fontFamily: "sans-serif", textAlign: "center", padding: "20px 0" },
  payBtn: { width: "100%", background: "#3a7a8c", color: "#fff", border: "none", borderRadius: 12, padding: 16, fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "sans-serif" },
  modalSecure: { textAlign: "center", fontSize: "0.8rem", color: "#999", fontFamily: "sans-serif", paddingTop: 16, borderTop: "1px solid #eee", marginTop: 8 },
  successBox: { textAlign: "center", padding: "20px 0" },
  successIcon: { width: 64, height: 64, background: "#3a7a8c", color: "#fff", borderRadius: "50%", fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  footer: { textAlign: "center", padding: "28px 20px 36px", borderTop: "1px solid #e8e2db", marginTop: 8 },
  footerText: { color: "#888", fontSize: "0.9rem", margin: 0 },
};