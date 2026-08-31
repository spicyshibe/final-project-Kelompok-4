import React from 'react';
import { DollarSign, ShoppingBag, Calendar, Utensils, Users, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function OverviewTab({ stats, onNavigateTab }) {
  if (!stats) return null;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number || 0);
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'baru':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">BARU</span>;
      case 'diproses':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">DIPROSES</span>;
      case 'siap':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">SIAP</span>;
      case 'selesai':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">SELESAI</span>;
      case 'dibatalkan':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">DIBATALKAN</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getResStatusBadge = (status) => {
    switch (status) {
      case 'dikonfirmasi':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">DIKONFIRMASI</span>;
      case 'menunggu':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">MENUNGGU</span>;
      case 'dibatalkan':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">DIBATALKAN</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pendapatan</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{formatRupiah(stats.revenue)}</div>
          <p className="text-[11px] text-gray-400 mt-1">Akumulasi pesanan valid</p>
        </div>

        {/* Orders */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pesanan</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.orders?.total_orders || 0}</div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
            <span className="text-amber-600 font-semibold">{stats.orders?.orders_baru || 0} baru</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">{stats.orders?.orders_diproses || 0} diproses</span>
          </div>
        </div>

        {/* Reservations Today */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reservasi Hari Ini</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.reservations?.reservations_today || 0}</div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
            <span className="text-amber-600 font-semibold">{stats.reservations?.reservations_pending || 0} menunggu</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">{stats.reservations?.reservations_confirmed || 0} confirmed</span>
          </div>
        </div>

        {/* Menu Catalog */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Katalog Menu</span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{stats.menus?.total_menus || 0}</div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
            <span className="text-emerald-600 font-semibold">{stats.menus?.menus_available || 0} tersedia</span>
            <span>•</span>
            <span className="text-red-500 font-semibold">{stats.menus?.menus_out_of_stock || 0} habis</span>
          </div>
        </div>
      </div>

      {/* 2 Columns: Recent Orders & Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Pesanan Terbaru Masuk</h3>
              <p className="text-xs text-gray-400">Daftar transaksi pesanan pelanggan</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <span>Pesanan #{order.id}</span>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <div className="text-gray-500 text-[11px] mt-0.5">
                      Pemesan: {order.user_nama || 'Tamu'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatRupiah(order.total_harga)}</div>
                    <div className="text-[10px] text-gray-400">
                      {order.created_at ? new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-6">Belum ada pesanan masuk.</p>
          )}
        </div>

        {/* Recent Reservations Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Reservasi Meja Terkini</h3>
              <p className="text-xs text-gray-400">Jadwal kedatangan pelanggan restoran</p>
            </div>
            <button
              onClick={() => onNavigateTab('reservations')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.recentReservations && stats.recentReservations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recentReservations.map((res) => (
                <div key={res.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <span>{res.nama_pemesan}</span>
                      {getResStatusBadge(res.status)}
                    </div>
                    <div className="text-gray-500 text-[11px] mt-0.5">
                      {res.kontak} • {res.jumlah_orang} Orang
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">{res.tanggal}</div>
                    <div className="text-[11px] text-amber-600 font-semibold">Pukul {res.jam}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-6">Belum ada jadwal reservasi.</p>
          )}
        </div>
      </div>
    </div>
  );
}
