const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const data =  { 
            id: user._id, 
            role: user.role,
            username: user.username,
            email: user.email
        };
        // Generate a JWT token
        const token = jwt.sign(
           data,
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.status(200).json({ message: 'Login successful', token, data });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
