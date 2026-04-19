const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: Number,
  category: String,
  title: String,
  description: String,
  price: Number,
  image: String,
});

module.exports = mongoose.model("Product", productSchema);