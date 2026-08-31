const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const config = require('./env');

const dbDir = path.resolve(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbFilePath = path.resolve(__dirname, '..', config.dbPath);
const db = new Database(dbFilePath);

// Enable foreign keys and WAL mode for better concurrency & integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Initialize core database tables if they do not exist
 */
function initDatabase() {
  // 1. Users table (Auth module - Amal)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'pelanggan' CHECK(role IN ('pelanggan', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if default admin exists; if not, seed default admin & demo customer
  const checkUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  const adminExists = checkUserStmt.get('admin@restoran.com');

  if (!adminExists) {
    const insertUserStmt = db.prepare(`
      INSERT INTO users (nama, email, password, role)
      VALUES (?, ?, ?, ?)
    `);

    const adminHashedPassword = bcrypt.hashSync('admin123', 10);
    insertUserStmt.run('Admin Restoran', 'admin@restoran.com', adminHashedPassword, 'admin');

    const customerHashedPassword = bcrypt.hashSync('pelanggan123', 10);
    insertUserStmt.run('Pelanggan Demo', 'pelanggan@restoran.com', customerHashedPassword, 'pelanggan');

    console.log('✅ Database berhasil diinisialisasi dengan akun demo admin dan pelanggan.');
  }
}

// Jalankan inisialisasi tabel saat pertama kali modul dimuat
initDatabase();

module.exports = db;
