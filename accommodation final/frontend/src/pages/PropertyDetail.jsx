import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaStar, FaMapMarkerAlt, FaShareAlt, FaHeart,
  FaHome, FaPaw, FaUsers, FaBan, FaArrowLeft,
  FaUserFriends, FaBed, FaBath, FaMinus, FaPlus,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../styles/propertyDetail.css";

const featureIconMap = {
  home: <FaHome />,
  map: <FaMapMarkerAlt />,
  pet: <FaPaw />,
  family: <FaUsers />,
  cancel: <FaBan />,
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/properties/${id}`)
      .then((res) => {
        setProperty(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const nights = calcNights();
  const total = nights * (property?.price || 0);

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (!property) return <div className="detail-loading">Property not found.</div>;

  return (
    <div className="detail-page">
      <Navbar />

      <div className="detail-container">

        {/* Back link */}
        <button className="back-btn" onClick={() => navigate("/accommodation")}>
          <FaArrowLeft /> Back to Properties
        </button>

        {/* Title row */}
        <h1 className="detail-title">{property.title}</h1>

        <div className="detail-meta">
          <span className="detail-rating">
            <FaStar /> {property.rating} ({property.reviews} reviews)
          </span>
          <span className="detail-location">
            <FaMapMarkerAlt /> {property.location}
          </span>
          <div className="detail-actions">
            <button className="action-btn"><FaShareAlt /> Share</button>
            <button
              className={`action-btn ${saved ? "saved" : ""}`}
              onClick={() => setSaved(!saved)}
            >
              <FaHeart /> {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Photo grid */}
        <div className="photo-grid">
          <div className="photo-main">
            <img src={property.images?.[0] || property.image} alt={property.title} />
          </div>
          <div className="photo-side">
            {property.images?.slice(1, 5).map((img, i) => (
              <div key={i} className="photo-thumb">
                <img src={img} alt={`${property.title} ${i + 2}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Main content + booking widget */}
        <div className="detail-body">

          {/* Left column */}
          <div className="detail-left">

            {/* Host info */}
            <div className="host-row">
              <div>
                <h2 className="host-subtitle">{property.subtitleDetail}</h2>
                <p className="host-specs">
                  {property.guests} guests &nbsp;•&nbsp;
                  {property.bedrooms} bedrooms &nbsp;•&nbsp;
                  {property.beds} beds &nbsp;•&nbsp;
                  {property.baths} bath
                </p>
              </div>
              {property.hostAvatar && (
                <img
                  src={property.hostAvatar}
                  alt={property.hostName}
                  className="host-avatar"
                />
              )}
            </div>

            <div className="host-tagline">
              <FaHome className="tagline-icon" />
              <span>{property.hostTagline}</span>
            </div>

            <hr className="divider" />

            {/* Features */}
            <div className="features-list">
              {property.features?.map((f, i) => (
                <div key={i} className="feature-item">
                  <span className="feature-icon">
                    {featureIconMap[f.icon] || <FaHome />}
                  </span>
                  <div>
                    <p className="feature-title">{f.title}</p>
                    <p className="feature-desc">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="divider" />

            {/* Calendar notice */}
            <div className="calendar-notice">
              <span className="calendar-icon">📅</span>
              <div>
                <p className="feature-title">Calendar availability</p>
                <p className="feature-desc">
                  This calendar is automatically synced with our Airbnb listing
                  to prevent double bookings.{" "}
                  {property.airbnbUrl && (
                    <a href={property.airbnbUrl} target="_blank" rel="noreferrer">
                      View the listing on Airbnb
                    </a>
                  )}
                </p>
              </div>
            </div>

            <hr className="divider" />

            {/* Reviews */}
            <div className="reviews-section">
              <h3 className="reviews-heading">
                <FaStar className="star-gold" />
                {property.rating} &middot; {property.reviews} guest reviews
              </h3>

              <div className="reviews-grid">
                {property.guestReviews?.map((review, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="reviewer-avatar"
                      />
                      <div>
                        <p className="reviewer-name">{review.name}</p>
                        <p className="reviewer-date">{review.date}</p>
                      </div>
                    </div>
                    <div className="review-stars">
                      {Array.from({ length: review.rating }).map((_, s) => (
                        <FaStar key={s} className="star-gold" />
                      ))}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right column — booking widget */}
          <div className="booking-widget">
            <div className="widget-price">
              <span className="widget-amount">${property.price}</span>
              <span className="widget-per"> / night</span>
            </div>

            <div className="widget-dates">
              <div className="date-field">
                <label>CHECK-IN</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="date-field">
                <label>CHECKOUT</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div className="widget-guests">
              <label>GUESTS</label>
              <div className="guest-counter">
                <span>
                  {guests} guest{guests > 1 ? "s" : ""}
                </span>
                <div className="counter-btns">
                  <button
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() =>
                      setGuests((g) => Math.min(property.guests, g + 1))
                    }
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>

            <button className="reserve-btn">Reserve</button>
            <p className="no-charge">You won't be charged yet</p>

            {nights > 0 && (
              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>${property.price} × {nights} nights</span>
                  <span>${total}</span>
                </div>
                <div className="breakdown-row total-row">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;