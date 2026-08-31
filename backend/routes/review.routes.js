const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// Endpoint untuk Reviews
router.get('/menu/:menuId', reviewController.getReviewsByMenu);
router.post('/', reviewController.addReview);

module.exports = router;
