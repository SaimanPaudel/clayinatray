import { useState } from "react";
import "./Login.css";

export default function Signup({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    marketing: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  // Password strength checker
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 6) {
      newErrors.fullName = "Name must be at least 6 characters long";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must be a valid @gmail.com address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordChecks.length) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordChecks.uppercase) {
      newErrors.password = "Password must include at least one uppercase letter";
    } else if (!passwordChecks.number) {
      newErrors.password = "Password must include at least one number";
    } else if (!passwordChecks.special) {
      newErrors.password = "Password must include at least one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the Terms and Conditions";
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

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const emailExists = existingUsers.find(
      (user) => user.email === formData.email
    );
    if (emailExists) {
      setErrors({ email: "This email is already registered" });
      return;
    }

    const newUser = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      marketing: formData.marketing,
    };
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => onNavigate("contact")}>
          Clay in a Tray
        </div>
        <ul className="navbar-links">
          <li><a onClick={() => onNavigate("contact")}>Home</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Gallery</a></li>
          <li><a href="#">Accommodation</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">Contacts</a></li>
        </ul>
        <div className="navbar-icons">
          <button className="icon-btn">🛒</button>
          <button className="icon-btn">☰</button>
          <button
            className="icon-btn avatar-btn"
            onClick={() => onNavigate("login")}
          >
            👤
          </button>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          {submitted ? (
            <div className="success-box">
              <div className="success-icon">✓</div>
              <h2>Account Created!</h2>
              <p>Welcome to Clay in a Tray, {formData.fullName}!</p>
              {formData.marketing && (
                <p className="marketing-note">
                  You have subscribed to our marketing updates 🎉
                </p>
              )}
              <button
                className="auth-btn"
                onClick={() => onNavigate("login")}
              >
                Log In Now
              </button>
            </div>
          ) : (
            <>
              <h1 className="auth-title">Create Account</h1>

              <form onSubmit={handleSubmit} className="auth-form">

                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">
                    Full Name
                    <span className="field-hint"> (min. 6 characters)</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className={`form-input ${errors.fullName ? "input-error" : ""}`}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && (
                    <p className="error-text">⚠ {errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">
                    Email Address
                    <span className="field-hint"> (must be @gmail.com)</span>
                  </label>
                  <input
                    type="text"
                    name="email"
                    className={`form-input ${errors.email ? "input-error" : ""}`}
                    placeholder="you@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="error-text">⚠ {errors.email}</p>
                  )}
                </div>

                {/* Password */}
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
                  {errors.password && (
                    <p className="error-text">⚠ {errors.password}</p>
                  )}

                  {/* Password strength checklist */}
                  {formData.password.length > 0 && (
                    <div className="password-checklist">
                      <p className="checklist-title">Password must have:</p>
                      <p className={passwordChecks.length ? "check-pass" : "check-fail"}>
                        {passwordChecks.length ? "✓" : "✗"} At least 8 characters
                      </p>
                      <p className={passwordChecks.uppercase ? "check-pass" : "check-fail"}>
                        {passwordChecks.uppercase ? "✓" : "✗"} At least one uppercase letter (A-Z)
                      </p>
                      <p className={passwordChecks.number ? "check-pass" : "check-fail"}>
                        {passwordChecks.number ? "✓" : "✗"} At least one number (0-9)
                      </p>
                      <p className={passwordChecks.special ? "check-pass" : "check-fail"}>
                        {passwordChecks.special ? "✓" : "✗"} At least one special character (!@#$%)
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="error-text">⚠ {errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>
                      I agree to the{" "}
                      <a href="#" className="terms-link">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="terms-link">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="error-text">⚠ {errors.terms}</p>
                  )}
                </div>

                {/* Marketing - Optional */}
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="marketing"
                      checked={formData.marketing}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>
                      📧 Send me updates about products, offers and news{" "}
                      <span className="optional-tag">(Optional)</span>
                    </span>
                  </label>
                </div>

                <button type="submit" className="auth-btn">
                  Sign Up
                </button>

                <p className="switch-text">
                  Already have an account?{" "}
                  <a onClick={() => onNavigate("login")}>Log in</a>
                </p>

              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}