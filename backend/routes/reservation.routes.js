const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
} = require('../controllers/reservation.controller');

router.post('/', createReservation);
router.get('/me', getMyReservations);
router.get('/', getAllReservations);
router.patch('/:id/status', updateReservationStatus);

module.exports = router;
