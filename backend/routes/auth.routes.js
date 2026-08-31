const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes (User yang login)
router.get('/me', verifyToken, AuthController.getMe);
router.put('/profile', verifyToken, AuthController.updateProfile);

// Admin only routes
router.get('/users', verifyToken, requireAdmin, AuthController.getAllUsers);

module.exports = router;
