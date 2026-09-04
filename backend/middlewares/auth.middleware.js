const jwt = require('jsonwebtoken');
const config = require('../config/env');
const sendResponse = require('../utils/response');
const UserModel = require('../models/user.model');

/**
 * Middleware untuk verifikasi JWT Bearer token
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, {
      code: 401,
      success: false,
      message: 'Akses ditolak. Token otentikasi tidak ditemukan.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = UserModel.findById(decoded.id);

    if (!user) {
      return sendResponse(res, {
        code: 401,
        success: false,
        message: 'Sesi tidak valid. Pengguna tidak ditemukan.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, {
        code: 401,
        success: false,
        message: 'Sesi telah berakhir. Silakan login kembali.'
      });
    }
    return sendResponse(res, {
      code: 403,
      success: false,
      message: 'Token otentikasi tidak valid.'
    });
  }
}

/**
 * Middleware buat route yang boleh diakses tamu (tanpa login) TAPI kalau ada
 * token valid, isi req.user - biar server percaya identitas dari token,
 * bukan dari body/query yang bisa dipalsuin.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], config.jwtSecret);
    const user = UserModel.findById(decoded.id);
    if (user) req.user = user;
  } catch (error) {
    // token gak valid, tetap lanjut sebagai tamu
  }
  next();
}

/**
 * Middleware untuk memastikan user memiliki role 'admin'
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return sendResponse(res, {
      code: 403,
      success: false,
      message: 'Akses khusus Administrator/Staff restoran.'
    });
  }
  next();
}

/**
 * Middleware untuk memastikan user memiliki role 'pelanggan'
 */
function requirePelanggan(req, res, next) {
  if (!req.user || req.user.role !== 'pelanggan') {
    return sendResponse(res, {
      code: 403,
      success: false,
      message: 'Akses khusus Pelanggan.'
    });
  }
  next();
}

module.exports = {
  verifyToken,
  optionalAuth,
  requireAdmin,
  requirePelanggan
};
