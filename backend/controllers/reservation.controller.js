const sendResponse = require('../utils/response');
const reservationModel = require('../models/reservation.model');

function createReservation(req, res) {
  const { user_id, nama_tamu, kontak, tanggal, jam, jumlah_orang, catatan } = req.body;
  if (!nama_tamu || !kontak || !tanggal || !jam || !jumlah_orang) {
    return sendResponse(res, { code: 400, success: false, message: 'nama_tamu, kontak, tanggal, jam, jumlah_orang wajib diisi' });
  }
  if (!reservationModel.isSlotAvailable(tanggal, jam)) {
    return sendResponse(res, { code: 409, success: false, message: 'Slot tanggal/jam ini sudah dipesan' });
  }
  const reservation = reservationModel.create({ user_id, nama_tamu, kontak, tanggal, jam, jumlah_orang, catatan });
  return sendResponse(res, { code: 201, message: 'Reservasi berhasil dibuat', data: reservation });
}

function getMyReservations(req, res) {
  const { user_id } = req.query;
  if (!user_id) {
    return sendResponse(res, { code: 400, success: false, message: 'user_id wajib diisi' });
  }
  return sendResponse(res, { data: reservationModel.findByUser(user_id) });
}

function getAllReservations(req, res) {
  return sendResponse(res, { data: reservationModel.findAll() });
}

function updateReservationStatus(req, res) {
  const { status } = req.body;
  const reservation = reservationModel.updateStatus(req.params.id, status);
  if (!reservation) {
    return sendResponse(res, { code: 400, success: false, message: 'Status tidak valid atau reservasi tidak ditemukan' });
  }
  return sendResponse(res, { message: 'Status reservasi diperbarui', data: reservation });
}

module.exports = { createReservation, getMyReservations, getAllReservations, updateReservationStatus };
