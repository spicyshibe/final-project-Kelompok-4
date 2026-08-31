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

  try {
    const sql = `SELECT * FROM reviews WHERE menu_item_id = ? ORDER BY created_at DESC`;
    const stmt = db.prepare(sql);
    const rows = stmt.all(menuId);
    
    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mengambil ulasan',
      data: rows
    });
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengambil ulasan'
    });
  }
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

  try {
    const sql = `INSERT INTO reviews (user_id, menu_item_id, rating, komentar) VALUES (?, ?, ?, ?) RETURNING id`;
    const stmt = db.prepare(sql);
    // run() doesn't return lastInsertRowid natively in the same way, but we can use get() with RETURNING id
    const result = stmt.get(user_id, menu_item_id, rating, komentar || '');

    return sendResponse(res, {
      code: 201,
      success: true,
      message: 'Ulasan berhasil ditambahkan',
      data: {
        id: result.id,
        user_id,
        menu_item_id,
        rating,
        komentar
      }
    });
  } catch (err) {
    console.error('Error adding review:', err.message);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal menambahkan ulasan'
    });
  }
};

module.exports = {
  getReviewsByMenu,
  addReview
};
