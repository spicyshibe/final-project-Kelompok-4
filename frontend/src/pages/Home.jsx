import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MenuCard from '../components/MenuCard';
import MenuDetailModal from '../components/MenuDetailModal';
import { useHealthCheck } from '../hooks/useHealthCheck';
import HealthBadge from '../components/HealthBadge';
import { apiGet } from '../utils/api';
import { useCart } from '../context/CartContext';
import {
  Utensils,
  ArrowRight,
  ShieldCheck,
  Bot,
  ShoppingBag,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react';

function Home() {
  const { status, data: healthData, checkHealth } = useHealthCheck();
  const { addToCart } = useCart();
  const [featuredMenu, setFeaturedMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const handleAddToCart = async (item, qty = 1) => {
    await addToCart(item, qty);
  };

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await apiGet('/api/menu', { featured: '1' });
        setFeaturedMenu(res.data?.slice(0, 4) || []);
      } catch (err) {
        console.warn('Gagal memuat menu favorit:', err);
      } finally {
        setLoadingFeatured(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white overflow-hidden py-16 sm:py-24">
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-900/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col - Headline */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-amber-100 shadow-sm">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
                <span>Restoran Digital Terintegrasi AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Nikmati Cita Rasa Nusantara, Bebas Cemas Alergen.
              </h1>

              <p className="text-base sm:text-lg text-amber-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Pesan hidangan favoritmu secara daring dengan transparansi bahan makanan, kandungan kalori terukur, serta asisten AI interaktif untuk konsultasi menu yang aman bagi kesehatanmu.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-orange-600 font-extrabold text-sm shadow-xl shadow-black/10 hover:bg-amber-50 active:scale-95 transition-all"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Buka Katalog Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs text-amber-100 bg-black/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>15+ Pilihan Menu Lengkap & Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* Right Col - Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80"
                    alt="Nasi Goreng Spesial"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-orange-600 px-2.5 py-1 rounded-full">
                      Menu Favorit
                    </span>
                    <h3 className="text-xl font-bold mt-2">Nasi Goreng Spesial Resto</h3>
                    <p className="text-xs text-gray-300 mt-1">
                      Aromatik, suwiran ayam, udang segar, telur & acar pilihan.
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20 text-xs">
                      <span className="font-bold text-amber-300 text-sm">Rp 38.000</span>
                      <span className="bg-black/50 px-2 py-0.5 rounded text-amber-200">
                        550 kkal • Alergen Info
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating highlight card */}
                <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Alergen Terfilter</span>
                    <span className="text-[10px] text-gray-500">Cek bahan sebelum checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Kenapa Memesan di Resto Nusantara?
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Solusi kuliner modern dengan kenyamanan dan keamanan pangan terbaik untuk kamu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 text-left hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-orange-500/20">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-1">
                Katalog Menu Transparan
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Setiap hidangan dilengkapi rincian kalori (kkal), porsi, harga jelas, dan peringatan bahan alergen (kacang, seafood, susu, gluten, dll).
              </p>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 text-left hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-amber-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-1">
                Asisten AI Pintar
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tanyakan rekomendasi menu, saran gizi, atau keamanan alergi makanan langsung ke asisten AI yang tersinkron dengan data resep dapur kami.
              </p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 text-left hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-emerald-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-1">
                Pesan & Reservasi Mudah
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Simpan makanan ke keranjang, pesan dalam hitungan detik, atau reservasi meja tanpa antre manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Preview Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilihan Favorit Pelanggan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Menu Terpopuler Hari Ini
            </h2>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
          >
            <span>Lihat Semua 15+ Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Grid */}
        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse space-y-3">
                <div className="h-44 bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMenu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onSelect={(menu) => setSelectedItem(menu)}
                onAddToCart={(menu) => handleAddToCart(menu, 1)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition"
          >
            <span>Jelajahi Seluruh Katalog Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* PAW System Health & Developer Info */}
      <section className="py-8 bg-gray-100 border-t border-gray-200/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  PAW Kelompok 4 — Status Backend & Database
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Fitur Modul: <strong className="text-gray-700">Katalog Menu & Keranjang (Gandhi - 20240140045)</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <HealthBadge status={status} />
              <button
                onClick={checkHealth}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
              >
                Cek Ulang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedItem && (
        <MenuDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <Footer />
    </div>
  );
}

export default Home;
