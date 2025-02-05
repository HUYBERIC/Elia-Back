const mongoose = require("mongoose");

const DutyShiftSchema = new mongoose.Schema({
  title:{type:String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  ServiceCenter: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCenter" },
  startTime: {type:Date},
  endTime: {type:Date},
  replacements: { type: mongoose.Schema.Types.ObjectId, ref: "replacements" },
  totalTime : Number
});

module.exports = mongoose.model("DutyShift", DutyShiftSchema);
