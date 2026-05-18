import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingCalendar from './BookingCalendar';
import './PropertyDetail.css';
import Navbar from './Navbar';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/api$/, '') + '/api';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/dJmUuG5DVrSCeSfu7';

const initialReviewsBySlug = {
  'upstairs-retreat': [
    { id: 1, name: 'Sophie', date: 'January 2025', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', text: "Absolutely loved staying at Jolene's place! The house is exactly as described - full of character and just steps from the beach. Jolene was an amazing host, super responsive and gave us great local tips. We borrowed the surfboards every day and loved the fire pit at night. Can't wait to come back!", stars: 5 },
    { id: 2, name: 'Marcus & Family', date: 'December 2025', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', text: "Perfect family getaway! Our kids (and dog!) loved having so much space and being so close to the beach. The house had everything we needed and more - the Weber BBQ got a workout! Jolene was wonderful, checking in to make sure we had everything. South Golden Beach is magic - quiet, beautiful, and the perfect escape from busy life.", stars: 5 },
    { id: 3, name: 'Rachel', date: 'September 2025', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', text: "Stayed here for a creative retreat and it was exactly what I needed. The natural light, original art on the walls, and ocean breezes were so inspiring. Jolene even offered art supplies when she heard I was painting! The area is super chill and has amazing cafes. Highly recommend Bayroots next door!", stars: 5 },
    { id: 4, name: 'Tom & Sarah', date: 'August 2025', avatar: 'https://randomuser.me/api/portraits/men/42.jpg', text: "Best beach house we have ever stayed in! Everything was spotless and the beds were so comfortable. We loved the fire pit evenings and borrowing the bikes to explore. Jolene's local recommendations were spot on - especially Billinudgel Pub! Will definitely be back.", stars: 5 },
    { id: 5, name: 'The Johnsons', date: 'June 2025', avatar: 'https://randomuser.me/api/portraits/women/52.jpg', text: "Our second time staying with Jolene and it just keeps getting better! The house is always immaculate and Jolene adds little touches that make you feel at home. Our teenagers loved having their own space and the sofa bed was actually comfortable! Can't recommend enough.", stars: 5 },
  ],
  'ground-floor-apartment': [
    { id: 1, name: 'Sophie', date: 'January 2025', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', text: "Gorgeous ground floor apartment with amazing Moroccan vibes. Steps from the beach and so peaceful!", stars: 5 },
    { id: 2, name: 'Marcus & Family', date: 'December 2025', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', text: "Perfect base for our beach holiday. Kids loved the space and the dog loved the outdoor area!", stars: 5 },
  ],
};

const properties = {
  'upstairs-retreat': {
    title: 'South Golden Beach House - Upstairs Retreat',
    location: 'South Golden Beach, Byron Bay, NSW',
    rating: 4.96,
    reviewCount: 189,
    price: 180,
    host: 'Jolene',
    hostImg: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
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
  },
  'ground-floor-apartment': {
    title: 'South Golden Sea Shack - Ground Floor Apartment',
    location: 'South Golden Beach, Byron Bay, NSW',
    rating: 4.94,
    reviewCount: 167,
    price: 165,
    host: 'Jolene',
    hostImg: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
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
  },
};

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: readOnly ? 14 : 24,
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= (hovered || value) ? '#f5a623' : '#ddd',
            transition: 'color 0.1s',
          }}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function PropertyDetail({ cart, setCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const property = properties[slug];

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'admin';
  const isLoggedIn = Boolean(localStorage.getItem('loggedInUser') || localStorage.getItem('user'));
  const currentUsername = user?.name || user?.email || 'You';

  const storageKey = `reviews_${slug}`;
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : (initialReviewsBySlug[slug] || []);
    } catch {
      return initialReviewsBySlug[slug] || [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reviews));
  }, [reviews, storageKey]);

  const [newReview, setNewReview] = useState({ text: '', stars: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ text: '', stars: 5 });

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState({ loading: false, pending: false, error: '' });
  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/bookings/booked-dates/${slug}`)
      .then(res => res.json())
      .then(data => setBookedRanges(data.bookedRanges || []))
      .catch(() => {});
  }, [slug]);

  if (!property) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        Property not found. <button onClick={() => navigate('/accommodation')}>Back</button>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (!newReview.text.trim()) return;
    if (!isLoggedIn) { setSubmitMsg('Please log in to leave a review.'); return; }
    setSubmitting(true);
    const review = {
      id: Date.now(),
      name: currentUsername,
      date: new Date().toLocaleString('en-AU', { month: 'long', year: 'numeric' }),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUsername)}&background=c0623a&color=fff`,
      text: newReview.text.trim(),
      stars: newReview.stars,
    };
    setReviews(prev => [review, ...prev]);
    setNewReview({ text: '', stars: 5 });
    setSubmitMsg('Review submitted!');
    setTimeout(() => setSubmitMsg(''), 3000);
    setSubmitting(false);
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Delete this review?')) setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleStartEdit = (review) => {
    setEditingId(review.id);
    setEditDraft({ text: review.text, stars: review.stars });
  };

  const handleSaveEdit = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, text: editDraft.text, stars: editDraft.stars } : r));
    setEditingId(null);
  };

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      setBooking(b => ({ ...b, error: 'Please select check-in and check-out dates.' }));
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setBooking({ loading: false, pending: false, error: 'Please log in to make a booking.' });
      return;
    }
    setBooking({ loading: true, pending: false, error: '' });
    try {
      const res = await fetch(`${API_BASE}/bookings/direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ propertyId: slug, name: property.title, price: property.price, checkIn, checkOut, guests }),
      });
      const data = await res.json();
      if (res.ok) {
        setBooking({ loading: false, pending: true, error: '' });
      } else {
        setBooking({ loading: false, pending: false, error: data.error || 'Booking failed.' });
      }
    } catch {
      setBooking({ loading: false, pending: false, error: 'Cannot connect to server. Is it running?' });
    }
  };

  const avgStars = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.stars || 5), 0) / reviews.length).toFixed(2)
    : property.rating;

  return (
    <div className="pd-page">
      <Navbar cartCount={cart ? cart.length : 0} />

      <div className="accom-search-bar" style={{ maxWidth: 500, margin: '16px auto' }}>
        <span>🔍</span>
        <input type="text" placeholder="Search South Golden Beach" />
      </div>

      <div className="pd-container">
        <button className="pd-back" onClick={() => navigate('/accommodation')}>← Back to Properties</button>

        <h1 className="pd-title">{property.title}</h1>
        <div className="pd-meta-row">
          <span className="pd-rating">⭐ {avgStars} ({reviews.length} reviews)</span>
          <a
            className="pd-location"
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#c0623a', textDecoration: 'underline', cursor: 'pointer' }}
          >
            📍 {property.location}
          </a>
        </div>

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

            <div className="pd-reviews-section">
              <h3>⭐ {avgStars} · {reviews.length} guest reviews</h3>
              <div className="pd-reviews-grid">
                {reviews.map((r) => (
                  <div key={r.id} className="pd-review">
                    {editingId === r.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="pd-review-header">
                          <img src={r.avatar} alt={r.name} />
                          <div><strong>{r.name}</strong><p>{r.date}</p></div>
                        </div>
                        <StarRating value={editDraft.stars} onChange={s => setEditDraft(d => ({ ...d, stars: s }))} />
                        <textarea value={editDraft.text} onChange={e => setEditDraft(d => ({ ...d, text: e.target.value }))} rows={4} style={styles.textarea} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={styles.btnPrimary} onClick={() => handleSaveEdit(r.id)}>Save</button>
                          <button style={styles.btnSecondary} onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="pd-review-header">
                          <img src={r.avatar} alt={r.name} />
                          <div><strong>{r.name}</strong><p>{r.date}</p></div>
                          {isAdmin && (
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                              <button style={styles.btnSmall} onClick={() => handleStartEdit(r)}>✏️</button>
                              <button style={{ ...styles.btnSmall, color: '#c0623a' }} onClick={() => handleDeleteReview(r.id)}>🗑️</button>
                            </div>
                          )}
                        </div>
                        <StarRating value={r.stars || 5} readOnly />
                        <p className="pd-review-text">{r.text}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div style={styles.reviewForm}>
                <h4 style={{ margin: '0 0 12px', color: '#2c2c2c', fontFamily: 'Georgia, serif' }}>Leave a Review</h4>
                {!isLoggedIn ? (
                  <button style={{ ...styles.btnPrimary, fontSize: 13, padding: '6px 14px' }} onClick={() => navigate('/login')}>
                    Log in to leave a review
                  </button>
                ) : (
                  <>
                    <div style={{ marginBottom: 10 }}>
                      <label style={styles.label}>Your rating</label>
                      <StarRating value={newReview.stars} onChange={s => setNewReview(r => ({ ...r, stars: s }))} />
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={styles.label}>Your review</label>
                      <textarea placeholder="Share your experience..." value={newReview.text} onChange={e => setNewReview(r => ({ ...r, text: e.target.value }))} rows={4} style={styles.textarea} />
                    </div>
                    {submitMsg && <p style={{ color: submitMsg.includes('log') ? '#c0623a' : '#2a9d2a', fontSize: 13, margin: '0 0 8px' }}>{submitMsg}</p>}
                    <button style={styles.btnPrimary} onClick={handleSubmitReview} disabled={submitting || !newReview.text.trim()}>
                      Submit Review
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Booking widget ── */}
          <div className="pd-booking-widget">
            <div className="pd-booking-price">
              <span className="pd-booking-amount">${property.price}</span>
              <span className="pd-booking-per"> / night</span>
            </div>

            <BookingCalendar
              bookedRanges={bookedRanges}
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckIn={setCheckIn}
              onCheckOut={setCheckOut}
            />

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

            {booking.pending ? (
              <div style={{
                background: '#fff8e1',
                border: '1.5px solid #f5a623',
                borderRadius: 10,
                padding: '16px',
                textAlign: 'center',
              }}>
                <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#b8860b' }}>
                  ⏳ Request Sent!
                </p>
                <p style={{ margin: 0, fontSize: 13, color: '#7a6000', lineHeight: 1.6 }}>
                  Your booking is <strong>pending approval</strong>. Admin will review it and
                  you'll receive a confirmation email once approved — usually within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <button className="pd-reserve-btn" onClick={handleReserve} disabled={booking.loading}>
                  {booking.loading ? 'Sending request…' : 'Request to Book'}
                </button>
                <p className="pd-no-charge">You won't be charged yet</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  reviewForm: {
    marginTop: 32,
    padding: 20,
    background: '#faf8f5',
    borderRadius: 12,
    border: '1px solid #ebe3db',
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: 6,
    fontFamily: 'Georgia, serif',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 14,
    fontFamily: 'Georgia, serif',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#2c2c2c',
    background: '#fff',
  },
  btnPrimary: {
    background: '#c0623a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontFamily: 'Georgia, serif',
    cursor: 'pointer',
    fontWeight: 600,
  },
  btnSecondary: {
    background: '#fff',
    color: '#2c2c2c',
    border: '1.5px solid #ddd',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontFamily: 'Georgia, serif',
    cursor: 'pointer',
  },
  btnSmall: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    padding: '2px 4px',
    borderRadius: 6,
    lineHeight: 1,
  },
};
