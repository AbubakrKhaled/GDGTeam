const Brand = require("../models/brand");
const Product = require("../models/product");

exports.createBrand = async (req, res) => {
    try{
        const brandname = req.body.brandname;
        const email = req.body.email;
        const categories = req.body.categories;
        const phonenumber = req.body.phonenumber;
        const page = req.body.page;
        const brandlocation = req.body.brandlocation;
        const logoURL = req.body.logoURL;
        const deliveryTime = req.body.deliveryTime;
        const payment = req.body.payment;
        const description = req.body.description;
        const isApproved = false;
        const ratings = 0;
        const products = req.body.products;
        const role = brand;
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