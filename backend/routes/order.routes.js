const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { getMyOrders } = require('../controllers/order.controller');

// Pesanan pelanggan sendiri saja - kelola status/lihat semua pesanan lewat /api/admin/orders (khusus admin)
router.get('/me', verifyToken, getMyOrders);

module.exports = router;
