import { Flame, Star, AlertTriangle, Plus, Eye } from 'lucide-react';
import { formatRupiah } from '../utils/currency';

function MenuCard({ item, onSelect, onAddToCart }) {
  const {
    id,
    nama,
    deskripsi,
    harga,
    kategori,
    kalori,
    gambar,
    allergens = [],
    rating_avg = 0,
    review_count = 0,
    is_featured,
    status_tersedia = true,
  } = item;

  const habis = !status_tersedia;

  // Category badge colors
  const categoryStyles = {
    'Makanan Utama': 'bg-amber-100 text-amber-800 border-amber-200',
    'Makanan Pembuka': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Minuman: 'bg-sky-100 text-sky-800 border-sky-200',
    Dessert: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group ${habis ? 'opacity-70' : ''}`}>
      {/* Image & Badges Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onSelect(item)}>
        <img
          src={gambar}
          alt={nama}
          loading="lazy"
          className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ${habis ? 'grayscale' : ''}`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {habis && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-red-600 text-white shadow-lg -rotate-6">
              Habis
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${
              categoryStyles[kategori] || 'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            {kategori}
          </span>

          {is_featured === 1 && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1">
              ⭐ Favorit
            </span>
          )}
        </div>

        {/* Bottom stats over image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{kalori} kkal</span>
          </div>

          {review_count > 0 && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{rating_avg} ({review_count})</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Dish Title */}
          <h3
            onClick={() => onSelect(item)}
            className="font-bold text-gray-900 text-base group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {nama}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">
            {deskripsi}
          </p>

          {/* Allergens warning pills */}
          {allergens && allergens.length > 0 && (
            <div className="mb-3.5">
              <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium mb-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span>Info Alergen:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {allergens.map((alg) => (
                  <span
                    key={alg.id || alg.nama_alergen}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60"
                  >
                    {alg.label || alg.nama_alergen}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Actions footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[10px] text-gray-400 block">Harga</span>
            <span className="font-extrabold text-gray-900 text-base tracking-tight">
              {formatRupiah(harga)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(item)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
              title="Lihat Detail & Gizi"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddToCart ? onAddToCart(item) : onSelect(item)}
              disabled={habis}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-white text-xs font-semibold shadow-sm transition-all ${
                habis
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-orange-600 hover:bg-orange-700 active:scale-95 shadow-orange-500/20'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{habis ? 'Habis' : 'Pesan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
