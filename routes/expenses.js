// /routes/expenses.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expenses');
const {authenticate, authorize} = require("../middleware/auth")

// Create a new expense
router.post('/', authenticate, authorize("admin", "manager"), async (req, res) => {
    // Log incoming request body
    const { name, price, date } = req.body;
    console.log('Received request body:', req.body); 
    if (typeof price !== 'number') {
      return res.status(400).json({ message: 'Price must be a number' });
    }
  
    const newExpense = new Expense({ name, price, date });
    
    try {
      const savedExpense = await newExpense.save();
      res.status(201).json(savedExpense);
    } catch (err) {
      console.error('Error saving expense:', err.message); // Detailed error log
      res.status(400).json({ message: err.message });
    }
  });
    
    

// Get all expenses
router.get('/', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an expense by ID
router.put('/:id', authenticate, authorize("admin"), async (req, res) => {
  const { name, price, date } = req.body;

  // Validate input data
  if (!name || !price || !date) {
    return res.status(400).json({ message: 'All fields are required (name, price, date)' });
  }

  if (typeof price !== 'number') {
    return res.status(400).json({ message: 'Price must be a number' });
  }

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { name, price, date },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error('Error updating expense:', err.message); // Log error details
    res.status(500).json({ message: err.message });
  }
});

// Delete an expense by ID
router.delete('/:id', authenticate, authorize("admin"), async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err.message); // Log error details
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
