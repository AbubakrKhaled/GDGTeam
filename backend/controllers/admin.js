// controllers/admin.js
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const Admin   = require('../models/admin');      
const Brand   = require('../models/brand');
const Customer= require('../models/customer');
const Order   = require('../models/order');
const ErrorResponse = require('../middlewares/errorresponse');
const mongoose = require('mongoose');

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

    // 3. Issue JWT with role
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

/* --------------------------- Brand CRUD -------------------------- */
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
exports.brandApproval = async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, { isApproved: req.body.isApproved }, { new: true });

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

