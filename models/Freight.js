const mongoose = require("mongoose");

const freightSchema = new mongoose.Schema({
  shipmentNumber: { type: String, required: true },
  originCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date, required: true },
  carrierName: { type: String, required: true },
  freightCostPKR: { type: Number, required: true },
  customsFeePKR: { type: Number, required: true },
  status: { type: String, required: false },
  containerNumber: { type: String },
  aeroplaneNumber: { type: String },
  contactNumber: { type: String, required: true },
  atoms: { type: String, required: true },
  journey: { type: String, required: true },
  driverPaymentPKR: { type: Number, required: true },
});

module.exports = mongoose.model("Freight", freightSchema);
