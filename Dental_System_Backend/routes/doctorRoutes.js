const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');


router.post('/add', async (req, res) => {
    try {
        const { name, specialization, phone, availability } = req.body;

      
        const existingDoctor = await Doctor.findOne({ phone });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor with this phone number already exists!' });
        }

       
        const newDoctor = new Doctor({
            name,
            specialization,
            phone,
            availability
        });

       
        await newDoctor.save();
        res.status(201).json({ message: 'Doctor added successfully!', doctor: newDoctor });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor updated successfully!', doctor: updatedDoctor });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!deletedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;