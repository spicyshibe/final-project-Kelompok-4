import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/api';
import { useAuth } from './useAuth';

export function useOrderTracking() {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setOrders([]); // bersihin dulu biar gak sempet kekilat nampilin data user sebelumnya
    try {
      const result = await apiGet('/api/orders/me');
      setOrders(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // user?.id ikut jadi dependency - kalau ganti akun (logout->login beda user)
    // di tab yang sama, state lama gak nyangkut, langsung fetch ulang punya user baru
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchOrders();
    // near-real-time (FR-6.2): polling tiap 10 detik, bukan websocket - cukup buat status pesanan
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return { orders, loading, error, refresh: fetchOrders };
}
