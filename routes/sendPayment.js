const express = require("express");
const router = express.Router();
const SendPayment = require("../models/SendPayment");
const { authenticate, authorize } = require('../middleware/auth')

// CREATE a new payment
router.post("/", authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const payment =SendPayment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all payments
router.get("/", authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const payments = await SendPayment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a specific payment by ID
router.get("/:id", authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const payment = await SendPayment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a payment by ID
router.put("/update/:id", authenticate, authorize('admin'), async (req, res) => {
  try {
    const payment = await SendPayment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a payment by ID
router.delete("/delete/:id", authenticate, authorize('admin'), async (req, res) => {
  try {
    const payment = await SendPayment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
