const ErrorResponse = require('../middlewares/errorresponse');
const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const Product = require("../models/product.js");

exports.createProduct = async (req, res,next) => {
    if (req.customer) {
    return next(new ErrorResponse('Not authorized as customer', 403));
    }
    try{
        const {
            productname, price, quantity, imageURL, description, category, color, size, discount
        } = req.body;
        const reviews = 0;

        const existingProduct = await Product.findOne({productname, brand: req.user.id});
        
        if (existingProduct) {return next(new ErrorResponse('Product already exists', 400));}

        const product = await Product.create({
            productname, price, quantity, imageURL, description, reviews: 0,
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

exports.updateProduct = async (req, res, next) => {
    const id = req.params.id;
    if (req.customer) {
    return next(new ErrorResponse('Not authorized as customer', 403));
    }
    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));
    
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

        res.status(200).json({success: true, data: product});

    }catch(err){
        next(err);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const filter = { isActive: true };
        if (req.user.role === 'brand') filter.brand = req.user.id;

        const products = await Product.find(filter);

        res.status(200).json({success: true, data: products});

    } catch(err) {
        next(err);
    }
}

exports.getProductById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));
    
    try {
        const product = await Product.findById(id);
        if (req.admin) {
            return res.status(200).json({ success: true, data: product });
        }

        if (req.brand && product.brand.toString() !== req.brand.id && product.isActive === false) {
            return next(new ErrorResponse('Not your product', 403));
        }
        if (req.brand && product.brand.toString() === req.brand.id) {
            return res.status(200).json({ success: true, data: product });
        }
              
        if (!product || !product.isActive) {
        return next(new ErrorResponse('Product not found', 404));
        }
        
        res.status(200).json({success: true, data: product});

    } catch(err) {
        next(err);
    }
}

exports.activateProduct = async (req, res, next) => {
    const id = req.params.id;
    if (req.customer) {
    return next(new ErrorResponse('Not authorized as customer', 403));
    }

    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));
    
    try {
        const product = await Product.findById(id);

        if (!product) {
        return next(new ErrorResponse('Product not found', 404));
        }
        if (req.brand && product.brand.toString() !== req.brand.id) {
        return next(new ErrorResponse('Not your product', 403));
        }
        //await Product.findByIdAndDelete(id);
        await Product.findByIdAndUpdate(id, { isActive: true });

        res.status(200).json({success: true, data: {}});
    } catch(err){
        next(err);
    }
}

exports.deactivateProduct = async (req, res, next) => {
    const id = req.params.id;
    if (req.customer) {
    return next(new ErrorResponse('Not authorized as customer', 403));
    }

    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));
    
    try {
        const product = await Product.findById(id);

        if (!product) {
        return next(new ErrorResponse('Product not found', 404));
        }
        if (req.brand && product.brand.toString() !== req.brand.id) {
        return next(new ErrorResponse('Not your product', 403));
        }

        //await Product.findByIdAndDelete(id);
        await Product.findByIdAndUpdate(id, { isActive: false });

        res.status(200).json({success: true, data: {}});
    } catch(err){
        next(err);
    }
}