const mongoose = require("mongoose");

const serviceCenter = new mongoose.Schema({
  firstName: { type: String, required: true, unique: true },
  lastName: { type: String, required: true, unique: true },
  currentShift: { type: mongoose.Schema.Types.ObjectId, ref: "DutyShift" },
  availableUsers : [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("ServicesCenters", serviceCenter);
