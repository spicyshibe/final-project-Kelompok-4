# AGENT.md

Panduan Antigravity (AI coding agent) buat kerja di repo ini — **Aplikasi Web Restoran, Kelompok 4 (PAW)**.

## Ringkasan Proyek
Web pemesanan makanan & reservasi restoran + asisten AI (Gemini API) buat konsultasi menu/kalori/alergen. Lihat `prd_tugas.md` buat detail lengkap (scope, user stories, functional requirements, skema data).

## Tech Stack Aktual (repo ini)
> Beda dari asumsi awal di `prd_tugas.md` (Express+SQLite+Bootstrap server-rendered) — repo ini pake:
- **Backend**: Express.js (Node, CommonJS) — `backend/`
- **Frontend**: React 18 + Vite + React Router + Tailwind CSS — `frontend/`
- **AI**: Gemini API (belum diintegrasi, lihat FR-3.x di prd_tugas.md)
- **DB**: belum ditentukan (PRD sebut SQLite/MySQL — sesuaikan pas mulai fitur Users/MenuItems dll)

Pola existing: backend nambah fitur ikutin pola `routes/<nama>.routes.js` + `controllers/<nama>.controller.js` (contoh: `health.*`). Frontend: page baru → daftar di `src/routes/index.jsx`, logic ke `src/hooks/`, UI reusable ke `src/components/`.

## Struktur Tim & Pembagian Kerja

| Anggota | NIM | Fokus | Modul PRD |
|---|---|---|---|
| Mohamad Ikhlasul Amal Pakaya | 20240140001 | Login/register, dashboard admin | FR-1.x (Auth), FR-8/9/10 terkait dashboard |
| Gandhi Muhammad Bagas Saputra | 20240140045 | Katalog menu, keranjang belanja | FR-2.x (Menu), FR-4.x (Cart) |
| Shahky Yandhana Putra | 20240140046 | Reservasi meja, pelacakan status pesanan | FR-5.x (Reservasi), FR-6.x (Order tracking) |
| Rafie Rasydan Wahyudi | 20240140074 | AI asisten virtual, ulasan hidangan | FR-3.x (AI Chat), FR-7.x (Review) |

Tiap anggota kerja di modul masing-masing, backend+frontend sekaligus untuk fitur yang jadi tanggung jawabnya (full-stack per fitur, bukan dipisah backend-dev/frontend-dev).

## Strategi Branch (per anggota & tugas)

Format: `feature/<nama-pendek>-<fitur>`

| Branch | Anggota | Isi |
|---|---|---|
| `feature/amal-auth` | Amal | Login/register (FR-1.x) |
| `feature/amal-admin-dashboard` | Amal | Dashboard admin (kelola menu/reservasi/pesanan) |
| `feature/gandhi-menu-catalog` | Gandhi | Katalog menu + detail (FR-2.x) |
| `feature/gandhi-cart` | Gandhi | Keranjang belanja & checkout (FR-4.x) |
| `feature/shahky-reservasi` | Shahky | Reservasi meja (FR-5.x) |
| `feature/shahky-order-tracking` | Shahky | Pelacakan status pesanan (FR-6.x) |
| `feature/rafie-ai-assistant` | Rafie | Chat AI Gemini (FR-3.x) |
| `feature/rafie-review` | Rafie | Ulasan/rating hidangan (FR-7.x) |

Aturan:
- Branch dari `main`, PR balik ke `main` setelah fitur jalan (minimal manual test lokal).
- Satu branch = satu modul fitur (jangan campur punya modul lain).
- Kalau butuh fitur modul lain yang belum merge (misal Cart butuh data Menu), pull/rebase dari branch yang bersangkutan, jangan duplikasi kerjaan.
- Model data (skema di §8 prd_tugas.md) shared — diskusi tim dulu sebelum ubah struktur tabel yang dipakai modul lain.

## Auto-Checkout Branch per Anggota

Kalau user nyebut namanya (nama depan/panggilan cukup) di awal sesi — misal "saya Gandhi" atau "ini Rafie" — SEBELUM ngerjain apapun, langsung checkout ke branch anggota itu:

1. Cocokin nama ke tabel alias di bawah.
2. `git status` dulu (cek ada uncommitted changes yang bukan punya branch tujuan — kalau ada, tanya dulu, jangan langsung pindah).
3. `git checkout <branch>` kalau branch udah ada; kalau belum ada, `git checkout -b <branch> main` (branch baru dari `main`).
4. Konfirmasi singkat ke user: branch aktif sekarang apa + fokus modulnya apa (dari tabel Struktur Tim).
5. Baru setelah itu tanya/tunggu instruksi tugas konkret — jangan mulai coding sebelum diminta.

| Alias nama (case-insensitive) | Branch utama | Kalau nyebut fitur kedua |
|---|---|---|
| amal, ikhlasul | `feature/amal-auth` | dashboard/admin → `feature/amal-admin-dashboard` |
| gandhi, bagas | `feature/gandhi-menu-catalog` | cart/keranjang → `feature/gandhi-cart` |
| shahky, yandhana | `feature/shahky-reservasi` | tracking/status pesanan → `feature/shahky-order-tracking` |
| rafie, rasydan | `feature/rafie-ai-assistant` | review/ulasan → `feature/rafie-review` |

Kalau nama disebut bareng fitur spesifik ("saya Gandhi mau kerjain cart"), langsung checkout branch kedua yang sesuai, skip branch utama.

## Catatan Kerja
- API key Gemini disimpan di server (`backend/.env`), jangan pernah expose ke client (NFR Security di PRD).
- Fitur non-AI harus tetap jalan walau Gemini API gagal/timeout (fallback message).
- Password wajib di-hash (bcrypt), validasi input server-side.
- **Commit & push: JANGAN pakai trailer** (no `Co-Authored-By`, no `Claude-Session`, no signature apapun) di commit message manapun.
