bookingroute: 
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createBooking,
  getUserBookings,
  getBookingById,
} = require("../controllers/bookingController");

router.post("/", auth, createBooking);
router.get("/user", auth, getUserBookings);
router.get("/:id", auth, getBookingById);

module.exports = router;