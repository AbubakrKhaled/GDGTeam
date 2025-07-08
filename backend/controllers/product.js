const ErrorResponse = require('../middlewares/errorresponse');
const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const Product = require("../models/product.js");

// check if the product already exists
exports.createProduct = async (req, res,next) => {
    try{
        const {
            productname, price, quantity, imageURL, description, category, color, size, discount
        } = req.body;
        const ratings = 0;

        const product = await Product.create({
            productname, price, quantity, imageURL, description, ratings: 0,
            category: Types.ObjectId(category),
            color: Types.ObjectId(color),
            size: Types.ObjectId(size),
            discount: Types.ObjectId(discount),
            brand: req.user.id
        });

        res.status(201).json({success: true, data: product});
    }catch(err){
        next(err);
    }
}

// here search for the product by id and if it exists, update it dont update the product if it does not exist
exports.updateProduct = async (req, res) => {
    const id = req.params.id;
    const {
            productname, price, quantity, imageURL, description, category, color, size, discount
        } = req.body;
    try{
        const product = await Product.findByIdAndUpdate(id, {
            productname, price, quantity, imageURL, description,
            category: Types.ObjectId(category),
            color: Types.ObjectId(color),
            size: Types.ObjectId(size),
            discount: Types.ObjectId(discount),       
        }, {new: true});

        if (!product) {
        return next(new ErrorResponse('Product not found', 404));
        }

        res.status(201).json({success: true, data: product});

    }catch(err){
        next(err);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const product = await Product.find({ brand: req.user.id });

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