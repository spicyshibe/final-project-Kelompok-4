const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// Semua route admin mewajibkan autentikasi JWT dan role Admin
router.use(verifyToken, requireAdmin);

// 1. Dashboard Overview Stats
router.get('/stats', AdminController.getStats);

// 2. Menu Management (FR-8)
router.get('/menu', AdminController.getMenus);
router.post('/menu', AdminController.createMenu);
router.put('/menu/:id', AdminController.updateMenu);
router.patch('/menu/:id/toggle', AdminController.toggleMenuAvailability);
router.delete('/menu/:id', AdminController.deleteMenu);
router.get('/allergens', AdminController.getAllergens);

// 3. Reservations Management (FR-9)
router.get('/reservations', AdminController.getReservations);
router.patch('/reservations/:id/status', AdminController.updateReservationStatus);
router.delete('/reservations/:id', AdminController.deleteReservation);

// 4. Orders Management (FR-10)
router.get('/orders', AdminController.getOrders);
router.patch('/orders/:id/status', AdminController.updateOrderStatus);
router.delete('/orders/:id', AdminController.deleteOrder);

module.exports = router;
