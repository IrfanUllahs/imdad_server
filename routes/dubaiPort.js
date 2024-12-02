const express = require('express');
const Expense = require('../models/dubaiPort');
const {authenticate, authorize} = require("../middleware/auth");
const router = express.Router();
// Create a new expense
router.post('/', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    const formattedExpense = { ...expense.toObject(), date: expense.date };
    res.status(201).json(formattedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all expenses
router.get('/', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const expenses = await Expense.find();
    const formattedExpenses = expenses.map(expense => ({
      ...expense.toObject(),
      date:expense.date
    }));
    res.status(200).json(formattedExpenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an expense
router.put('/:id', authenticate, authorize("admin"), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const formattedExpense = { ...expense.toObject(), date:expense.date };
    res.status(200).json(formattedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an expense
router.delete('/:id', authenticate, authorize("admin"), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    const formattedExpense = { ...expense.toObject(), date:expense.date };
    res.status(200).json({ message: 'Expense deleted', deletedExpense: formattedExpense });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
