const Message = require('../models/Message');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'Please provide all fields' });
        }

        const newMessage = await Message.create({
            name,
            email,
            message
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
