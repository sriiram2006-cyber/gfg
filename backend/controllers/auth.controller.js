const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const JWT_SECRET = process.env.JWT_SECRET || 'gfg-rit-member-secret-2026';

// @desc    Register a member
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, branch, year } = req.body;

        // Check if member already exists
        let member = await Member.findOne({ email });
        if (member) {
            return res.status(400).json({ success: false, error: 'Member already registered with this email' });
        }

        // Domain validation
        if (!email.endsWith('@ritchennai.edu.in')) {
            return res.status(400).json({ success: false, error: 'Only college emails (@ritchennai.edu.in) are allowed' });
        }

        member = await Member.create({
            name,
            email,
            password,
            branch,
            year
        });

        const token = jwt.sign({ id: member._id, role: 'member' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            token,
            member: {
                id: member._id,
                name: member.name,
                email: member.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

// @desc    Login a member
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const member = await Member.findOne({ email }).select('+password');
        if (!member) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // We can't use .select('+password') directly if it's not in schema with select:false, 
        // but Member model doesn't have select:false, so it's always there.
        const isMatch = await require('bcryptjs').compare(password, member.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: member._id, role: 'member' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            token,
            member: {
                id: member._id,
                name: member.name,
                email: member.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get current logged in member
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const member = await Member.findById(req.user.id);
        res.status(200).json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
