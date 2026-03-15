const Leaderboard = require('../models/Leaderboard');
const Member = require('../models/Member');

// @desc    Get top students on leaderboard
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
    try {
        // Fetch top members by score
        const members = await Member.find().sort({ score: -1 }).limit(10);
        
        // Map members to the format expected by the frontend leaderboard
        const rankedBoard = members.map((member, index) => ({
            studentName: member.name,
            points: member.score,
            rank: index + 1
        }));

        res.status(200).json({ success: true, data: rankedBoard });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add or update points for a student
// @route   POST /api/leaderboard/update
// @access  Private/Admin
exports.updateLeaderboard = async (req, res) => {
    try {
        const { studentName, points } = req.body;

        let student = await Leaderboard.findOne({ studentName });

        if (student) {
            student.points += points;
            await student.save();
        } else {
            student = await Leaderboard.create({ studentName, points });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
