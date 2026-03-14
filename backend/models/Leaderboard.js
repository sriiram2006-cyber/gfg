const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        unique: true
    },
    points: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
