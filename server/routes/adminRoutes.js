const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, deleteUser,
  getAllOrders, updateOrderStatus,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;
