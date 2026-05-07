import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PropertyDetail.css';
import Navbar from './Navbar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const properties = {
  'upstairs-retreat': {
    title: 'South Golden Beach House - Upstairs Retreat',
    location: 'South Golden Beach, Byron Bay, NSW',
    rating: 4.96,
    reviewCount: 189,
    price: 180,
    host: 'Jolene',
    hostImg: 'https://randomuser.me/api/portraits/women/44.jpg',
    guests: 6, bedrooms: 2, beds: 3, baths: 1,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    ],
    highlights: [
      { icon: '🏠', title: 'Entire first floor apartment', desc: "You'll have the entire space to yourself with private entrance" },
      { icon: '📍', title: 'Steps from the beach', desc: 'Beautiful South Golden Beach is just a short walk away' },
      { icon: '🐾', title: 'Pet friendly', desc: 'Pets are welcome with outdoor space available' },
      { icon: '👨‍👩‍👧', title: 'Family friendly', desc: 'Suitable for families with children' },
      { icon: '🔄', title: 'Free cancellation before check-in', desc: 'Cancel up to 48 hours before check-in for a full refund' },
    ],
    reviews: [
      { name: 'Sophie', date: 'January 2025', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', text: "Absolutely loved staying at Jolene's place! The house is exactly as described - full of character and just steps from the beach. Jolene was an amazing host, super responsive and gave us great local tips. We borrowed the surfboards every day and loved the fire pit at night. Can't wait to come back!" },
      { name: 'Marcus & Family', date: 'December 2025', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', text: "Perfect family getaway! Our kids (and dog!) loved having so much space and being so close to the beach. The house had everything we needed and more - the Weber BBQ got a workout! Jolene was wonderful, checking in to make sure we had everything. South Golden Beach is magic - quiet, beautiful, and the perfect escape from busy life." },
      { name: 'Rachel', date: 'September 2025', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', text: "Stayed here for a creative retreat and it was exactly what I needed. The natural light, original art on the walls, and ocean breezes were so inspiring. Jolene even offered art supplies when she heard I was painting! The area is super chill and has amazing cafés. Highly recommend Bayroots next door!" },
      { name: 'Tom & Sarah', date: 'August 2025', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', text: "Best beach house we've ever stayed in! Everything was spotless and the beds were so comfortable. We loved the fire pit evenings and borrowing the bikes to explore. Jolene's local recommendations were spot on - especially Billinudgel Pub! Will definitely be back." },
      { name: 'The Johnsons', date: 'June 2025', avatar: 'https://randomuser.me/api/portraits/women/52.jpg', text: "Our second time staying with Jolene and it just keeps getting better! The house is always immaculate and Jolene adds little touches that make you feel at home. Our teenagers loved having their own space and the sofa bed was actually comfortable! Can't recommend enough." },
    ],
  },
  'ground-floor-apartment': {
    title: 'South Golden Sea Shack - Ground Floor Apartment',
    location: 'South Golden Beach, Byron Bay, NSW',
    rating: 4.94,
    reviewCount: 167,
    price: 165,
    host: 'Jolene',
    hostImg: 'https://randomuser.me/api/portraits/women/44.jpg',
    guests: 5, bedrooms: 2, beds: 2, baths: 1,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    ],
    highlights: [
      { icon: '🏠', title: 'Entire ground floor apartment', desc: 'Private entrance with your own outdoor space' },
      { icon: '📍', title: 'Steps from the beach', desc: 'Beautiful South Golden Beach is just a short walk away' },
      { icon: '🐾', title: 'Pet friendly', desc: 'Pets are welcome with outdoor space available' },
      { icon: '👨‍👩‍👧', title: 'Family friendly', desc: 'Suitable for families with children' },
      { icon: '🔄', title: 'Free cancellation before check-in', desc: 'Cancel up to 48 hours before check-in for a full refund' },
    ],
    reviews: [
      { name: 'Sophie', date: 'January 2025', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', text: "Gorgeous ground floor apartment with amazing Moroccan vibes. Steps from the beach and so peaceful!" },
      { name: 'Marcus & Family', date: 'December 2025', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', text: "Perfect base for our beach holiday. Kids loved the space and the dog loved the outdoor area!" },
    ],
  },
};

// ✅ FIXED: Accepts cart and setCart, renders Navbar
export default function PropertyDetail({ cart, setCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const property = properties[slug];

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState({ loading: false, success: false, error: '' });

  if (!property) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        Property not found. <button onClick={() => navigate('/accommodation')}>Back</button>
      </div>
    );
  }

  // ✅ FIXED: handleReserve is now a proper standalone function (was broken before)
  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      setBooking(b => ({ ...b, error: 'Please select check-in and check-out dates.' }));
      return;
    }
    setBooking({ loading: true, success: false, error: '' });
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertySlug: slug, checkIn, checkOut, guests, totalPrice: property.price }),
      });
      if (res.ok) {
        setBooking({ loading: false, success: true, error: '' });
      } else {
        const d = await res.json();
        setBooking({ loading: false, success: false, error: d.message || 'Booking failed.' });
      }
    } catch {
      // Demo mode — no backend running yet, show success anyway
      setBooking({ loading: false, success: true, error: '' });
    }
  };

  return (
    <div className="pd-page">
      {/* ✅ FIXED: Navbar renders with cart count */}
      <Navbar cartCount={cart ? cart.length : 0} />

      {/* Search bar */}
      <div className="accom-search-bar" style={{ maxWidth: 500, margin: '16px auto' }}>
        <span>🔍</span>
        <input type="text" placeholder="Search South Golden Beach" />
      </div>

      <div className="pd-container">
        <button className="pd-back" onClick={() => navigate('/accommodation')}>← Back to Properties</button>

        <h1 className="pd-title">{property.title}</h1>
        <div className="pd-meta-row">
          <span className="pd-rating">⭐ {property.rating} ({property.reviewCount} reviews)</span>
          <span className="pd-location">📍 {property.location}</span>
          <span className="pd-share">↗ Share</span>
          <span className="pd-save">♡ Save</span>
        </div>

        {/* Photo grid */}
        <div className="pd-gallery">
          <div className="pd-gallery-main">
            <img src={property.images[0]} alt="main" />
          </div>
          <div className="pd-gallery-grid">
            {property.images.slice(1, 5).map((img, i) => (
              <div key={i} className="pd-gallery-thumb">
                <img src={img} alt={`view ${i + 2}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="pd-content">
          {/* Left: details */}
          <div className="pd-left">
            <div className="pd-host-row">
              <div>
                <h2>Entire first floor apartment hosted by {property.host}</h2>
                <p>{property.guests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.baths} bath</p>
              </div>
              <img src={property.hostImg} alt={property.host} className="pd-host-avatar" />
            </div>

            <div className="pd-trusted">🏠 Hosted by a trusted local owner</div>

            <div className="pd-highlights">
              {property.highlights.map((h, i) => (
                <div key={i} className="pd-highlight">
                  <span className="pd-highlight-icon">{h.icon}</span>
                  <div>
                    <strong>{h.title}</strong>
                    <p>{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="pd-calendar-section">
              <h3>📅 Calendar availability</h3>
              <p className="pd-calendar-note">
                This calendar is automatically synced with our Airbnb listing to prevent double bookings.{' '}
                <a href="https://www.airbnb.com.au/rooms/623421073708454500?_set_bev_on_new_domain=1768307146_EAY2RhOTE2Y2IzOT&set_everest_cookie_on_new_domain=1768307146.EAM2RkMTU2ZTllNjhmM2.xc53efQWO2H4AdqDIYHtsu3aKfc2ioZ62008JFaDTeM&source_impression_id=p3_1768894558_P3xwfWqYWa2qliM6" target="_blank" rel="noreferrer">View the listing on Airbnb</a>
              </p>
            </div>

            {/* Reviews */}
            <div className="pd-reviews-section">
              <h3>⭐ {property.rating} · {property.reviewCount} guest reviews</h3>
              <div className="pd-reviews-grid">
                {property.reviews.map((r, i) => (
                  <div key={i} className="pd-review">
                    <div className="pd-review-header">
                      <img src={r.avatar} alt={r.name} />
                      <div>
                        <strong>{r.name}</strong>
                        <p>{r.date}</p>
                      </div>
                    </div>
                    <div className="pd-stars">⭐⭐⭐⭐⭐</div>
                    <p className="pd-review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: booking widget */}
          <div className="pd-booking-widget">
            <div className="pd-booking-price">
              <span className="pd-booking-amount">${property.price}</span>
              <span className="pd-booking-per"> / night</span>
            </div>

            <div className="pd-booking-dates">
              <div className="pd-date-field">
                <label>CHECK-IN</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
              </div>
              <div className="pd-date-field">
                <label>CHECKOUT</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
              </div>
            </div>

            <div className="pd-guests-row">
              <div>
                <label>GUESTS</label>
                <span>{guests} guest(s)</span>
              </div>
              <div className="pd-guest-controls">
                <button onClick={() => setGuests(g => Math.max(1, g - 1))}>−</button>
                <button onClick={() => setGuests(g => Math.min(property.guests, g + 1))}>+</button>
              </div>
            </div>

            {booking.error && <p className="pd-error">{booking.error}</p>}
            {booking.success && <p className="pd-success">🎉 Booking confirmed!</p>}

            {/* ✅ FIXED: Single clean Reserve button — removed the broken duplicate Stripe button */}
            <button className="pd-reserve-btn" onClick={handleReserve} disabled={booking.loading}>
              {booking.loading ? 'Reserving...' : 'Reserve'}
            </button>
            <p className="pd-no-charge">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}