const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
exports.getResources = async (req, res) => {
    try {
        const { category, level } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (level) filter.level = level;

        const resources = await Resource.find(filter).sort({ category: 1, title: 1 });
        res.status(200).json({ success: true, count: resources.length, data: resources });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
