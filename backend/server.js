const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Route files
const events = require('./routes/events.routes');
const leaderboard = require('./routes/leaderboard.routes');
const contact = require('./routes/contact.routes');
const roadmap = require('./routes/roadmap.routes');
const community = require('./routes/community.routes');
const mentor = require('./routes/mentor.routes');

// Mount routers
app.use('/api/events', events);
app.use('/api/leaderboard', leaderboard);
app.use('/api/contact', contact);
app.use('/api/roadmap', roadmap);
app.use('/api/community', community);
app.use('/api/mentor', mentor);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
