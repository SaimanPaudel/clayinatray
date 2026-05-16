const express = require("express");
const router = express.Router();
 
const auth = require("../middleware/authMiddleware");
const {
  createBooking,
  createDirectBooking,
  getBookedDates,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");
 
router.post("/direct", createDirectBooking);
router.get("/booked-dates/:propertySlug", getBookedDates);
router.post("/", auth, createBooking);
router.get("/user", auth, getUserBookings);
router.get("/:id", auth, getBookingById);
router.put("/:id/cancel", auth, cancelBooking);
 
module.exports = router;