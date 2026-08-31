import { useAdminOrders, ORDER_STATUSES } from '../hooks/useAdminOrders';
import AdminStatusList from '../components/AdminStatusList';

function AdminOrders() {
  const { orders, loading, error, updateStatus } = useAdminOrders();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800 mb-4">Admin - Kelola Status Pesanan</h1>

        {loading && <p className="text-sm text-gray-500">Memuat...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && orders.length === 0 && <p className="text-sm text-gray-500">Belum ada pesanan.</p>}

        <AdminStatusList
          items={orders}
          statusOptions={ORDER_STATUSES}
          onUpdateStatus={updateStatus}
          renderLabel={(o) => `#${o.id} - Rp${o.total_harga.toLocaleString('id-ID')} (user #${o.user_id})`}
        />
      </div>
    </div>
  );
}

export default AdminOrders;
