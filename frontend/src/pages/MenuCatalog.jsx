import { useState } from 'react';
import Footer from '../components/Footer';
import MenuCard from '../components/MenuCard';
import MenuFilter from '../components/MenuFilter';
import MenuDetailModal from '../components/MenuDetailModal';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';
import { Utensils, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

function MenuCatalog() {
  const {
    menuList,
    categories,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    maxCalories,
    setMaxCalories,
    refetch,
    resetFilters,
  } = useMenu();

  const { addToCart } = useCart();
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleAddToCart = async (item, qty = 1) => {
    await addToCart(item, qty);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-amber-600 via-orange-600 to-orange-700 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-amber-100 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Transparan Bahan, Kalori & Alergen</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Katalog Hidangan Nusantara
            </h1>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Jelajahi sajian lezat kami dengan kepastian bahan makanan, info alergi, dan hitungan kalori yang jelas sebelum memesan.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold block text-sm">{menuList.length} Pilihan Menu</span>
              <span className="text-amber-200">100% Halal & Fresh Cooked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <MenuFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          maxCalories={maxCalories}
          onMaxCaloriesChange={setMaxCalories}
          onReset={resetFilters}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h3 className="font-bold text-base mb-1">Gagal Memuat Menu</h3>
            <p className="text-xs text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse space-y-4"
              >
                <div className="h-48 bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && menuList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuList.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onSelect={(menu) => setSelectedMenuItem(menu)}
                onAddToCart={(menu) => handleAddToCart(menu, 1)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && menuList.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto my-10">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Tidak Ada Menu yang Cocok
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Coba gunakan kata kunci pencarian yang lain atau atur ulang filter kategori dan batas kalori.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </main>

      {/* Menu Detail Modal */}
      {selectedMenuItem && (
        <MenuDetailModal
          item={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <Footer />
    </div>
  );
}

export default MenuCatalog;
