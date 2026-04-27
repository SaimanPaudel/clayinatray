const express = require("express");
const Stripe = require("stripe");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

router.post("/webhook", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;