// what is isModified ??
const bcrypt = require('bcryptjs');
const {brand} = require('../models/brand'); // Adjust the path as necessary

module.exports = async function hashPassword(next) {
  // Only hash if the password field was added or changed
  brand.isModified('password');
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();           // call once, whether we hashed or not
};
