const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');


router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, age, gender } = req.body;

       
        const existingPatient = await Patient.findOne({ phone });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient with this phone number already exists!' });
        }

       
        const newPatient = new Patient({
            name,
            phone,
            email,
            age,
            gender
        });

       
        await newPatient.save();
        res.status(201).json({ message: 'Patient registered successfully!', patient: newPatient });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json({ message: 'Patient updated successfully!', patient: updatedPatient });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json({ message: 'Patient deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;