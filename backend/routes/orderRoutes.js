const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const SESSION_ID = "default";

// POST — checkout
router.post("/", async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    if (!paymentMethod)
      return res.status(400).json({ error: "Payment method required" });

    const cart = await Cart.findOne({ sessionId: SESSION_ID });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const serviceFee = Math.round(subtotal * 0.14);
    const total = subtotal + serviceFee;

    // Save order to MongoDB
    const order = await Order.create({
      items: cart.items.map((i) => ({
        productId: i.productId,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal,
      serviceFee,
      total,
      paymentMethod,
      status: "completed",
    });

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Payment successful",
      orderId: order._id,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — all orders (for admin/testing)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;