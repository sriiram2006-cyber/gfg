const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve admin portal as static
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Route files
const events = require('./routes/events.routes');
const leaderboard = require('./routes/leaderboard.routes');
const contact = require('./routes/contact.routes');
const roadmap = require('./routes/roadmap.routes');
const community = require('./routes/community.routes');
const mentor = require('./routes/mentor.routes');
const resources = require('./routes/resources.routes');
const admin = require('./routes/admin.routes');
const auth = require('./routes/auth.routes');
const challenges = require('./routes/challenge.routes');

// Mount routers
app.use('/api/events', events);
app.use('/api/leaderboard', leaderboard);
app.use('/api/contact', contact);
app.use('/api/roadmap', roadmap);
app.use('/api/community', community);
app.use('/api/mentor', mentor);
app.use('/api/resources', resources);
app.use('/api/admin', admin);
app.use('/api/auth', auth);
app.use('/api/challenges', challenges);

const PORT = process.env.PORT || 5000;

// API Status Route (Moved from root)
app.get('/api/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'GeeksforGeeks RIT Campus Club API is running! 🚀',
        version: '1.0.0'
    });
});

// Admin Redirect
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/login.html'));
});

// Fallback for API 404s and SPA index
app.use((req, res, next) => {
    // If it's an API route that didn't match, send 404
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({ success: false, message: 'API Endpoint not found' });
    }
    // Otherwise, let static middleware handle it
    next();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
