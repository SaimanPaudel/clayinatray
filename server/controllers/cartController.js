cartController : 
const Cart = require("../models/Cart");

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      propertyId,
      name,
      price,
      image,
      quantity = 1,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    if (!propertyId || !name || price == null) {
      return res
        .status(400)
        .json({ error: "propertyId, name, and price are required" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.propertyId === String(propertyId)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        propertyId: String(propertyId),
        name,
        price: Number(price),
        image,
        quantity: Number(quantity),
        checkIn,
        checkOut,
        guests,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("addToCart error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ userId, items: [] });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("getCart error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart/:itemId
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const before = cart.items.length;
    cart.items = cart.items.filter((item) => String(item._id) !== itemId);

    if (cart.items.length === before) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("removeFromCart error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(200).json({ userId, items: [] });

    cart.items = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("clearCart error:", err.message);
    res.status(500).json({ error: err.message });
  }
};