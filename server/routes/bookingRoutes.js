const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createDirectBooking,
  getBookedDates,
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookingsAdmin,
  approveBooking,
  rejectBooking,
} = require("../controllers/bookingController");

router.get("/booked-dates/:propertySlug", getBookedDates);
router.post("/direct", protect, createDirectBooking);
router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);

router.get("/admin/all", protect, admin, getAllBookingsAdmin);
router.put("/admin/:id/approve", protect, admin, approveBooking);
router.put("/admin/:id/reject", protect, admin, rejectBooking);

router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
