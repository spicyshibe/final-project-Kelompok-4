const db = require('../config/database');

const ReservationModel = {
  /**
   * Ambil semua daftar reservasi meja beserta relasi user
   */
  findAll({ status, tanggal, search } = {}) {
    let query = `
      SELECT 
        r.id, r.user_id, r.nama_pemesan, r.kontak, r.tanggal, r.jam, r.jumlah_orang,
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
      query += ` AND (r.nama_pemesan LIKE ? OR r.kontak LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    query += ` ORDER BY r.tanggal DESC, r.jam DESC, r.id DESC`;

    return db.prepare(query).all(...params);
  },

  /**
   * Ambil reservasi berdasarkan ID
   */
  findById(id) {
    const stmt = db.prepare(`
      SELECT 
        r.id, r.user_id, r.nama_pemesan, r.kontak, r.tanggal, r.jam, r.jumlah_orang,
        r.status, r.catatan, r.created_at,
        u.nama as user_nama, u.email as user_email
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `);
    return stmt.get(id);
  },

  /**
   * Buat reservasi baru
   */
  create({ user_id = null, nama_pemesan, kontak, tanggal, jam, jumlah_orang, catatan = '' }) {
    const stmt = db.prepare(`
      INSERT INTO reservations (user_id, nama_pemesan, kontak, tanggal, jam, jumlah_orang, status, catatan)
      VALUES (?, ?, ?, ?, ?, ?, 'menunggu', ?)
    `);
    const info = stmt.run(user_id, nama_pemesan, kontak, tanggal, jam, jumlah_orang, catatan);
    return this.findById(info.lastInsertRowid);
  },

  /**
   * Ubah status reservasi (FR-5.3 / FR-9)
   */
  updateStatus(id, status) {
    const stmt = db.prepare(`
      UPDATE reservations 
      SET status = ? 
      WHERE id = ?
    `);
    const info = stmt.run(status, id);
    if (info.changes === 0) return null;
    return this.findById(id);
  },

  /**
   * Hapus reservasi
   */
  delete(id) {
    const stmt = db.prepare('DELETE FROM reservations WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};

module.exports = ReservationModel;
