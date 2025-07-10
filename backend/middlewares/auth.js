const jwt = require('jsonwebtoken');

const authByRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role) {
        return res.status(403).json({ message: `Not authorized as ${role}` });
      }
      req[role] = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Unauthorized or invalid token' });
    }
  };
};

module.exports = {
  adminAuth: authByRole('admin'),
  brandAuth: authByRole('brand'),
  customerAuth: authByRole('customer'),
};
