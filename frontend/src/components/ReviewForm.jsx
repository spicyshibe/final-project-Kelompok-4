import { useState } from 'react';

export default function ReviewForm({ onSubmit, isLoading }) {
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gunakan user_id statis untuk mock auth sementara
    const success = await onSubmit({ user_id: 1, rating, komentar });
    if (success) {
      setRating(5);
      setKomentar('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6">
      <h4 className="text-lg font-semibold mb-3">Tulis Ulasan</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl focus:outline-none transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="komentar" className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
          <textarea
            id="komentar"
            rows="3"
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bagaimana pendapatmu tentang hidangan ini?"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </form>
    </div>
  );
}
