import { CheckCircle2, Clock, Utensils, ArrowRight, Receipt, X } from 'lucide-react';
import { formatRupiah } from '../utils/currency';
import { Link } from 'react-router-dom';

function OrderSuccessModal({ orderData, onClose }) {
  if (!orderData) return null;

  const {
    order_id,
    total_harga,
    nama_pemesan,
    jenis_pesanan,
    nomor_meja,
    catatan,
    items = [],
  } = orderData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative animate-scaleUp p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Pesanan Diterima Dapur
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">
            Terima Kasih, {nama_pemesan}!
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Pesanan kamu dengan nomor{' '}
            <strong className="text-gray-900 font-mono">#ORD-{String(order_id).padStart(4, '0')}</strong>{' '}
            sedang dipersiapkan oleh tim koki.
          </p>
        </div>

        {/* Status Tracker Teaser */}
        <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="text-xs text-orange-950">
            <span className="font-bold block text-sm text-orange-900">Estimasi Selesai: ~15 - 20 Menit</span>
            <span>Status: <strong className="font-semibold">Baru (Menunggu Diproses)</strong></span>
          </div>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs space-y-3 mb-6">
          <div className="flex items-center justify-between font-semibold text-gray-700 border-b border-gray-200 pb-2">
            <span className="flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-gray-500" />
              <span>Rincian Struk</span>
            </span>
            <span className="text-gray-500">{jenis_pesanan} {nomorMeja ? `(${nomorMeja})` : ''}</span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-gray-600">
                <span>{it.jumlah}x {it.nama}</span>
                <span className="font-semibold text-gray-900">{formatRupiah(it.subtotal)}</span>
              </div>
            ))}
          </div>

          {catatan && (
            <p className="text-[11px] text-gray-500 bg-white p-2 rounded-lg border border-gray-200 italic">
              Catatan: "{catatan}"
            </p>
          )}

          <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
            <span>Total Pembayaran:</span>
            <span className="text-base text-orange-600 font-black">{formatRupiah(total_harga)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Utensils className="w-4 h-4" />
            <span>Pesan Menu Lainnya</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessModal;
