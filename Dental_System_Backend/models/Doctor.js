const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false 
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    availability: {
        type: [String], 
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', DoctorSchema);