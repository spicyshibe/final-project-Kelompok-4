const db = require('../config/db');

const STATUSES = ['baru', 'diproses', 'siap', 'selesai'];

function findById(id) {
  return db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
}

function findByUser(user_id) {
  return db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
}

function updateStatus(id, status) {
  if (!STATUSES.includes(status)) return null;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  return findById(id);
}

module.exports = { STATUSES, findById, findByUser, updateStatus };
