const Problem = require('../models/Problem');

// @desc    Get all problems (Admin view)
// @route   GET /api/admin/problems
exports.getProblemsAdmin = async (req, res) => {
    try {
        const problems = await Problem.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: problems.length, data: problems });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a new problem
// @route   POST /api/admin/problems
exports.createProblem = async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(201).json({ success: true, data: problem });
    } catch (error) {
        console.error('Create problem error:', error);
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

// @desc    Update a problem
// @route   PUT /api/admin/problems/:id
exports.updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!problem) {
            return res.status(404).json({ success: false, error: 'Problem not found' });
        }
        res.status(200).json({ success: true, data: problem });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

// @desc    Delete a problem
// @route   DELETE /api/admin/problems/:id
exports.deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndDelete(req.params.id);
        if (!problem) {
            return res.status(404).json({ success: false, error: 'Problem not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
