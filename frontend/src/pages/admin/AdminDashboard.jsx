import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { apiGet } from '../../utils/api';
import { LayoutDashboard, Utensils, Calendar, ShoppingBag, Users, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

import OverviewTab from './components/OverviewTab';
import MenuManagement from './components/MenuManagement';
import ReservationManagement from './components/ReservationManagement';
import OrderManagement from './components/OrderManagement';
import UserManagement from './components/UserManagement';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'menu' | 'reservations' | 'orders' | 'users'
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await apiGet('/api/admin/stats');
      if (res && res.success) {
        setStats(res.data);
      }
    } catch (e) {
      console.warn('Gagal memuat statistik:', e.message);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Ikhtisar', icon: LayoutDashboard },
    { id: 'menu', label: 'Kelola Menu', icon: Utensils, count: stats?.menus?.total_menus },
    { id: 'reservations', label: 'Reservasi Meja', icon: Calendar, count: stats?.reservations?.reservations_pending },
    { id: 'orders', label: 'Status Pesanan', icon: ShoppingBag, count: stats?.orders?.orders_baru },
    { id: 'users', label: 'Pengguna', icon: Users, count: stats?.users?.total_users }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-purple-900/40 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-purple-200 mb-2 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              Panel Kontrol Administrator RestoHub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard Operasional Restoran
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
              Login sebagai: <span className="font-semibold text-white">{user?.nama}</span> ({user?.email})
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={isLoadingStats}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/10 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
            Perbarui Statistik
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200/80 mb-8 overflow-x-auto flex space-x-1 sm:space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] sm:min-w-[150px] py-3 px-3 rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-md shadow-purple-900/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-amber-400 text-purple-950' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'menu' && <MenuManagement />}

          {activeTab === 'reservations' && <ReservationManagement />}

          {activeTab === 'orders' && <OrderManagement />}

          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </div>
  );
}
