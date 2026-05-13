const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createMessage,
  getAllMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/", createMessage);
router.get("/admin/all", auth, admin, getAllMessages);
router.put("/admin/:id/read", auth, admin, markAsRead);
router.delete("/admin/:id", auth, admin, deleteMessage);

module.exports = router;