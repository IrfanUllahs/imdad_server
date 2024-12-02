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

module.exports = router;
