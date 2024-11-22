const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  status: { type: String, default: "active" }, // assuming active status for donors
  contact: { type: String, required: true },
  dob: { type: Date, required: true },
});

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;
