// models/Transaction.js
const mongoose = require('mongoose');

const sendPaymentSchema = new mongoose.Schema({
    paymentType: {
        type: String,
        enum: ["cash", "bank"],
        required: true,
      },
      payerName: { type: String },
      recipientName: { type: String, required: true },
      transactionDate: { type: Date, required: true },
      amount: { type: Number, required: true },
      bankName: { type: String }, // only for bank payments
      senderName: { type: String }, // only for bank payments
});

const SendPayment = mongoose.model('sendPayment', sendPaymentSchema);

module.exports = SendPayment;
