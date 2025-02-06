const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  message: { type: String },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "DutyShift" },
  status: { type: String, enum: ["pending", "approved", "declined"] },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Requests", userSchema);
