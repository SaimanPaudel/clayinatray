import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Contact.css";
import Navbar from "./Navbar";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero */}
      <div className="contact-hero">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          We'd love to hear from you. Get in touch with us for bookings, 
          inquiries, or just to say hello.
        </p>
      </div>

      {/* Main Content */}
      <div className="contact-content">

        {/* Left Column */}
        <div className="contact-left">

          {/* Get in Touch Card */}
          <div className="contact-card">
            <h2 className="card-title">Get in Touch</h2>

            <div className="contact-info-item">
              <div className="contact-icon">📍</div>
              <div>
                <p className="info-label">Address</p>
                <p className="info-text">South Golden Beach, Byron Bay</p>
                <p className="info-text">Byron Bay</p>
                <p className="info-text">Sydney, NSW</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">📞</div>
              <div>
                <p className="info-label">Phone</p>
                <p className="info-text">+1 (555) 123-4567</p>
                <p className="info-text">+1 (555) 987-6543</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">✉️</div>
              <div>
                <p className="info-label">Email</p>
                <p className="info-text">info@clayinatray.com</p>
                <p className="info-text">bookings@clayinatray.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">🕐</div>
              <div>
                <p className="info-label">Business Hours</p>
                <p className="info-text">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="info-text">Saturday - Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* Gallery Card */}
          <div className="contact-card gallery-card">
            <h2 className="card-title">Visit Our Gallery</h2>
            <p className="gallery-desc">
              Our on-site gallery is open to guest. Come see art collection
              and bond with us.
            </p>
            <button className="gallery-btn" onClick={() => navigate("/gallery")}>
              View Gallery Hours
            </button>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="contact-card contact-form-card">
          <h2 className="card-title">Send Us a Message</h2>

          {submitted && (
            <div className="success-message">
              Message sent! We will get back to you within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="Your name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                name="subject"
                className="form-select"
                value={formData.subject}
                onChange={handleChange}
              >
                <option>General Inquiry</option>
                <option>Booking</option>
                <option>Products</option>
                <option>Gallery</option>
                <option>Accommodation</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                className="form-textarea"
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
            <p className="form-note">
              We typically respond within 24 hours during business days
            </p>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="map-placeholder">
          <div className="map-pin">📍</div>
          <p className="map-title">Find Us Here</p>
          <p className="map-address">South Golden Beach, Byron Bay, NSW</p>
        </div>
      </div>

    </div>
  );
}
