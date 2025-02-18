const mongoose = require("mongoose");

const dutyShiftSchema = new mongoose.Schema({
  title: { type: String, required: true },
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCenter" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalTime: { type: Number, required: true },
  mainUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  segments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      totalTime: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("DutyShift", dutyShiftSchema);
