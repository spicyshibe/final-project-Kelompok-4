import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../utils/api';
import { useAuth } from './useAuth';

export function useReservation() {
  const { isAuthenticated, user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    if (!isAuthenticated) {
      setReservations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setReservations([]); // bersihin dulu biar gak sempet kekilat nampilin data user sebelumnya
    try {
      const result = await apiGet('/api/reservations/me');
      setReservations(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // user?.id ikut dependency - ganti akun di tab sama, langsung fetch ulang punya user baru
  }, [isAuthenticated, user?.id]);

  const submitReservation = useCallback(
    async ({ nama_tamu, kontak, tanggal, jam, jumlah_orang }) => {
      // Server ambil identitas dari token JWT kalau login - user_id gak dikirim dari client
      const result = await apiPost('/api/reservations', {
        nama_tamu,
        kontak,
        tanggal,
        jam,
        jumlah_orang,
      });
      await fetchReservations();
      return result;
    },
    [fetchReservations]
  );

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return { reservations, loading, error, submitReservation, refresh: fetchReservations };
}
