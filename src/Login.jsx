import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import Navbar from "./Navbar";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Get users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if email and password match
    const matchedUser = existingUsers.find(
      (user) =>
        user.email === formData.email &&
        user.password === formData.password
    );

    if (!matchedUser) {
      setErrors({
        email: "Email or password is incorrect",
      });
      return;
    }

    // Login successful
    localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <Navbar profilePath="/login" />

      <div className="auth-container">
        <div className="auth-card">
          {submitted ? (
            <div className="success-box">
              <div className="success-icon">✓</div>
              <h2>Welcome Back!</h2>
              <p>You have successfully logged in.</p>
              <button className="auth-btn" onClick={() => navigate("/")}>
                Go to Home
              </button>
            </div>
          ) : (
            <>
              <h1 className="auth-title">Welcome Back</h1>
              <form onSubmit={handleSubmit} className="auth-form">

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="text"
                    name="email"
                    className={`form-input ${errors.email ? "input-error" : ""}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className={`form-input ${errors.password ? "input-error" : ""}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                <div className="forgot-link">
                  <a onClick={() => navigate("/forgot-password")}>Forgot password?</a>
                </div>

                <button type="submit" className="auth-btn">Log In</button>

                <p className="switch-text">
                  Don't have an account?{" "}
                  <a onClick={() => navigate("/signup")}>Sign up</a>
                </p>

              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
