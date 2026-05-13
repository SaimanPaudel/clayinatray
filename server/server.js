require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
 
connectDB();
 
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];
 
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
 
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
 
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
 
app.get("/api/health", (req, res) => res.json({ status: "OK" }));
 
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});
 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});