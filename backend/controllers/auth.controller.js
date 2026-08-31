const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const UserModel = require('../models/user.model');
const sendResponse = require('../utils/response');

/**
 * Helper untuk membuat JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

/**
 * Helper validasi format email
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

const AuthController = {
  /**
   * Register pengguna baru (FR-1.1)
   */
  async register(req, res) {
    try {
      const { nama, email, password, role } = req.body;

      // 1. Validasi input
      if (!nama || !email || !password) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Nama, email, dan password wajib diisi.'
        });
      }

      if (nama.trim().length < 2) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Nama minimal terdiri dari 2 karakter.'
        });
      }

      if (!isValidEmail(email)) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Format email tidak valid.'
        });
      }

      if (password.length < 6) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Password minimal 6 karakter.'
        });
      }

      // 2. Cek apakah email sudah terdaftar
      const existingUser = UserModel.findByEmail(email.trim().toLowerCase());
      if (existingUser) {
        return sendResponse(res, {
          code: 409,
          success: false,
          message: 'Email sudah terdaftar. Silakan login atau gunakan email lain.'
        });
      }

      // 3. Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Default role adalah 'pelanggan'
      const assignedRole = role === 'admin' ? 'admin' : 'pelanggan';

      // 4. Simpan ke database
      const newUser = UserModel.create({
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: assignedRole
      });

      // 5. Generate token JWT
      const token = generateToken(newUser);

      return sendResponse(res, {
        code: 201,
        success: true,
        message: 'Registrasi berhasil. Selamat datang di Restoran Kelompok 4!',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      console.error('Error saat register:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan pada server saat registrasi.'
      });
    }
  },

  /**
   * Login pengguna (FR-1.1 & FR-1.2)
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Validasi input
      if (!email || !password) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Email dan password wajib diisi.'
        });
      }

      // 2. Cari user berdasarkan email
      const user = UserModel.findByEmail(email.trim().toLowerCase());
      if (!user) {
        return sendResponse(res, {
          code: 401,
          success: false,
          message: 'Email atau password salah.'
        });
      }

      // 3. Verifikasi password hash
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return sendResponse(res, {
          code: 401,
          success: false,
          message: 'Email atau password salah.'
        });
      }

      // 4. Data user tanpa password
      const userPayload = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      };

      // 5. Generate token JWT
      const token = generateToken(userPayload);

      return sendResponse(res, {
        code: 200,
        success: true,
        message: `Login berhasil. Selamat datang kembali, ${user.nama}!`,
        data: {
          user: userPayload,
          token
        }
      });
    } catch (error) {
      console.error('Error saat login:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan pada server saat login.'
      });
    }
  },

  /**
   * Ambil data user yang sedang login (FR-1.3)
   */
  async getMe(req, res) {
    try {
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Profil user berhasil diambil.',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      console.error('Error saat getMe:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan saat memuat data profil.'
      });
    }
  },

  /**
   * Update profil pengguna (nama & password)
   */
  async updateProfile(req, res) {
    try {
      const { nama, passwordLama, passwordBaru } = req.body;
      const userId = req.user.id;

      if (!nama || nama.trim().length < 2) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Nama wajib diisi minimal 2 karakter.'
        });
      }

      let updatedPasswordHash = null;

      // Jika user ingin mengubah password
      if (passwordBaru) {
        if (!passwordLama) {
          return sendResponse(res, {
            code: 400,
            success: false,
            message: 'Password saat ini (lama) diperlukan untuk mengubah password baru.'
          });
        }

        if (passwordBaru.length < 6) {
          return sendResponse(res, {
            code: 400,
            success: false,
            message: 'Password baru minimal 6 karakter.'
          });
        }

        const userWithPass = UserModel.findByIdWithPassword(userId);
        const isMatch = await bcrypt.compare(passwordLama, userWithPass.password);
        if (!isMatch) {
          return sendResponse(res, {
            code: 400,
            success: false,
            message: 'Password saat ini salah.'
          });
        }

        updatedPasswordHash = await bcrypt.hash(passwordBaru, 10);
      }

      const updatedUser = UserModel.update(userId, {
        nama: nama.trim(),
        password: updatedPasswordHash
      });

      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Profil berhasil diperbarui.',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      console.error('Error saat updateProfile:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan saat memperbarui profil.'
      });
    }
  },

  /**
   * Ambil daftar semua user (Hanya untuk Admin)
   */
  async getAllUsers(req, res) {
    try {
      const users = UserModel.findAll();
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Daftar pengguna berhasil diambil.',
        data: {
          users
        }
      });
    } catch (error) {
      console.error('Error saat getAllUsers:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan saat mengambil daftar pengguna.'
      });
    }
  }
};

module.exports = AuthController;
