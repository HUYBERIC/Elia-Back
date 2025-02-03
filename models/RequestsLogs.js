const mongoose = require("mongoose");

const RequestsLogsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String },
    details: {
      oldshift: { type: String },
      newShift: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestsLogs", RequestsLogsSchema);
