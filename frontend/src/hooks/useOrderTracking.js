import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/api';

// TODO: ganti hardcoded user_id begitu modul Auth (Amal) selesai
const CURRENT_USER_ID = 1;

export function useOrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiGet(`/orders/me?user_id=${CURRENT_USER_ID}`);
      setOrders(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // near-real-time (FR-6.2): polling tiap 10 detik, bukan websocket - cukup buat status pesanan
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return { orders, loading, error, refresh: fetchOrders };
}
