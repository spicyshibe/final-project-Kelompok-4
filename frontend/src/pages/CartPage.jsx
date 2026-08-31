import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';
import OrderSuccessModal from '../components/OrderSuccessModal';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/currency';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Utensils,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

function CartPage() {
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
  } = useCart();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  const handleCheckoutConfirm = async (formData) => {
    const result = await checkout(formData);
    setShowCheckoutModal(false);
    setOrderSuccessData(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-amber-100 hover:text-white text-xs font-semibold mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Katalog Menu</span>
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Keranjang Belanja Kamu
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-semibold">
            <ShoppingBag className="w-4 h-4 text-amber-200" />
            <span>{cart.total_items} Item Terpilih</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Keranjang Belanja Masih Kosong
            </h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6 leading-relaxed">
              Kamu belum menambahkan hidangan apapun. Jelajahi katalog kuliner nusantara kami sekarang!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition"
            >
              <Utensils className="w-4 h-4" />
              <span>Lihat Katalog Menu</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="font-bold text-sm text-gray-800">
                  Daftar Pesanan ({cart.items.length} jenis hidangan)
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan Semua</span>
                </button>
              </div>

              {/* Items Card List */}
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    {/* Thumbnail + Name */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80';
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 mb-1 inline-block">
                          {item.kategori}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                          {item.nama}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatRupiah(item.harga)} / porsi
                        </span>

                        {/* Allergen chips */}
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.allergens.map((alg) => (
                              <span
                                key={alg.id || alg.nama_alergen}
                                className="text-[9px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60"
                              >
                                {alg.label || alg.nama_alergen}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stepper + Subtotal + Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      {/* Stepper */}
                      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, item.jumlah - 1)}
                          className="w-7 h-7 rounded-lg bg-white text-gray-700 hover:bg-gray-200 flex items-center justify-center transition shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs sm:text-sm text-gray-800">
                          {item.jumlah}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.jumlah + 1)}
                          className="w-7 h-7 rounded-lg bg-white text-gray-700 hover:bg-gray-200 flex items-center justify-center transition shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-[10px] text-gray-400 block sm:hidden">Subtotal</span>
                        <span className="font-extrabold text-gray-900 text-sm sm:text-base">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Sticky Column */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
                <h3 className="font-extrabold text-base text-gray-900 pb-3 border-b border-gray-100">
                  Ringkasan Transaksi
                </h3>

                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Porsi Makanan:</span>
                    <span className="font-bold text-gray-800">{cart.total_items} porsi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal Harga:</span>
                    <span className="font-bold text-gray-800">{formatRupiah(cart.total_price)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Biaya Layanan Meja:</span>
                    <span className="font-bold">Gratis (Rp 0)</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Pajak Restoran (PB1):</span>
                    <span className="font-bold">Termasuk</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                    <span>Total Tagihan:</span>
                    <span className="text-xl font-black text-orange-600">
                      {formatRupiah(cart.total_price)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Checkout Pesanan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 flex items-center gap-2 text-[11px] text-gray-500 justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pesanan langsung diteruskan ke staf & koki</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckoutModal(false)}
          onConfirm={handleCheckoutConfirm}
        />
      )}

      {/* Order Success Modal */}
      {orderSuccessData && (
        <OrderSuccessModal
          orderData={orderSuccessData}
          onClose={() => setOrderSuccessData(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default CartPage;
