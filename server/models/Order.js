const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Product details (your version)
    productId: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      default: "",
    },

    // Payment details (friend's version)
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "cash", "other"],
      default: "other",
    },
    paymentId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs without paymentId
      default: null,
    },
    payerEmail: {
      type: String,
      default: "",
    },

    // Shared fields (merged)
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

    // Items array (friend's version)
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);