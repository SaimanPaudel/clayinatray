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
    const { name, email, password, avatar } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;
    if (password) user.password = password;

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
    res
      .status(500)
      .json({ message: "Profile update failed", error: error.message });
  }
};
