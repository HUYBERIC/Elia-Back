const mongoose = require("mongoose");

const replacementsSchema = new mongoose.Schema({
  replacedUserId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  replacingUserId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCenter" },
  status: { type: String, enum: ["pending", "approved", "declined"] },
  startTime: { type: Date },
  endTime: { type: Date },
});

module.exports = mongoose.model("Replacements", replacementsSchema);
