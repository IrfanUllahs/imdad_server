const express = require("express");
const router = express.Router();
const AgentPayment = require("../models/AgentPayment");
const { authenticate, authorize } = require('../middleware/auth');

// Function to format date to DD/MM/YYYY
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// GET all agent payments

// Route to get all agent payments
router.get("/", authenticate, authorize('admin','manager'), async (req, res) => {
  try {
    // Fetch all agent payments
    const agentPayments = await AgentPayment.find();
    res.json(agentPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authenticate, authorize('admin','manager'), async (req, res) => {
  const {id}=req.params;
  try {
    const agentPayments = await AgentPayment.findById(id);
    res.json(agentPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST a new agent payment
router.post("/save", authenticate, authorize('admin','manager'), async (req, res) => {
  const {
    shipmentNumber,
    arrivalDate,
    agentName,
    paymentAmount,
    paymentDate,
    paymentStatus,
    currency
  } = req.body;
  // console.log('body *++++++++++++++++*',req.body);

  const newAgentPayment = new AgentPayment({
    shipmentNumber,
    arrivalDate: (arrivalDate),
    agentName,
    paymentAmount,
    paymentDate: (paymentDate),
    paymentStatus,
    currency
  });

  try {
    const savedAgentPayment = await newAgentPayment.save();
    res.status(201).json(savedAgentPayment);
  } catch (error) {
    console.log('error********** ',error);
    res.status(400).json({ message: error.message });
  }
});

// PUT to update an existing agent payment
router.put("/update/:id", authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;
  const {
    shipmentNumber,
    arrivalDate,
    agentName,
    paymentAmount,
    paymentDate,
    paymentStatus,
    currency
  } = req.body;

  try {
    const updatedAgentPayment = await AgentPayment.findByIdAndUpdate(
      id,
      {
        shipmentNumber,
        arrivalDate: arrivalDate,
        agentName,
        paymentAmount,
        paymentDate: paymentDate,
        paymentStatus,
        currency
      },
      { new: true }
    );

    if (!updatedAgentPayment) {
      return res.status(404).json({ message: "Agent Payment not found" });
    }

    res.json(updatedAgentPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an agent payment by ID
router.delete("/delete/:id", authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAgentPayment = await AgentPayment.findByIdAndDelete(id);

    if (!deletedAgentPayment) {
      return res.status(404).json({ message: "Agent Payment not found" });
    }

    res.json({ message: "Agent Payment deleted successfully", deletedAgentPayment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
