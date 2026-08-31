import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { UtensilsCrossed, ShoppingBag, LogOut, ShieldCheck, Menu as MenuIcon, X } from 'lucide-react';

const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Katalog Menu', path: '/menu' },
  { name: 'Reservasi Meja', path: '/reservasi' },
  { name: 'Lacak Pesanan', path: '/pesanan' },
];

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, toggleCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 tracking-tight block">
                Resto<span className="text-amber-600">Hub</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase block -mt-1">
                Kelompok 4 PAW
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/60">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-white text-amber-600 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/admin/dashboard')
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop: cart + auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors flex items-center justify-center cursor-pointer"
              title="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart?.total_items > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cart.total_items}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-amber-300 hover:bg-amber-50/40 transition group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    {user?.nama?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left pr-1">
                    <span className="text-xs font-semibold text-gray-800 block group-hover:text-amber-600 transition truncate max-w-[120px]">
                      {user?.nama}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                        user?.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg shadow-sm shadow-orange-500/20 transition"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              title="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart?.total_items > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.total_items}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-purple-700 bg-purple-50"
            >
              Dashboard Admin
            </Link>
          )}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  {user?.nama?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{user?.nama}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Pengaturan Profil
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium"
              >
                Keluar (Logout)
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
              >
                Daftar Sekarang
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
