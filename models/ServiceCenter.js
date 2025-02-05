const mongoose = require("mongoose");

const serviceCenter = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  location: { type: String },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // References users
});

module.exports = mongoose.model("Zone", serviceCenter);
