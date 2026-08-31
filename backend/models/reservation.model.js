const db = require('../config/db');

const STATUSES = ['menunggu konfirmasi', 'dikonfirmasi', 'dibatalkan'];
// ponytail: jumlah meja restoran di-hardcode, ganti ke tabel `tables` kalau nanti butuh atur per-meja
const MAX_MEJA_PER_SLOT = 5;

const ReservationModel = {
  STATUSES,

  /**
   * Ambil semua daftar reservasi meja, bisa difilter (buat admin dashboard)
   */
  findAll({ status, tanggal, search } = {}) {
    let query = `
      SELECT
        r.id, r.user_id, r.nama_tamu, r.kontak, r.tanggal, r.jam, r.jumlah_orang,
        r.status, r.catatan, r.created_at,
        u.nama as user_nama, u.email as user_email
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'semua') {
      query += ` AND r.status = ?`;
      params.push(status);
    }

    if (tanggal) {
      query += ` AND r.tanggal = ?`;
      params.push(tanggal);
    }

    if (search && search.trim()) {
      query += ` AND (r.nama_tamu LIKE ? OR r.kontak LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    query += ` ORDER BY r.tanggal DESC, r.jam DESC, r.id DESC`;

    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db
      .prepare(
        `SELECT
          r.id, r.user_id, r.nama_tamu, r.kontak, r.tanggal, r.jam, r.jumlah_orang,
          r.status, r.catatan, r.created_at,
          u.nama as user_nama, u.email as user_email
        FROM reservations r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = ?`
      )
      .get(id);
  },

  findByUser(user_id) {
    return db.prepare('SELECT * FROM reservations WHERE user_id = ? ORDER BY tanggal, jam').all(user_id);
  },

  create({ user_id = null, nama_tamu, kontak, tanggal, jam, jumlah_orang, catatan = null }) {
    const stmt = db.prepare(
      `INSERT INTO reservations (user_id, nama_tamu, kontak, tanggal, jam, jumlah_orang, catatan) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(user_id, nama_tamu, kontak, tanggal, jam, jumlah_orang, catatan);
    return this.findById(info.lastInsertRowid);
  },

  isSlotAvailable(tanggal, jam) {
    const row = db
      .prepare(
        `SELECT COUNT(*) AS count FROM reservations WHERE tanggal = ? AND jam = ? AND status != 'dibatalkan'`
      )
      .get(tanggal, jam);
    return row.count < MAX_MEJA_PER_SLOT;
  },

  updateStatus(id, status) {
    if (!STATUSES.includes(status)) return null;
    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
    return this.findById(id);
  },

  delete(id) {
    const info = db.prepare('DELETE FROM reservations WHERE id = ?').run(id);
    return info.changes > 0;
  },
};

module.exports = ReservationModel;
