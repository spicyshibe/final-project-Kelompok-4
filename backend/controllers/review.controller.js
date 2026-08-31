const db = require('../config/db');
const { sendResponse } = require('../utils/response');

// GET /api/reviews/menu/:menuId
const getReviewsByMenu = (req, res) => {
  const { menuId } = req.params;
  
  if (!menuId) {
    return sendResponse(res, {
      code: 400,
      success: false,
      message: 'menuId tidak valid'
    });
  }

  // Mengambil daftar ulasan untuk suatu menu
  // (Nantinya bisa di-join dengan tabel Users untuk mendapatkan nama user)
  const sql = `SELECT * FROM reviews WHERE menu_item_id = ? ORDER BY created_at DESC`;
  
  db.all(sql, [menuId], (err, rows) => {
    if (err) {
      console.error('Error fetching reviews:', err.message);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal mengambil ulasan'
      });
    }

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mengambil ulasan',
      data: rows
    });
  });
};

// POST /api/reviews
const addReview = (req, res) => {
  const { user_id, menu_item_id, rating, komentar } = req.body;

  if (!user_id || !menu_item_id || !rating) {
    return sendResponse(res, {
      code: 400,
      success: false,
      message: 'user_id, menu_item_id, dan rating wajib diisi'
    });
  }

  if (rating < 1 || rating > 5) {
    return sendResponse(res, {
      code: 400,
      success: false,
      message: 'Rating harus antara 1 dan 5'
    });
  }

  const sql = `INSERT INTO reviews (user_id, menu_item_id, rating, komentar) VALUES (?, ?, ?, ?)`;
  const params = [user_id, menu_item_id, rating, komentar || ''];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error adding review:', err.message);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal menambahkan ulasan'
      });
    }

    return sendResponse(res, {
      code: 201,
      success: true,
      message: 'Ulasan berhasil ditambahkan',
      data: {
        id: this.lastID,
        user_id,
        menu_item_id,
        rating,
        komentar
      }
    });
  });
};

module.exports = {
  getReviewsByMenu,
  addReview
};
