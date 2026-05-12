const Cart = require("../models/Cart");
const Booking = require("../models/Booking");

const SERVICE_FEE_RATE = 0.14;

// POST /api/bookings/direct — book directly from property page
exports.createDirectBooking = async (req, res) => {
  try {
    const { propertyId, name, price, checkIn, checkOut, guests } = req.body;

    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for conflicts
    const conflict = await Booking.findOne({
      status: { $in: ["pending", "paid"] },
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
      status: { $in: ["pending", "paid"] },
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
    if (booking.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json(booking);
  } catch (err) {
    console.error("getBookingById error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
