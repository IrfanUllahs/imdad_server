// /models/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true,
    default: 0
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
