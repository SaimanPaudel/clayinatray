const User = require("../models/User");

exports.getProfile = async (req, res) => {
  res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    role: req.user.role,
    createdAt: req.user.createdAt,
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, currentPassword, password, avatar } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      const passwordMatches = await user.matchPassword(currentPassword);
      if (!passwordMatches) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};

// GET /api/users/admin/all
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/admin/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete an admin" });
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/admin/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};