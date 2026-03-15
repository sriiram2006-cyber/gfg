const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const Member = require('../models/Member');
const Message = require('../models/Message');
const Registration = require('../models/Registration');

const JWT_SECRET = process.env.JWT_SECRET || 'gfg-rit-admin-secret-2026';

// @desc    Admin login
// @route   POST /api/admin/login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Please provide username and password' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const [events, resources, members, messages, registrations] = await Promise.all([
            Event.countDocuments(),
            Resource.countDocuments(),
            Member.countDocuments(),
            Message.countDocuments(),
            Registration.countDocuments()
        ]);
        res.status(200).json({ success: true, data: { events, resources, members, messages, registrations } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- EVENTS CRUD ---
exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- RESOURCES CRUD ---
exports.createResource = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json({ success: true, data: resource });
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- MEMBERS ---
exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: members.length, data: members });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- MESSAGES ---
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// --- REGISTRATIONS ---
exports.getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
