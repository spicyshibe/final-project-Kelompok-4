# Presentasi — Aplikasi Web Restoran (Kelompok 4)

## 1. Apa aplikasi ini

Web pesan makanan + reservasi meja restoran, dilengkapi asisten AI buat konsultasi menu, kalori, dan **alergen** — biar pelanggan gak perlu nanya-nanya ke pelayan soal keamanan makanan.

---

## 2. Siapa Ngerjain Apa

| Nama | NIM | Bagian | Folder Kerja |
|---|---|---|---|
| Mohamad Ikhlasul Amal Pakaya | 20240140001 | Login/register + Dashboard Admin | `backend/controllers/auth.*`, `backend/middlewares/`, `frontend/src/pages/admin/` |
| Gandhi Muhammad Bagas Saputra | 20240140045 | Katalog Menu + Keranjang Belanja | `backend/controllers/menu.*`, `cart.*`, `frontend/src/pages/MenuCatalog.jsx`, `CartPage.jsx` |
| Shahky Yandhana Putra | 20240140046 | Reservasi Meja + Lacak Status Pesanan | `backend/controllers/reservation.*`, `order.*`, `frontend/src/pages/Reservation.jsx`, `OrderTracking.jsx` |
| Rafie Rasydan Wahyudi | 20240140074 | Asisten AI + Ulasan Hidangan | `backend/controllers/chat.*`, `review.*`, `frontend/src/components/ChatWidget.jsx`, `ReviewForm.jsx` |

Tiap orang pegang 1 modul penuh (backend & frontend sekaligus), kerja di branch Git masing-masing, baru digabung ke branch utama.

**Struktur folder proyek:**
```
clone-cek/
├── backend/    → Express.js (API, logic, database)
│   ├── controllers/   → logic tiap fitur (auth, menu, cart, dst)
│   ├── routes/        → daftar endpoint API
│   ├── models/         → query ke database
│   └── config/db.js   → skema & koneksi database
└── frontend/   → React (tampilan)
    └── src/
        ├── pages/       → halaman utuh (Home, MenuCatalog, Login, dll)
        ├── components/  → potongan UI yang dipakai berulang
        └── hooks/       → logic ambil data dari backend
```
Pola kerjanya: tiap fitur punya file `<nama>.controller.js` + `<nama>.routes.js` di backend, dan halaman/komponen sendiri di frontend — jadi gampang dilacak siapa ngerjain bagian mana.

---

## 3. Alur Pakai Aplikasi

1. Pelanggan daftar/login
2. Lihat katalog menu (cek kalori & alergen)
3. (Opsional) tanya asisten AI soal rekomendasi/alergen
4. Masukin menu ke keranjang → checkout jadi pesanan
5. Pantau status pesanan sampai selesai
6. Kasih ulasan menu yang udah dipesan

Sementara itu Admin punya dashboard sendiri buat kelola menu, konfirmasi reservasi, dan update status pesanan.

---

## 4. Fitur Andalan: Asisten AI Anti-Alergen

**Masalahnya:** pelanggan alergi susah mastiin menu aman tanpa nanya pelayan.

**Solusinya:** chatbot yang jawabannya **selalu berdasarkan data menu asli di database** restoran (bukan ngarang), dan **cuma boleh bahas soal restoran ini**.

**Cara kerjanya, simpelnya:**
1. Tiap ada pertanyaan masuk, sistem ambil semua data menu + alergennya langsung dari database
2. Data itu "dikasih tau" ke AI sebelum AI jawab, plus aturan: harus jujur, dilarang ngarang, maksimal kasih 3 rekomendasi kalau soal alergen (biar gak muter-muter)
3. AI baru jawab pertanyaan pelanggan, filter otomatis mana menu yang aman/berbahaya dari data itu

**Contoh:** pelanggan bilang "saya alergi udang, rekomendasi apa?" → AI cek data alergen semua menu → jawab 3 menu yang beneran bebas seafood, sambil selalu ingetin "tetap konfirmasi ke staf untuk alergi berat".

---

## 5. Keamanan

- Password di-hash, gak disimpan mentahan
- Login pakai token (JWT), data pesanan/keranjang cuma bisa diakses pemiliknya sendiri
- Admin gak bisa dibikin sembarangan lewat form daftar biasa

---

## 6. Link Demo

- **Website:** https://frontend-coral-sigma-62.vercel.app
- **Login pelanggan:** `/login` — **login admin:** `/admin/login`
- Akun demo ada di `CREDENTIALS.md`
