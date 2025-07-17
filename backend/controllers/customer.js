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

