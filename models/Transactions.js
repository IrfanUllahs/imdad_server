// models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  quantity: {
    type: Number,
    required: false
   },
  totalPrice: { 
    type: Number, 
    required: true
   },
  payment: { 
    type: Number,
    required: true
   },
  loan: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});
// Add a virtual field for totalLoan
TransactionSchema.virtual("totalLoan").get(function () {
  return this.totalPrice - this.payment; // Calculate totalLoan dynamically
});

// Ensure virtual fields are included in JSON responses
TransactionSchema.set("toJSON", { virtuals: true });
TransactionSchema.set("toObject", { virtuals: true });

// Check if the model already exists before defining it
module.exports =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
