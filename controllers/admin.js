const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME)
    return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({ token });
};
