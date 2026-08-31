const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkout,
  getOrderById,
} = require('../controllers/cart.controller');

// Cart routes
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);
router.delete('/', clearCart);

// Checkout & Order routes
router.post('/checkout', checkout);
router.get('/orders/:id', getOrderById);

module.exports = router;
