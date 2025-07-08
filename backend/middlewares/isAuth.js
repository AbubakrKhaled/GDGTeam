 const jwt = require('jsonwebtoken');

const valid_roles = require('../core/constants');


const isAuth = (req,res,next) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }

      req.user = decoded; // user info like id, role, etc.
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Unauthorized or invalid token' });
    }
  };
};

module.exports = isAuth;
