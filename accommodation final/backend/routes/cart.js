const express = require('express');
const router  = express.Router();
const Cart    = require('../models/Cart');

// GET cart items for a user
router.get('/:userId', async (req, res) => {
  try {
    const items = await Cart.find({
      userId: req.params.userId,
      status: 'pending',
    }).populate('propertyId', 'title image price location');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add item to cart
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      propertyId,
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice,
    } = req.body;

    const item = new Cart({
      userId,
      propertyId,
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice,
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;