import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UtensilsCrossed, Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('pelanggan'); // 'pelanggan' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || (activeTab === 'admin' ? '/admin/dashboard' : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Silakan isi email dan password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login(email, password);
      const userRole = response?.data?.user?.role;

      if (activeTab === 'admin' && userRole !== 'admin') {
        setError('Akun ini bukan akun Administrator/Staff.');
        setIsSubmitting(false);
        return;
      }

      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from === '/admin/dashboard' ? '/' : from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper quick fill for testing / demo
  const fillDemoAccount = (role) => {
    setError('');
    if (role === 'admin') {
      setActiveTab('admin');
      setEmail('admin@restoran.com');
      setPassword('admin123');
    } else {
      setActiveTab('pelanggan');
      setEmail('pelanggan@restoran.com');
      setPassword('pelanggan123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-amber-50/40 via-white to-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 mb-3">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Selamat Datang Kembali</h2>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akun RestoHub Anda</p>
        </div>

        {/* Tab Role Switcher (FR-1.1 & FR-1.2) */}
        <div className="bg-gray-100/80 p-1 rounded-xl flex mb-6 border border-gray-200/60">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pelanggan');
              setError('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition ${
              activeTab === 'pelanggan'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            👤 Pelanggan
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition ${
              activeTab === 'admin'
                ? 'bg-white text-purple-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🛡️ Staff / Admin
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-700">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-2 py-2.5 px-4 text-sm font-semibold rounded-xl text-white shadow-md transition flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-600/20'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
              } disabled:opacity-60`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk {activeTab === 'admin' ? 'Sebagai Admin' : ''}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Testing Box */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-center mb-3">
              ⚡ Akun Demo Pengujian Cepat
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('pelanggan')}
                className="px-2.5 py-2 text-xs font-medium bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100/80 transition text-left border border-amber-200/60"
              >
                <div className="font-semibold text-amber-900">👤 Pelanggan Demo</div>
                <div className="text-[10px] text-amber-700/80">pelanggan@restoran.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="px-2.5 py-2 text-xs font-medium bg-purple-50 text-purple-800 rounded-lg hover:bg-purple-100/80 transition text-left border border-purple-200/60"
              >
                <div className="font-semibold text-purple-900">🛡️ Admin Demo</div>
                <div className="text-[10px] text-purple-700/80">admin@restoran.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-amber-600 hover:text-amber-700">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
