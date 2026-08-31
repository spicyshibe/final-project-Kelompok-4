const db = require('../config/database');

const MenuModel = {
  /**
   * Ambil semua menu beserta relasi alergen
   */
  findAll({ kategori, search, isAvailable } = {}) {
    let query = `
      SELECT 
        m.id, m.nama, m.deskripsi, m.harga, m.kategori, m.kalori, m.gambar, m.is_available, m.created_at,
        GROUP_CONCAT(a.nama_alergen, ', ') as allergens_str
      FROM menu_items m
      LEFT JOIN menu_item_allergens ma ON m.id = ma.menu_item_id
      LEFT JOIN allergens a ON ma.allergen_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (kategori && kategori !== 'semua') {
      query += ` AND m.kategori = ?`;
      params.push(kategori);
    }

    if (isAvailable !== undefined && isAvailable !== null && isAvailable !== '') {
      query += ` AND m.is_available = ?`;
      params.push(Number(isAvailable));
    }

    if (search && search.trim()) {
      query += ` AND (m.nama LIKE ? OR m.deskripsi LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    query += ` GROUP BY m.id ORDER BY m.id DESC`;

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map((row) => ({
      ...row,
      allergens: row.allergens_str ? row.allergens_str.split(', ') : [],
      is_available: Boolean(row.is_available)
    }));
  },

  /**
   * Ambil detail menu berdasarkan ID
   */
  findById(id) {
    const stmt = db.prepare(`
      SELECT 
        m.id, m.nama, m.deskripsi, m.harga, m.kategori, m.kalori, m.gambar, m.is_available, m.created_at,
        GROUP_CONCAT(a.nama_alergen, ', ') as allergens_str
      FROM menu_items m
      LEFT JOIN menu_item_allergens ma ON m.id = ma.menu_item_id
      LEFT JOIN allergens a ON ma.allergen_id = a.id
      WHERE m.id = ?
      GROUP BY m.id
    `);
    const row = stmt.get(id);
    if (!row) return null;

    return {
      ...row,
      allergens: row.allergens_str ? row.allergens_str.split(', ') : [],
      is_available: Boolean(row.is_available)
    };
  },

  /**
   * Tambah menu baru (FR-2.3 / FR-8)
   */
  create({ nama, deskripsi, harga, kategori, kalori = 0, gambar = '', allergens = [] }) {
    const stmt = db.prepare(`
      INSERT INTO menu_items (nama, deskripsi, harga, kategori, kalori, gambar, is_available)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(nama, deskripsi, harga, kategori, kalori, gambar);
    const menuId = info.lastInsertRowid;

    // Handle allergens
    if (Array.isArray(allergens) && allergens.length > 0) {
      this.syncAllergens(menuId, allergens);
    }

    return this.findById(menuId);
  },

  /**
   * Update menu (FR-2.3 / FR-8)
   */
  update(id, { nama, deskripsi, harga, kategori, kalori, gambar, allergens, is_available }) {
    const fields = [];
    const params = [];

    if (nama !== undefined) { fields.push('nama = ?'); params.push(nama); }
    if (deskripsi !== undefined) { fields.push('deskripsi = ?'); params.push(deskripsi); }
    if (harga !== undefined) { fields.push('harga = ?'); params.push(harga); }
    if (kategori !== undefined) { fields.push('kategori = ?'); params.push(kategori); }
    if (kalori !== undefined) { fields.push('kalori = ?'); params.push(kalori); }
    if (gambar !== undefined) { fields.push('gambar = ?'); params.push(gambar); }
    if (is_available !== undefined) { fields.push('is_available = ?'); params.push(is_available ? 1 : 0); }

    if (fields.length > 0) {
      params.push(id);
      const query = `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`;
      db.prepare(query).run(...params);
    }

    if (allergens !== undefined && Array.isArray(allergens)) {
      this.syncAllergens(id, allergens);
    }

    return this.findById(id);
  },

  /**
   * Toggle ketersediaan menu (tersedia / habis)
   */
  toggleAvailability(id) {
    const menu = this.findById(id);
    if (!menu) return null;
    const newStatus = menu.is_available ? 0 : 1;
    db.prepare('UPDATE menu_items SET is_available = ? WHERE id = ?').run(newStatus, id);
    return this.findById(id);
  },

  /**
   * Hapus menu
   */
  delete(id) {
    const stmt = db.prepare('DELETE FROM menu_items WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  },

  /**
   * Helper sinkronisasi relasi alergen
   */
  syncAllergens(menuId, allergenNames) {
    // Hapus relasi lama
    db.prepare('DELETE FROM menu_item_allergens WHERE menu_item_id = ?').run(menuId);

    const getAllergenStmt = db.prepare('SELECT id FROM allergens WHERE nama_alergen = ?');
    const insertAllergenStmt = db.prepare('INSERT INTO allergens (nama_alergen) VALUES (?)');
    const linkStmt = db.prepare('INSERT INTO menu_item_allergens (menu_item_id, allergen_id) VALUES (?, ?)');

    for (const name of allergenNames) {
      if (!name || !name.trim()) continue;
      const cleanName = name.trim();
      let allergenRow = getAllergenStmt.get(cleanName);
      let allergenId;
      if (!allergenRow) {
        const info = insertAllergenStmt.run(cleanName);
        allergenId = info.lastInsertRowid;
      } else {
        allergenId = allergenRow.id;
      }
      linkStmt.run(menuId, allergenId);
    }
  },

  /**
   * Ambil daftar semua jenis alergen yang ada
   */
  getAllAllergens() {
    return db.prepare('SELECT * FROM allergens ORDER BY nama_alergen ASC').all();
  }
};

module.exports = MenuModel;
