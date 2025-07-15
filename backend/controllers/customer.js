const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const ErrorResponse = require('../middlewares/errorresponse');
//continue this

// Input validation helper
function validateCustomerInput(email, password) {
    if (!email || !password) return 'Email and password are required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
}

// Customer login or signup
exports.customerLogin = async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Input validation
    const validationError = validateCustomerInput(email, password);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        // 2. Prevent duplicate email on signup
        let customer = await Customer.findOne({ email }).select('+password');
        if (!customer) {
            // Check again for duplicate email (race condition)
            const existingCustomer = await Customer.findOne({ email });
            if (existingCustomer) {
                return res.status(409).json({ message: 'Email already registered' });
            }
            // Signup: let the model's pre-save hook hash the password
            customer = new Customer({
                email,
                password,
                role: 'customer'
            });
            await customer.save();

            const token = jwt.sign(
                { id: customer._id, role: 'customer' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return res.status(201).json({ token, message: 'Signed up and logged in.' });
        }

        // Sign in
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: customer._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ token, message: 'Signed in.' });
    } catch (err) {
        next(err);
    }
};

// 4. Profile update endpoint
exports.updateCustomer = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));

    // Only allow the customer to update their own profile
    if (!req.customer || req.customer.id !== id)
        return res.status(403).json({ message: 'Not authorized' });

    const { email, password, ...otherFields } = req.body;
    let updateData = { ...otherFields };
    if (password) {
        updateData.password = await bcrypt.hash(password, 8);
    }
    if (email) {
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        updateData.email = email;
    }

    try {
        const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
        if (!customer) return next(new ErrorResponse('Customer not found', 404));
        res.status(200).json({ success: true, data: customer });
    } catch (err) {
        next(err);
    }
};

// 5. Order creation logic (basic)
const Order = require('../models/order');
exports.createOrder = async (req, res, next) => {
    try {
        const customerId = req.customer.id;
        const { products, deliveryAddress, paymentMethod, usePointsForFreeDelivery } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products are required' });
        }
        if (!deliveryAddress) {
            return res.status(400).json({ message: 'Delivery address is required' });
        }
        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required' });
        }

        // Fetch customer to get loyalty points
        const customer = await Customer.findById(customerId);

        let deliveryFee = 50; // Example delivery fee
        let pointsUsed = 0;

        // Use loyalty points for free delivery if requested and enough points
        if (usePointsForFreeDelivery && customer.loyaltyPoints >= 100) {
            deliveryFee = 0;
            pointsUsed = 100;
            customer.loyaltyPoints -= 100;
        }

        // Create the order
        const order = await Order.create({
            customer: customerId,
            products,
            deliveryAddress,
            paymentMethod,
            deliveryFee,
            status: 'pending'
        });

        // Add loyalty points for this order (e.g., 10 points per order)
        customer.loyaltyPoints = (customer.loyaltyPoints || 0) + 10 - pointsUsed;
        await customer.save();

        res.status(201).json({ success: true, data: order, loyaltyPoints: customer.loyaltyPoints });
    } catch (err) {
        next(err);
    }
};

// 2. Order history endpoint
exports.getOrderHistory = async (req, res, next) => {
    try {
        // req.customer should be set by authentication middleware
        const customerId = req.customer.id;

        const orders = await Order.find({ customer: customerId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};