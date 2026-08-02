const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');


router.post('/add', async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        await newNotification.save();
        
       
        const io = req.app.get('io'); 
        if (io) {
            io.emit('newNotification', newNotification);
        }
        
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const mongoose = require('mongoose');

router.get('/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        
       
        const notifications = await Notification.find({
            $or: [
                { userId: id }, 
                { userId: new mongoose.Types.ObjectId(id) } 
            ]
        }).sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        
        
        const notifications = await Notification.find({ userId: id }).sort({ createdAt: -1 });
        res.json(notifications);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );
        res.status(200).json(updatedNotification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

module.exports = router;