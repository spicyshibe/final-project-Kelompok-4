import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiGet } from '../../utils/api';
import { ShieldCheck, Users, UtensilsCrossed, CalendarCheck, ShoppingBag, Server, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setError('');
    try {
      const response = await apiGet('/api/auth/users');
      if (response && response.success && response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat data pengguna.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalAdmin = users.filter((u) => u.role === 'admin').length;
  const totalPelanggan = users.filter((u) => u.role === 'pelanggan').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-purple-200 mb-3 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panel Administrator & Staff
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {user?.nama}!
          </h1>
          <p className="text-sm text-purple-200/90 mt-1 max-w-2xl">
            Kelola operasional restoran, data pengguna, katalog hidangan, reservasi meja, dan status pesanan pelanggan.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-xs text-gray-500 font-medium">Total Akun Terdaftar</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{totalPelanggan}</div>
            <div className="text-xs text-gray-500 font-medium">Pelanggan Aktif</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{totalAdmin}</div>
            <div className="text-xs text-gray-500 font-medium">Staff & Administrator</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online (SQLite)
            </div>
            <div className="text-xs text-gray-500 font-medium">Status Server & DB</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Manajemen Menu Hidangan</h3>
          <p className="text-xs text-gray-500 mb-4">
            Kelola data katalog makanan, minuman, alergen, dan info kalori restoran (Modul Gandhi).
          </p>
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
            Siap Diintegrasikan
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Manajemen Reservasi Meja</h3>
          <p className="text-xs text-gray-500 mb-4">
            Lihat daftar jadwal booking meja, konfirmasi, atau batalkan reservasi pelanggan (Modul Shahky).
          </p>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Siap Diintegrasikan
          </span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Manajemen Status Pesanan</h3>
          <p className="text-xs text-gray-500 mb-4">
            Pantau dan ubah status pesanan masuk: Baru → Diproses → Siap → Selesai (Modul Shahky).
          </p>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            Siap Diintegrasikan
          </span>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Daftar Pengguna Terdaftar</h2>
            <p className="text-xs text-gray-500">Data akun pengguna yang tersimpan di sistem basis data</p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={isLoadingUsers}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nama Pengguna</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Akses</th>
                <th className="py-3 px-4">Waktu Pendaftaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    Belum ada data pengguna.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-500">#{u.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs">
                        {u.nama?.charAt(0)?.toUpperCase()}
                      </div>
                      {u.nama}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {u.created_at ? new Date(u.created_at).toLocaleString('id-ID') : '-'}
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
