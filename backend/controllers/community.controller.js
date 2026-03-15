const Member = require('../models/Member');

// @desc    Register a new community member
// @route   POST /api/community/join
// @access  Public
exports.joinCommunity = async (req, res) => {
    try {
        const { name, email, branch, year } = req.body;

        if (!name || !email || !branch || !year) {
            return res.status(400).json({ success: false, error: 'Please provide all fields' });
        }

        // Validate college email domain
        if (!email.endsWith('ritchennai.edu.in')) {
            return res.status(400).json({ success: false, error: 'Please use your @ritchennai.edu.in college email' });
        }

        // Check if already a member
        const existing = await Member.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, error: 'You are already a member!' });
        }

        const member = await Member.create({ name, email, branch, year });

        res.status(201).json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
