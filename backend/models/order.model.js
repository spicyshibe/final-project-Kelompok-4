const db = require('../config/database');

const OrderModel = {
  /**
   * Ambil semua daftar pesanan beserta rincian item & data user
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

    // Ambil order items untuk setiap order
    const getItemsStmt = db.prepare(`
      SELECT id, menu_item_id, nama_item, jumlah, harga_satuan, subtotal
      FROM order_items
      WHERE order_id = ?
    `);

    return orders.map((order) => ({
      ...order,
      items: getItemsStmt.all(order.id)
    }));
  },

  /**
   * Ambil pesanan berdasarkan ID
   */
  findById(id) {
    const stmt = db.prepare(`
      SELECT 
        o.id, o.user_id, o.total_harga, o.status, o.catatan, o.created_at,
        u.nama as user_nama, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `);
    const order = stmt.get(id);
    if (!order) return null;

    const items = db.prepare(`
      SELECT id, menu_item_id, nama_item, jumlah, harga_satuan, subtotal
      FROM order_items
      WHERE order_id = ?
    `).all(id);

    return {
      ...order,
      items
    };
  },

  /**
   * Update status pesanan (FR-6.3 / FR-10)
   */
  updateStatus(id, status) {
    const stmt = db.prepare(`
      UPDATE orders 
      SET status = ? 
      WHERE id = ?
    `);
    const info = stmt.run(status, id);
    if (info.changes === 0) return null;
    return this.findById(id);
  },

  /**
   * Hapus pesanan
   */
  delete(id) {
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};

module.exports = OrderModel;
