const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/Order");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Stripe: Create Payment Intent ───────────────────────────────────────────
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || "aud",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe create-payment-intent error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── PayPal: Confirm Order ────────────────────────────────────────────────────
router.post("/paypal/confirm", async (req, res) => {
  try {
    const { orderId, payerEmail, amount, items } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Missing PayPal order ID" });
    }

    const order = await Order.create({
      paymentMethod: "paypal",
      paymentId: orderId,
      payerEmail: payerEmail || "unknown",
      amount,
      items: items || [],
      status: "paid",
    });

    res.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("PayPal confirm error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── Stripe: Webhook ──────────────────────────────────────────────────────────
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body); // for local testing without secret
    }
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    console.log("✅ Stripe payment succeeded:", pi.id);

    try {
      await Order.create({
        paymentMethod: "stripe",
        paymentId: pi.id,
        amount: pi.amount / 100,
        status: "paid",
      });
    } catch (dbErr) {
      console.error("DB save error:", dbErr.message);
    }
  }

  res.sendStatus(200);
});

module.exports = router;