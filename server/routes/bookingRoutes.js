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
  getAllBookingsAdmin,
  approveBooking,
  rejectBooking,
} = require("../controllers/bookingController");

router.post("/direct", createDirectBooking);
router.get("/booked-dates/:propertySlug", getBookedDates);
router.post("/", auth, createBooking);
router.get("/user", auth, getUserBookings);

// Admin routes — must be before /:id
router.get("/admin/all", auth, getAllBookingsAdmin);
router.put("/admin/:id/approve", auth, approveBooking);
router.put("/admin/:id/reject", auth, rejectBooking);

// Keep /:id routes at the bottom
router.get("/:id", auth, getBookingById);
router.put("/:id/cancel", auth, cancelBooking);

module.exports = router;