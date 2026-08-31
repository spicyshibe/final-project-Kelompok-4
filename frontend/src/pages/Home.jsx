import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useHealthCheck } from '../hooks/useHealthCheck';
import HealthBadge from '../components/HealthBadge';
import { UtensilsCrossed, Calendar, Bot, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { status, data, checkHealth } = useHealthCheck();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-amber-500/10 via-white to-gray-50/50 pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Final Project PAW — Kelompok 4
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Nikmati Pengalaman Kuliner Digital Bersama <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">RestoHub</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Pesan hidangan lezat, reservasi meja secara instan, dan konsultasikan preferensi kalori & alergi makanan dengan Asisten AI kami.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/profile'}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2"
                >
                  {isAdmin ? 'Masuk ke Dashboard Admin' : 'Kelola Profil Saya'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-sm font-semibold rounded-xl transition"
                >
                  Masuk Akun
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Fitur Unggulan RestoHub</h2>
          <p className="text-sm text-gray-500 mt-1">Solusi komprehensif pemesanan dan layanan restoran modern</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Auth & Role */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Autentikasi & Multi-Role</h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Login aman dengan enkripsi kata sandi (bcrypt) & JWT. Pembedaan hak akses antara Pelanggan dan Admin/Staff Restoran.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" /> Modul Auth Aktif
            </div>
          </div>

          {/* Card 2: AI Asisten */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">AI Asisten Menu (Gemini)</h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Konsultasikan rekomendasi hidangan, cek informasi alergen, dan hitung estimasi kalori secara cerdas & interaktif.
            </p>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Modul AI (Rafie)
            </span>
          </div>

          {/* Card 3: Reservasi & Pesanan */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Katalog & Reservasi Meja</h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Pemesanan makanan langsung ke keranjang belanja serta reservasi meja daring tanpa khawatir bentrok jadwal.
            </p>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
              Modul Menu & Reservasi
            </span>
          </div>
        </div>

        {/* Backend Health Check Card (Kept from template) */}
        <div className="mt-12 max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
            Status Koneksi Backend
          </h3>
          <div className="mb-4 flex justify-center">
            <HealthBadge status={status} />
          </div>

          {data && (
            <pre className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-left overflow-x-auto mb-4 text-gray-700 font-mono">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}

          <button
            onClick={checkHealth}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl transition"
          >
            Uji Ulang Koneksi Server
          </button>
        </div>
      </div>
    </div>
  );
}
