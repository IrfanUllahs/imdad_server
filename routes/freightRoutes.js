const express = require("express");
const Freight = require("../models/Freight");
const router = express.Router();
const {authenticate, authorize} = require("../middleware/auth")



// Get all freight details
router.get("/", authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const freights = await Freight.find();
    res.json(freights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific freight detail
router.get("/:id", authenticate, authorize("admin", "manager"), async (req, res) => {
  try {
    const freight = await Freight.findById(req.params.id);
    if (!freight) {
      return res.status(404).json({ message: "Freight not found" });
    }
    res.json(freight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new freight detail
router.post("/", authenticate, authorize("admin", "manager"), async (req, res) => {
  const { departureDate, arrivalDate, ...rest } = req.body;

  // Format the date fields before saving
  const formattedDepartureDate = (departureDate);
  const formattedArrivalDate = (arrivalDate);

  const freight = new Freight({
    ...rest,
    departureDate: formattedDepartureDate,
    arrivalDate: formattedArrivalDate,
  });

  try {
    const newFreight = await freight.save();
    res.status(201).json(newFreight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a freight detail
router.put("/update/:id", authenticate, authorize("admin"), async (req, res) => {
  const { departureDate, arrivalDate, ...rest } = req.body;

  // Format the date fields before updating
  const formattedDepartureDate = departureDate;
  const formattedArrivalDate = arrivalDate;

  try {
    const freight = await Freight.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        departureDate: formattedDepartureDate,
        arrivalDate: formattedArrivalDate,
      },
      { new: true }
    );
    if (!freight) {
      return res.status(404).json({ message: "Freight not found" });
    }
    res.json(freight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a freight detail
router.delete("/delete/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const freight = await Freight.findByIdAndDelete(req.params.id);
    if (!freight) {
      return res.status(404).json({ message: "Freight not found" });
    }
    res.json({ message: "Freight deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
