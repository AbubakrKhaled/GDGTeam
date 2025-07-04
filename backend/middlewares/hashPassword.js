const bcrypt = require('bcryptjs');

module.exports = async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
};