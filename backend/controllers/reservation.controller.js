const sendResponse = require('../utils/response');
const reservationModel = require('../models/reservation.model');

function createReservation(req, res) {
  const { nama_tamu, kontak, tanggal, jam, jumlah_orang, catatan } = req.body;
  if (!nama_tamu || !kontak || !tanggal || !jam || !jumlah_orang) {
    return sendResponse(res, { code: 400, success: false, message: 'nama_tamu, kontak, tanggal, jam, jumlah_orang wajib diisi' });
  }
  if (!reservationModel.isSlotAvailable(tanggal, jam)) {
    return sendResponse(res, { code: 409, success: false, message: 'Slot tanggal/jam ini sudah dipesan' });
  }
  // user_id ambil dari token kalau login (optionalAuth) - bukan dari body, biar gak bisa dipalsuin
  const user_id = req.user ? req.user.id : null;
  const reservation = reservationModel.create({ user_id, nama_tamu, kontak, tanggal, jam, jumlah_orang, catatan });
  return sendResponse(res, { code: 201, message: 'Reservasi berhasil dibuat', data: reservation });
}

function getMyReservations(req, res) {
  return sendResponse(res, { data: reservationModel.findByUser(req.user.id) });
}

module.exports = { createReservation, getMyReservations };
