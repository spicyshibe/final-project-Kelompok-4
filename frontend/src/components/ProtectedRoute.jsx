import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Komponen pembungkus untuk route yang memerlukan autentikasi dan role tertentu
 * @param {ReactNode} children
 * @param {string|Array<string>} roles - Role yang diizinkan (misal: 'admin' atau ['admin', 'pelanggan'])
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles) {
    const roleList = Array.isArray(roles) ? roles : [roles];
    if (!roleList.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✕
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Akses Terbatas</h2>
            <p className="text-sm text-gray-600 mb-6">
              Halaman ini hanya dapat diakses oleh <span className="font-semibold text-gray-800">{roleList.join('/')}</span>. Anda saat ini login sebagai <span className="capitalize font-semibold text-blue-600">{user.role}</span>.
            </p>
            <a
              href="/"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
}
