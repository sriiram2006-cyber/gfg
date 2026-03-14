const { generateAIResponse } = require('../services/groq.service');

// @desc    Ask the AI Mentor a coding question
// @route   POST /api/mentor
// @access  Public
exports.askMentor = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ success: false, error: 'Please provide a question' });
        }

        const answer = await generateAIResponse(question);

        res.json({ success: true, answer });
    } catch (error) {
        console.error('Mentor AI Error:', error.message);
        res.status(500).json({ success: false, error: 'AI service unavailable. Please try again.' });
    }
};
