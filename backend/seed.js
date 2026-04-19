const mongoose = require("mongoose");
const Product = require("./models/Product");
const products = require("./data");
require("dotenv").config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Products seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();