import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/api$/, "") + "/api";

export default function AdminMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || user?.role !== "admin") navigate("/");
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/messages/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { setMessages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRead = async (id) => {
    const res = await fetch(`${API_BASE}/messages/admin/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`${API_BASE}/messages/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  if (loading) return <div style={{ padding: 40 }}>Loading messages...</div>;

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ marginBottom: 8 }}>📬 Messages</h1>
        <p style={{ marginBottom: 24, color: "#666" }}>
          {messages.length} total · {unread} unread
        </p>

        {messages.length === 0 && <p>No messages yet.</p>}

        {messages.map((m) => (
          <div
            key={m._id}
            style={{
              border: `1px solid ${m.read ? "#ebe3db" : "#c0623a"}`,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              background: m.read ? "#fff" : "#fff5f2",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <strong>{m.fullName}</strong>
                {!m.read && (
                  <span style={{
                    marginLeft: 8,
                    background: "#c0623a",
                    color: "#fff",
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 20,
                    fontWeight: 600,
                  }}>NEW</span>
                )}
                <p style={{ margin: "2px 0", fontSize: 13, color: "#666" }}>{m.email} {m.phone && `· ${m.phone}`}</p>
                <p style={{ margin: "2px 0", fontSize: 12, color: "#999" }}>
                  {new Date(m.createdAt).toLocaleString()} · {m.subject}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!m.read && (
                  <button
                    onClick={() => handleRead(m._id)}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    ✓ Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m._id)}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            <p style={{ marginTop: 12, fontSize: 14, color: "#2c2c2c", lineHeight: 1.6 }}>
              {m.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}