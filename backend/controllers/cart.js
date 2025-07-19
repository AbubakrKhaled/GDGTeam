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
        if (!productExists || !productExists.isActive) 
            return res.status(404).json({ message: 'Product not found or inactive.' });

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
exports.getCart = async (req, res, next) => {
    try {
        const id = req.customer.id;

        const user = await Customer.findById(id).populate({ path: 'cart.product' }).exec();

        if (!user || !user.cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        res.status(200).json({ cart: user.cart });
    } catch (err) {
        next(err)
    }
};

exports.addToCartFromWishlist = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.customer.id;
        const productExists = await Product.findById(productId);
        if (!productExists || !productExists.isActive) {
            return res.status(404).json({ message: 'Product not found or inactive.' });
        }
        if(productExists.quantity < 1){
            return res.status(400).json({ message: 'Product out of stock.' });
        }
        const user = await Customer.findById(userId);
        if (!user.wishlist.includes(productId)) {
            return res.status(400).json({ message: 'Product not in wishlist.' });
        }
        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (cartItem) {
            if(productExists.quantity < cartItem.quantity + 1){
                return res.status(400).json({ message: 'Quantity exceeds stock.' });
            }
            cartItem.quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1 });
        }
        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
        await user.save();
        res.status(200).json({ message: 'Product moved from wishlist to cart.', cart: user.cart });
    } catch (err) {
        next(err);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.customer.id;

        const productExists = await Product.findById(productId);
        if (!productExists || !productExists.isActive) {
            return res.status(404).json({ message: 'Product not found or inactive.' });
        }
        if (productExists.quantity < 1) {
            return res.status(400).json({ message: 'Product out of stock.' });
        }
        const user = await Customer.findById(userId);

        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (cartItem) {
            if (productExists.quantity < cartItem.quantity + 1) {
                return res.status(400).json({ message: 'Quantity exceeds stock.' });
            }
            cartItem.quantity += 1;
        } else {
            user.cart.push({ product: productId, quantity: 1 });
        }

        await user.save();

        res.status(200).json({ message: 'Product added to cart.', cart: user.cart });
    } catch (err) {
        next(err);
    }
};

exports.updateCartProductAmount = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { quantity } = req.body;
        const userId = req.customer.id;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1.' });
        }
        const productExists = await Product.findById(productId);
        if(productExists.quantity < quantity){
            return res.status(400).json({ message: 'Quantity exceeds stock.' });
        }
        const user = await Customer.findById(userId);
        const cartItem = user.cart.find(item => item.product.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        cartItem.quantity = quantity;

        await user.save();

        res.status(200).json({ message: 'Product quantity updated in cart.', cart: user.cart });
    } catch (err) {
        next(err);
    }
};

exports.deleteCartProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.customer.id;

        const user = await Customer.findById(userId);
        const cartItem = user.cart.find(item => item.product.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        user.cart = user.cart.filter(item => item.product.toString() !== productId);

        await user.save();

        res.status(200).json({ message: 'Product removed from cart.', cart: user.cart });
    } catch (err) {
        next(err);
    }
};