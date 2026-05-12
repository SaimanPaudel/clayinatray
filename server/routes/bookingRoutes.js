const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createBooking,
  createDirectBooking,
  getBookedDates,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  approveBooking,
  rejectBooking,
} = require("../controllers/bookingController");

// User routes
router.post("/", auth, createBooking);
router.post("/direct", auth, createDirectBooking);
router.get("/booked-dates/:propertySlug", getBookedDates);
router.get("/user", auth, getUserBookings);
router.put("/:id/cancel", auth, cancelBooking);

// Admin routes (require admin role)
router.get("/admin/all", auth, admin, getAllBookings);
router.put("/admin/:id/approve", auth, admin, approveBooking);
router.put("/admin/:id/reject", auth, admin, rejectBooking);

// Generic id route LAST (must be at the bottom to avoid catching admin/* routes)
router.get("/:id", auth, getBookingById);

module.exports = router;