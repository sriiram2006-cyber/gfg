const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Note: Using the same protect middleware, but we'll need to handle roles if necessary
// Original protect middleware attaches admin ID to req.user.
// For members, we can create a separate middleware or update the existing one.

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
