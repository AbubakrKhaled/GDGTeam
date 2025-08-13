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
            productname, price, quantity, imageURL, description, category, color, size, discountAmount, isDiscountValid
        } = req.body;
        const reviews = 0;

        const existingProduct = await Product.findOne({productname, brand: req.brand.id});
        
        if (existingProduct) {return next(new ErrorResponse('Product already exists', 400));}

        const product = await Product.create({
            productname, price, quantity, imageURL, description, reviews: 0, discountAmount, isDiscountValid,
            category: Types.ObjectId(category),
            color: Types.ObjectId(color),
            size: Types.ObjectId(size),
            brand: req.brand.id
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
            productname, price, quantity, imageURL, description, category, color, size, discountAmount, isDiscountValid
        } = req.body;
    try{
        const product = await Product.findByIdAndUpdate(id, {
            productname, price, quantity, imageURL, description, discountAmount, isDiscountValid,
            category: Types.ObjectId(category),
            color: Types.ObjectId(color),
            size: Types.ObjectId(size),
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
        // Get query parameters for filtering
        const { category, priceRange, search } = req.query;
        
        let filter = { isActive: true };
        
        // Apply category filter
        if (category) {
            filter.category = category;
        }
        
        // Apply search filter
        if (search) {
            filter.$or = [
                { productname: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter)
            .populate('brand', 'name')
            .populate('category', 'category')
            .populate('color', 'color')
            .populate('size', 'size')
            .populate('reviews', 'rating count')
            .lean();

        // Apply price range filter after fetching (since price is a number)
        let filteredProducts = products;
        if (priceRange) {
            filteredProducts = products.filter(product => {
                switch (priceRange) {
                    case '0-50':
                        return product.price >= 0 && product.price <= 50;
                    case '50-100':
                        return product.price > 50 && product.price <= 100;
                    case '100-200':
                        return product.price > 100 && product.price <= 200;
                    case '200+':
                        return product.price > 200;
                    default:
                        return true;
                }
            });
        }

        // Transform the data to match frontend expectations
        const transformedProducts = filteredProducts.map(product => ({
            _id: product._id,
            productname: product.productname,
            price: product.price,
            quantity: product.quantity,
            imageURL: Array.isArray(product.imageURL) ? product.imageURL[0] : product.imageURL,
            description: product.description,
            category: product.category?.category || 'Unknown',
            color: product.color?.color || 'Unknown',
            size: product.size?.size || 'Unknown',
            brand: product.brand,
            reviews: {
                rating: product.reviews?.rating || 0,
                count: product.reviews?.count || 0
            },
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));

        res.status(200).json({success: true, data: transformedProducts});

    } catch(err) {
        next(err);
    }
}

exports.getProductById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));
    
    try {
        const product = await Product.findById(id)
            .populate('brand', 'name')
            .populate('category', 'category')
            .populate('color', 'color')
            .populate('size', 'size')
            .populate('reviews', 'rating count')
            .lean();

        if (req.admin) {
            return res.status(200).json({ success: true, data: product });
        }else if (req.brand && product.brand._id.toString() !== req.brand.id && product.isActive === false) {
            return next(new ErrorResponse('Not your product', 403));
        }else if (req.brand && product.brand._id.toString() === req.brand.id) {
            return res.status(200).json({ success: true, data: product });
        }
              
        if (!product || !product.isActive) {
            return next(new ErrorResponse('Product not found', 404));
        }

        const finalPrice = product.isDiscountValid
      ? product.price - product.discountAmount
      : product.price;

        // Transform the data to match frontend expectations
        const transformedProduct = {
            _id: product._id,
            productname: product.productname,
            price: finalPrice,
            quantity: product.quantity,
            imageURL: Array.isArray(product.imageURL) ? product.imageURL : [product.imageURL],
            description: product.description,
            category: product.category?.category || 'Unknown',
            color: product.color?.color || 'Unknown',
            size: product.size?.size || 'Unknown',
            brand: product.brand,
            reviews: {
                rating: product.reviews?.rating || 0,
                count: product.reviews?.count || 0
            },
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
        
        res.status(200).json({success: true, data: transformedProduct});

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
        await Product.findByIdAndUpdate(id, { isActive: false });

        res.status(200).json({success: true, data: {}});
    } catch(err){
        next(err);
    }
}