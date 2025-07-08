const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const ErrorResponse = require('../middlewares/errorresponse');

// Customer login or signup
exports.customerLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let customer = await Customer.findOne({ email }).select('+password');
        if (!customer) {
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