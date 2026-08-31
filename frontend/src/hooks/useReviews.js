import { useState, useCallback } from 'react';
import { apiGet, apiPost } from '../utils/api';

export function useReviews(menuId) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!menuId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/api/reviews/menu/${menuId}`);
      if (res.success) {
        setReviews(res.data);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [menuId]);

  const submitReview = async (reviewData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiPost('/api/reviews', { ...reviewData, menu_item_id: menuId });
      if (res.success) {
        // Refresh reviews list after successful submission
        await fetchReviews();
        return true;
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    submitReview
  };
}
