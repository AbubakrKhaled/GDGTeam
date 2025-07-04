const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Brand = require("../models/brand.js");
const Customer = require("../models/customer.js");
const Order = require("../models/order.js");

// for logging in **************************************************************************************
exports.adminLogin = async (req, res) => {
	const { username, password } = req.body;
	/*
	const username = req.body.username;
	const password = req.body.password;
	*/

  	if (username !== process.env.ADMIN_USERNAME)
    	return res.status(401).json({ message: 'Invalid credentials' });

  	const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
  	if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  	const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    	expiresIn: process.env.JWT_EXPIRES_IN
  	});

  	res.status(200).json({ token });
};
// ******************************************************************************************************
//brand operations ***********************************************************************************
exports.getAllBrands = async (req, res, next) => {
	try {
		const brand = await Brand.find();

		res.status(200).json({success: true, data: brand});

	} catch(err) {
		next(err);
	}
}

exports.getBrandById = async (req, res, next) => {
    const id = req.params.id;
    try {
		const brand = await Brand.findById(id);

		if (!brand) {
		return next(new ErrorResponse('Brand not found', 404));
		}

        res.status(200).json({success: true, data: brand});

    } catch(err) {
        next(err);
    }
}

exports.brandApproval = async (req, res, next) => {
	const id = req.params.id;
	try {
		const brand = await Brand.findById(id);

		if (!brand) {
		return next(new ErrorResponse('Brand not found', 404));
		}

		brand.isApproved = req.body.isApproved;
		await brand.save();

		res.status(200).json({success: true, data: brand});
	} catch(err) {
		next(err);
	}
};

exports.deleteBrand = async (req, res, next) => {
    const id = req.params.id;
    try {
		const brand = await Brand.findById(id);

		if (!brand) {
		return next(new ErrorResponse('Brand not found', 404));
		}

		await Brand.findByIdAndDelete(id);

        res.status(200).json({success: true, data: {}});
    } catch(err){
        next(err);
    }
}
// ******************************************************************************************************
//customer operations ***********************************************************************************
exports.getAllCustomers = async (req, res, next) => {
	try {
		const customer = await Customer.find();

		res.status(200).json({success: true, data: customer});

	} catch(err) {
		next(err);
	}
}

exports.getCustomerById = async (req, res, next) => {
    const id = req.params.id;
    try {
		const customer = await Customer.findById(id);

		if (!customer) {
		return next(new ErrorResponse('Customer not found', 404));
		}

        res.status(200).json({success: true, data: customer});

    } catch(err) {
        next(err);
    }
}

exports.deleteCustomer = async (req, res, next) => {
    const id = req.params.id;
    try {
		const customer = await Customer.findById(id);

		if (!customer) {
		return next(new ErrorResponse('Customer not found', 404));
		}

		await Customer.findByIdAndDelete(id);

        res.status(200).json({success: true, data: {}});
    } catch(err){
        next(err);
    }
}
// ******************************************************************************************************
//order operations **************************************************************************************
exports.getAllOrders = async (req, res, next) => {
	try {
		const order = await order.find();

		res.status(200).json({success: true, data: order});

	} catch(err) {
		next(err);
	}
}

exports.getOrderById = async (req, res, next) => {
    const id = req.params.id;
    try {
		const order = await Order.findById(id);

		if (!order) {
		return next(new ErrorResponse('Order not found', 404));
		}

        res.status(200).json({success: true, data: order});

    } catch(err) {
        next(err);
    }
}

exports.updateOrderStatus = async (req, res, next) => {
	const id = req.params.id;
	try {
		const order = await Order.findById(id);

		if (!order) {
		return next(new ErrorResponse('Order not found', 404));
		}

		order.status = req.body.status;
		await order.save();

		res.status(200).json({success: true, data: order});
	} catch(err){
		next(err);
	}
}