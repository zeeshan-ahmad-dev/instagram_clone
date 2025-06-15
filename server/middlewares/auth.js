
const jwt = require('jsonwebtoken');
const secret = 'secretKey';

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
    }
    try {
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (error) {
        console.error('JWT verification failed:', error); 
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
    }
}

module.exports = authMiddleware;