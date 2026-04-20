const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  checkIn:    { type: Date, required: true },
  checkOut:   { type: Date, required: true },
  guests:     { type: Number, required: true },
  nights:     { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);