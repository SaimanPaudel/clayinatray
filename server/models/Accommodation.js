const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  title: String,
  location: String,
  price: Number,
  rating: Number,
  reviewCount: Number,
  guests: Number,
  bedrooms: Number,
  beds: Number,
  baths: Number,
  description: String,
  images: [String],
}, { timestamps: true });

module.exports = mongoose.model('Accommodation', accommodationSchema);