const ErrorResponse = require('../middlewares/errorresponse');
const Order   = require('../models/order');
const Product = require('../models/product');
const Customer= require('../models/customer');
const mongoose = require('mongoose');

exports.getOrders = async (req, res, next) => {
  try {
    let orders;

    if (req.admin) {
        orders = await Order.find().populate('products.product');
    } 
    else if (req.brand) {
        orders = await Order.find({brand: req.brand.id}).populate('products.product');
    } 
    else if (req.customer) {
      orders = await Order.find({ customer: req.customer.id }).populate('products.product');
    } 
    else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));
    
    try {
        const order = await Order.findById(id).populate('products.product');
        if (!order || !order.isActive) {
            return next(new ErrorResponse('Order not found', 404));
        }
        
        if (req.admin) {
            return res.status(200).json({ success: true, data: order });
        }

        if (req.brand && order.brand.toString() !== req.brand.id) {
            return next(new ErrorResponse("Not your brand's order", 403));
        }
        if (req.brand && order.brand.toString() === req.brand.id) {
            return res.status(200).json({ success: true, data: order });
        } 
        
        if (req.customer && order.customer.toString() !== req.customer.id) {
            return next(new ErrorResponse("Not your order", 403));
        }
        if (req.customer && order.customer.toString() === req.customer.id) {
            return res.status(200).json({ success: true, data: order });
        }

        return res.status(403).json({ message: 'Please make an account' });

    } catch(err) {
        next(err);
    }
}

exports.updateOrderStatus = async (req, res, next) => {
    const {id} = req.params;
    const {status} = req.body;
    
    try {
        const order = await Order.findByIdAndUpdate(id, {status}, {new: true});
        if (!order) return next(new ErrorResponse('Order not found', 404));


        if (req.customer && req.customer.id !== order.customer.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (req.brand && req.brand.id !== order.brand.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        order.status = status;
        await order.save();
        
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

exports.deactivateOrder = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));
    
    try {
        const order = await Order.findById(id).populate('products.product');

        if (!order) {
        return next(new ErrorResponse('Order not found', 404));
        }
        if (req.customer.id === order.customer.toString() && order.status.toString() === "Pending") {
            order.status = 'Cancelled';
            await order.save();
            return res.status(200).json({success: true, data: order});
        }
   
        if (req.brand.id === order.products[0].product.brand.toString() && order.status.toString() === "Pending") {
            order.status = 'Cancelled';
            await order.save();
            return res.status(200).json({success: true, data: order});
        }
        
        return next(new ErrorResponse('Order status not pending or unauthorized', 403));


    } catch(err){
        next(err);
    }
}

exports.checkoutOrder = async (req,res,next) => {
    try{
        const id = req.customer.id;
        const deliveryAddress = req.customer.address
        const user = await Customer.findById(id).populate('cart.product');
        const brand = user.cart[0].product.brand;

        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'No products in the cart to create an order.' });
        }

        let totalPrice = 0;
        const products = [];
        
        for (const cartItem of user.cart) { 
            const product = cartItem.product; 
 
            if (!product) { 
                return res.status(404).json({ message: 'Product not found in cart.' }); 
            } 
 
            if (cartItem.quantity > product.quantity) { 
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` }); 
            } 
 
            products.push({ 
                product: product._id, 
                quantity: cartItem.quantity, 
                price: product.price 
            }); 

            const finalPrice = product.isDiscountValid
            ? product.price - product.discountAmount
            : product.price;

            
            totalPrice += cartItem.quantity * finalPrice; 
        } 
        

        const newOrder = new Order({ 
            customer: id, 
            brand,
            products, 
            totalPrice, 
            deliveryAddress, 
            status: 'Pending', 
            //paymentMethod: 'none', 
            isActive: true, 
        }); 
        await newOrder.save();


        for (const cartItem of user.cart) { 
            const product = cartItem.product; 
            product.quantity -= cartItem.quantity;
            if(product.quantity === 0){ 
                console.log(product + "is out of stock") ; 
            } 
            await product.save(); 
        } 
        user.cart = []; 
        await user.save(); 
 
        res.status(201).json({ message: 'Order created successfully', order: newOrder }); 

    }
    catch (err) {
        next(err);
    }
}




exports.getOrderHistory = async (req, res, next) => {
    try {
        const id = req.customer.id;

        const orders = await Order.find({ customer: id }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

