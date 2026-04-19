const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const SESSION_ID = "default";

// Helper — get or create cart
const getCart = async () => {
  let cart = await Cart.findOne({ sessionId: SESSION_ID });
  if (!cart) cart = await Cart.create({ sessionId: SESSION_ID, items: [] });
  return cart;
};

// GET cart
router.get("/", async (req, res) => {
  try {
    const cart = await getCart();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — add to cart
router.post("/", async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const cart = await getCart();
    const existing = cart.items.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1,
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — update quantity
router.put("/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;
    const cart = await getCart();
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — remove one item
router.delete("/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const cart = await getCart();
    cart.items = cart.items.filter((i) => i.productId !== productId);
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — clear entire cart
router.delete("/", async (req, res) => {
  try {
    const cart = await getCart();
    cart.items = [];
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;