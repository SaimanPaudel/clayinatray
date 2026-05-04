const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

// ─────────────────────────────────────────────────────────────
// POST /api/payment/create-payment-intent
// Called by Cart.jsx when user clicks "Pay with Card" or Wallet
// ─────────────────────────────────────────────────────────────
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "aud" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount is already in cents from Cart.jsx
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { source: "clayinatray-cart" },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/payment/paypal/confirm
// Called after PayPal captures payment on the frontend
// Saves the order to MongoDB
// ─────────────────────────────────────────────────────────────
const confirmPayPal = async (req, res) => {
  try {
    const { orderId, payerEmail, amount, items } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Missing PayPal order ID" });
    }

    // Save order to DB
    const order = await Order.create({
      paymentMethod: "paypal",
      paymentId: orderId,
      payerEmail: payerEmail || "unknown",
      amount,
      items: items || [],
      status: "paid",
    });

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error("PayPal confirm error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/payment/webhook
// Stripe sends events here after payment completes
// Raw body parsing is set in server.js already ✅
// ─────────────────────────────────────────────────────────────
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // If you have a webhook secret, verify it
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // No secret yet (testing) — just parse the body
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log("✅ Payment succeeded:", paymentIntent.id);

      // Save successful Stripe payment to DB
      try {
        await Order.create({
          paymentMethod: "stripe",
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // convert cents to dollars
          status: "paid",
        });
      } catch (dbErr) {
        console.error("DB save error:", dbErr.message);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.log("❌ Payment failed:", paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = { createPaymentIntent, confirmPayPal, handleWebhook };