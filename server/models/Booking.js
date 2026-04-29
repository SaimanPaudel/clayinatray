booking: 
const mongoose = require("mongoose");

const bookingItemSchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, default: 1, min: 1 },

    checkIn: { type: Date },
    checkOut: { type: Date },
    guests: { type: Number, min: 1 },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    properties: [bookingItemSchema],

    subtotal: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "failed"],
      default: "pending",
      index: true,
    },

    paymentMethod: { type: String },
    paymentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);