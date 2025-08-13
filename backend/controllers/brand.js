const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Brand = require("../models/brand.js");
const Product = require("../models/product.js");
const Token = require('../models/token');
const ErrorResponse = require('../middlewares/errorresponse');
const mongoose = require('mongoose');
const hashPassword = require('../middlewares/hashPassword');
const Order = require('../models/order.js');

// Helper function to set cookie
const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    });
};

// Helper function to generate token
const generateToken = async (brandId) => {
    const token = jwt.sign(
        { id: brandId, role: 'brand' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    await Token.create({
            token,
            userId: brandId,
            userType: 'brand'
        });
        
    return token;
};

// Brand Authentication Controllers
exports.brandLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find brand and validate password
        const brand = await Brand.findOne({ email }).select('+password');
        if (!brand || !(await bcrypt.compare(password, brand.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate and save token
        const token = await generateToken(brand._id);
        setTokenCookie(res, token);

        res.status(200).json({ 
            success: true,
            token,
            user: {
                id: brand._id,
                name: brand.name,
                email: brand.email,
                role: 'brand' ,
                isApproved : brand.isApproved,
            }
        });
    } catch (err) {
        next(err);
    }
};

// Brand CRUD Operations
exports.createBrand = async (req, res, next) => {
    try {
        const {
            name, email, phonenumber, categories, page, brandlocation, logoURL,
            deliveryTime, description, products, password
        } = req.body;
        
        // Create brand with hashed password
        const brand = await Brand.create({
            name, email, categories, phonenumber, page, brandlocation, logoURL,
            deliveryTime, description, ratings: 0, products,
            role: 'brand', password: await hashPassword(password)
        });

        // Generate and save token
        const token = await generateToken(brand._id);
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            token,
            data: brand
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllBrands = async (req, res, next) => {
    try {
        const brands = await Brand.find({
            isApproved: true,
            isActive: true
        }).select('name logoURL categories');
        
        res.status(200).json({ success: true, data: brands });
    } catch (err) {
        next(err);
    }
};

exports.getBrandById = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(new ErrorResponse('Invalid ID', 400));
    }

    try {
        const brand = await Brand.findOne({
            _id: id,
            isApproved: true,
            isActive: true
        }).populate('reviews');

        if (!brand) {
            return next(new ErrorResponse('Brand not found', 404));
        }

        const products = await Product.find({
            brand: id,
            isActive: true
        }).populate('imageURL color category price productname');

        res.status(200).json({
            success: true,
            data: { brand, products }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateBrand = async (req, res, next) => {
    const id = req.brand._id;

    if (!mongoose.isValidObjectId(id.toString())) {
        return next(new ErrorResponse('Invalid ID', 400));
    }

    if (req.brand.role !== 'brand') {
        return res.status(403).json({ message: 'Not authorized' });
    }

    try {
        const {
            name, email, categories, phonenumber, page, brandlocation,
            logoURL, deliveryTime, description, products, password
        } = req.body;
        
        const updateFields = {
            name, email, categories, phonenumber, page, brandlocation,
            logoURL, deliveryTime, description, products
        };

        if (password) {
            updateFields.password = await hashPassword(password);
        }

        const brand = await Brand.findByIdAndUpdate(id, updateFields, { new: true });
        if (!brand) {
            return next(new ErrorResponse('Brand not found', 404));
        }

        res.status(200).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
};

exports.getBrandProfile = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id.toString())) {
        return next(new ErrorResponse('Invalid ID', 400));
    }

    try {
        const brand = await Brand.findById(id);
        if (!brand) {
            return next(new ErrorResponse('Brand not found', 404));
        }

        if (req.brand.id !== id && (brand.isApproved === false || brand.isActive === false)){
            return next(new ErrorResponse('Not authorized. Cant view inactive brand', 403));
        }
        else if (req.customer) {
            return next(new ErrorResponse('Not authorized.', 403));
        }
        
        const [products, orders] = await Promise.all([
            Product.find({ brand: id }),
            Order.find({ brand: id })
        ]);

        res.status(200).json({
            success: true,
            data: { brand, products, orders }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = exports;