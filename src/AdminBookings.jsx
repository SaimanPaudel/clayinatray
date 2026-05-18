import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/api$/, "") + "/api";

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Redirect if not admin
  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/");
    }
  }, []);

  // Fetch all bookings
  useEffect(() => {
    fetch(`${API_BASE}/bookings/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load bookings");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`${API_BASE}/bookings/admin/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, ...data.booking } : b))
      );
      if (!data.email?.sent) {
        alert(`Booking approved, but email was not sent: ${data.email?.error || "unknown email error"}`);
      }
    } else {
      alert(data.error || data.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    const res = await fetch(`${API_BASE}/bookings/admin/${id}/reject`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, ...data.booking } : b))
      );
      if (!data.email?.sent) {
        alert(`Booking rejected, but email was not sent: ${data.email?.error || "unknown email error"}`);
      }
    } else {
      alert(data.error || data.message || "Failed to reject");
    }
  };

  const statusColor = {
    pending: "#f59e0b",
    approved: "#10b981",
    rejected: "#ef4444",
    cancelled: "#6b7280",
    paid: "#3b82f6",
  };

  if (loading) return <div style={{ padding: 40 }}>Loading bookings...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ marginBottom: 24 }}>🛠️ Manage Bookings</h1>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              style={{
                border: "1px solid #ebe3db",
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong>{b.properties?.[0]?.name || "Unknown Property"}</strong>
                <span
                  style={{
                    background: statusColor[b.status] || "#ccc",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {b.status}
                </span>
              </div>

              <p style={{ margin: "4px 0", fontSize: 14, color: "#666" }}>
                Booking ID: {b._id}
              </p>
              <p style={{ margin: "4px 0", fontSize: 14, color: "#666" }}>
                Guest: {b.user?.name || "Unknown"} {b.user?.email ? `(${b.user.email})` : ""}
              </p>
              <p style={{ margin: "4px 0", fontSize: 14, color: "#666" }}>
                User ID: {b.userId}
              </p>
              <p style={{ margin: "4px 0", fontSize: 14 }}>
                Check-in: <strong>{b.properties?.[0]?.checkIn?.split("T")[0]}</strong> →
                Check-out: <strong>{b.properties?.[0]?.checkOut?.split("T")[0]}</strong>
              </p>
              <p style={{ margin: "4px 0", fontSize: 14 }}>
                Total: <strong>${b.totalPrice}</strong>
              </p>
              <p style={{ margin: "4px 0", fontSize: 14 }}>
                Booked on: {new Date(b.createdAt).toLocaleDateString()}
              </p>

              {b.status === "pending" && (
                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <button
                    onClick={() => handleApprove(b._id)}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(b._id)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

              {b.status === "rejected" && b.rejectionReason && (
                <p style={{ marginTop: 8, fontSize: 13, color: "#ef4444" }}>
                  Reason: {b.rejectionReason}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
