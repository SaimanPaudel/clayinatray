const Accommodation = require("../models/Accommodation");

const getAllAccommodations = async (req, res) => {
  try {
    const { search, available } = req.query;
    let query = {};
    if (available === "true") query.isAvailable = true;
    if (search && search.trim()) query.$text = { $search: search.trim() };
    const data = await Accommodation.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAccommodationById = async (req, res) => {
  try {
    const data = await Accommodation.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAccommodation = async (req, res) => {
  try {
    const saved = await new Accommodation(req.body).save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAccommodation = async (req, res) => {
  try {
    const data = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAccommodation = async (req, res) => {
  try {
    const data = await Accommodation.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};