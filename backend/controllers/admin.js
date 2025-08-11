// controllers/admin.js
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const Admin   = require('../models/admin');      
const Brand   = require('../models/brand');
const Customer= require('../models/customer');
const Order   = require('../models/order');
const User = require('../models/User');
const Product = require('../models/product');
const Token = require('../models/token');
const ErrorResponse = require('../middlewares/errorresponse');
const mongoose = require('mongoose');

// Helper function to set cookie
const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    });
};

// Helper function to generate and save token
const generateToken = async (adminId) => {
    const token = jwt.sign(
        { id: adminId, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    await Token.create({
        token,
        userId: adminId,
        userType: 'admin'
    });
    
    return token;
};

/* --------------------------- Admin Auth --------------------------- */
exports.adminLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // 1. Fetch admin user
        const admin = await Admin.findOne({ username }).select('+password');
        if (!admin) return next(new ErrorResponse('Invalid credentials', 401));

        // 2. Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

        // 3. Generate and save token
        const token = await generateToken(admin._id);
        
        // 4. Set cookie
        setTokenCookie(res, token);

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        });
    } catch (err) {
        next(err);
    }
};

/*
exports.userLogin = async (req, res, next) => {
  const { email, password, type } = req.body;

  if (!email || !password || !type) {
    return next(new ErrorResponse('Please provide email, password, and type', 400));
  }

  let model;
  switch (type) {
    case 'customer':
      model = Customer;
      break;
    case 'brand':
      model = Brand;
      break;
    case 'admin':
      model = Admin;
      break;
    default:
      return next(new ErrorResponse('Invalid user type', 400));
  }

  try {
    const user = await model.findOne({ email }).select('+password');
    if (!user) return next(new ErrorResponse('Invalid credentials', 401));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

    const token = generateToken({ id: user._id, role: type });
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        role: type,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};
*/
exports.userLogout = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(200).json({ success: true, message: 'Already logged out' });

    await Token.findOneAndUpdate(
      { token },
      { blackListedToken: true },
      { upsert: true } //ensure token is stored as blacklisted
    );

    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

/*
exports.userLogout = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (token) {
            // Blacklist the token
            await Token.findOneAndUpdate(
                { token },
                { blackListedToken: true }
            );
            
            // Clear cookie
            res.clearCookie('token');
        }
        
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};
*/
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const users = await User.find();
    const products = await Product.find();
    const orders = await Order.find();

    const customers = users.filter(u => u.role === 'customer');
    const brands = users.filter(u => u.role === 'brand');

    const pendingBrands = brands.filter(b => !b.isApproved);
    const recentOrders = orders.slice(-5);
    const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({
      totalCustomers: customers.length,
      totalBrands: brands.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingBrands,
      recentOrders,
      revenue
    });
  } catch (error) {
    next(error);
  }
};

/* --------------------------- Brand CRUD -------------------------- */
// handle cases
exports.getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ success: true, data: brands });
  } catch (err) {
    next(err);
  }
};
/*
exports.getBrandById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return next(new ErrorResponse('Invalid ID', 400));

  try {
    const brand = await Brand.findById(id);
    if (!brand) return next(new ErrorResponse('Brand not found', 404));
    res.status(200).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};
*/
exports.brandApprove = async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, { isApproved: true }, { new: true });

    if (!brand) return next(new ErrorResponse('Brand not found', 404));
    res.status(200).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

exports.brandDisapprove = async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, { isApproved: false }, { new: true });

    if (!brand) return next(new ErrorResponse('Brand not found', 404));
    res.status(200).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

exports.activateBrand = async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, { isActive: true }, { new: true });
    
    if (!brand) return next(new ErrorResponse('Brand not found', 404));
    res.status(200).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

exports.deactivateBrand = async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, { isActive: false }, { new: true });
    
    if (!brand) return next(new ErrorResponse('Brand not found', 404));
    res.status(200).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

/* -------------------------- Customer CRUD ------------------------ */
exports.getAllCustomers = async (_req, res, next) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ success: true, data: customers });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return next(new ErrorResponse('Invalid ID', 400));

  try {
    const customer = await Customer.findById(id);
    if (!customer) return next(new ErrorResponse('Customer not found', 404));
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

exports.activateCustomer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByIdAndUpdate(id, { isActive: true }, { new: true });

    if (!customer) return next(new ErrorResponse('Customer not found', 404));
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

exports.deactivateCustomer = async (req, res, next) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!customer) return next(new ErrorResponse('Customer not found', 404));
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

/* ---------------------------- Orders ----------------------------- */

