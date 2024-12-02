const express = require('express');
const router = express.Router();
const Commission = require('../models/Commission'); // Import the model
const {authenticate, authorize} = require("../middleware/auth")

// Create a new commission
router.post('/', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const { name, date, amount } = req.body;
    const commission = new Commission({ name, date, amount });
    const savedCommission = await commission.save();
    res.status(201).json(savedCommission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all commissions
router.get('/', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const commissions = await Commission.find();
    res.json(commissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a commission by ID
router.put('/:id', authenticate, authorize("admin"),  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, date, amount } = req.body;
  
      // Find and update the commission
      const updatedCommission = await Commission.findByIdAndUpdate(
        id,
        { name, date, amount },
        { new: true } // Return the updated document
      );
  
      if (!updatedCommission) {
        return res.status(404).json({ message: 'Commission not found' });
      }
  
      res.json(updatedCommission);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
// Delete all commissions (optional for development/testing)
router.delete('/', authenticate, authorize("admin"), async (req, res) => {
  try {
    await Commission.deleteMany();
    res.json({ message: 'All commissions deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
