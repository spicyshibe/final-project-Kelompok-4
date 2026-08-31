const express = require('express');
const router = express.Router();
const { getMyOrders, updateOrderStatus } = require('../controllers/order.controller');

router.get('/me', getMyOrders);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
