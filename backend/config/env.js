require('dotenv').config();

/**
 * Semua env variable dibaca SEKALI di sini, bukan langsung process.env
 * tersebar di banyak file. Kalo nambah env variable baru, tinggal
 * tambahin di sini, terus import { config } di file yang butuh -
 * gampang dicari ada env apa aja yang dipake project ini.
 */
// JWT_SECRET WAJIB di-set lewat env - JANGAN kasih fallback hardcode di sini.
// Fallback bakal ke-commit ke repo publik, siapapun bisa baca terus forge token admin.
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET belum di-set di .env - server gak boleh jalan tanpa ini (lihat .env.example)');
}

const config = {
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dbPath: process.env.DB_PATH || './database/restaurant.db',
  geminiApiKey: process.env.GEMINI_API_KEY,
};

module.exports = config;
