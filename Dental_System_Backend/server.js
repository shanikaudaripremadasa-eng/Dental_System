const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST", "PUT", "DELETE"] 
    }
});

app.use(cors()); 
app.use(express.json());


app.set('io', io); 


app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

io.on('connection', (socket) => {
    console.log('✅ A user connected: ' + socket.id);

    socket.on('join', (userId) => {
        if (userId) {
            socket.join(userId); 
            console.log(`✅ User ${userId} joined room!`);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ A user disconnected: ' + socket.id);
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected! ✅'))
    .catch((err) => console.error('DB Error ❌:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}... 🚀`);
});