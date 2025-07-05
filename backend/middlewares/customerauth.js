const jwt = require('jsonwebtoken');

const customerAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: 'Not authorized as customer' });
    }
    req.customer = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized or invalid token' });
  }
};

module.exports = customerAuth;
