const mongoose = require("mongoose");

const serviceCenter = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  location: { type: String },
  planning: [{ type: mongoose.Schema.Types.ObjectId, ref: "DutyShift" }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("ServiceCenter", serviceCenter);