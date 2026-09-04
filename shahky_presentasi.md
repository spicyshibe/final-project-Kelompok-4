# Presentasi Bagian Shahky — Reservasi Meja & Lacak Status Pesanan

**NIM:** 20240140046 | **Modul PRD:** FR-5.x (Reservasi) + FR-6.x (Order Tracking)

---

## 1. Masalah yang Diselesaikan

- **Reservasi:** pelanggan mau booking meja tanpa telepon/datang langsung, dan sistem harus nyegah 2 rombongan dapet meja yang sama di jam yang sama.
- **Order Tracking:** pelanggan mau tau progress makanannya tanpa nanya-nanya ke dapur.

---

## 2. Lapisan Kode (dari dalam ke luar)

Pola tiap fitur di backend selalu 3 lapis, biar rapi (masing-masing punya tanggung jawab sendiri):

```
Model (query DB)  →  Controller (logic + validasi)  →  Routes (alamat endpoint)
```

### a) Model — `backend/models/reservation.model.js` & `order.model.js`
Isinya murni fungsi yang ngobrol sama database (gak tau apa-apa soal HTTP).

**Reservasi:**
| Fungsi | Ngapain |
|---|---|
| `isSlotAvailable(tanggal, jam)` | Hitung berapa reservasi aktif di slot itu, harus `< 5` (kapasitas meja) |
| `create()` | Simpan reservasi baru |
| `findByUser()` | Reservasi punya 1 orang |
| `findAll()` | Semua reservasi + filter (buat admin) |
| `updateStatus()` | Ubah `menunggu konfirmasi` → `dikonfirmasi`/`dibatalkan` |

**Order Tracking:**
| Fungsi | Ngapain |
|---|---|
| `findByUser()` | Pesanan punya 1 orang |
| `findAll()` | Semua pesanan + detail item (join ke tabel `order_items`+`menu_items`) |
| `updateStatus()` | Ubah `baru → diproses → siap → selesai` |

### b) Controller — `reservation.controller.js` & `order.controller.js`
Nerima request dari luar, validasi, panggil Model, balikin JSON.

```js
function createReservation(req, res) {
  // 1. cek field wajib
  if (!nama_tamu || !kontak || ...) return error 400

  // 2. cek slot bentrok
  if (!reservationModel.isSlotAvailable(tanggal, jam)) return error 409

  // 3. user_id diambil dari TOKEN kalau login, bukan dari body
  const user_id = req.user ? req.user.id : null;

  // 4. baru simpan
  reservationModel.create({ user_id, ... });
}
```

Poin penting: `user_id` **sengaja gak diambil dari input pengguna**. Kalau diambil dari body request, orang bisa aja kirim `user_id` orang lain dan reservasi itu ke-atas-namain orang lain (celah keamanan). Makanya diambil dari token JWT yang udah diverifikasi server.

### c) Routes — `reservation.routes.js` & `order.routes.js`
Daftar alamat + siapa yang boleh akses:

```js
router.post('/', optionalAuth, createReservation);   // boleh tamu, boleh login
router.get('/me', verifyToken, getMyReservations);   // WAJIB login
```

`optionalAuth` vs `verifyToken` — bedanya:
- `verifyToken` → **wajib** ada token valid, kalau enggak ditolak
- `optionalAuth` → token opsional, ada boleh, gak ada juga boleh (dipake di `POST /reservations` karena PRD nyuruh reservasi tetep bisa buat tamu tanpa akun)

---

## 3. Frontend

| File | Fungsi |
|---|---|
| `pages/Reservation.jsx` | Halaman reservasi, gabungin form + hook |
| `components/ReservationForm.jsx` | Form isi tanggal/jam/jumlah orang |
| `hooks/useReservation.js` | Logic fetch/submit ke backend |
| `pages/OrderTracking.jsx` | Halaman lacak pesanan |
| `hooks/useOrderTracking.js` | Fetch status, **polling tiap 10 detik** |

Kenapa polling, bukan WebSocket? Websocket butuh koneksi persisten & infrastruktur ekstra — buat scope tugas kuliah, cukup fetch ulang tiap 10 detik, efeknya kerasa "hampir real-time" tanpa kerumitan tambahan.

---

## 4. Alur Datanya (End-to-End)

**Reservasi:**
```
User isi form → POST /api/reservations → controller cek slot →
model isSlotAvailable() → kalau OK, simpan → balik ke user "berhasil"
```

**Order Tracking:**
```
User checkout di modul Cart (Gandhi) → order tercipta status "baru" →
User buka /pesanan → GET /api/orders/me → tampil daftar + status →
Admin ubah status dari dashboard → user refresh (polling) lihat update
```

---

## 5. Kalau Ditanya Dosen

**Q: Kenapa 1 slot bisa 5 reservasi, bukan 1?**
A: Asumsi restoran punya beberapa meja, jadi 1 jam bisa nampung beberapa rombongan sampai kapasitas penuh (5 meja).

**Q: Kalau 2 orang submit reservasi bersamaan di slot yang sama gimana?**
A: Validasi `isSlotAvailable()` jalan di server tiap request masuk — dicek ulang tiap kali, bukan cuma di frontend, jadi gak bisa dibohongin.

**Q: Kenapa order tracking gak pake status custom per-user?**
A: Status di-standardin (`baru/diproses/siap/selesai`) sama semua order, biar konsisten dan gampang di-manage admin dari 1 dashboard.

**Q: Data reservasi/order kesimpen di mana?**
A: SQLite (`backend/config/db.js`), tabel `reservations` dan `orders`+`order_items` — 1 database yang sama dipakai semua modul lain juga.
