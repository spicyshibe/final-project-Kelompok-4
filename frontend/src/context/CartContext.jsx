import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext(null);

const EMPTY_CART = { items: [], total_items: 0, total_price: 0 };

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch cart data from backend - cart cuma ada buat pengguna yang login
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(EMPTY_CART);
      return;
    }
    setCart(EMPTY_CART); // bersihin dulu biar gak sempet kekilat nampilin cart user sebelumnya
    try {
      setLoading(true);
      const res = await apiGet('/api/cart');
      if (res && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.warn('Gagal memuat keranjang:', err.message);
    } finally {
      setLoading(false);
    }
    // user?.id ikut dependency - ganti akun di tab sama, langsung fetch ulang punya user baru
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (menuItem, quantity = 1) => {
    try {
      const res = await apiPost('/api/cart', {
        menu_item_id: menuItem.id,
        jumlah: quantity,
      });
      if (res && res.data) {
        setCart(res.data);
      }
      showToast(`✓ ${quantity}x ${menuItem.nama} masuk ke keranjang`);
      return res;
    } catch (err) {
      showToast(`✗ Gagal menambahkan: ${err.message}`);
      throw err;
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const res = await apiPut(`/api/cart/${cartItemId}`, {
        jumlah: newQuantity,
      });
      if (res && res.data) {
        setCart(res.data);
      }
      return res;
    } catch (err) {
      showToast(`✗ Gagal mengubah jumlah: ${err.message}`);
      throw err;
    }
  };

  // Remove single item
  const removeFromCart = async (cartItemId) => {
    try {
      const res = await apiDelete(`/api/cart/${cartItemId}`);
      if (res && res.data) {
        setCart(res.data);
      }
      showToast('Item dihapus dari keranjang');
      return res;
    } catch (err) {
      showToast(`✗ Gagal menghapus item: ${err.message}`);
      throw err;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const res = await apiDelete('/api/cart');
      if (res && res.data) {
        setCart(res.data);
      }
      showToast('Keranjang berhasil dikosongkan');
      return res;
    } catch (err) {
      showToast(`✗ Gagal mengosongkan keranjang: ${err.message}`);
      throw err;
    }
  };

  // Checkout cart
  const checkout = async (checkoutData) => {
    try {
      setLoading(true);
      const res = await apiPost('/api/cart/checkout', checkoutData);
      // Reset local cart
      setCart({
        items: [],
        total_items: 0,
        total_price: 0,
      });
      setIsCartOpen(false);
      return res.data;
    } catch (err) {
      showToast(`✗ Gagal checkout: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
        refetchCart: fetchCart,
        toastMessage,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900/95 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
}
