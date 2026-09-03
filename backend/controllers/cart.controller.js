const db = require('../config/db');
const sendResponse = require('../utils/response');

/**
 * Ambil user ID dari token JWT yang udah diverifikasi (req.user, dari middleware verifyToken).
 * JANGAN pernah percaya user_id dari client (query/header) - itu bisa dipalsuin buat
 * ngintip/ubah data user lain.
 */
function getUserId(req) {
  return req.user.id;
}

/**
 * Helper untuk mengambil isi keranjang lengkap beserta subtotal dan alergen
 */
function fetchUserCart(userId) {
  const cartRows = db.prepare(`
    SELECT 
      c.id as cart_item_id,
      c.user_id,
      c.menu_item_id,
      c.jumlah,
      c.created_at,
      c.updated_at,
      m.nama,
      m.deskripsi,
      m.harga,
      m.kategori,
      m.kalori,
      m.gambar,
      m.status_tersedia
    FROM cart_items c
    JOIN menu_items m ON c.menu_item_id = m.id
    WHERE c.user_id = ?
    ORDER BY c.id DESC
  `).all(userId);

  const allergenStmt = db.prepare(`
    SELECT a.id, a.nama_alergen, a.label
    FROM allergens a
    JOIN menu_item_allergens mia ON a.id = mia.allergen_id
    WHERE mia.menu_item_id = ?
  `);

  let totalItems = 0;
  let totalPrice = 0;

  const items = cartRows.map((row) => {
    const allergens = allergenStmt.all(row.menu_item_id);
    const subtotal = row.jumlah * row.harga;
    totalItems += row.jumlah;
    totalPrice += subtotal;

    return {
      id: row.cart_item_id,
      menu_item_id: row.menu_item_id,
      nama: row.nama,
      deskripsi: row.deskripsi,
      harga: row.harga,
      kategori: row.kategori,
      kalori: row.kalori,
      gambar: row.gambar,
      status_tersedia: Boolean(row.status_tersedia),
      jumlah: row.jumlah,
      subtotal,
      allergens: allergens || [],
    };
  });

  return {
    user_id: userId,
    items,
    total_items: totalItems,
    total_price: totalPrice,
  };
}

/**
 * GET /api/cart
 * Mengambil seluruh isi keranjang belanja user
 */
function getCart(req, res) {
  try {
    const userId = getUserId(req);
    const cart = fetchUserCart(userId);

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mengambil data keranjang belanja',
      data: cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengambil data keranjang',
      data: { error: error.message },
    });
  }
}

/**
 * POST /api/cart
 * Menambahkan menu ke keranjang belanja
 * Body: { menu_item_id, jumlah }
 */
function addToCart(req, res) {
  try {
    const userId = getUserId(req);
    const { menu_item_id, jumlah = 1 } = req.body;

    if (!menu_item_id) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'Parameter menu_item_id wajib disertakan',
      });
    }

    const qty = parseInt(jumlah, 10) || 1;
    if (qty <= 0) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'Jumlah item harus minimal 1',
      });
    }

    // Cek menu ada di DB
    const menuItem = db.prepare('SELECT id, nama, harga, status_tersedia FROM menu_items WHERE id = ?').get(menu_item_id);
    if (!menuItem) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: `Menu dengan ID ${menu_item_id} tidak ditemukan`,
      });
    }

    if (!menuItem.status_tersedia) {
      return sendResponse(res, {
        code: 409,
        success: false,
        message: `Menu "${menuItem.nama}" sedang habis, tidak bisa ditambahkan ke keranjang`,
      });
    }

    // Cek apakah item sudah ada di keranjang user
    const existing = db.prepare(`
      SELECT id, jumlah FROM cart_items WHERE user_id = ? AND menu_item_id = ?
    `).get(userId, menu_item_id);

    if (existing) {
      const newQty = existing.jumlah + qty;
      db.prepare(`
        UPDATE cart_items SET jumlah = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(newQty, existing.id);
    } else {
      db.prepare(`
        INSERT INTO cart_items (user_id, menu_item_id, jumlah) VALUES (?, ?, ?)
      `).run(userId, menu_item_id, qty);
    }

    const updatedCart = fetchUserCart(userId);

    return sendResponse(res, {
      code: 200,
      success: true,
      message: `Berhasil menambahkan ${menuItem.nama} ke keranjang`,
      data: updatedCart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal menambahkan ke keranjang',
      data: { error: error.message },
    });
  }
}

/**
 * PUT /api/cart/:id
 * Mengubah jumlah / kuantitas item dalam keranjang
 * Body: { jumlah }
 */
function updateCartItem(req, res) {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { jumlah } = req.body;

    const existing = db.prepare(`
      SELECT id, user_id FROM cart_items WHERE id = ?
    `).get(id);

    if (!existing) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: 'Item keranjang tidak ditemukan',
      });
    }

    const newQty = parseInt(jumlah, 10);

    if (isNaN(newQty) || newQty <= 0) {
      // Hapus jika jumlah 0 atau negatif
      db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);
    } else {
      db.prepare(`
        UPDATE cart_items SET jumlah = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(newQty, id);
    }

    const updatedCart = fetchUserCart(userId);

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Jumlah item keranjang berhasil diperbarui',
      data: updatedCart,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengubah item keranjang',
      data: { error: error.message },
    });
  }
}

