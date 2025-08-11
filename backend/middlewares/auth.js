const jwt = require('jsonwebtoken');
const Token = require('../models/token');

const authByRole = (role) => {
    return async (req, res, next) => {
        // Check for token in cookies first, then headers
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== role) {
                return res.status(403).json({ message: `Not authorized as ${role}` });
            }
            const dbToken = await Token.findOne({ token });
            if (!dbToken) return res.status(403).json({ message: 'Login first' });
            if (dbToken.blackListedToken) {
                // Clear cookie if token is blacklisted
                res.clearCookie('token');
                return res.status(403).json({ message: 'You are blocked, You cannot perform this request' });
            }
            req[role] = decoded;
            next();
        } catch (err) {
            // Clear cookie if token is invalid
            res.clearCookie('token');
            return res.status(403).json({ message: 'Unauthorized or invalid token' });
        }
    };
};

const authAny = async (req, res, next) => {
    // Check for token in cookies first, then headers
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const dbToken = await Token.findOne({ token });
        if (!dbToken) {
            res.clearCookie('token');
            return res.status(403).json({ message: 'Login first' });
        }
        if (dbToken.blackListedToken) {
            res.clearCookie('token');
            return res.status(403).json({ message: 'You are blocked, You cannot perform this request' });
        }
        const role = decoded.role;
        if (!['admin', 'brand', 'customer'].includes(role)) {
            res.clearCookie('token');
            return res.status(403).json({ message: 'Invalid role' });
        }
        req[role] = { id: decoded.id };
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.status(403).json({ message: 'Unauthorized or invalid token' });
    }
};

// Helper function to set cookie
const setCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

module.exports = {
    adminAuth: authByRole('admin'),
    brandAuth: authByRole('brand'),
    customerAuth: authByRole('customer'),
    authAny,
    setCookie
};
