const mongoose = require("mongoose");

const DutyShiftSchema = new mongoose.Schema({
  title:{type:String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: "zone" },
  startTime: {type:Date},
  endTime: {type:Date},
  replacements: { type: mongoose.Schema.Types.ObjectId, ref: "replacements" },
  totalTime : Number
});

module.exports = mongoose.model("DutyShift", DutyShiftSchema);
