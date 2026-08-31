import { useReservation } from '../hooks/useReservation';
import ReservationForm from '../components/ReservationForm';
import StatusBadge from '../components/StatusBadge';

function Reservation() {
  const { reservations, loading, error, submitReservation } = useReservation();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h1 className="text-lg font-bold text-gray-800 mb-4">Reservasi Meja</h1>
          <ReservationForm onSubmit={submitReservation} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-3">Reservasi Saya</h2>
          {loading && <p className="text-sm text-gray-500">Memuat...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && reservations.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada reservasi.</p>
          )}
          <ul className="space-y-2">
            {reservations.map((r) => (
              <li key={r.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                <span>
                  {r.tanggal} · {r.jam} · {r.jumlah_orang} orang
                </span>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