/**
 * DELETE /api/cart/:id
 * Menghapus satu item dari keranjang
 */
function removeCartItem(req, res) {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const result = db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);

    if (result.changes === 0) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: 'Item keranjang tidak ditemukan',
      });
    }

    const updatedCart = fetchUserCart(userId);

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Item berhasil dihapus dari keranjang',
      data: updatedCart,
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal menghapus item keranjang',
      data: { error: error.message },
    });
  }
}

/**
 * DELETE /api/cart
 * Mengosongkan keranjang belanja
 */
function clearCart(req, res) {
  try {
    const userId = getUserId(req);
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Keranjang belanja berhasil dikosongkan',
      data: {
        user_id: userId,
        items: [],
        total_items: 0,
        total_price: 0,
      },
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengosongkan keranjang',
      data: { error: error.message },
    });
  }
}

/**
 * POST /api/cart/checkout
 * Checkout isi keranjang belanja menjadi data Order resmi (FR-4.4)
 * Body: { nama_pemesan, jenis_pesanan, nomor_meja, catatan }
 */
function checkout(req, res) {
  try {
    const userId = getUserId(req);
    const {
      nama_pemesan = 'Pelanggan',
      jenis_pesanan = 'Makan di Tempat (Dine In)',
      nomor_meja = 'Meja 01',
      catatan = '',
    } = req.body;

    const cart = fetchUserCart(userId);

    if (!cart.items || cart.items.length === 0) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'Keranjang belanja masih kosong, tidak dapat melakukan checkout',
      });
    }

    const fullCatatan = [
      `Pemesan: ${nama_pemesan}`,
      `Tipe: ${jenis_pesanan}`,
      nomor_meja ? `No. Meja: ${nomor_meja}` : null,
      catatan ? `Catatan: ${catatan}` : null,
    ].filter(Boolean).join(' | ');

    // 1. Buat order baru
    const insertOrder = db.prepare(`
      INSERT INTO orders (user_id, total_harga, status, catatan)
      VALUES (?, ?, 'baru', ?)
    `);

    const orderResult = insertOrder.run(userId, cart.total_price, fullCatatan);
    const orderId = Number(orderResult.lastInsertRowid);

    // 2. Simpan setiap item ke order_items
    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, jumlah, harga_satuan, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of cart.items) {
      insertOrderItem.run(
        orderId,
        item.menu_item_id,
        item.jumlah,
        item.harga,
        item.subtotal
      );
    }

    // 3. Kosongkan keranjang user setelah checkout berhasil
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

    return sendResponse(res, {
      code: 201,
      success: true,
      message: 'Pesanan berhasil dibuat (Checkout Sukses)',
      data: {
        order_id: orderId,
        status: 'baru',
        total_harga: cart.total_price,
        total_items: cart.total_items,
        nama_pemesan,
        jenis_pesanan,
        nomor_meja,
        catatan,
        items: cart.items,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal memproses checkout pesanan',
      data: { error: error.message },
    });
  }
}

/**
 * GET /api/cart/orders/:id
 * Mengambil struk / ringkasan pesanan yang baru dibuat
 */
function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return sendResponse(res, {
        code: 404,
        success: false,
        message: `Pesanan #${id} tidak ditemukan`,
      });
    }

    if (order.user_id !== getUserId(req)) {
      return sendResponse(res, {
        code: 403,
        success: false,
        message: 'Kamu tidak punya akses ke pesanan ini',
      });
    }

    const items = db.prepare(`
      SELECT
        oi.id as order_item_id,
        oi.menu_item_id,
        oi.jumlah,
        oi.harga_satuan,
        oi.subtotal,
        m.nama,
        m.kategori,
        m.gambar
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE oi.order_id = ?
    `).all(id);

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mengambil data pesanan',
      data: {
        ...order,
        items,
      },
    });
  } catch (error) {
    console.error('Error fetching order by id:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal mengambil rincian pesanan',
      data: { error: error.message },
    });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkout,
  getOrderById,
};
