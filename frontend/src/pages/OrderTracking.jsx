import { useOrderTracking } from '../hooks/useOrderTracking';
import StatusBadge from '../components/StatusBadge';

function OrderTracking() {
  const { orders, loading, error, refresh } = useOrderTracking();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-800">Status Pesanan</h1>
          <button onClick={refresh} className="text-xs text-blue-600 font-semibold">
            Refresh
          </button>
        </div>

        {loading && <p className="text-sm text-gray-500">Memuat...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && orders.length === 0 && <p className="text-sm text-gray-500">Belum ada pesanan.</p>}

        <ul className="space-y-2">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
              <span>
                Pesanan #{o.id} · Rp{o.total_harga.toLocaleString('id-ID')}
              </span>
              <StatusBadge status={o.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderTracking;
