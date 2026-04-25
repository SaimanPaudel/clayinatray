const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: Number,
  title: String,
  price: Number,
  quantity: Number,
  status: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);