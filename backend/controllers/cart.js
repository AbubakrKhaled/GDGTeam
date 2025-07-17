const mongoose = require('mongoose');
const Customer = require('../models/customer');
const ErrorResponse = require('../middlewares/errorresponse');
const { Schema, model, Types } = mongoose;
const Product = require("../models/product.js");

//Wishlist ------------------------------------------------------------------------
exports.getWishlist = async (req, res, next) => {
    try {
        const id = req.customer.id;
        const user = await Customer.findById(id).populate({ path: 'wishlist'}).exec();

        if (!user || !user.wishlist) {
            return res.status(404).json({ message: 'Wishlist not found.' });
        }
        if(user.wishlist.length === 0){
            return res.status(200).json({ message: 'Wishlist is empty.' });
        }
        res.status(200).json({ wishlist: user.wishlist });
    } catch (err) {
        next(err)
    }
};

exports.addToWishlist = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.customer.id;
        const productExists = await Product.findById(productId);
        if (!productExists) 
            return res.status(404).json({ message: 'Product not found.' });

        const user = await Customer.findById(userId);
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ message: 'Product is already in wishlist.' });
        }

        user.wishlist.push(productId);
        await user.save();
        res.status(200).json({ message: 'Product added to wishlist.', wishlist: user.wishlist });
    } catch (err) {
        next(err)
    }
};

exports.deleteWishlistProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.customer.id;

        const user = await Customer.findById(userId);

        if (!user.wishlist.includes(productId)) {
            return res.status(404).json({ message: 'Product not found in wishlist.' });
        }

        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);

        await user.save();

        res.status(200).json({ message: 'Product removed from wishlist.', wishlist: user.wishlist });
    } catch (err) {
        next(err)
    }
};

//Cart ------------------------------------------------------------------
exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await Tourist.findById(userId).populate({ path: 'cart.product' }).exec();

        if (!user || !user.cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve cart.' });
    }
};