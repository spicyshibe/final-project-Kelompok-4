import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../utils/api';

/**
 * Custom hook untuk mengelola data katalog menu, filter, pencarian, dan kategori
 */
export function useMenu(initialParams = {}) {
  const [menuList, setMenuList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState(initialParams.kategori || 'Semua');
  const [searchQuery, setSearchQuery] = useState(initialParams.search || '');
  const [sortBy, setSortBy] = useState(initialParams.sort || 'default');
  const [maxCalories, setMaxCalories] = useState(initialParams.max_kalori || '');

  // Fetch categories metadata
  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiGet('/api/menu/categories/list');
      if (res && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.warn('Gagal memuat kategori:', err.message);
    }
  }, []);

  // Fetch menu items with current filter params
  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'Semua') {
        params.kategori = selectedCategory;
      }
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (sortBy && sortBy !== 'default') {
        params.sort = sortBy;
      }
      if (maxCalories) {
        params.max_kalori = maxCalories;
      }

      const res = await apiGet('/api/menu', params);
      setMenuList(res.data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat katalog menu');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, maxCalories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // Debounce search/filter fetch
    const timer = setTimeout(() => {
      fetchMenu();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchMenu]);

  const resetFilters = () => {
    setSelectedCategory('Semua');
    setSearchQuery('');
    setSortBy('default');
    setMaxCalories('');
  };

  return {
    menuList,
    categories,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    maxCalories,
    setMaxCalories,
    refetch: fetchMenu,
    resetFilters,
  };
}
