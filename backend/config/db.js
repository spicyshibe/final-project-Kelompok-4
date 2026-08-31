const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Membuat atau membuka file database SQLite di folder root backend
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Gagal terhubung ke database SQLite:', err.message);
  } else {
    console.log('Berhasil terhubung ke database SQLite.');
    
    // Inisialisasi tabel Reviews
    // Note: Tabel Users dan MenuItems akan dibuat oleh anggota lain (Amal/Gandhi), 
    // tapi kita tidak menggunakan foreign key constraint ketat di sini sementara waktu
    // agar fitur review bisa dites mandiri.
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        menu_item_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        komentar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Gagal membuat tabel reviews:', err.message);
      } else {
        console.log('Tabel reviews siap digunakan.');
      }
    });
  }
});

module.exports = db;
