const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PurchaseHistory = require('../models/PurchaseHistory');
const {login, register} = require('../controllers/userController');
const {authenticate, authorize} = require("../middleware/auth")

// Registration endpoint
router.post('/register', register)

// Login endpoint
router.post('/login', login)
// POST route to save purchase history
router.post('/save', authenticate, authorize("admin", "manager"), async (req, res) => {
    try {
        const { pkr, amountInSelectedCurrency, selectedCurrency, selectedCurrencySymbol, date } = req.body;
        
        const newEntry = new PurchaseHistory({
            pkr,
            amountInSelectedCurrency,
            selectedCurrency,
            selectedCurrencySymbol
        });
        
        await newEntry.save();
        res.status(201).json( newEntry );
    } catch (error) {
        res.status(500).json({ message: 'Error saving purchase history', error });
    }
});

// GET route to retrieve all purchase history entries
router.get('/', authenticate, authorize("admin", "manager"), async (req, res) => {
    try {
        const history = await PurchaseHistory.find();
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving purchase history', error });
    }
});


module.exports = router;
