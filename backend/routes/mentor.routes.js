const express = require('express');
const router = express.Router();
const { askMentor } = require('../controllers/mentor.controller');

// POST /api/mentor
router.post('/', askMentor);

module.exports = router;
