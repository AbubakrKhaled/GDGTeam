const Order = require("../models/order");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, totalPrice } = req.body;

    const order = new Order({
      shippingAddress,
      totalPrice,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
