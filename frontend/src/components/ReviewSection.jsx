import { useEffect } from 'react';
import { useReviews } from '../hooks/useReviews';
import ReviewForm from './ReviewForm';

export default function ReviewSection({ menuId }) {
  const { reviews, isLoading, error, fetchReviews, submitReview } = useReviews(menuId);

  useEffect(() => {
    if (menuId) {
      fetchReviews();
    }
  }, [menuId, fetchReviews]);

  // Hitung rata-rata rating
  const averageRating = reviews.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Ulasan Pelanggan</h3>
        {reviews.length > 0 && (
          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
            <span className="text-yellow-500 font-bold mr-1">★</span>
            <span className="font-semibold text-yellow-700">{averageRating}</span>
            <span className="text-gray-500 text-sm ml-1">({reviews.length})</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 && !isLoading ? (
          <p className="text-gray-500 italic">Belum ada ulasan untuk hidangan ini. Jadilah yang pertama!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    {/* Placeholder untuk inisial nama */}
                    U
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">User #{review.user_id}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-400 text-sm">
                  {'★'.repeat(review.rating)}
                  <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                </div>
              </div>
              {review.komentar && (
                <p className="text-gray-700 mt-2 text-sm">{review.komentar}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Tambah Ulasan */}
      <ReviewForm onSubmit={submitReview} isLoading={isLoading} />
    </div>
  );
}
