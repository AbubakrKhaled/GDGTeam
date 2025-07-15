const ErrorResponse = require('../middlewares/errorresponse');
const Order   = require('../models/order');
const Product = require('../models/product');
const Customer= require('../models/customer');


exports.getOrders = async (req, res, next) => {
  try {
    let orders;

    if (req.admin) {
        orders = await Order.find().populate('products.product');
    } 
    else if (req.brand) {
        orders = await Order.find().populate('products.product');

        orders = orders.filter(order => {
            const firstProduct = order.products[0].product;
            return firstProduct && firstProduct.brand?.toString() === req.brand.id;
        });
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

        if (req.brand && order.products[0].product.brand.toString() !== req.brand.id) {
            return next(new ErrorResponse("Not your brand's order", 403));
        }
        if (req.brand && order.products[0].product.brand.toString() === req.brand.id) {
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
  const { id } = req.params;
  const { status } = req.body;

if (req.customer !== order.customer.toString() || order.status.toString() !== "Pending") {
    return next(new ErrorResponse('Order not found', 404));
}
   
if (req.brand !== order.product[0].brand.toString() || order.status.toString() !== "Pending") {
    return next(new ErrorResponse('Order not found', 404));
}

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) return next(new ErrorResponse('Order not found', 404));
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
        const order = await Order.findById(id);

        if (!order) {
        return next(new ErrorResponse('Order not found', 404));
        }
        if (req.customer === order.customer.toString() && order.status.toString() === "Pending") {
            await Order.findByIdAndUpdate(id, order.status = "Cancelled", { new: true });
            res.status(200).json({success: true, data: order});
        }
   
        if (req.brand === order.product[0].brand.toString() && order.status.toString() === "Pending") {
            await Order.findByIdAndUpdate(id, order.status = "Cancelled", { new: true });
            res.status(200).json({success: true, data: order});
        }

    } catch(err){
        next(err);
    }
}

exports.checkoutOrder = async (req,res,next) => {
    try{
        const id = req.customer.id;
        const deliveryAddress = req.customer.address
        const user = await Customer.findById(id).populate('cart.product');

        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'No products in the cart to create an order.' });
        }

        let totalPrice = 0;
        const products = [];

    }
    catch{

    }
}

exports.createOrder = async (req, res, next) => {
    try {
        // req.customer should be set by authentication middleware
        const customerId = req.customer.id;
        const { products, deliveryAddress, paymentMethod } = req.body;

        // Create the order
        const order = await Order.create({
            customer: customerId,
            products,
            deliveryAddress,
            paymentMethod,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};