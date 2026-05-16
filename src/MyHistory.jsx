import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/api$/, "");

export default function MyHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    const fetchAll = async () => {
      try {
        // Fetch cancelled/rejected bookings
        const bRes = await fetch(`${BACKEND_URL}/api/bookings/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bData = await bRes.json();
        const pastBookings = Array.isArray(bData)
          ? bData.filter((b) => b.status === "cancelled" || b.status === "rejected")
          : [];
        setBookings(pastBookings);

        // Fetch product orders
        const oRes = await fetch(`${BACKEND_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const oData = await oRes.json();
        setOrders(Array.isArray(oData) ? oData : []);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "cancelled":
      case "rejected": return { background: "#fef2f2", color: "#c0533a" };
      case "paid": return { background: "#e3f2fd", color: "#1565c0" };
      case "completed": return { background: "#e8f5e9", color: "#2e7d32" };
      default: return { background: "#f0f0f0", color: "#666" };
    }
  };

  if (!token || !user) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.emptyCard}>
            <h2 style={styles.title}>My History</h2>
            <p style={styles.emptyText}>Please log in to view your history.</p>
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasHistory = bookings.length > 0 || orders.length > 0;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>My History</h2>
        <p style={styles.subtitle}>Past bookings, orders and cancellations</p>

        {loading ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>Loading your history...</p>
          </div>
        ) : !hasHistory ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>No history yet.</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Browse Properties
            </button>
          </div>
        ) : (
          <div style={styles.list}>

            {/* ── Product Orders ── */}
            {orders.map((order) => (
              <div key={order._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(order.status) }}>
                    ● {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                  <span style={styles.dateText}>
                    {new Date(order.createdAt).toLocaleDateString("en-AU", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} style={styles.propertyRow}>
                      {item.image && (
                        <img src={item.image} alt={item.name} style={styles.propImg} />
                      )}
                      <div style={styles.propInfo}>
                        <h3 style={styles.propName}>{item.name}</h3>
                        <p style={styles.propMeta}>
                          Qty: {item.quantity} · ${item.price?.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.cardFooter}>
                  <div>
                    <p style={styles.totalLabel}>Product order via {order.paymentMethod}</p>
                    <p style={styles.totalValue}>${order.amount?.toLocaleString()}.00</p>
                  </div>
                </div>
              </div>
            ))}

            {/* ── Cancelled / Rejected Bookings ── */}
            {bookings.map((booking) => (
              <div key={booking._id} style={{ ...styles.card, opacity: 0.9 }}>
                <div style={styles.cardHeader}>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(booking.status) }}>
                    ● {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>
                  <span style={styles.dateText}>
                    {new Date(booking.createdAt).toLocaleDateString("en-AU", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  {(booking.items || []).map((item, idx) => (
                    <div key={idx} style={styles.propertyRow}>
                      {item.image && (
                        <img src={item.image} alt={item.name} style={styles.propImg} />
                      )}
                      <div style={styles.propInfo}>
                        <h3 style={styles.propName}>{item.name}</h3>
                        <p style={styles.propMeta}>
                          Quantity: {item.quantity} · ${item.price?.toLocaleString()} / night
                        </p>
                        {item.checkIn && (
                          <p style={styles.propMeta}>
                            Check-in: {item.checkIn} → Check-out: {item.checkOut}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.cardFooter}>
                  <div>
                    <p style={styles.totalLabel}>Booking via {booking.paymentMethod}</p>
                    <p style={styles.totalValue}>${booking.totalPrice?.toLocaleString()}.00</p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Georgia', 'Times New Roman', serif", background: "#f5f0eb", minHeight: "100vh", color: "#2c2c2c" },
  container: { maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px" },
  title: { fontSize: "1.8rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 6 },
  subtitle: { color: "#888", fontSize: "0.95rem", marginBottom: 28 },
  emptyCard: { background: "#fff", border: "1px solid #ebe3db", borderRadius: 20, padding: 48, textAlign: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" },
  emptyText: { color: "#666", marginBottom: 20, fontSize: "1rem" },
  list: { display: "flex", flexDirection: "column", gap: 18 },
  card: { background: "#fff", border: "1px solid #ebe3db", borderRadius: 20, padding: 24, boxShadow: "0 6px 18px rgba(0,0,0,0.05)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #f0e8df" },
  statusBadge: { display: "inline-block", padding: "5px 12px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, fontFamily: "sans-serif" },
  dateText: { color: "#888", fontSize: "0.85rem", fontFamily: "sans-serif" },
  cardBody: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 },
  propertyRow: { display: "flex", gap: 14, alignItems: "center" },
  propImg: { width: 80, height: 64, objectFit: "cover", borderRadius: 10, flexShrink: 0 },
  propInfo: { flex: 1 },
  propName: { fontSize: "1rem", fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px" },
  propMeta: { fontSize: "0.85rem", color: "#666", margin: "0 0 2px" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #f0e8df" },
  totalLabel: { fontSize: "0.82rem", color: "#888", margin: "0 0 4px", fontFamily: "sans-serif" },
  totalValue: { fontSize: "1.3rem", fontWeight: 700, color: "#c0533a", margin: 0 },
};