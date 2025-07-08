const isAuth = require('./isAuth'); // adjust path if this file lives elsewhere

// Factory returns an Express middleware that accepts only 'brand' users
const brandAuth = (req, res, next) =>
  isAuth('brand')(req, res, () => {
    // optional alias so legacy controllers can read req.brand
    req.brand = req.user;
    next();
  });

module.exports = brandAuth;
