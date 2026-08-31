# Product Requirements Document (PRD)
## Aplikasi Web Pemesanan & Reservasi Restoran

| | |
|---|---|
| **Nama Produk** | Aplikasi Web Restoran |
| **Jenis Dokumen** | PRD (Product Requirements Document) |
| **Mata Kuliah** | PAW (Pengembangan Aplikasi Web) — Final Project |
| **Kelompok** | Kelompok 4 |
| **Repositori** | github.com/spicyshibe/final-project-Kelompok-4 |
| **Drive** | [Link Drive](https://drive.google.com/drive/folders/1sPHEKz93JA-2lcrGBdO6YcYv_c2wGv-I?usp=sharing) |
| **Versi Dokumen** | 1.1 |
| **Status** | Draft untuk review tim |

---

## 1. Latar Belakang & Tujuan

### 1.1 Latar Belakang
Pelanggan restoran sering kesulitan memastikan keamanan makanan bagi mereka yang punya alergi tertentu, karena informasi bahan biasanya hanya tersedia lewat tanya langsung ke pelayan. Selain itu, proses pemesanan dan reservasi meja secara manual kurang efisien saat restoran ramai. Aplikasi ini dibangun untuk mendigitalkan pemesanan makanan dan reservasi meja, sekaligus menghadirkan asisten virtual berbasis AI yang bisa menjawab berbagai pertanyaan pelanggan, mulai dari konsultasi menu, kandungan kalori, hingga informasi alergen.

### 1.2 Tujuan Produk
- Memudahkan pelanggan memesan makanan dan reservasi meja secara daring.
- Menyediakan asisten AI interaktif untuk konsultasi menu, cek kalori, alergen, dan pertanyaan seputar hidangan restoran.
- Menyediakan pengalaman restoran digital yang lengkap: katalog menu, keranjang, pelacakan pesanan, dan ulasan.
- Menjadi capstone project PAW yang mendemonstrasikan integrasi AI conversational ke dalam alur transaksi nyata.

### 1.3 Target Pengguna
| Peran | Deskripsi |
|---|---|
| **Pelanggan** | Mendaftar/login, browse menu, konsultasi dengan AI soal menu/kalori/alergen, pesan makanan, reservasi meja, beri ulasan |
| **Admin/Staff Restoran** | Kelola menu, kelola reservasi, kelola status pesanan |

---

## 2. Ruang Lingkup (Scope)

### 2.1 In-Scope
- Login & register pelanggan (dan admin/staff)
- Katalog menu dengan detail hidangan (nama, harga, deskripsi, bahan/alergen, kalori, gambar)
- Keranjang belanja (tambah/ubah/hapus item sebelum checkout)
- Reservasi meja secara daring (pilih tanggal, jam, jumlah orang)
- Pelacakan status pesanan (dari dipesan hingga selesai)
- Ulasan/rating hidangan oleh pelanggan
- **AI Asisten Virtual (Gemini API)**: tanya jawab interaktif seputar menu restoran, rekomendasi hidangan, info kalori, bahan makanan, dan alergen.
- Dashboard admin untuk kelola menu, reservasi, dan status pesanan

### 2.2 Out-of-Scope (untuk versi final project ini)
- Payment gateway pihak ketiga (pembayaran online real)
- Aplikasi mobile native
- Sistem loyalty/poin pelanggan
- Multi-cabang restoran
- Pengantaran/delivery tracking dengan lokasi kurir real-time

---

## 3. Tech Stack

*(Sesuaikan dengan yang benar-benar dipakai tim — berikut asumsi awal konsisten dengan project PAW lain)*

| Layer | Teknologi |
|---|---|
| Backend | Express.js (Node.js) |
| Database | SQLite |
| Frontend/View | HTML + Bootstrap (server-rendered) |
| AI Engine | Gemini API (asisten virtual konsultasi menu) |

---

## 4. Struktur Tim & Pembagian Kerja

| Anggota | NIM | Kemungkinan Fokus *(draft awal, silakan disesuaikan tim)* |
|---|---|---|
| Mohamad Ikhlasul Amal Pakaya | 20240140001 | Login/register, dashboard admin |
| Gandhi Muhammad Bagas Saputra | 20240140045 | Katalog menu, keranjang belanja |
| Shahky Yandhana Putra | 20240140046 | Reservasi meja, pelacakan status pesanan |
| Rafie Rasydan Wahyudi | 20240140074 | AI asisten virtual (konsultasi menu), ulasan hidangan |

> Catatan: pembagian di atas hanya draft berdasarkan urutan fitur — silakan tim diskusikan ulang siapa pegang bagian mana.

---

## 5. User Stories

| ID | Sebagai | Saya ingin | Agar |
|---|---|---|---|
| US-01 | Pelanggan | Mendaftar & login | Bisa memesan makanan dan melakukan reservasi |
| US-02 | Pelanggan | Melihat katalog menu lengkap dengan bahan-bahannya | Tahu apa yang saya pesan sebelum checkout |
| US-03 | Pelanggan | Bertanya ke asisten AI tentang rekomendasi menu, kalori, atau alergen | Mendapatkan informasi mendetail dan personal sebelum memesan |
| US-04 | Pelanggan | Menambah menu ke keranjang dan checkout | Bisa memesan beberapa hidangan sekaligus dengan mudah |
| US-05 | Pelanggan | Melakukan reservasi meja secara daring | Tidak perlu telepon/datang langsung untuk booking meja |
| US-06 | Pelanggan | Melacak status pesanan saya | Tahu kapan makanan saya siap/diantar |
| US-07 | Pelanggan | Memberi ulasan/rating hidangan | Membantu pelanggan lain dan memberi masukan ke restoran |
| US-08 | Admin | Mengelola menu (tambah/ubah/hapus) | Katalog selalu sesuai dengan menu yang tersedia |
| US-09 | Admin | Mengelola reservasi meja | Menghindari bentrok jadwal antar pelanggan |
| US-10 | Admin | Mengubah status pesanan | Pelanggan mendapat info status yang akurat |

---

## 6. Kebutuhan Fungsional (Functional Requirements)

### 6.1 Autentikasi
- FR-1.1: Sistem menyediakan form register & login untuk pelanggan
- FR-1.2: Sistem menyediakan login terpisah/role admin untuk staff restoran
- FR-1.3: Sistem membedakan akses halaman berdasarkan role (pelanggan vs admin)

### 6.2 Katalog Menu
- FR-2.1: Pelanggan dapat melihat daftar menu dengan filter kategori (makanan/minuman/dessert, dll.)
- FR-2.2: Setiap menu menampilkan nama, harga, deskripsi, gambar, info kalori, dan daftar bahan/alergen
- FR-2.3: Admin dapat menambah, mengubah, menghapus data menu beserta detail informasinya

### 6.3 AI Asisten Virtual — Konsultasi Menu
- FR-3.1: Tersedia widget chat AI yang dapat diakses dari halaman web (misal sebagai floating chat atau halaman khusus konsultasi)
- FR-3.2: Pelanggan dapat bertanya bebas seputar menu restoran, misalnya "Apa menu spesial hari ini?", "Berapa kalori nasi goreng?", atau "Menu apa yang aman untuk alergi seafood?"
- FR-3.3: Sistem mengirim pertanyaan pelanggan beserta konteks data menu dari database ke Gemini API, agar jawaban AI akurat sesuai ketersediaan dan resep restoran
- FR-3.4: Sistem menampilkan jawaban AI dalam format percakapan (chat bubble)
- FR-3.5: Sistem menampilkan disclaimer bahwa untuk informasi medis terkait alergi berat, pelanggan tetap disarankan konfirmasi ke staff

### 6.4 Keranjang Belanja
- FR-4.1: Pelanggan dapat menambah menu ke keranjang beserta jumlahnya
- FR-4.2: Pelanggan dapat mengubah jumlah atau menghapus item dari keranjang
- FR-4.3: Sistem menghitung total harga otomatis
- FR-4.4: Pelanggan dapat checkout untuk membuat pesanan dari isi keranjang

### 6.5 Reservasi Meja
- FR-5.1: Pelanggan dapat memilih tanggal, jam, dan jumlah orang untuk reservasi
- FR-5.2: Sistem menampilkan ketersediaan meja/slot waktu (mencegah reservasi bentrok)
- FR-5.3: Admin dapat melihat, mengonfirmasi, atau membatalkan reservasi dari dashboard
- FR-5.4: Pelanggan dapat melihat status reservasi miliknya (menunggu konfirmasi/dikonfirmasi/dibatalkan)

### 6.6 Pelacakan Status Pesanan
- FR-6.1: Setiap pesanan memiliki status (baru → diproses → siap → selesai)
- FR-6.2: Pelanggan dapat melihat status pesanan miliknya secara real-time/near real-time
- FR-6.3: Admin dapat mengubah status pesanan dari dashboard

### 6.7 Ulasan Hidangan
- FR-7.1: Pelanggan yang sudah memesan dapat memberi rating (bintang) dan komentar pada hidangan
- FR-7.2: Ulasan ditampilkan di halaman detail menu terkait
- FR-7.3: Sistem menampilkan rata-rata rating per menu

---

## 7. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Usability** | Widget chat AI harus mudah diakses (idealnya floating button di semua halaman) |
| **Akurasi & Keamanan Informasi** | Jawaban AI soal menu HARUS didasarkan pada data menu yang tersimpan di database restoran, bukan hanya pengetahuan umum model |
| **Performance** | Respons AI idealnya di bawah ~5 detik, tampilkan loading indicator saat menunggu |
| **Security** | Password di-hash (bcrypt), validasi input server-side, API key Gemini disimpan di server (tidak exposed ke client) |
| **Reliability** | Fitur non-AI (menu, keranjang, reservasi) tetap berjalan normal walau Gemini API gagal/timeout |
| **Maintainability** | Struktur folder Express konsisten (routes/controllers/models/views terpisah) |
| **Compatibility** | Responsif untuk diakses dari HP maupun desktop |

---

## 8. Skema Data (Ringkasan Entitas)

- **Users**: id, nama, email, password (hashed), role (pelanggan/admin)
- **MenuItems**: id, nama, deskripsi, harga, kategori, kalori, gambar
- **Allergens**: id, nama_alergen (misal: kacang, seafood, susu, gluten)
- **MenuItemAllergens** *(relasi many-to-many)*: menu_item_id, allergen_id
- **Cart / CartItems**: id, user_id, menu_item_id, jumlah
- **Orders**: id, user_id, total_harga, status, created_at
- **OrderItems**: id, order_id, menu_item_id, jumlah, subtotal
- **Reservations**: id, user_id, tanggal, jam, jumlah_orang, status (menunggu/dikonfirmasi/dibatalkan)
- **Reviews**: id, user_id, menu_item_id, rating, komentar, created_at
- **ChatHistory** *(opsional, untuk asisten AI)*: id, user_id, pesan, role (user/ai), timestamp

---

## 9. Alur Utama (User Flow)

### 9.1 Alur Pemesanan Makanan
1. Pelanggan login → browse katalog menu
2. Pelanggan menggunakan chat AI untuk konsultasi rekomendasi menu, kalori, atau info alergen (opsional)
3. Pelanggan tambah menu ke keranjang
4. Pelanggan checkout → pesanan tercatat dengan status "baru"
5. Pelanggan melacak status pesanan hingga "selesai"
6. Setelah pesanan selesai, pelanggan dapat memberi ulasan pada hidangan yang dipesan

### 9.2 Alur Reservasi Meja
1. Pelanggan login → buka halaman reservasi
2. Pilih tanggal, jam, dan jumlah orang
3. Sistem cek ketersediaan → pelanggan submit reservasi (status "menunggu konfirmasi")
4. Admin mengonfirmasi reservasi dari dashboard
5. Pelanggan melihat status reservasi terkonfirmasi

### 9.3 Alur Admin
1. Admin login → dashboard
2. Kelola menu (tambah/ubah/hapus beserta detail kalori dan alergen)
3. Kelola reservasi (konfirmasi/tolak)
4. Update status pesanan yang masuk

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| AI memberikan rekomendasi hidangan atau informasi gizi yang tidak akurat | Ekspektasi pelanggan meleset, risiko kesehatan | Selalu sertakan data menu dari database sebagai konteks prompt, tambahkan disclaimer di UI |
| Reservasi bentrok pada slot waktu yang sama | Pengalaman pelanggan buruk, komplain | Validasi ketersediaan slot di server-side sebelum menyimpan reservasi |
| Rate limit Gemini API saat banyak pelanggan bertanya bersamaan | Chat AI lambat/gagal merespons | Test dengan API key sendiri per anggota saat development, tampilkan pesan fallback jika API gagal |
| Ulasan spam/tidak relevan | Menurunkan kualitas informasi ulasan | Batasi ulasan hanya untuk pelanggan yang sudah pernah memesan menu tersebut |

---

## 11. Kriteria Keberhasilan (Definition of Done)

- Pelanggan dapat register/login, browse menu, checkout pesanan, dan reservasi meja end-to-end
- Chat AI asisten berhasil menjawab pertanyaan dan konsultasi pengguna berdasarkan data menu yang tersimpan di database
- Admin dapat mengelola menu, reservasi, dan status pesanan dari dashboard
- Pelacakan status pesanan dan fitur ulasan berjalan sesuai alur
- UI responsif di desktop maupun HP
- Repository dapat dijalankan ulang tanpa error oleh dosen penguji

---

*Dokumen ini adalah PRD untuk Aplikasi Web Restoran, Kelompok 4. Bagian tech stack dan pembagian tugas masih berupa asumsi/draft — sesuaikan dengan kondisi tim yang sebenarnya.*
