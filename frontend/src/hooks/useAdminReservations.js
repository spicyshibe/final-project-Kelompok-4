import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch } from '../utils/api';

export const RESERVATION_STATUSES = ['menunggu', 'dikonfirmasi', 'dibatalkan'];

export function useAdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiGet('/api/reservations');
      setReservations(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (id, status) => {
      await apiPatch(`/api/reservations/${id}/status`, { status });
      await fetchAll();
    },
    [fetchAll]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { reservations, loading, error, updateStatus, refresh: fetchAll };
}
