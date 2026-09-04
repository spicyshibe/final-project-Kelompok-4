# Credentials Testing

Akun buat testing. **Cuma buat dev/demo** — jangan dipake di deploy produksi beneran, ganti semua password kalau perlu.

Akun `@restonusantara.com` otomatis ke-seed ulang tiap DB fresh (termasuk tiap cold start di Vercel) — gak perlu register manual buat demo.

## URL

| Environment | Frontend | Backend |
|---|---|---|
| Lokal | `http://localhost:5173` | `http://localhost:3000` |
| Production (Vercel) | `https://frontend-coral-sigma-62.vercel.app` | `https://backend-nine-red-61.vercel.app` |

⚠️ Selalu pake URL alias di atas (bukan URL per-deployment yang muncul tiap `vercel deploy`, itu berubah tiap kali deploy).

## Admin

| Email | Password |
|---|---|
| `admin@restonusantara.com` | `admin123` |
| `admin@resto.com` | `admin123` |

Login lewat **`/admin/login`** (bukan `/login` — portal admin dipisah dari login pelanggan) → otomatis kebuka akses `/admin/dashboard` (kelola menu, reservasi, pesanan, user).

## Pelanggan

| Email | Password |
|---|---|
| `pelanggan@restonusantara.com` | `pelanggan123` |
| `pelanggan@resto.com` | `pelanggan123` |

Login lewat `/login` → akses fitur pelanggan (menu, cart, reservasi, pesanan, review, chat AI).

## Chat AI (Gemini)

Key `GEMINI_API_KEY` udah disinkronin antara `.env` lokal dan env var Vercel production (sama-sama key aktif terbaru). Free tier Gemini API kuotanya **20 request/hari per project Google Cloud** — kalau abis, chat AI bakal balikin error 429 sampe reset harian. Key baru dari akun/project Google yang beda = kuota fresh; key baru dari project yang sama = tetep share kuota lama.

## Bikin akun baru

- **Pelanggan**: daftar bebas lewat `/register` — role otomatis `pelanggan`, gak bisa self-assign admin (bug ini udah difix).
- **Admin**: **belum ada UI buat promote user** (User Management di dashboard masih read-only, gak ada tombol ubah role). Buat sementara, promote manual lewat DB:
  ```bash
  cd backend
  node -e "
  const db = require('./config/db');
  db.prepare(\"UPDATE users SET role='admin' WHERE email='EMAIL_USER'\").run();
  "
  ```

## Catatan

- `admin@resto.com`/`pelanggan@resto.com` dibikin manual pas testing sesi ini, tersimpan di DB lokal — kalau DB di-reset (misal fresh clone atau cold start Vercel), cuma 2 akun `@restonusantara.com` di atas yang otomatis ada (dari seeder).
