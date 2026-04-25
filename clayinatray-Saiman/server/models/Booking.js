const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  propertySlug: String,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  status: { type: String, default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);