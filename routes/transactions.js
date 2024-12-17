const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const Customer = require('../models/Customer');
const Stock = require('../models/Stock');
const {authenticate, authorize} = require("../middleware/auth")


router.post('/', authenticate, authorize("admin", "manager"), async (req, res) => {
  const { customer, product, quantity, payment, loan, totalPrice } = req.body;

  try {
    // Find the customer and product
    const foundCustomer = await Customer.findById(customer);
    const foundProduct = await Stock.findById(product);

    if (!foundCustomer || !foundProduct) {
      return res.status(404).json({ message: 'Customer or Product not found' });
    }

    // Ensure sufficient product quantity is available
    if (foundProduct.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient product quantity' });
    }

    // Update the product quantity
    foundProduct.quantity -= quantity;
    foundProduct.soldQuantity += quantity;
    await foundProduct.save();

    // Create a new transaction
    const newTransaction = new Transaction({
      customer: foundCustomer._id,
      product: foundProduct._id,
      quantity,
      totalPrice,
      payment,
      loan,
    });

    await newTransaction.save();

    // Update the customer's loan balance
    foundCustomer.loan += loan; // Add the new loan to the existing loan
    await foundCustomer.save();

    // Respond with the created transaction and updated customer
    res.status(201).json({
      newTransaction,
      updatedCustomer: foundCustomer,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all transactions
router.get('/', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    // Populate customer and product details in the transaction
    const transactions = await Transaction.find()
      .populate('customer', 'name') // Populate customer name
      .populate('product', 'name companyName size'); // Populate product name

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get a transactions
router.get('/:id', authenticate, authorize("admin", "manager"), async (req, res) => {
  const {id}=req.params
  try {
    // Populate customer and product details in the transaction
    const transactions = await Transaction.find({
      customer:id
    }).populate('product', 'name companyName size');
      if(!transactions){
       return  res.status(404).json({message:"no transactions found!"})
      }

    res.json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
