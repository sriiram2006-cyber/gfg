const express = require('express');
const router = express.Router();
const { generateRoadmap } = require('../controllers/roadmap.controller');

// POST /api/roadmap
router.post('/', generateRoadmap);

module.exports = router;
