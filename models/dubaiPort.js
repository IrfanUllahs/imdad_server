const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: Date,
  description: String,
});

const DoubaiPortExpense = mongoose.model('DubaiPortExpense', expenseSchema);

module.exports = DoubaiPortExpense;
