cart: 

const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    checkIn: { type: Date },
    checkOut: { type: Date },
    guests: { type: Number, min: 1 },
  },
  { _id: true, timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);