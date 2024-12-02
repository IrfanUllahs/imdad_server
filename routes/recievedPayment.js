const express = require("express");
const router = express.Router();
const Payment = require("../models/RecievedPayment");
const moment = require("moment");
const { authenticate, authorize } = require("../middleware/auth");

// Get all payments (Accessible to admin and manager)
router.get("/", authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new payment (Accessible to admin only)
router.post("/", authenticate, authorize('admin', 'manager'), async (req, res) => {
  const { paymentType, payerName, recipientName, transactionDate, amount, bankName, senderName } = req.body;
  try {
    const newPayment = new Payment({
      paymentType,
      payerName,
      recipientName,
      transactionDate,
      amount,
      bankName,
      senderName,
    });

    const savedPayment = await newPayment.save();
    res.json(savedPayment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update a payment by ID (Accessible to admin only)
router.put("/update/:id", authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;
  const { paymentType, payerName, recipientName, transactionDate, amount, bankName, senderName } = req.body;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { paymentType, payerName, recipientName, transactionDate, amount, bankName, senderName },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a payment by ID (Accessible to admin only)
router.delete("/delete/:id", authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get today's received payments grouped by bankName (Accessible to admin and manager)
router.get("/today", async (req, res) => {
  try {
    const today = moment().startOf("day");
    const endOfDay = moment().endOf("day");

    const payments = await Payment.find({
      transactionDate: { $gte: today.toDate(), $lte: endOfDay.toDate() },
      paymentType: { $in: ["bank", "cash"] }
    });

    const paymentsByBank = payments.reduce((acc, payment) => {
      if (!acc[payment.bankName]) {
        acc[payment.bankName] = 0;
      }
      acc[payment.bankName] += payment.amount;
      return acc;
    }, {});

    res.json(paymentsByBank);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get this month's received payments grouped by bankName (Accessible to admin and manager)
router.get("/monthly", async (req, res) => {
  try {
    const startOfMonth = moment().startOf("month").startOf("day");
    const endOfMonth = moment().endOf("month").endOf("day");

    const payments = await Payment.find({
      transactionDate: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
      paymentType: { $in: ["bank", "cash"] }
    });

    const paymentsByBank = payments.reduce((acc, payment) => {
      if (!acc[payment.bankName]) {
        acc[payment.bankName] = 0;
      }
      acc[payment.bankName] += payment.amount;
      return acc;
    }, {});

    res.json(paymentsByBank);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get total received payments for the year (Accessible to admin and manager)
router.get("/total-yearly",  async (req, res) => {
  try {
    const startOfYear = moment().startOf("year").startOf("day");
    const endOfYear = moment().endOf("year").endOf("day");

    const payments = await Payment.find({
      transactionDate: { $gte: startOfYear.toDate(), $lte: endOfYear.toDate() },
      paymentType: { $in: ["bank", "cash"] }
    });

    const totalAmount = payments.reduce((acc, payment) => acc + payment.amount, 0);

    res.json({ totalAmount });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
