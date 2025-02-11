require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/eliadb?retryWrites=true&w=majority&appName=EliaDB`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop le serveur si erreur
  }
};

module.exports = connectDB;

