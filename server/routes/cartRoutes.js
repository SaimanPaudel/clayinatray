cartRoute : 

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.delete("/:itemId", auth, removeFromCart);
router.delete("/", auth, clearCart);

module.exports = router;