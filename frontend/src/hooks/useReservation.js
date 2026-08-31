import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../utils/api';

// TODO: ganti hardcoded user_id begitu modul Auth (Amal) selesai
const CURRENT_USER_ID = 1;

export function useReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiGet(`/api/reservations/me?user_id=${CURRENT_USER_ID}`);
      setReservations(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReservation = useCallback(
    async ({ nama_tamu, kontak, tanggal, jam, jumlah_orang }) => {
      const result = await apiPost('/api/reservations', {
        user_id: CURRENT_USER_ID,
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
