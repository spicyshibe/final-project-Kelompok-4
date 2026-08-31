const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'restaurant.sqlite');
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize Database Schema and Tables according to PRD
 */
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('pelanggan', 'admin')) DEFAULT 'pelanggan',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS allergens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_alergen TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      deskripsi TEXT
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      deskripsi TEXT NOT NULL,
      harga INTEGER NOT NULL,
      kategori TEXT NOT NULL CHECK(kategori IN ('Makanan Utama', 'Makanan Pembuka', 'Minuman', 'Dessert')),
      kalori INTEGER NOT NULL,
      gambar TEXT NOT NULL,
      status_tersedia INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menu_item_allergens (
      menu_item_id INTEGER NOT NULL,
      allergen_id INTEGER NOT NULL,
      PRIMARY KEY (menu_item_id, allergen_id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
      FOREIGN KEY (allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      jumlah INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_harga INTEGER NOT NULL,
      status TEXT CHECK(status IN ('baru', 'diproses', 'siap', 'selesai', 'dibatalkan')) DEFAULT 'baru',
      catatan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      jumlah INTEGER NOT NULL,
      harga_satuan INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      nama_tamu TEXT NOT NULL,
      kontak TEXT NOT NULL,
      tanggal TEXT NOT NULL,
      jam TEXT NOT NULL,
      jumlah_orang INTEGER NOT NULL,
      status TEXT CHECK(status IN ('menunggu konfirmasi', 'dikonfirmasi', 'dibatalkan')) DEFAULT 'menunggu konfirmasi',
      catatan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL,
      komentar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    );
  `);

  seedData();
}

/**
 * Seed initial allergens & restaurant menu items if empty
 */
function seedData() {
  const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (countUsers.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, nama, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertUser.run(1, 'Pelanggan Demo', 'pelanggan@restonusantara.com', 'hashed_pass_demo', 'pelanggan');
    insertUser.run(2, 'Admin Resto', 'admin@restonusantara.com', 'hashed_pass_admin', 'admin');
  }

  const countAllergens = db.prepare('SELECT COUNT(*) as count FROM allergens').get();
  if (countAllergens.count === 0) {
    const insertAllergen = db.prepare('INSERT INTO allergens (id, nama_alergen, label, deskripsi) VALUES (?, ?, ?, ?)');
    const allergensData = [
      [1, 'kacang', 'Kacang-kacangan', 'Mengandung kacang tanah atau olahan kacang'],
      [2, 'seafood', 'Seafood / Udang', 'Mengandung udang, kepiting, ikan, atau terasi'],
      [3, 'susu', 'Susu / Laktosa', 'Mengandung susu sapi, keju, atau olahan dairy'],
      [4, 'gluten', 'Gluten / Gandum', 'Mengandung tepung terigu atau gandum'],
      [5, 'telur', 'Telur', 'Mengandung telur ayam'],
      [6, 'kedelai', 'Kedelai', 'Mengandung kedelai, tahu, tempe, atau kecap'],
    ];

    for (const a of allergensData) {
      insertAllergen.run(...a);
    }
  }

  const countMenu = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
  if (countMenu.count === 0) {
    const insertMenu = db.prepare(`
      INSERT INTO menu_items (id, nama, deskripsi, harga, kategori, kalori, gambar, status_tersedia, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const menuData = [
      [
        1,
        'Nasi Goreng Spesial Resto',
        'Nasi goreng aromatik dengan suwiran ayam gurih, udang segar, telur mata sapi, acar segar, dan kerupuk udang renyah.',
        38000,
        'Makanan Utama',
        550,
        'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700&auto=format&fit=crop&q=80',
        1,
        1
      ],
      [
        2,
        'Sate Ayam Madura (10 Tusuk)',
        'Daging ayam pilihan empuk dibakar dengan bumbu kecap rempah, disajikan dengan lontong hangat dan siraman bumbu kacang kental.',
        42000,
        'Makanan Utama',
        480,
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80',
        1,
        1
      ],
      [
        3,
        'Rendang Daging Sapi Padang',
        'Daging sapi pilihan dimasak perlahan berjam-jam dengan santan kelapa murni dan rempah Nusantara otentik hingga gurih meresap.',
        55000,
        'Makanan Utama',
        620,
        'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=700&auto=format&fit=crop&q=80',
        1,
        1
      ],
      [
        4,
        'Sup Iga Sapi Kuah Bening',
        'Iga sapi empuk dalam kuah kaldu rempah hangat beraroma pala dan cengkeh, dilengkapi potongan wortel, kentang, dan taburan bawang goreng.',
        65000,
        'Makanan Utama',
        420,
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ],
      [
        5,
        'Ayam Bakar Taliwang',
        'Ayam kampung bakar dengan bumbu khas Taliwang pedas gurih, disajikan lengkap dengan plecing kangkung segar dan sambal terasi.',
        45000,
        'Makanan Utama',
        510,
        'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ],
      [
        6,
        'Gado-Gado Spesial Penganten',
        'Sayuran rebus segar, tahu, tempe, telur rebus, dan lontong disiram saus kacang kental bertabur emping melinjo renyah.',
        32000,
        'Makanan Pembuka',
        360,
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80',
        1,
        1
      ],
      [
        7,
        'Lumpia Udang Kulit Tahu (3 pcs)',
        'Olahan daging udang dan ayam cincang berbalut kulit kembang tahu goreng garing keemasan, disajikan dengan saus asam manis.',
        28000,
        'Makanan Pembuka',
        290,
        'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ],
      [
        8,
        'Tahu Telur Bumbu Petis',
        'Tahu sutra lembut berbalut telur dadar krispi, disajikan dengan tauge segar dan siraman kuah petis gurih manis khas Jawa Timur.',
        26000,
        'Makanan Pembuka',
        340,
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ],
      [
        9,
        'Es Teh Manis Melati',
        'Seduhan daun teh melati pilihan disajikan dingin dengan gula tebu murni dan es kristal menyegarkan dahaga.',
        8000,
        'Minuman',
        90,
        'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ],
      [
        10,
        'Jus Alpukat Kocok Cokelat',
        'Buah alpukat mentega segar diblender lembut dengan susu kental manis dan lelehan sirup cokelat premium.',
        24000,
        'Minuman',
        310,
        'https://images.unsplash.com/photo-1638176066666-ffb2f5d1e261?w=700&auto=format&fit=crop&q=80',
        1,
        1
      ],
      [
        11,
        'Es Kelapa Muda Jeruk',
        'Perpaduan murni air kelapa muda segar, kerokan daging kelapa, dan perasan jeruk nipis manis segar alami.',
        22000,
        'Minuman',
        120,
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ],
      [
        12,
        'Wedang Jahe Rempah Madu',
        'Minuman hangat tradisi nusantara dari jahe merah bakar, sereh wangi, kayu manis, dan madu murni penghangat tubuh.',
        18000,
        'Minuman',
        85,
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ],
      [
        13,
        'Pisang Goreng Keju Karamel',
        'Pisang raja manis digoreng krispi dengan limpahan keju cheddar parut dan saus karamel lezat.',
        25000,
        'Dessert',
        320,
        'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=700&auto=format&fit=crop&q=80',
        1,
        1
      ],
      [
        14,
        'Es Cendol Durian Segar',
        'Cendol hijau pandan lembut, santan gurih, gula aren cair organik, dipadukan dengan topping daging durian asli.',
        30000,
        'Dessert',
        380,
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ],
      [
        15,
        'Pancake Durian Lumer (2 pcs)',
        'Crepe pandan lembut tipis berisikan whipped cream lembut dan pure daging durian Medan murni yang lumer di mulut.',
        32000,
        'Dessert',
        270,
        'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=700&auto=format&fit=crop&q=80',
        1,
        0
      ]
    ];

    for (const m of menuData) {
      insertMenu.run(...m);
    }

    // Connect menu items to allergens
    const insertMenuAllergen = db.prepare('INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES (?, ?)');
    const relations = [
      [1, 2], // Nasi goreng -> seafood
      [1, 5], // Nasi goreng -> telur
      [1, 6], // Nasi goreng -> kedelai
      [2, 1], // Sate ayam -> kacang
      [2, 6], // Sate ayam -> kedelai
      [5, 2], // Ayam bakar taliwang -> seafood (terasi)
      [6, 1], // Gado-gado -> kacang
      [6, 5], // Gado-gado -> telur
      [6, 6], // Gado-gado -> kedelai
      [7, 2], // Lumpia udang -> seafood
      [7, 4], // Lumpia udang -> gluten
      [7, 5], // Lumpia udang -> telur
      [8, 5], // Tahu telur -> telur
      [8, 6], // Tahu telur -> kedelai
      [8, 2], // Tahu telur -> seafood (petis)
      [10, 3], // Jus alpukat -> susu
      [13, 3], // Pisang goreng keju -> susu
      [13, 4], // Pisang goreng keju -> gluten
      [14, 3], // Es Cendol -> susu/santan
      [15, 3], // Pancake durian -> susu
      [15, 4], // Pancake durian -> gluten
      [15, 5], // Pancake durian -> telur
    ];

    for (const r of relations) {
      insertMenuAllergen.run(...r);
    }
  }
}

// Auto init on import
initDatabase();

module.exports = db;
