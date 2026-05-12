import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import Navbar from "./Navbar";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar profilePath="/login" />

      <div className="auth-container">
        <div className="auth-card">
          {submitted ? (
            <div className="success-box">
              <div className="success-icon">✉️</div>
              <h2>Check Your Email</h2>
              <p>We sent a reset link to:</p>
              <p className="reset-email">{email}</p>
              <button className="auth-btn" onClick={() => navigate("/login")}>
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <h1 className="auth-title">Forgot Password</h1>
              <p className="auth-subtitle">
                Enter your email and we will send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="text"
                    name="email"
                    className={`form-input ${error ? "input-error" : ""}`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                  />
                  {error && <p className="error-text">{error}</p>}
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
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
