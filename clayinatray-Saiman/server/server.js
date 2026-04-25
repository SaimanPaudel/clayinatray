require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Stripe webhook — raw body must come before express.json()
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

// Routes
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/accommodation', require('./routes/accommodationRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => res.send('Clay in a Tray API running'));
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 4000;

// ✅ FIXED: console.log moved inside listen callback where it belongs
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("MONGO URI:", process.env.MONGO_URI ? "set ✓" : "MISSING ✗");
});