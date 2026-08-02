const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Doctor = require('../models/Doctor');


router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!' });
        }
        
        const newUser = new User({ 
            fullName, 
            email, 
            password,
            role: 'patient' 
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully! ✅' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


router.post('/add-doctor', async (req, res) => {
    try {
        
        const { fullName, email, password, specialization, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists for this doctor!' });
        }

       
        const newDoctorUser = new User({ 
            fullName, 
            email, 
            password,
            role: 'doctor' 
        });
        await newDoctorUser.save();

        
        const newDoctorProfile = new Doctor({
            name: fullName,
            specialization: specialization || 'General', 
            phone: phone || 'Not Provided'
        });
        await newDoctorProfile.save();

        res.status(201).json({ message: 'Doctor registered successfully by Admin! 🩺✅' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password! ❌' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password! ❌' });
        }
        
        res.status(200).json({ 
            message: 'Login successful! Welcome ✅', 
            userId: user._id, 
            role: user.role,
            user: { 
                id: user._id, 
                fullName: user.fullName, 
                email: user.email,
                role: user.role 
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;