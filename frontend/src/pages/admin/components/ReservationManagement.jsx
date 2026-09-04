import React, { useState, useEffect } from 'react';
import { apiGet, apiPatch, apiDelete } from '../../../utils/api';
import { Calendar, Clock, Users, Phone, Check, X, Trash2, Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      let path = `/api/admin/reservations?status=${selectedStatus}`;
      if (selectedDate) path += `&tanggal=${selectedDate}`;
      if (searchQuery.trim()) path += `&search=${encodeURIComponent(searchQuery.trim())}`;

      const res = await apiGet(path);
      if (res && res.success) {
        setReservations(res.data.reservations || []);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Gagal memuat daftar reservasi meja.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [selectedStatus, selectedDate]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await apiPatch(`/api/admin/reservations/${id}/status`, { status: newStatus });
      setStatusMessage({ type: 'success', text: res.message });
      fetchReservations();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal mengubah status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus riwayat reservasi ini?')) return;
    try {
      const res = await apiDelete(`/api/admin/reservations/${id}`);
      setStatusMessage({ type: 'success', text: res.message || 'Reservasi berhasil dihapus.' });
      fetchReservations();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus reservasi.' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'dikonfirmasi':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            DIKONFIRMASI
          </span>
        );
      case 'menunggu konfirmasi':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            MENUNGGU KONFIRMASI
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
        <h2 className="text-xl font-bold text-gray-900">Manajemen Reservasi Meja Restoran</h2>
        <p className="text-xs text-gray-500">Konfirmasi atau batalkan permintaan booking meja dari pelanggan</p>
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

      {/* Filter and Date Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Status buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'semua', label: 'Semua Status' },
            { id: 'menunggu konfirmasi', label: 'Menunggu' },
            { id: 'dikonfirmasi', label: 'Dikonfirmasi' },
            { id: 'dibatalkan', label: 'Dibatalkan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedStatus === tab.id
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Filter & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-xs text-gray-400 hover:text-gray-600 p-1"
              title="Reset tanggal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Pemesan</th>
                <th className="py-3 px-4">Jadwal Kedatangan</th>
                <th className="py-3 px-4">Tamu</th>
                <th className="py-3 px-4">Catatan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Konfirmasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    Memuat data reservasi...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    Tidak ada jadwal reservasi meja yang sesuai filter.
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/80 transition">
                    {/* Pemesan */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{res.nama_tamu}</div>
                        <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {res.kontak}
                        </div>
                      </div>
                    </td>

                    {/* Jadwal */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        {res.tanggal}
                      </div>
                      <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        Pukul {res.jam} WIB
                      </div>
                    </td>

                    {/* Tamu */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 font-bold text-gray-800 text-xs">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        {res.jumlah_orang} Orang
                      </div>
                    </td>

                    {/* Catatan */}
                    <td className="py-3.5 px-4">
                      <div className="text-gray-600 text-[11px] max-w-xs truncate">
                        {res.catatan || '- Tidak ada -'}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">{getStatusBadge(res.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'menunggu konfirmasi' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'dikonfirmasi')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition flex items-center gap-1 shadow-sm"
                              title="Konfirmasi Reservasi"
                            >
                              <Check className="w-3.5 h-3.5" /> Terima
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'dibatalkan')}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-[11px] rounded-lg transition flex items-center gap-1 border border-red-200"
                              title="Tolak Reservasi"
                            >
                              <X className="w-3.5 h-3.5" /> Tolak
                            </button>
                          </>
                        )}

                        {res.status === 'dikonfirmasi' && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'dibatalkan')}
                            className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            Batalkan
                          </button>
                        )}

                        {res.status === 'dibatalkan' && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'dikonfirmasi')}
                            className="px-2.5 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          >
                            Pulihkan
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(res.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
