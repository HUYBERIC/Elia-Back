const mongoose = require("mongoose");

const replacementsSchema = new mongoose.Schema({
  replacingUserId:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCenter" },
  status: { type: String, enum: ["pending", "approved", "declined"] },
  startTime: { type: Date },
  endTime: { type: Date },
});

module.exports = mongoose.model("replacements", replacementsSchema);
