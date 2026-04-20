const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  avatar:  { type: String },
  date:    { type: String },
  rating:  { type: Number, default: 5 },
  comment: { type: String, required: true },
});

const featureSchema = new mongoose.Schema({
  icon:        { type: String },
  title:       { type: String },
  description: { type: String },
});

const propertySchema = new mongoose.Schema(
  {
    title:          { type: String, required: true },
    description:    { type: String, required: true },
    subtitleDetail: { type: String },
    type: {
      type: String,
      enum: ['single tray', 'double tray', 'studio', 'suite', 'workshop room'],
      required: true,
    },
    price:      { type: Number, required: true },
    guests:     { type: Number, required: true },
    bedrooms:   { type: Number, required: true },
    beds:       { type: Number, required: true },
    baths:      { type: Number, required: true },
    image:      { type: String },
    images:     [{ type: String }],
    location:   { type: String, required: true },
    isAvailable:{ type: Boolean, default: true },
    petFriendly:{ type: Boolean, default: false },
    amenities:  [{ type: String }],
    rating:     { type: Number, default: 0 },
    reviews:    { type: Number, default: 0 },
    hostName:   { type: String },
    hostAvatar: { type: String },
    hostTagline:{ type: String },
    airbnbUrl:  { type: String },
    features:      [featureSchema],
    guestReviews:  [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);