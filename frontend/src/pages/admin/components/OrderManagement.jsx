import React, { useState, useEffect } from 'react';
import { apiGet, apiDelete } from '../../../utils/api';
import { ShoppingBag, ChevronRight, CheckCircle2, Clock, Truck, ChefHat, XCircle, Search, Trash2, AlertCircle, X } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let path = `/api/admin/orders?status=${selectedStatus}`;
      if (searchQuery.trim()) path += `&search=${encodeURIComponent(searchQuery.trim())}`;
      const res = await apiGet(path);
      if (res && res.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Gagal memuat daftar pesanan.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        fetchOrders();
      } else {
        throw new Error(data.message || 'Gagal mengubah status pesanan.');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data pesanan ini?')) return;
    try {
      const res = await apiDelete(`/api/admin/orders/${id}`);
      setStatusMessage({ type: 'success', text: res.message || 'Pesanan berhasil dihapus.' });
      fetchOrders();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus pesanan.' });
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'baru':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            BARU MASUK
          </span>
        );
      case 'diproses':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            SEDANG DIMASAK
          </span>
        );
      case 'siap':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            SIAP DISAJIKAN
          </span>
        );
      case 'selesai':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            SELESAI
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            DIBATALKAN
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manajemen Status Pesanan Masuk</h2>
        <p className="text-xs text-gray-500">Pantau transaksi hidangan pelanggan dan perbarui alur status pesanan (FR-10)</p>
      </div>

      {/* Notification */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage({ type: '', text: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'semua', label: 'Semua Status' },
            { id: 'baru', label: 'Baru' },
            { id: 'diproses', label: 'Diproses' },
            { id: 'siap', label: 'Siap' },
            { id: 'selesai', label: 'Selesai' },
            { id: 'dibatalkan', label: 'Dibatalkan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                selectedStatus === tab.id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID / Nama pemesan..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border border-gray-200">
            Memuat daftar pesanan masuk...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border border-gray-200">
            Tidak ada transaksi pesanan yang sesuai filter.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                    #{order.id}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <span>Pesanan #{order.id}</span>
                      <span className="text-xs font-normal text-gray-500">
                        oleh <span className="font-semibold text-gray-800">{order.user_nama || 'Pelanggan'}</span>
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus Pesanan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Items Detail */}
              <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="font-semibold text-gray-700 uppercase tracking-wider text-[10px]">
                    Rincian Hidangan yang Dipesan:
                  </div>
                  <div className="bg-gray-50/80 p-3 rounded-xl space-y-1.5 border border-gray-100">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-800 font-medium">
                            <span className="font-bold text-amber-600">{item.jumlah}x</span> {item.nama_item}
                          </span>
                          <span className="font-semibold text-gray-900">{formatRupiah(item.subtotal)}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">Tidak ada rincian item.</span>
                    )}
                  </div>
                  {order.catatan && (
                    <p className="text-[11px] text-gray-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
                      Catatan Pelanggan: "{order.catatan}"
                    </p>
                  )}
                </div>

                {/* Total & Action Stepper */}
                <div className="flex flex-col justify-between bg-gray-50/40 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 font-medium">Total Tagihan:</span>
                    <span className="text-lg font-black text-gray-900">{formatRupiah(order.total_harga)}</span>
                  </div>

                  {/* Status Progress Actions */}
                  <div>
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Ubah Status Pesanan:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {order.status === 'baru' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'diproses')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded-lg transition shadow-sm flex items-center gap-1"
                        >
                          <ChefHat className="w-3.5 h-3.5" /> Mulai Masak (Diproses)
                        </button>
                      )}

                      {order.status === 'diproses' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'siap')}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] rounded-lg transition shadow-sm flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" /> Hidangan Siap (Siap)
                        </button>
                      )}

                      {order.status === 'siap' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'selesai')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesaikan Pesanan
                        </button>
                      )}

                      {order.status !== 'selesai' && order.status !== 'dibatalkan' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'dibatalkan')}
                          className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          Batalkan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
