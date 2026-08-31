import { Search, X, SlidersHorizontal, Flame, RotateCcw } from 'lucide-react';

function MenuFilter({
  categories = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  maxCalories,
  onMaxCaloriesChange,
  onReset,
}) {
  const isFiltered =
    selectedCategory !== 'Semua' ||
    Boolean(searchQuery) ||
    sortBy !== 'default' ||
    Boolean(maxCalories);

  const defaultCategories = [
    { value: 'Semua', label: 'Semua' },
    { value: 'Makanan Utama', label: 'Makanan Utama' },
    { value: 'Makanan Pembuka', label: 'Makanan Pembuka' },
    { value: 'Minuman', label: 'Minuman' },
    { value: 'Dessert', label: 'Dessert' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
      {/* Top Row: Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari hidangan favorit, misal 'nasi goreng', 'sate', 'durian'..."
            className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[170px]">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-500 focus:bg-white cursor-pointer"
            >
              <option value="default">✨ Urutkan: Terpopuler</option>
              <option value="termurah">💰 Harga: Termurah</option>
              <option value="termahal">💎 Harga: Tertinggi</option>
              <option value="kalori_rendah">🥗 Kalori: Terendah</option>
              <option value="kalori_tinggi">⚡ Kalori: Tertinggi</option>
              <option value="nama_asc">🔤 Nama: A - Z</option>
            </select>
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition"
              title="Reset semua filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Category Chips & Calorie shortcuts */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-gray-100">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {displayCategories.map((cat) => {
            const val = cat.value || cat.label;
            const isSelected = selectedCategory === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => onSelectCategory(val)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-gray-100/90 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-orange-700/50 text-white'
                        : 'bg-gray-200/80 text-gray-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Max Calories Quick Filter */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-medium">Maks. Kalori:</span>
          <div className="flex items-center gap-1">
            {[300, 500].map((cal) => (
              <button
                key={cal}
                type="button"
                onClick={() => onMaxCaloriesChange(maxCalories === String(cal) ? '' : String(cal))}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition ${
                  maxCalories === String(cal)
                    ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                ≤ {cal} kkal
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuFilter;
