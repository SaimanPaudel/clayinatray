const Cart = require("../models/Cart");
const Booking = require("../models/Booking");
const User = require("../models/User");
const mongoose = require("mongoose");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/emailService");
 
const SERVICE_FEE_RATE = 0.14;
const ACTIVE_BOOKING_STATUSES = ["pending", "approved", "paid"];

const formatDate = (date) => {
  if (!date) return "Not provided";
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return Math.max(
    0,
    Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
  );
};

const buildEmailDetails = (booking, user, reason = "") => {
  const property = booking.properties?.[0] || {};

  return {
    guestName: user?.name || "there",
    propertyName: property.name || "your selected property",
    checkIn: formatDate(property.checkIn),
    checkOut: formatDate(property.checkOut),
    guests: property.guests || 1,
    totalNights: getNights(property.checkIn, property.checkOut),
    totalPrice: Number(booking.totalPrice || 0).toLocaleString("en-AU"),
    reason,
  };
};

const sendBookingStatusEmail = async (booking, type, reason = "") => {
  if (!mongoose.Types.ObjectId.isValid(booking.userId)) {
    return { sent: false, error: "Booking is not linked to a registered user" };
  }

  const user = await User.findById(booking.userId);

  if (!user?.email) {
    return { sent: false, error: "User email not found" };
  }

  const details = buildEmailDetails(booking, user, reason);

  if (type === "approved") {
    await sendApprovalEmail(user.email, details);
  } else {
    await sendRejectionEmail(user.email, details);
  }

  return { sent: true, to: user.email };
};
 
// POST /api/bookings/direct — book directly from property page
exports.createDirectBooking = async (req, res) => {
  try {
    const { propertyId, name, price, checkIn, checkOut, guests } = req.body;
 
    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }
 
    const conflict = await Booking.findOne({
      status: { $in: ACTIVE_BOOKING_STATUSES },
      properties: {
        $elemMatch: {
          propertyId,
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) },
        },
      },
    });
 
    if (conflict) {
      return res.status(409).json({
        error: "These dates are already booked. Please choose different dates.",
      });
    }
 
    const nights = Math.round(
      (new Date(checkOut) - new Date(checkIn)) / 86400000
    );
    const subtotal = (price || 0) * nights;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
    const totalPrice = subtotal + serviceFee;
 
    const booking = await Booking.create({
      userId: req.user ? req.user.id : "guest",
      properties: [
        {
          propertyId,
          name: name || propertyId,
          price: price || 0,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          guests: guests || 1,
        },
      ],
      subtotal,
      serviceFee,
      totalPrice,
      status: "pending",
    });
 
    res.status(201).json(booking);
  } catch (err) {
    console.error("createDirectBooking error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
 
// GET /api/bookings/booked-dates/:propertySlug
exports.getBookedDates = async (req, res) => {
  try {
    const { propertySlug } = req.params;
 
    const bookings = await Booking.find({
      "properties.propertyId": propertySlug,
      status: { $in: ACTIVE_BOOKING_STATUSES },
    });
 
    const bookedRanges = [];
    bookings.forEach((booking) => {
      booking.properties.forEach((prop) => {
        if (prop.propertyId === propertySlug && prop.checkIn && prop.checkOut) {
          bookedRanges.push({
            checkIn: prop.checkIn,
            checkOut: prop.checkOut,
          });
        }
      });
    });
 
    res.status(200).json({ bookedRanges });
  } catch (err) {
    console.error("getBookedDates error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
 
// POST /api/bookings — create booking from cart
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
 
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
 
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
    const totalPrice = subtotal + serviceFee;
 
    const booking = await Booking.create({
      userId,
      properties: cart.items.map((item) => ({
        propertyId: item.propertyId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        guests: item.guests,
      })),
      subtotal,
      serviceFee,
      totalPrice,
      status: "pending",
    });
 
    cart.items = [];
    await cart.save();
 
    res.status(201).json(booking);
  } catch (err) {
    console.error("createBooking error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
 
// GET /api/bookings/user
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error("getUserBookings error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
 
// GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const userId = req.user.id;
    const booking = await Booking.findById(req.params.id);
 
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
 
    res.status(200).json(booking);
  } catch (err) {
    console.error("getBookingById error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
 
// PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const booking = await Booking.findById(req.params.id);
 
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }
 
    booking.status = "cancelled";
    await booking.save();
 
    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("cancelBooking error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// GET /api/bookings/admin/all
exports.getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    const userIds = [
      ...new Set(
        bookings
          .map((b) => b.userId)
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
      ),
    ];
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email")
      .lean();
    const usersById = new Map(users.map((user) => [user._id.toString(), user]));

    res.status(200).json(
      bookings.map((booking) => ({
        ...booking,
        user: usersById.get(booking.userId) || null,
      }))
    );
  } catch (err) {
    console.error("getAllBookingsAdmin error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/bookings/admin/:id/approve
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status !== "pending") {
      return res.status(400).json({ error: "Only pending bookings can be approved" });
    }

    booking.status = "approved";
    booking.approvedAt = new Date();
    booking.approvedBy = req.user.id;
    await booking.save();

    let email = { sent: false };
    try {
      email = await sendBookingStatusEmail(booking, "approved");
    } catch (emailErr) {
      console.error("approval email error:", emailErr.message);
      email = { sent: false, error: emailErr.message };
    }

    res.status(200).json({ booking, email });
  } catch (err) {
    console.error("approveBooking error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/bookings/admin/:id/reject
exports.rejectBooking = async (req, res) => {
  try {
    const reason = (req.body.reason || "").trim();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status !== "pending") {
      return res.status(400).json({ error: "Only pending bookings can be rejected" });
    }

    booking.status = "rejected";
    booking.rejectionReason = reason;
    booking.rejectedAt = new Date();
    booking.rejectedBy = req.user.id;
    await booking.save();

    let email = { sent: false };
    try {
      email = await sendBookingStatusEmail(booking, "rejected", reason);
    } catch (emailErr) {
      console.error("rejection email error:", emailErr.message);
      email = { sent: false, error: emailErr.message };
    }

    res.status(200).json({ booking, email });
  } catch (err) {
    console.error("rejectBooking error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
