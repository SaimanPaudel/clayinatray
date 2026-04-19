const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: Number,
  title: String,
  price: Number,
  image: String,
  category: String,
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, default: "default" },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart", cartSchema);