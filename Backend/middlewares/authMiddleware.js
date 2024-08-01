const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const { decode } = require('punycode');

const authMiddleware = (allowedRoles = []) => async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded)
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Access denied. User not found.' });
        }
        console.log(allowedRoles)
        console.log(user.role)
        // console.log(allowedRoles.length)

        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }

        req.user = user;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
