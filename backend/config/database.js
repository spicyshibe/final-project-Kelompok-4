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
 * Inisialisasi skema tabel basis data
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

  // 2. MenuItems table (Menu module & Admin module)
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      deskripsi TEXT,
      harga INTEGER NOT NULL,
      kategori TEXT NOT NULL DEFAULT 'makanan' CHECK(kategori IN ('makanan', 'minuman', 'dessert', 'cemilan')),
      kalori INTEGER DEFAULT 0,
      gambar TEXT,
      is_available INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Allergens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS allergens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_alergen TEXT UNIQUE NOT NULL
    );
  `);

  // 4. MenuItemAllergens (Many-to-many relationship)
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_item_allergens (
      menu_item_id INTEGER NOT NULL,
      allergen_id INTEGER NOT NULL,
      PRIMARY KEY (menu_item_id, allergen_id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
      FOREIGN KEY (allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
    );
  `);

  // 5. Reservations table (Reservation module & Admin module)
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      nama_pemesan TEXT NOT NULL,
      kontak TEXT NOT NULL,
      tanggal TEXT NOT NULL,
      jam TEXT NOT NULL,
      jumlah_orang INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'menunggu' CHECK(status IN ('menunggu', 'dikonfirmasi', 'dibatalkan')),
      catatan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 6. Orders table (Order tracking & Admin module)
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_harga INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'baru' CHECK(status IN ('baru', 'diproses', 'siap', 'selesai', 'dibatalkan')),
      catatan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 7. OrderItems table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      nama_item TEXT NOT NULL,
      jumlah INTEGER NOT NULL,
      harga_satuan INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
    );
  `);

  // Seed default admin and initial test data
  seedInitialData();
}

/**
 * Seed data awal jika tabel masih kosong
 */
function seedInitialData() {
  // Check users
  const checkUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  if (!checkUserStmt.get('admin@restoran.com')) {
    const insertUserStmt = db.prepare(`
      INSERT INTO users (nama, email, password, role)
      VALUES (?, ?, ?, ?)
    `);

    const adminHashedPassword = bcrypt.hashSync('admin123', 10);
    insertUserStmt.run('Admin Restoran', 'admin@restoran.com', adminHashedPassword, 'admin');

    const customerHashedPassword = bcrypt.hashSync('pelanggan123', 10);
    insertUserStmt.run('Pelanggan Demo', 'pelanggan@restoran.com', customerHashedPassword, 'pelanggan');
  }

  // Check allergens
  const allergenCount = db.prepare('SELECT COUNT(*) as count FROM allergens').get().count;
  if (allergenCount === 0) {
    const insertAllergen = db.prepare('INSERT INTO allergens (nama_alergen) VALUES (?)');
    const defaultAllergens = ['Kacang', 'Seafood', 'Gluten', 'Susu/Laktosa', 'Telur', 'Kedelai'];
    for (const a of defaultAllergens) {
      insertAllergen.run(a);
    }
  }

  // Check menu items
  const menuCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count;
  if (menuCount === 0) {
    const insertMenu = db.prepare(`
      INSERT INTO menu_items (nama, deskripsi, harga, kategori, kalori, gambar, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMenuAllergen = db.prepare(`
      INSERT OR IGNORE INTO menu_item_allergens (menu_item_id, allergen_id)
      VALUES (?, ?)
    `);

    const getAllergenId = db.prepare('SELECT id FROM allergens WHERE nama_alergen = ?');

    const sampleMenus = [
      {
        nama: 'Nasi Goreng Spesial RestoHub',
        deskripsi: 'Nasi goreng aromatik dengan suwiran ayam kampung, telur mata sapi, udang bakar, dan kerupuk udang renyah.',
        harga: 38000,
        kategori: 'makanan',
        kalori: 550,
        gambar: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
        is_available: 1,
        allergens: ['Seafood', 'Telur', 'Kedelai']
      },
      {
        nama: 'Ayam Bakar Madu Pedas',
        deskripsi: 'Paha ayam empuk dibakar dengan olesan madu murni dan bumbu rempah pedas manis khas nusantara, disajikan dengan sambal terasi.',
        harga: 42000,
        kategori: 'makanan',
        kalori: 480,
        gambar: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
        is_available: 1,
        allergens: ['Kedelai']
      },
      {
        nama: 'Soto Betawi Kuah Susu Daging Sapi',
        deskripsi: 'Potongan daging sapi empuk dalam kuah rempah susu gurih kaya rasa, disajikan dengan emping dan acar segar.',
        harga: 45000,
        kategori: 'makanan',
        kalori: 520,
        gambar: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=600&auto=format&fit=crop&q=80',
        is_available: 1,
        allergens: ['Susu/Laktosa']
      },
      {
        nama: 'Spaghetti Aglio Olio Salmon',
        deskripsi: 'Pasta al dente ditumis dengan minyak zaitun extra virgin, bawang putih renyah, cabai kering, dan potongan grilled salmon segar.',
        harga: 58000,
        kategori: 'makanan',
        kalori: 490,
        gambar: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=600&auto=format&fit=crop&q=80',
        is_available: 1,
        allergens: ['Gluten', 'Seafood']
      },
      {
        nama: 'Es Teh Leci Mint Segar',
        deskripsi: 'Seduhan teh melati premium berpadu dengan sirup buah leci asli dan daun mint segar yang menyegarkan dahaga.',
        harga: 18000,
        kategori: 'minuman',
        kalori: 110,
        gambar: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        is_available: 1,
        allergens: []
      },
      {
        nama: 'Avocado Coffee Float',
        deskripsi: 'Jus alpukat mentega kental dipadukan dengan espresso roast dan satu scoop es krim vanilla lembut.',
        harga: 28000,
        kategori: 'minuman',
        kalori: 240,
        gambar: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
        is_available: 1,
        allergens: ['Susu/Laktosa']
      },
      {
        nama: 'Matcha Lava Cake',
        deskripsi: 'Kue cokelat leleh dengan isian matcha Uji Jepang yang lumer saat dipotong, disajikan dengan es krim vanilla.',
        harga: 32000,
        kategori: 'dessert',
        kalori: 360,
        gambar: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
        is_available: 1,
        allergens: ['Gluten', 'Susu/Laktosa', 'Telur']
      }
    ];

    for (const menu of sampleMenus) {
      const res = insertMenu.run(
        menu.nama,
        menu.deskripsi,
        menu.harga,
        menu.kategori,
        menu.kalori,
        menu.gambar,
        menu.is_available
      );
      const menuId = res.lastInsertRowid;

      for (const aName of menu.allergens) {
        const aRow = getAllergenId.get(aName);
        if (aRow) {
          insertMenuAllergen.run(menuId, aRow.id);
        }
      }
    }
  }

  // Check reservations
  const resCount = db.prepare('SELECT COUNT(*) as count FROM reservations').get().count;
  if (resCount === 0) {
    const insertRes = db.prepare(`
      INSERT INTO reservations (user_id, nama_pemesan, kontak, tanggal, jam, jumlah_orang, status, catatan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const today = new Date().toISOString().split('T')[0];
    insertRes.run(2, 'Pelanggan Demo', '081234567890', today, '19:00', 4, 'menunggu', 'Dekat jendela jika memungkinkan.');
    insertRes.run(null, 'Siti Rahma', '085712349988', today, '20:00', 2, 'dikonfirmasi', 'Meja untuk acara ulang tahun.');
  }

  // Check orders
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  if (orderCount === 0) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (user_id, total_harga, status, catatan)
      VALUES (?, ?, ?, ?)
    `);

    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, nama_item, jumlah, harga_satuan, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Order 1 (Baru)
    const o1 = insertOrder.run(2, 76000, 'baru', 'Kurangi pedas untuk salah satu nasi goreng.');
    insertOrderItem.run(o1.lastInsertRowid, 1, 'Nasi Goreng Spesial RestoHub', 2, 38000, 76000);

    // Order 2 (Diproses)
    const o2 = insertOrder.run(2, 70000, 'diproses', 'Tambahkan es batu terpisah.');
    insertOrderItem.run(o2.lastInsertRowid, 2, 'Ayam Bakar Madu Pedas', 1, 42000, 42000);
    insertOrderItem.run(o2.lastInsertRowid, 6, 'Avocado Coffee Float', 1, 28000, 28000);
  }
}

// Inisialisasi otomatis
initDatabase();

module.exports = db;
