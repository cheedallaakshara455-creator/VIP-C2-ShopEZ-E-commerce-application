const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true, enum: ['COD', 'Card', 'UPI', 'NetBanking'] },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed'] },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
