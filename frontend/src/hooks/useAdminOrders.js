import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch } from '../utils/api';

export const ORDER_STATUSES = ['baru', 'diproses', 'siap', 'selesai'];

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiGet('/api/orders');
      setOrders(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (id, status) => {
      await apiPatch(`/api/orders/${id}/status`, { status });
      await fetchAll();
    },
    [fetchAll]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { orders, loading, error, updateStatus, refresh: fetchAll };
}
