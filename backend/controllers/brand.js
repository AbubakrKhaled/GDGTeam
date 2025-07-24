const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Brand = require("../models/brand.js");
const Product = require("../models/product.js");
const ErrorResponse = require('../middlewares/errorresponse');
const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const hashPassword = require('../middlewares/hashPassword');
const Order = require('../models/order.js');

//brand logging in ***************************************************************************
exports.brandLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const brand = await Brand.findOne({ email }).select('+password');
        if (!brand)
            return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, brand.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: brand._id, role: 'brand' }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};
//************************************************************************************************
exports.getAllBrands = async (req, res, next) => {
    try{
        const brands = await Brand.find({isApproved : true, isActive : true})
        res.status(200).json({ success: true, data: brands });

    } catch (err) {
        next(err);
    }
}

exports.createBrand = async (req, res, next) => {
    try{
        const {
            name, email, phonenumber, categories, page, brandlocation, logoURL, deliveryTime,
            description, products, password
        } = req.body;
        const isApproved = false;
        const ratings = 0;
        const role = 'brand';

        const hashed = await hashPassword(password);

        const brand = await Brand.create({
            name, email, categories, phonenumber, page, brandlocation, logoURL, deliveryTime,
            description, isApproved, ratings, products, role,
            password: hashed
        });

        res.status(201).json({success: true, data: brand});
    } catch (err) {
        next(err);
    }
}

exports.updateBrand = async (req, res, next) => {
    const id = req.brand._id;

    if (!mongoose.isValidObjectId(id.toString()))
        return next(new ErrorResponse('Invalid ID', 400));
    
    if (req.brand.role !== 'brand' || req.brand._id.toString() !== id) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    const {
        name, email, categories, phonenumber, page, brandlocation, logoURL,
        deliveryTime, description, products, password
    } = req.body;
    
    const updateFields = {
        name, email, categories, phonenumber, page, brandlocation,
        logoURL, deliveryTime, description, products,
    }

    if (password) {
        updateFields.password = await hashPassword(req.body.password);
    }

    try {
        const brand = await Brand.findByIdAndUpdate(id, updateFields, { new: true });

        if (!brand) return next(new ErrorResponse('Brand not found', 404));

        res.status(200).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
};

exports.getBrandById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));

    try {
        const brand = await Brand.findById(id);
        if (!brand) return next(new ErrorResponse('Brand not found', 404));

        const products = await Product.find({ brand: id, isActive: true });

        res.status(200).json({
            success: true,
            data: { brand, products }
        });
    } catch (err) {
        next(err);
    }
};

exports.getBrandProfile = async (req, res, next) => {
    //const id = req.params.id;
    const id = req.brand._id

    if (!mongoose.isValidObjectId(id.toString()))
        return next(new ErrorResponse('Invalid ID', 400));

    try {
        const brand = await Brand.findById(id);
        if (!brand) return next(new ErrorResponse('Brand not found', 404));

        const products = await Product.find({ brand: id });
        const orders = await Order.find({ brand: id });

        res.status(200).json({
            success: true,
            data: { brand, products, orders }
        });
    } catch (err) {
        next(err);
    }
};



exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({success: true, data: products});

    } catch(err) {
        next(err);
    }
}
