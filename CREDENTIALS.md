# Credentials Testing Lokal

Akun buat testing di `localhost:5173`. **Cuma buat dev lokal** — jangan dipake di deploy produksi, ganti semua password sebelum demo/submit kalau perlu.

## Admin

| Email | Password |
|---|---|
| `admin@resto.com` | `admin123` |

Login lewat `/login` → otomatis kebuka akses `/admin/dashboard` (kelola menu, reservasi, pesanan, user).

## Pelanggan

| Email | Password |
|---|---|
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

- User seed bawaan (`admin@restonusantara.com`, `pelanggan@restonusantara.com`) **gak bisa login** — passwordnya cuma teks placeholder (`hashed_pass_admin`/`hashed_pass_demo`), bukan hash bcrypt asli. Abaikan 2 akun itu.
