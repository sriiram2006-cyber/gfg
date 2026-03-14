const express = require('express');
const router = express.Router();
const { joinCommunity } = require('../controllers/community.controller');

// POST /api/community/join
router.post('/join', joinCommunity);

module.exports = router;
