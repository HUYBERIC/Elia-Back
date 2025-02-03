const mongoose = require("mongoose");

const replacementsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: "zone" },
  status: { type: String, enum: ["pending", "approved", "declined"] },
  startTime: { type: Date },
  endTime: { type: Date },
});

module.exports = mongoose.model("replacements", replacementsSchema);
