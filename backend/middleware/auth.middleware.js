const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gfg-rit-admin-secret-2026';

exports.protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token invalid or expired' });
    }
};
