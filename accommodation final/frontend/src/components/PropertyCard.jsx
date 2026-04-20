import React from "react";
import { FaHeart, FaUserFriends, FaBed, FaBath, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/propertyCard.css";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      onClick={() => navigate(`/accommodation/${property._id}`)}
    >
      <div className="card-image">
        <img src={property.image} alt={property.title} />

        {property.petFriendly && (
          <span className="badge">Pet Friendly</span>
        )}

        <button
          className="wishlist-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <FaHeart />
        </button>

        <span className="rating-badge">
          <FaStar /> {property.rating}
        </span>
      </div>

      <div className="card-content">
        <p className="location">{property.location}</p>
        <h3>{property.title}</h3>

        <div className="details">
          <span><FaUserFriends /> {property.guests} guests</span>
          <span><FaBed /> {property.beds} beds</span>
          <span><FaBath /> {property.baths} bath</span>
        </div>

        <p className="description">{property.description}</p>

        <div className="price-rating">
          <span className="price">
            <strong>${property.price}</strong> / night
          </span>
          <span className="review">
            <FaStar /> {property.rating} ({property.reviews})
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;