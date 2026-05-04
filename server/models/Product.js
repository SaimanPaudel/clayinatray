const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  price: Number,
  image: String,
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);