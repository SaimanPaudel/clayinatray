const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      enum: [
        "stripe",
        "paypal",
        "cash",
        "other",
        "wallet",
        "Wallet",
        "apple-pay",
        "google-pay",
        "Wallet (Test)",
        "PayPal (Test)",
        "Card (Test)",
        "Apple Pay",
        "Google Pay",
        "PayPal",
        "Card",
      ],
      default: "other",
    },
    paymentId: {
      type: String,
      default: null,
      // removed unique/sparse — caused duplicate key errors for null test orders
    },
    payerEmail: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    quantity: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    userId: { type: String, index: true },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: {
      type: Number,
      default: null,
    },
    serviceFee: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);