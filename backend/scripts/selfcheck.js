// ponytail: assert-based self-check, bukan test suite - jalanin dengan `node scripts/selfcheck.js`
process.env.DB_PATH = ':memory:';
const assert = require('assert');

const reservationModel = require('../models/reservation.model');
const orderModel = require('../models/order.model');

// isSlotAvailable: slot kosong -> true, slot penuh (>= MAX_MEJA_PER_SLOT) -> false
for (let i = 0; i < 5; i++) {
  assert.strictEqual(reservationModel.isSlotAvailable('2026-09-01', '19:00'), true, `slot ke-${i} harusnya masih available`);
  reservationModel.create({ user_id: 1, tanggal: '2026-09-01', jam: '19:00', jumlah_orang: 2 });
}
assert.strictEqual(reservationModel.isSlotAvailable('2026-09-01', '19:00'), false, 'slot harusnya penuh setelah 5 reservasi');

// reservasi dibatalkan tidak menghitung ke kapasitas slot
const list = reservationModel.findAll();
reservationModel.updateStatus(list[0].id, 'dibatalkan');
assert.strictEqual(reservationModel.isSlotAvailable('2026-09-01', '19:00'), true, 'slot harusnya available lagi setelah 1 dibatalkan');

// updateStatus: status invalid ditolak (return null), gak nulis ke DB
const before = reservationModel.findById(list[1].id).status;
assert.strictEqual(reservationModel.updateStatus(list[1].id, 'status-ngasal'), null, 'status invalid harus ditolak');
assert.strictEqual(reservationModel.findById(list[1].id).status, before, 'status gak boleh berubah kalo input invalid');

// order: updateStatus valid & invalid
const order = orderModel.updateStatus;
const db = require('../config/db');
db.prepare("INSERT INTO orders (user_id, total_harga, status) VALUES (1, 50000, 'baru')").run();
const o = orderModel.findAll()[0];
assert.strictEqual(orderModel.updateStatus(o.id, 'diproses').status, 'diproses', 'order status harusnya update ke diproses');
assert.strictEqual(orderModel.updateStatus(o.id, 'ngasal'), null, 'order status invalid harus ditolak');

console.log('selfcheck OK - semua assertion reservasi & order tracking lolos');
