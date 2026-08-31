const db = require('../config/db');

const count = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
if (count === 0) {
  const insert = db.prepare('INSERT INTO orders (user_id, total_harga, status) VALUES (?, ?, ?)');
  insert.run(1, 85000, 'baru');
  insert.run(1, 42000, 'diproses');
  insert.run(2, 60000, 'selesai');
  console.log('Seed orders dummy berhasil.');
} else {
  console.log('Orders udah ada data, skip seed.');
}
