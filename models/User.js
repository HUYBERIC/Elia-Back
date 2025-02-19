const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, unique: true },
  lastName: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:{type:Number},
  role:{type: String, enum: ["user", "admin"], default:"user" },
  serviceCenter: { 
    serviceCenterId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCenter" },
    serviceCenter: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
