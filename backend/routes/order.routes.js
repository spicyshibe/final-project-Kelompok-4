const express = require('express');
const router = express.Router();
const { getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');

router.get('/me', getMyOrders);
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
