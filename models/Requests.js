const mongoose = require("mongoose");

const request = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  emergencyLevel: { type: String, enum: ["low", "medium", "high"], required: true },
  askedStartTime:{type:Date},
  askedEndTime:{type:Date},
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "DutyShift" },
  status: { type: String, enum: ["pending", "approved", "declined"] },
}, { timestamps: true });

module.exports = mongoose.model("Requests", request);
