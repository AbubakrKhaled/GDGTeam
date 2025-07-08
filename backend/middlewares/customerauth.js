 const isAuth = require('./isAuth'); // adjust the path as needed

// Factory returns a middleware restricted to "customer" role
const customerAuth = (req, res, next) =>
  isAuth('customer')(req, res, () => {
    // Optional alias so existing code that reads req.customer still works
    req.customer = req.user;
    next();
  });

module.exports = customerAuth;
