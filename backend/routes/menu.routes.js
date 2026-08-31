const express = require('express');
const router = express.Router();
const {
  getAllMenu,
  getMenuById,
  getCategories,
  getAllergens,
} = require('../controllers/menu.controller');

// Categories & Allergens metadata routes
router.get('/categories/list', getCategories);
router.get('/allergens/list', getAllergens);

// Menu items routes
router.get('/', getAllMenu);
router.get('/:id', getMenuById);

module.exports = router;
