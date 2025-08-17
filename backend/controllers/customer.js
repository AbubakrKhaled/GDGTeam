const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const Token = require('../models/token');
const ErrorResponse = require('../middlewares/errorresponse');

// Input validation helper
function validateCustomerInput(email, password) {

    if (!email || !password) return 'Email and password are required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
}

// Customer login or signup
/*exports.customerLogin = async (req, res, next) => {
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
        } else {
            // Sign in - verify password
            const isMatch = await bcrypt.compare(password, customer.password);
            if (!isMatch)
                return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: customer._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Save token to database
        //await Token.create({ token });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send response
        const statusCode = customer ? 200 : 201;
        const message = customer ? 'Signed in.' : 'Signed up and logged in.';
        
        res.status(statusCode).json({
            success: true,
            token,
            message,
            customer: {
                id: customer._id,
                email: customer.email,
                role: 'customer'
            }
        });
    } catch (err) {
        next(err);
    }
};*/

// Login
exports.customerLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const validationError = validateCustomerInput(email, password);
    if (validationError) return res.status(400).json({ message: validationError });

    try {
        const customer = await Customer.findOne({ email }).select('+password');
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: customer._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        await Token.create({
            token,
            userId: customer._id,
            userType: 'customer'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: customer._id,
                email: customer.email,
                role: 'customer' ,
                address : customer.address ,
                gender : customer.gender,
            }
        });
    } catch (err) {
        next(err);
    }
};

// Signup
exports.customerSignup = async (req, res, next) => {
    const data = req.body;
    const { email, password, address, phonenumber, name, gender } = data;
    
    // Enhanced validation
    const validationError = validateCustomerInput(email, password);
    if (validationError) return res.status(400).json({ message: validationError });
    
    // Validate required fields
    if (!name || !address || !gender || !phonenumber) {
        return res.status(400).json({ message: 'Name, address, gender, and phone number are required' });
    }
    
    // Validate phone number format
    if (isNaN(parseInt(phonenumber))) {
        return res.status(400).json({ message: 'Phone number must be a valid number' });
    }

    try {
        const existing = await Customer.findOne(    { email });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword)

        // Convert phonenumber to number if it's a string
        const phoneNumber = typeof phonenumber === 'string' ? parseInt(phonenumber) : phonenumber;

        const customer = new Customer({ 
            email, 
            password: hashedPassword, 
            address, 
            phonenumber: phoneNumber, 
            name, 
            gender, 
            role: 'customer' 
        });
        await customer.save();

        const token = jwt.sign(
            { id: customer._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            token,
            customer: {
                id: customer._id,
                email: customer.email,
                role: 'customer' ,
                address : customer.address
            }
        });
    } catch (err) {
        console.error('Customer signup error:', err);
        
        // Handle specific MongoDB errors
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: validationErrors.join(', ') });
        }
        
        next(err);
    }
};

/*
// Logout endpoint
exports.customerLogout = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (token) {
            // Blacklist the token
            await Token.findOneAndUpdate(
                { token },
                { blackListedToken: true }
            );
            
            // Clear cookie
        }

        res.clearCookie('token');

        
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};
*/

// 4. Profile update endpoint
exports.updateCustomer = async (req, res, next) => {
    const { email, password, ...otherFields } = req.body;
    let updateData = { ...otherFields };

    if (password) updateData.password = await bcrypt.hash(password, 8);

    if (email) {
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        updateData.email = email;
    }

    try {
        const customer = await Customer.findByIdAndUpdate(req.customer.id, updateData, { new: true });
        if (!customer) return next(new ErrorResponse('Customer not found', 404));
        res.status(200).json({ success: true, data: customer });
    } catch (err) {
        next(err);
    }
};

// Get customer profile
exports.getCustomerProfile = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.customer.id);
        if (!customer) {
            return next(new ErrorResponse('Customer not found', 404));
        }
        res.json({ success: true, data: customer });
    } catch (err) {
        next(err);
    }
};

