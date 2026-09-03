const express = require('express');
const router = express.Router();
const { verifyToken, optionalAuth } = require('../middlewares/auth.middleware');
const { createReservation, getMyReservations } = require('../controllers/reservation.controller');

// Boleh tamu (tanpa login), tapi kalau login user_id kepercaya dari token
router.post('/', optionalAuth, createReservation);
// Lihat reservasi sendiri wajib login - kelola semua reservasi lewat /api/admin/reservations (khusus admin)
router.get('/me', verifyToken, getMyReservations);

module.exports = router;
