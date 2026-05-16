import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/api$/, "");

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    fetch(`${BACKEND_URL}/api/bookings/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const active = Array.isArray(data)
          ? data.filter((b) => b.status === "pending" || b.status === "approved")
          : [];
        setBookings(active);
      })
      .catch((err) => console.error("Failed to load bookings:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        alert("Booking cancelled successfully.");
      } else {
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking.");
    }
  };

  if (!token || !user) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.emptyCard}>
            <h2 style={styles.title}>My Bookings</h2>
            <p style={styles.emptyText}>Please log in to view your bookings.</p>
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>My Bookings</h2>
        <p style={styles.subtitle}>Active bookings awaiting confirmation</p>

        {loading ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>You have no active bookings yet.</p>
            <button className="btn-primary" onClick={() => navigate("/accommodation")}>
              Browse Properties
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {bookings.map((booking) => (
              <div key={booking._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.statusBadge}>
                    ● {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
                    <p style={styles.totalLabel}>Total paid via {booking.paymentMethod}</p>
                    <p style={styles.totalValue}>${booking.totalPrice?.toLocaleString()}.00</p>
                  </div>
                  <button style={styles.cancelBtn} onClick={() => handleCancel(booking._id)}>
                    Cancel Booking
                  </button>
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
  statusBadge: { display: "inline-block", background: "#fef3e0", color: "#c47a1f", padding: "5px 12px", borderRadius: 999, fontSize: "0.82rem", fontWeight: 600, fontFamily: "sans-serif" },
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
  cancelBtn: { background: "#fff", color: "#c0533a", border: "1.5px solid #c0533a", borderRadius: 12, padding: "10px 22px", fontSize: "0.9rem", fontWeight: 600, fontFamily: "'Georgia', serif", cursor: "pointer" },
};