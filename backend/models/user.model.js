const db = require('../config/database');

const UserModel = {
  /**
   * Cari user berdasarkan email
   * @param {string} email 
   * @returns {object|undefined}
   */
  findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  /**
   * Cari user berdasarkan ID (tanpa password)
   * @param {number} id 
   * @returns {object|undefined}
   */
  findById(id) {
    const stmt = db.prepare('SELECT id, nama, email, role, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  },

  /**
   * Cari user beserta hash password berdasarkan ID
   * @param {number} id 
   * @returns {object|undefined}
   */
  findByIdWithPassword(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  /**
   * Buat user baru
   * @param {object} param0 
   * @returns {object}
   */
  create({ nama, email, password, role = 'pelanggan' }) {
    const stmt = db.prepare(`
      INSERT INTO users (nama, email, password, role)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(nama, email, password, role);
    return {
      id: info.lastInsertRowid,
      nama,
      email,
      role
    };
  },

  /**
   * Update profil user (nama dan/atau password)
   * @param {number} id 
   * @param {object} param1 
   * @returns {object}
   */
  update(id, { nama, password }) {
    if (password) {
      const stmt = db.prepare(`
        UPDATE users 
        SET nama = ?, password = ? 
        WHERE id = ?
      `);
      stmt.run(nama, password, id);
    } else {
      const stmt = db.prepare(`
        UPDATE users 
        SET nama = ? 
        WHERE id = ?
      `);
      stmt.run(nama, id);
    }
    return this.findById(id);
  },

  /**
   * Ambil semua user (untuk admin)
   * @returns {Array}
   */
  findAll() {
    const stmt = db.prepare('SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC');
    return stmt.all();
  }
};

module.exports = UserModel;
