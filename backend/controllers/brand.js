const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Brand = require("../models/brand.js");
const Product = require("../models/product.js");
const ErrorResponse = require('../middlewares/errorresponse');
const { Schema, model, Types } = mongoose;



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
exports.createBrand = async (req, res) => {
    try{
        const {
            brandname, email, categories, phonenumber, page, brandlocation, logoURL, deliveryTime,
            payment, description, products
        } = req.body;
        const isApproved = false;
        const ratings = 0;
        const role = 'brand';

        const brand = await Brand.create({
            brandname, email, categories, phonenumber, page, brandlocation, logoURL, deliveryTime,
            payment, description, isApproved, ratings, products, role
        });

        res.status(201).json({success: true, data: brand});
    }catch(err){
        next(err);
    }
}

exports.updateBrand = async (req, res, next) => {
    const id = req.params.id;

    if (req.brand.role !== 'brand' || req.brand.id !== id) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    const {
        brandname, email, categories, phonenumber, page, brandlocation, logoURL,
        deliveryTime, payment, description, products
    } = req.body;

    try {
        const brand = await Brand.findByIdAndUpdate(id, {
            brandname, email, categories, phonenumber, page, brandlocation,
            logoURL, deliveryTime, payment, description, products
        }, { new: true });

        if (!brand) return next(new ErrorResponse('Brand not found', 404));

        res.status(201).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
};

exports.getBrandById = async (req, res, next) => {
    const id = req.params.id;

    if (req.brand.role !== 'brand' || req.brand.id !== id) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    try {
        const brand = await Brand.findById(id);
        if (!brand) return next(new ErrorResponse('Brand not found', 404));

        res.status(200).json({ success: true, data: brand });
    } catch (err) {
        next(err);
    }
};

