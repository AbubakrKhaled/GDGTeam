const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Brand = require("../models/brand");
const Product = require("../models/product");

//brand logging in ***************************************************************************
exports.brandLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const brand = await Brand.findOne({ email });
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

        res.status(201).json({
            success: true,
            data: brand
        });
    }catch(err){
        errorHandler(err);
    }
}

exports.updateBrand = async (req, res) => {
    const {
            brandname, email, categories, phonenumber, page, brandlocation, logoURL, deliveryTime,
            payment, description, products
        } = req.body;
        const isApproved = false;
        const role = 'brand';
    try{
        const brand = await Brand.findByIdAndUpdate(id, {
            brandname, email, categories, phonenumber, page, brandlocation, logoURL, deliveryTime,
            payment, description, isApproved, products, role
        }, {new: true});

        res.status(201).json({
            success: true,
            data: brand
        });
    }catch(err){
        errorHandler(err);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const product = await Product.find();

        res.status(200).json({success: true, data: product});

    } catch(err) {
        next(err);
    }
}

exports.getProductById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);

        if (!product) {
        return next(new ErrorResponse('Product not found', 404));
        }

        res.status(200).json({success: true, data: product});

    } catch(err) {
        next(err);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);

        if (!product) {
        return next(new ErrorResponse('Product not found', 404));
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({success: true, data: {}});
    } catch(err){
        next(err);
    }
}