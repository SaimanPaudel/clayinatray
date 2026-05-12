import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import Navbar from "./Navbar";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirm) {
      setError("Both fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Reset failed");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar profilePath="/login" />

      <div className="auth-container">
        <div className="auth-card">
          {success ? (
            <div className="success-box">
              <div className="success-icon">✅</div>
              <h2>Password Reset!</h2>
              <p>Your password has been updated successfully.</p>
              <button className="auth-btn" onClick={() => navigate("/login")}>
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">Enter your new password below.</p>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className={`form-input ${error ? "input-error" : ""}`}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-input ${error ? "input-error" : ""}`}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                  />
                  {error && <p className="error-text">{error}</p>}
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <p className="switch-text">
                  Remember your password?{" "}
                  <a onClick={() => navigate("/login")}>Back to login</a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
