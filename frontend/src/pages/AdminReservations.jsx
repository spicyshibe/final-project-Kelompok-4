import { useAdminReservations, RESERVATION_STATUSES } from '../hooks/useAdminReservations';
import AdminStatusList from '../components/AdminStatusList';

function AdminReservations() {
  const { reservations, loading, error, updateStatus } = useAdminReservations();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800 mb-4">Admin - Kelola Reservasi</h1>

        {loading && <p className="text-sm text-gray-500">Memuat...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && reservations.length === 0 && <p className="text-sm text-gray-500">Belum ada reservasi.</p>}

        <AdminStatusList
          items={reservations}
          statusOptions={RESERVATION_STATUSES}
          onUpdateStatus={updateStatus}
          renderLabel={(r) => `#${r.id} - ${r.tanggal} ${r.jam} - ${r.jumlah_orang} orang (user #${r.user_id})`}
        />
      </div>
    </div>
  );
}

export default AdminReservations;
