const ErrorResponse = require('../middlewares/errorresponse');
const Order   = require('../models/order');


exports.getAllOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find();

    if (req.admin){
        res.status(200).json({ success: true, data: orders });
    }

    return next(new ErrorResponse('Insufficient permissions', 400));
    
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id))
        return next(new ErrorResponse('Invalid ID', 400));
    
    try {
        const order = await Order.findById(id);
        if (req.admin) {
            return res.status(200).json({ success: true, data: order });
        }

        if (req.brand && order.product[0].brand.toString() !== req.brand.id) {
            return next(new ErrorResponse("Not your brand's order", 403));
        }
        if (req.brand && order.product[0].brand.toString() === req.brand.id) {
            return res.status(200).json({ success: true, data: order });
        }
              
        if (!order || !order.isActive) {
        return next(new ErrorResponse('Order not found', 404));
        }
        
        if (req.customer && order.customer.toString() !== req.cutomer.id) {
            return next(new ErrorResponse("Not your order", 403));
        }
        if (req.customer && order.customer.toString() === req.customer.id) {
            return res.status(200).json({ success: true, data: order });
        }

        res.status(200).json({success: true, data: order});

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