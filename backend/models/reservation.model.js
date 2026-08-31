const db = require('../config/db');

const STATUSES = ['menunggu', 'dikonfirmasi', 'dibatalkan'];
// ponytail: jumlah meja restoran di-hardcode, ganti ke tabel `tables` kalau nanti butuh atur per-meja
const MAX_MEJA_PER_SLOT = 5;

function create({ user_id, tanggal, jam, jumlah_orang }) {
  const stmt = db.prepare(
    `INSERT INTO reservations (user_id, tanggal, jam, jumlah_orang) VALUES (?, ?, ?, ?)`
  );
  const info = stmt.run(user_id, tanggal, jam, jumlah_orang);
  return findById(info.lastInsertRowid);
}

function findById(id) {
  return db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
}

function findByUser(user_id) {
  return db.prepare('SELECT * FROM reservations WHERE user_id = ? ORDER BY tanggal, jam').all(user_id);
}

function findAll() {
  return db.prepare('SELECT * FROM reservations ORDER BY tanggal, jam').all();
}

function isSlotAvailable(tanggal, jam) {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS count FROM reservations WHERE tanggal = ? AND jam = ? AND status != 'dibatalkan'`
    )
    .get(tanggal, jam);
  return row.count < MAX_MEJA_PER_SLOT;
}

function updateStatus(id, status) {
  if (!STATUSES.includes(status)) return null;
  db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
  return findById(id);
}

module.exports = { STATUSES, create, findById, findByUser, findAll, isSlotAvailable, updateStatus };
