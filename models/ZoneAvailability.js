const mongoose = require("mongoose");

const zoneAvailabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Zone" },
  startTime: { type:Date },
  endTime: { type:Date },
});

module.exports = mongoose.model("Zone_Availability", zoneAvailabilitySchema);
