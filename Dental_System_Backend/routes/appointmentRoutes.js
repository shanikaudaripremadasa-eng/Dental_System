const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Notification = require('../models/Notification');


router.get('/patient/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;

    
        const appointments = await Appointment.find({ patient: patientId })
            .populate('doctor', 'name specialization')
            .sort({ appointmentDate: -1 });

        const modifiedAppointments = appointments.map(app => {
            const appObj = app.toObject();
            if (appObj.appointmentDate) {
                const dateObj = new Date(appObj.appointmentDate);
                appObj.date = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                appObj.time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            }
            return appObj;
        });
        
        res.status(200).json(modifiedAppointments);
    } catch (error) {
        res.status(500).json({ message: 'Patient appointments loading error', error: error.message });
    }
});


router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        
        const foundDoctor = await Doctor.findOne({ user: doctorId });
       
        let queryIds = [doctorId];
        if (foundDoctor) {
            queryIds.push(foundDoctor._id.toString());
        }

       
        const appointments = await Appointment.find({ doctor: { $in: queryIds } })
            .populate('patient', 'fullName email')
            .sort({ appointmentDate: -1 });

        const modifiedAppointments = appointments.map(app => {
            const appObj = app.toObject();
            appObj.patientName = appObj.patient ? appObj.patient.fullName : 'Unknown';
            return appObj;
        });

       res.status(200).json(modifiedAppointments);
    } catch (error) {
        res.status(500).json({ message: 'Doctor stats loading error', error: error.message });
    }
});
router.post('/book', async (req, res) => {
    try {
        const { patient, doctor, appointmentDate, time, notes } = req.body;
        
       
        const newAppointment = new Appointment({
            patient, doctor, appointmentDate, time, notes, status: 'Pending'
        });
        await newAppointment.save();

        
        const doctorProfile = await Doctor.findById(doctor); 
        
        
        const doctorUserId = (doctorProfile && doctorProfile.user) ? doctorProfile.user : doctor;
        
        
        const doctorNotification = new Notification({
            userId: doctorUserId, 
            message: `New appointment booked by patient. Date: ${appointmentDate}`,
            type: 'appointment',
            isRead: false
        });
        await doctorNotification.save();

        const patientNotification = new Notification({
            userId: patient, 
            message: `Your appointment request for ${appointmentDate} is pending.`,
            type: 'appointment',
            isRead: false
        });
        await patientNotification.save();

        
        const io = req.app.get('io');
        if (io) {
            io.to(doctorUserId.toString()).emit('newNotification', doctorNotification);
            io.to(patient.toString()).emit('newNotification', patientNotification);
        }

        res.status(201).json({ message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error("BOOKING ERROR:", error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/all', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('patient', 'fullName email').populate('doctor', 'name specialization');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/dashboard-stats', async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: { $regex: /^pending$/i } });
        const confirmedAppointments = await Appointment.countDocuments({ status: { $regex: /^confirmed$/i } });
        const cancelledAppointments = await Appointment.countDocuments({ status: { $regex: /^cancelled$/i } });
        
        let totalPatients = await User.countDocuments({ role: 'patient' });
        
        res.status(200).json({
            totalAppointments, totalDoctors, totalPatients,
            pendingCount: pendingAppointments,
            pieChart: { confirmed: confirmedAppointments, pending: pendingAppointments, cancelled: cancelledAppointments }
        });
    } catch (error) {
        res.status(500).json({ message: 'Dashboard error', error: error.message });
    }
});

router.get('/patient-stats/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const totalAppointments = await Appointment.countDocuments({ patient: patientId });
        const pendingCount = await Appointment.countDocuments({ patient: patientId, status: { $regex: /^pending$/i } });
        res.status(200).json({ totalAppointments, pendingCount });
    } catch (error) {
        res.status(500).json({ message: 'Patient stats error', error: error.message });
    }
});


router.put('/update/:id', async (req, res) => {
    try {
        const updated = await Appointment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json({ message: 'Updated!', appointment: updated });
    } catch (error) {
        res.status(500).json({ message: 'Update error', error: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Delete error', error: error.message });
    }
});

module.exports = router;                 