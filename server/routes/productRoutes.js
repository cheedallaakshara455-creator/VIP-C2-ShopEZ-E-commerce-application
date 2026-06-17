const express = require('express');
const router = express.Router();
const {
  getProducts, getFeaturedProducts, getProductById,
  createProduct, updateProduct, deleteProduct,
  createReview, getCategories,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, createReview);

module.exports = router;
