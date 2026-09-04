import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (userRole !== 'admin') {
        logout();
        setError('Akun ini bukan akun Administrator/Staff.');
        setIsSubmitting(false);
        return;
      }

      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-purple-950 via-gray-900 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-900/40 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Portal Staff / Admin</h2>
          <p className="text-sm text-gray-400 mt-1">Khusus pengelola RestoHub</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/80 border border-gray-700/60 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur">
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800/60 rounded-xl flex items-start gap-2.5 text-sm text-red-300">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@resto.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-900/60 text-white border border-gray-700 rounded-xl focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-900/60 text-white border border-gray-700 rounded-xl focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-gray-500 hover:text-gray-300 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 text-sm font-semibold rounded-xl text-white shadow-md transition flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 shadow-purple-900/40 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sebagai Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Halaman ini khusus staff/admin restoran. Pelanggan biasa silakan masuk lewat halaman login utama.
        </p>
      </div>
    </div>
  );
}
