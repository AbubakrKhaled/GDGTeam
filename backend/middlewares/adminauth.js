// it is not common to have separate files for auth middlewares specially when you dont add any new logic
// you just change the condition to check if the user is admin or whatever role you want
// you can make this middleware more generic by passing the role as a parameter and then call it isAuth.


const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized or invalid token' });
  }
};

module.exports = adminAuth;
