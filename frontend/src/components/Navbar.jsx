import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Navbar() {
  const location = useLocation();
  const { cart, toggleCart } = useCart();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Katalog Menu', path: '/menu' },
    { name: 'Keranjang', path: '/cart' },
    { name: 'Reservasi Meja', path: '/reservasi', badge: 'Segera' },
    { name: 'Lacak Pesanan', path: '/tracking', badge: 'Segera' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-gray-900 tracking-tight block leading-tight">
                Resto<span className="text-orange-600">Nusantara</span>
              </span>
              <span className="text-[10px] font-medium text-gray-400 block tracking-wider uppercase">
                Autentik & Higienis
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-200/60">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 relative ${
                    active
                      ? 'bg-white text-orange-600 shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-200 text-gray-600 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* AI Assistant teaser button */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 rounded-full text-xs font-semibold text-orange-700">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>AI Asisten Menu</span>
            </div>

            {/* Cart Button with Slide Drawer Trigger */}
            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors flex items-center justify-center cursor-pointer"
              title="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.total_items > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cart.total_items}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
