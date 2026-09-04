import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/currency';
import CheckoutModal from './CheckoutModal';
import OrderSuccessModal from './OrderSuccessModal';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Utensils,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
  } = useCart();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  if (!isCartOpen) return null;

  const handleCheckoutConfirm = async (formData) => {
    const result = await checkout(formData);
    setShowCheckoutModal(false);
    setOrderSuccessData(result);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 max-w-md w-full bg-white shadow-2xl flex flex-col animate-slideLeft border-l border-gray-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Keranjang Pesanan</h3>
              <p className="text-xs text-gray-500">{cart.total_items} hidangan dipilih</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Utensils className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-800 text-base">Keranjangmu Masih Kosong</h4>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Pilih menu nusantara favoritmu di katalog hidangan untuk mulai memesan.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                Jelajahi Menu Sekarang
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                {/* Food Image */}
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                        {item.nama}
                      </h4>
                      <span className="text-[11px] text-gray-400 block">
                        {formatRupiah(item.harga)} / porsi
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-600 transition p-1"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Allergen chips if any */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-1.5">
                      {item.allergens.map((alg) => (
                        <span
                          key={alg.id || alg.nama_alergen}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60"
                        >
                          {alg.label || alg.nama_alergen}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stepper & Subtotal */}
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.id, item.jumlah - 1)}
                        className="w-6 h-6 rounded-lg bg-white text-gray-700 hover:bg-gray-200 flex items-center justify-center transition shadow-2xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-gray-800">
                        {item.jumlah}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.jumlah + 1)}
                        className="w-6 h-6 rounded-lg bg-white text-gray-700 hover:bg-gray-200 flex items-center justify-center transition shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-sm text-gray-900">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.total_items} menu):</span>
                <span className="font-semibold text-gray-800">{formatRupiah(cart.total_price)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Biaya Layanan Resto:</span>
                <span className="font-semibold">Gratis (Rp 0)</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Total Pembayaran:</span>
                <span className="text-lg font-black text-orange-600">
                  {formatRupiah(cart.total_price)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={clearCart}
                className="p-3 rounded-2xl bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-600 transition text-xs font-semibold flex items-center justify-center"
                title="Kosongkan Semua"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowCheckoutModal(true)}
                className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
              >
                <span>Lanjut Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal Form */}
      {showCheckoutModal && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckoutModal(false)}
          onConfirm={handleCheckoutConfirm}
        />
      )}

      {/* Order Success Modal Receipt */}
      {orderSuccessData && (
        <OrderSuccessModal
          orderData={orderSuccessData}
          onClose={() => setOrderSuccessData(null)}
        />
      )}
    </>
  );
}

export default CartDrawer;
