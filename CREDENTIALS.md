# Credentials Testing Lokal

Akun buat testing di `localhost:5173`. **Cuma buat dev lokal** — jangan dipake di deploy produksi, ganti semua password sebelum demo/submit kalau perlu.

Akun ini otomatis ke-seed ulang tiap DB fresh (termasuk tiap cold start di Vercel) — gak perlu register manual buat demo.

## Admin

| Email | Password |
|---|---|
| `admin@restonusantara.com` | `admin123` |
| `admin@resto.com` | `admin123` |

Login lewat `/login` → otomatis kebuka akses `/admin/dashboard` (kelola menu, reservasi, pesanan, user).

## Pelanggan

| Email | Password |
|---|---|
| `pelanggan@restonusantara.com` | `pelanggan123` |
| `pelanggan@resto.com` | `pelanggan123` |

Login lewat `/login` → akses fitur pelanggan (menu, cart, reservasi, pesanan, review, chat AI).

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
