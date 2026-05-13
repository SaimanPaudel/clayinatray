const express = require("express");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const User = require("../models/User");
const {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

const router = express.Router();


router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Admin routes
router.get("/admin/all", auth, admin, getAllUsers);
router.delete("/admin/:id", auth, admin, deleteUser);
router.put("/admin/:id/role", auth, admin, updateUserRole);

module.exports = router;