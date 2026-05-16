import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || currentUser?.role !== "admin") navigate("/");
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/users/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { 
        console.log("API response:", data);
        setUsers(data); 
        setLoading(false); 
      })
      .catch(() => { setError("Failed to load users"); setLoading(false); });
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`${API_BASE}/users/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } else {
      const data = await res.json();
      alert(data.message || "Failed to delete");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    const res = await fetch(`${API_BASE}/users/admin/${id}/role`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update role");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading users...</div>;
  if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ marginBottom: 24 }}>👥 Manage Users</h1>
        <p style={{ marginBottom: 20, color: "#666" }}>{users.length} users total</p>

        {users.map((u) => (
          <div
            key={u._id}
            style={{
              border: "1px solid #ebe3db",
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              background: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <strong>{u.name}</strong>
                <span style={{
                  background: u.role === "admin" ? "#c0623a" : "#6b7280",
                  color: "#fff",
                  padding: "2px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}>
                  {u.role}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "#666" }}>{u.email}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Role toggle — don't allow changing your own role */}
              {u._id !== currentUser.id && (
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )}

              {/* Can't delete yourself or other admins */}
              {u._id !== currentUser.id && u.role !== "admin" && (
                <button
                  onClick={() => handleDelete(u._id, u.name)}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}