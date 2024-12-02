const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const {authenticate, authorize} = require("../middleware/auth")

// Get all customers
router.get('/', authenticate, authorize("admin", "manager"),async (req, res) => {
  try {
    const customers = await Customer.find()
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a customer by ID
router.get('/:id', authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new customer
router.post('/', authenticate, authorize("admin", "manager"), async (req, res) => {
  const { name, email, phone, address,loan } = req.body;
  const newCustomer = new Customer({ name, email, phone, address,loan });
  try {
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a customer
router.put('/update/:id', authenticate, authorize("admin"),async (req, res) => {
  try {
    const {id}=req.params;
    const { name, email, phone, address, loan } = req.body;

    // Create an update object with only the provided fields
    const updateFields = {};
    if(!loan){
      return res.status(404).json({message:"loan not found"})
    }
   
    // Update the customer with only the provided fields

    const updatedCustomer = await Customer.findById(id)

    if(!updatedCustomer){
      return res.status(404).json({message:"Customer not found"})
    }

    updatedCustomer.loan -=loan;
    
    updatedCustomer.save()
    
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete a customer
router.delete('/:id', authenticate, authorize("admin"), async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
