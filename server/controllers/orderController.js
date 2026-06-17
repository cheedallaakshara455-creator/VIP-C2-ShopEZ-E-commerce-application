const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc Create order
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No order items' });
    const order = await Order.create({
      user: req.user._id, items, shippingAddress,
      paymentMethod, itemsPrice, shippingPrice, totalPrice,
    });
    // Clear cart after order
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get logged-in user orders
// @route GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single order
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
