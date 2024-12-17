const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const {authenticate, authorize} = require("../middleware/auth")

// Get all stock entries
router.get('/stocks', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const stocks = await Stock.find();
    const formattedStocks = stocks.map(stock => ({
      ...stock.toObject(),
      totalProfit: stock.soldQuantity * (stock.salePrice - stock.purchasePrice), // Recalculate total profit dynamically
    }));
    res.json(formattedStocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific stock entry by ID
router.get('/stocks/:id', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json({
      ...stock.toObject(),
      totalProfit: stock.soldQuantity * (stock.salePrice - stock.purchasePrice),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new stock entry
router.post('/stocks', authenticate, authorize("admin", "manager"), async (req, res) => {
  const { name,companyName, purchasePrice, salePrice, size, weight, quantity } = req.body;

  // Calculate initial profit (which will be 0 as no items are sold initially)
  const stock = new Stock({ name, companyName, purchasePrice, salePrice,size, weight, quantity });

  try {
    const newStock = await stock.save();
    res.status(201).json({
      ...newStock.toObject(),
      totalProfit: 0, // Initially total profit is 0
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing stock entry (e.g., updating quantity, prices, or sold items)
router.put('/stocks/:id', authenticate, authorize("admin"), async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) return res.status(404).json({ message: 'Stock not found' });

    const { quantity, soldQuantity, salePrice, purchasePrice } = req.body;

    // Update stock details (adjusting quantity and prices)
    if (quantity !== undefined) stock.quantity = quantity;
    if (soldQuantity !== undefined) stock.soldQuantity = soldQuantity;
    if (salePrice !== undefined) stock.salePrice = salePrice;
    if (purchasePrice !== undefined) stock.purchasePrice = purchasePrice;

    const updatedStock = await stock.save();

    res.json({
      ...updatedStock.toObject(),
      totalProfit: updatedStock.soldQuantity * (updatedStock.salePrice - updatedStock.purchasePrice),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a stock entry
router.delete('/stocks/:id', authenticate, authorize("admin"), async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json({ message: 'Stock deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
