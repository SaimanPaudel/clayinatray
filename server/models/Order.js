const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    payerEmail: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
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