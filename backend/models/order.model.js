const db = require('../config/db');

const STATUSES = ['baru', 'diproses', 'siap', 'selesai'];

const getItemsStmt = db.prepare(`
  SELECT oi.id, oi.menu_item_id, m.nama AS nama_item, oi.jumlah, oi.harga_satuan, oi.subtotal
  FROM order_items oi
  LEFT JOIN menu_items m ON m.id = oi.menu_item_id
  WHERE oi.order_id = ?
`);

const OrderModel = {
  STATUSES,

  /**
   * Ambil semua daftar pesanan beserta rincian item & data user (buat admin dashboard)
   */
  findAll({ status, search } = {}) {
    let query = `
      SELECT
        o.id, o.user_id, o.total_harga, o.status, o.catatan, o.created_at,
        u.nama as user_nama, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'semua') {
      query += ` AND o.status = ?`;
      params.push(status);
    }

    if (search && search.trim()) {
      query += ` AND (u.nama LIKE ? OR u.email LIKE ? OR CAST(o.id AS TEXT) LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    query += ` ORDER BY o.id DESC`;

    const orders = db.prepare(query).all(...params);
    return orders.map((order) => ({ ...order, items: getItemsStmt.all(order.id) }));
  },

  findById(id) {
    const order = db
      .prepare(
        `SELECT
          o.id, o.user_id, o.total_harga, o.status, o.catatan, o.created_at,
          u.nama as user_nama, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ?`
      )
      .get(id);
    if (!order) return null;
    return { ...order, items: getItemsStmt.all(id) };
  },

  findByUser(user_id) {
    return db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
  },

  updateStatus(id, status) {
    if (!STATUSES.includes(status)) return null;
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    return this.findById(id);
  },

  delete(id) {
    const info = db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    return info.changes > 0;
  },
};

module.exports = OrderModel;
