const db = require('../config/database');

const AdminModel = {
  /**
   * Ambil ringkasan statistik menyeluruh untuk Dashboard Admin
   */
  getStats() {
    // 1. Total Pendapatan
    const revenueRow = db.prepare(`
      SELECT COALESCE(SUM(total_harga), 0) as total_revenue
      FROM orders
      WHERE status != 'dibatalkan'
    `).get();

    // 2. Metrik Pesanan
    const ordersRow = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'baru' THEN 1 ELSE 0 END) as orders_baru,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as orders_diproses,
        SUM(CASE WHEN status = 'siap' THEN 1 ELSE 0 END) as orders_siap,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as orders_selesai,
        SUM(CASE WHEN status = 'dibatalkan' THEN 1 ELSE 0 END) as orders_dibatalkan
      FROM orders
    `).get();

    // 3. Metrik Reservasi
    const today = new Date().toISOString().split('T')[0];
    const resRow = db.prepare(`
      SELECT 
        COUNT(*) as total_reservations,
        SUM(CASE WHEN tanggal = ? THEN 1 ELSE 0 END) as reservations_today,
        SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as reservations_pending,
        SUM(CASE WHEN status = 'dikonfirmasi' THEN 1 ELSE 0 END) as reservations_confirmed
      FROM reservations
    `).get(today);

    // 4. Metrik Menu
    const menuRow = db.prepare(`
      SELECT 
        COUNT(*) as total_menus,
        SUM(CASE WHEN is_available = 1 THEN 1 ELSE 0 END) as menus_available,
        SUM(CASE WHEN is_available = 0 THEN 1 ELSE 0 END) as menus_out_of_stock
      FROM menu_items
    `).get();

    // 5. Metrik Pengguna
    const userRow = db.prepare(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'pelanggan' THEN 1 ELSE 0 END) as total_pelanggan,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as total_admin
      FROM users
    `).get();

    // 6. Recent Orders & Recent Reservations
    const recentOrders = db.prepare(`
      SELECT o.id, o.total_harga, o.status, o.created_at, u.nama as user_nama
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.id DESC LIMIT 5
    `).all();

    const recentReservations = db.prepare(`
      SELECT id, nama_pemesan, kontak, tanggal, jam, jumlah_orang, status
      FROM reservations
      ORDER BY id DESC LIMIT 5
    `).all();

    return {
      revenue: revenueRow.total_revenue,
      orders: ordersRow,
      reservations: resRow,
      menus: menuRow,
      users: userRow,
      recentOrders,
      recentReservations
    };
  }
};

module.exports = AdminModel;
