require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔍 Connecting to MongoDB:", process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{userMongoClient: true});
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop le serveur si erreur
  }
};

module.exports = connectDB;

