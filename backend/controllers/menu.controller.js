const db = require('../config/db');
const sendResponse = require('../utils/response');

/**
 * Helper to attach allergens & review stats to menu items
 */
function enrichMenuItems(menuItems) {
  if (!menuItems || menuItems.length === 0) return [];

  const allergenStmt = db.prepare(`
    SELECT a.id, a.nama_alergen, a.label, a.deskripsi
    FROM allergens a
    JOIN menu_item_allergens mia ON a.id = mia.allergen_id
    WHERE mia.menu_item_id = ?
  `);

  const reviewStatsStmt = db.prepare(`
    SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
    FROM reviews
    WHERE menu_item_id = ?
  `);

  return menuItems.map((item) => {
    const allergens = allergenStmt.all(item.id);
    const reviewStats = reviewStatsStmt.get(item.id);

    return {
      ...item,
      allergens: allergens || [],
      rating_avg: reviewStats?.avg_rating ? parseFloat(reviewStats.avg_rating.toFixed(1)) : 0,
      review_count: reviewStats?.review_count || 0,
    };
  });
}

/**
 * GET /api/menu
 * Mengambil daftar menu dengan opsi filter (kategori, search, sort, max_kalori, dll.)
 */
function getAllMenu(req, res) {
  try {
    const { kategori, search, featured, sort, max_kalori } = req.query;

    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];

    if (kategori && kategori !== 'Semua') {
      sql += ' AND kategori = ?';
      params.push(kategori);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (nama LIKE ? OR deskripsi LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (featured === '1' || featured === 'true') {
      sql += ' AND is_featured = 1';
    }

    if (max_kalori && !isNaN(max_kalori)) {
      sql += ' AND kalori <= ?';
      params.push(parseInt(max_kalori, 10));
    }

    // Sorting
    switch (sort) {
      case 'termurah':
        sql += ' ORDER BY harga ASC';
        break;
      case 'termahal':
        sql += ' ORDER BY harga DESC';
        break;
      case 'kalori_rendah':
        sql += ' ORDER BY kalori ASC';
        break;
      case 'kalori_tinggi':
        sql += ' ORDER BY kalori DESC';
        break;
      case 'nama_asc':
        sql += ' ORDER BY nama ASC';
        break;
      default:
        sql += ' ORDER BY is_featured DESC, id ASC';
    }

    const items = db.prepare(sql).all(...params);
    const enrichedItems = enrichMenuItems(items);

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mengambil daftar menu',
      data: enrichedItems,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengambil daftar menu',
      data: { error: error.message },
    });
  }
}

/**
 * GET /api/menu/:id
 * Mengambil detail hidangan tertentu beserta daftar alergen dan ulasan
 */
function getMenuById(req, res) {
  try {
    const { id } = req.params;

    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);

    if (!item) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: `Menu dengan ID ${id} tidak ditemukan`,
      });
    }

    const [enrichedItem] = enrichMenuItems([item]);

    // Ambil ulasan
    const reviews = db.prepare(`
      SELECT r.id, r.rating, r.komentar, r.created_at, u.nama as user_nama
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.menu_item_id = ?
      ORDER BY r.created_at DESC
    `).all(id);

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mengambil detail menu',
      data: {
        ...enrichedItem,
        reviews: reviews || [],
      },
    });
  } catch (error) {
    console.error('Error fetching menu detail:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengambil detail menu',
      data: { error: error.message },
    });
  }
}

/**
 * GET /api/menu/categories
 * Mengambil ringkasan kategori dan jumlah item
 */
function getCategories(req, res) {
  try {
    const categories = [
      { id: 'semua', label: 'Semua Menu', value: 'Semua' },
      { id: 'utama', label: 'Makanan Utama', value: 'Makanan Utama' },
      { id: 'pembuka', label: 'Makanan Pembuka', value: 'Makanan Pembuka' },
      { id: 'minuman', label: 'Minuman', value: 'Minuman' },
      { id: 'dessert', label: 'Dessert & Penutup', value: 'Dessert' },
    ];

    const counts = db.prepare(`
      SELECT kategori, COUNT(*) as count FROM menu_items GROUP BY kategori
    `).all();

    const countMap = {};
    let totalAll = 0;
    for (const c of counts) {
      countMap[c.kategori] = c.count;
      totalAll += c.count;
    }

    const result = categories.map((cat) => ({
      ...cat,
      count: cat.value === 'Semua' ? totalAll : (countMap[cat.value] || 0),
    }));

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mengambil daftar kategori',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengambil kategori',
    });
  }
}

/**
 * GET /api/menu/allergens
 * Mengambil daftar referensi alergen
 */
function getAllergens(req, res) {
  try {
    const allergens = db.prepare('SELECT * FROM allergens ORDER BY id ASC').all();

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mengambil daftar alergen',
      data: allergens,
    });
  } catch (error) {
    console.error('Error fetching allergens:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengambil data alergen',
    });
  }
}

module.exports = {
  getAllMenu,
  getMenuById,
  getCategories,
  getAllergens,
};
