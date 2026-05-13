const Message = require("../models/Message");

// POST /api/messages — save contact form message
exports.createMessage = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }
    const saved = await Message.create({ fullName, email, phone, subject, message });
    res.status(201).json({ message: "Message sent successfully", data: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/messages/admin/all — admin sees all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/messages/admin/:id/read — mark as read
exports.markAsRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.status(200).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/messages/admin/:id — delete message
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};