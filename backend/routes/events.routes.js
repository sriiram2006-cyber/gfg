const express = require('express');
const router = express.Router();
const { getEvents, registerEvent } = require('../controllers/events.controller');

// GET /api/events
router.get('/', getEvents);

// POST /api/events/register
router.post('/register', registerEvent);

module.exports = router;
