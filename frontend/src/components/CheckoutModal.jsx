import { useState } from 'react';
import { X, ShoppingBag, Utensils, Home, User, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { formatRupiah } from '../utils/currency';

function CheckoutModal({ cart, onClose, onConfirm }) {
  const [namaPemesan, setNamaPemesan] = useState('');
  const [jenisPesanan, setJenisPesanan] = useState('Makan di Tempat (Dine In)');
  const [nomorMeja, setNomorMeja] = useState('Meja 01');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaPemesan.trim()) {
      setErrorMsg('Silakan masukkan nama pemesan terlebih dahulu');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await onConfirm({
        nama_pemesan: namaPemesan.trim(),
        jenis_pesanan: jenisPesanan,
        nomor_meja: jenisPesanan.includes('Dine In') ? nomorMeja : '',
        catatan: catatan.trim(),
      });
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses checkout');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Konfirmasi Checkout</h3>
              <p className="text-xs text-gray-500">{cart.total_items} item di keranjang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-600" />
              <span>Nama Pemesan *</span>
            </label>
            <input
              type="text"
              required
              value={namaPemesan}
              onChange={(e) => setNamaPemesan(e.target.value)}
              placeholder="Masukkan nama kamu (contoh: Gandhi B.)"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white text-gray-800 transition"
            />
          </div>

          {/* Dining Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Tipe Pesanan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setJenisPesanan('Makan di Tempat (Dine In)')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  jenisPesanan.includes('Dine In')
                    ? 'bg-orange-50 text-orange-700 border-orange-400 shadow-xs'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Makan di Tempat</span>
              </button>

              <button
                type="button"
                onClick={() => setJenisPesanan('Bawa Pulang (Take Away)')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  jenisPesanan.includes('Take Away')
                    ? 'bg-orange-50 text-orange-700 border-orange-400 shadow-xs'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Bawa Pulang</span>
              </button>
            </div>
          </div>

          {/* Table Number (if Dine In) */}
          {jenisPesanan.includes('Dine In') && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Nomor Meja
              </label>
              <select
                value={nomorMeja}
                onChange={(e) => setNomorMeja(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white text-gray-800 transition cursor-pointer"
              >
                {Array.from({ length: 15 }, (_, i) => `Meja ${String(i + 1).padStart(2, '0')}`).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
              <span>Catatan Khusus (Opsional)</span>
            </label>
            <textarea
              rows="2"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Sambal dipisah, tidak pakai es, dll."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white text-gray-800 transition"
            />
          </div>

          {/* Order Summary Recap */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Ringkasan Pesanan
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs text-gray-600 pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="line-clamp-1">
                    {item.jumlah}x {item.nama}
                  </span>
                  <span className="font-semibold text-gray-800 ml-2">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-sm text-gray-900">Total Pembayaran:</span>
              <span className="font-extrabold text-base text-orange-600">
                {formatRupiah(cart.total_price)}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Pesanan...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Konfirmasi Pesanan ({formatRupiah(cart.total_price)})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;
