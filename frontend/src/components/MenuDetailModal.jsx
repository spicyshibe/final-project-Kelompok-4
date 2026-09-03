import { useState } from 'react';
import { X, Flame, Star, AlertTriangle, ShieldCheck, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { formatRupiah } from '../utils/currency';
import ReviewSection from './ReviewSection';

function MenuDetailModal({ item, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) return null;

  const {
    nama,
    deskripsi,
    harga,
    kategori,
    kalori,
    gambar,
    allergens = [],
    rating_avg = 0,
    review_count = 0,
    status_tersedia = true,
  } = item;

  const habis = !status_tersedia;

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    if (habis) return;
    if (onAddToCart) {
      onAddToCart(item, quantity);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  const totalPrice = harga * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 backdrop-blur flex items-center justify-center shadow-md transition-transform hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-gray-100">
          <img
            src={gambar}
            alt={nama}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {habis && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-base font-bold px-5 py-2 rounded-full bg-red-600 text-white shadow-lg -rotate-6">
                Habis
              </span>
            </div>
          )}

          {/* Badges in Image */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-600 shadow-md">
              {kategori}
            </span>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-medium">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{kalori} kkal</span>
              </div>
              {review_count > 0 && (
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-medium">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{rating_avg} ({review_count} ulasan)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{nama}</h2>
              <p className="text-sm text-gray-500 mt-0.5">Resep Autentik Restoran</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 block">Harga Satuan</span>
              <span className="text-2xl font-extrabold text-orange-600">
                {formatRupiah(harga)}
              </span>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Deskripsi Menu
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{deskripsi}</p>
          </div>

          {/* Allergen & Dietary Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Informasi Bahan & Alergen
            </h3>

            {allergens && allergens.length > 0 ? (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Peringatan Alergi: Hidangan ini mengandung bahan berikut</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {allergens.map((alg) => (
                    <div
                      key={alg.id || alg.nama_alergen}
                      className="bg-white/90 border border-amber-300 px-3 py-1 rounded-xl text-xs font-semibold text-amber-900 shadow-xs"
                    >
                      <span>{alg.label || alg.nama_alergen}</span>
                      {alg.deskripsi && (
                        <span className="block text-[10px] font-normal text-amber-700">
                          {alg.deskripsi}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-amber-700 italic">
                  * Catatan: Jika memiliki riwayat alergi berat/spesifik, disarankan untuk mengonfirmasi ulang kepada staff atau tanyakan pada asisten AI kami.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold block">Bebas dari Alergen Utama</span>
                  <span className="text-xs text-emerald-700">
                    Hidangan ini tidak mengandung bahan alergen umum (kacang, seafood, susu, gandum berlebih).
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ulasan Pelanggan (FR-7.2) */}
          <ReviewSection menuId={item.id} />

          {/* Quantity and Add to Cart Bar */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-gray-100 p-1.5 rounded-2xl">
              <span className="text-xs font-semibold text-gray-500 pl-2">Jumlah:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-xl bg-white text-gray-700 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center shadow-xs transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-gray-900 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-xl bg-white text-gray-700 hover:bg-gray-200 flex items-center justify-center shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total and Action button */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-gray-400 block">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={habis}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all ${
                  habis
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-emerald-600 shadow-emerald-500/20'
                    : 'bg-orange-600 hover:bg-orange-700 active:scale-98 shadow-orange-500/25'
                }`}
              >
                {habis ? (
                  <span>Menu Sedang Habis</span>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ditambahkan ke Pesanan!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Tambah ke Pesanan ({formatRupiah(totalPrice)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuDetailModal;
