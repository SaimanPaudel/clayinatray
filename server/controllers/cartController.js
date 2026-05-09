const Cart = require("../models/Cart");

/*
========================================
GET CART
GET /api/cart/:sessionId
OR
GET /api/cart   (if using logged-in user)
========================================
*/
const getCart = async (req, res) => {
  try {
    // Supports both login user and guest session
    const userId = req.user?.id;
    const sessionId = req.params.sessionId;

    const query = userId ? { userId } : { sessionId };

    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: cart.items,
    });
  } catch (error) {
    console.error("getCart error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
ADD TO CART
POST /api/cart/:sessionId/add
OR
POST /api/cart/add
========================================
*/
const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.params.sessionId;

    const {
      itemId,
      propertyId,
      type,
      name,
      price,
      image,
      quantity = 1,
      details,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    // Support both itemId and propertyId
    const finalItemId = itemId || propertyId;

    if (!finalItemId || !name || price == null) {
      return res.status(400).json({
        success: false,
        message: "itemId/propertyId, name, and price are required",
      });
    }

    const query = userId ? { userId } : { sessionId };

    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        ...(userId ? { userId } : { sessionId }),
        items: [],
      });
    }

    // Check existing item
    const existingItem = cart.items.find(
      (item) =>
        item.itemId === String(finalItemId) &&
        (type ? item.type === type : true)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        itemId: String(finalItemId),
        propertyId: String(finalItemId),
        type,
        name,
        price: Number(price),
        image,
        quantity: Number(quantity),
        details,
        checkIn,
        checkOut,
        guests,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart.items,
    });
  } catch (error) {
    console.error("addToCart error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
REMOVE FROM CART
DELETE /api/cart/:sessionId/:itemId
OR
DELETE /api/cart/:itemId
========================================
*/
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.params.sessionId;
    const { itemId } = req.params;

    const query = userId ? { userId } : { sessionId };

    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const before = cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        String(item._id) !== itemId &&
        item.itemId !== itemId &&
        item.propertyId !== itemId
    );

    if (before === cart.items.length) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart.items,
    });
  } catch (error) {
    console.error("removeFromCart error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
CLEAR CART
DELETE /api/cart/:sessionId
OR
DELETE /api/cart
========================================
*/
const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.params.sessionId;

    const query = userId ? { userId } : { sessionId };

    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart.items,
    });
  } catch (error) {
    console.error("clearCart error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};