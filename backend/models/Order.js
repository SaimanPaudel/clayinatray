const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: Number,
      title: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  subtotal: Number,
  serviceFee: Number,
  total: Number,
  paymentMethod: String,
  status: { type: String, default: "completed" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);