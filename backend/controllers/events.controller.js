const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Register for an event
// @route   POST /api/events/register
// @access  Public
exports.registerEvent = async (req, res) => {
    try {
        const { studentName, email, department, eventId } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Check if already registered
        const existingReg = await Registration.findOne({ email, eventId });
        if (existingReg) {
            return res.status(400).json({ success: false, error: 'Already registered for this event' });
        }

        const registration = await Registration.create({
            studentName,
            email,
            department,
            eventId
        });

        res.status(201).json({ success: true, data: registration });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
