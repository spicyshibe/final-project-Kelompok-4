import { useState } from 'react';

function ReservationForm({ onSubmit }) {
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ tanggal, jam, jumlah_orang: Number(jumlahOrang) });
      setTanggal('');
      setJam('');
      setJumlahOrang(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
        <input
          type="time"
          value={jam}
          onChange={(e) => setJam(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Orang</label>
        <input
          type="number"
          min="1"
          value={jumlahOrang}
          onChange={(e) => setJumlahOrang(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg"
      >
        {submitting ? 'Memproses...' : 'Reservasi Sekarang'}
      </button>
    </form>
  );
}

export default ReservationForm;
