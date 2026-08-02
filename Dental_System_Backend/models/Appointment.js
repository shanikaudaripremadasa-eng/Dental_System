const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
   
    time: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'No Show'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', AppointmentSchema);