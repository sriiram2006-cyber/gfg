const express = require('express');
const router = express.Router();
const { getLeaderboard, updateLeaderboard } = require('../controllers/leaderboard.controller');

// GET /api/leaderboard
router.get('/', getLeaderboard);

// POST /api/leaderboard/update
router.post('/update', updateLeaderboard);

module.exports = router;
