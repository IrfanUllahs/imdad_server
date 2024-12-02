const express = require("express");
const Recovery = require("../models/Recovery");
const Customer = require("../models/Customer");
const router = express.Router();
const {authenticate, authorize} = require("../middleware/auth")

// Add a new recovery
router.post("/add", authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const { customerId, amountRecovered, recoveryDate, notes } = req.body;

    // Validate customer
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Create recovery
    const newRecovery = new Recovery({ customerId, amountRecovered, recoveryDate, notes });
    await newRecovery.save();

    // Update customer loan amount
    customer.loanAmount -= amountRecovered;
    await customer.save();

    res.status(201).json({ message: "Recovery added successfully", recovery: newRecovery });
  } catch (error) {
    res.status(500).json({ message: "Error adding recovery", error: error.message });
  }
});

// Get all recoveries
router.get("/", authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const recoveries = await Recovery.find().populate("customerId", "name loan");
    res.status(200).json(recoveries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recoveries", error: error.message });
  }
});

// Get recoveries for a specific customer
router.get("/:customerId", authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const { customerId } = req.params;
    const recoveries = await Recovery.find({ customerId }).populate("customerId", "name loan");
    res.status(200).json(recoveries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer recoveries", error: error.message });
  }
});

// Delete a recovery
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const recovery = await Recovery.findByIdAndDelete(req.params.id);
    if (!recovery) return res.status(404).json({ message: "Recovery not found" });

    // Adjust customer loan amount
    const customer = await Customer.findById(recovery.customerId);
    if (customer) {
      customer.loanAmount += recovery.amountRecovered;
      await customer.save();
    }

    res.status(200).json({ message: "Recovery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recovery", error: error.message });
  }
});

module.exports = router;
