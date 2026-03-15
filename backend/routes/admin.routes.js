const express = require('express');
const router = express.Router();
const {
    login, getStats,
    createEvent, deleteEvent,
    createResource, deleteResource,
    getMembers, getMessages, getRegistrations
} = require('../controllers/admin.controller');
const {
    getProblemsAdmin, createProblem, updateProblem, deleteProblem
} = require('../controllers/problem.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', login);

// Protected routes
router.get('/stats', protect, getStats);

// Events
router.post('/events', protect, createEvent);
router.delete('/events/:id', protect, deleteEvent);

// Resources
router.post('/resources', protect, createResource);
router.delete('/resources/:id', protect, deleteResource);

// Problems
router.get('/problems', protect, getProblemsAdmin);
router.post('/problems', protect, createProblem);
router.put('/problems/:id', protect, updateProblem);
router.delete('/problems/:id', protect, deleteProblem);

// Collections view
router.get('/members', protect, getMembers);
router.get('/messages', protect, getMessages);
router.get('/registrations', protect, getRegistrations);

module.exports = router;
