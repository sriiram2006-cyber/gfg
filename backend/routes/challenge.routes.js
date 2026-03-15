const express = require('express');
const router = express.Router();
const { getChallenges, getChallenge, submitChallenge } = require('../controllers/challenge.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getChallenges);
router.get('/:id', getChallenge);
router.post('/:id/submit', protect, submitChallenge);

module.exports = router;
