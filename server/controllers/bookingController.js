bookingcontroller : 

const Cart = require("../models/Cart");
const Booking = require("../models/Booking");

const SERVICE_FEE_RATE = 0.14; 

// POST /api/bookings
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

    if (booking.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json(booking);
  } catch (err) {
    console.error("getBookingById error:", err.message);
    res.status(500).json({ error: err.message });
  }
};