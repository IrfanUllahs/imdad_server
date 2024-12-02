const mongoose = require("mongoose");

const RecievedpaymentSchema = new mongoose.Schema({
  paymentType: {
    type: String,
    enum: ["cash", "bank"],
    required: true,
  },
  payerName: { type: String },
  recipientName: { type: String, required: true },
  transactionDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  bankName: { type: String, default: "cash" }, // only for bank payments
  senderName: { type: String }, // only for bank payments
});

const RecievedPayment = mongoose.model(
  "RecievedPayment",
  RecievedpaymentSchema
);

module.exports = RecievedPayment;
