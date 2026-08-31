import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/api';

/**
 * Custom hook untuk mengambil detail lengkap suatu menu (termasuk alergen & ulasan)
 */
export function useMenuDetail(menuId) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async (id) => {
    if (!id) {
      setItem(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/api/menu/${id}`);
      setItem(res.data);
    } catch (err) {
      setError(err.message || 'Gagal memuat detail menu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (menuId) {
      fetchDetail(menuId);
    }
  }, [menuId, fetchDetail]);

  return {
    item,
    loading,
    error,
    refetch: () => fetchDetail(menuId),
  };
}
