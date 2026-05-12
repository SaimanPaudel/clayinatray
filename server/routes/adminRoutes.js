const express = require("express");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin-only route
router.get("/dashboard", protect, admin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;