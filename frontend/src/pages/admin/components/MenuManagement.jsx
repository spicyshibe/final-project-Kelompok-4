import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../utils/api';
import { Plus, Edit2, Trash2, Search, Utensils, CheckCircle2, XCircle, AlertCircle, X, Sparkles } from 'lucide-react';

export default function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [allergensList, setAllergensList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    kategori: 'Makanan Utama',
    kalori: '',
    gambar: '',
    allergens: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      let path = `/api/admin/menu?kategori=${selectedCategory}`;
      if (searchQuery.trim()) {
        path += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const response = await apiGet(path);
      if (response && response.success) {
        setMenus(response.data.menus || []);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Gagal memuat katalog menu.' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllergens = async () => {
    try {
      const res = await apiGet('/api/admin/allergens');
      if (res && res.success) {
        setAllergensList(res.data.allergens || []);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [selectedCategory]);

  useEffect(() => {
    fetchAllergens();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMenus();
  };

  const openAddModal = () => {
    setEditingMenu(null);
    setFormData({
      nama: '',
      deskripsi: '',
      harga: '',
      kategori: 'Makanan Utama',
      kalori: '',
      gambar: '',
      allergens: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (menu) => {
    setEditingMenu(menu);
    setFormData({
      nama: menu.nama,
      deskripsi: menu.deskripsi || '',
      harga: menu.harga,
      kategori: menu.kategori,
      kalori: menu.kalori || '',
      gambar: menu.gambar || '',
      allergens: menu.allergens || []
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!formData.nama || !formData.harga) {
      setStatusMessage({ type: 'error', text: 'Nama dan harga menu wajib diisi.' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingMenu) {
        // Update
        const res = await apiPut(`/api/admin/menu/${editingMenu.id}`, formData);
        setStatusMessage({ type: 'success', text: res.message || 'Menu berhasil diperbarui.' });
      } else {
        // Create
        const res = await apiPost('/api/admin/menu', formData);
        setStatusMessage({ type: 'success', text: res.message || 'Menu baru berhasil ditambahkan!' });
      }
      setIsModalOpen(false);
      fetchMenus();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan menu.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const res = await apiPut(`/api/admin/menu/${id}/toggle`, {});
      // or patch
      fetchMenus();
    } catch (e) {
      // Fallback with custom request if needed
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:3000/api/admin/menu/${id}/toggle`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMenus();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      const res = await apiDelete(`/api/admin/menu/${id}`);
      setStatusMessage({ type: 'success', text: res.message || 'Menu berhasil dihapus.' });
      setDeleteConfirmId(null);
      fetchMenus();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus menu.' });
    }
  };

  const toggleAllergenSelection = (allergenName) => {
    setFormData((prev) => {
      const exists = prev.allergens.includes(allergenName);
      if (exists) {
        return { ...prev, allergens: prev.allergens.filter((a) => a !== allergenName) };
      } else {
        return { ...prev, allergens: [...prev.allergens, allergenName] };
      }
    });
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manajemen Katalog Menu Restoran</h2>
          <p className="text-xs text-gray-500">Kelola hidangan, informasi alergen, kalori, harga, dan ketersediaan stok</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold tracking-wide text-xs rounded-xl shadow-md shadow-orange-500/25 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Menu Baru
        </button>
      </div>

      {/* Status Feedback Notification */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage({ type: '', text: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['semua', 'Makanan Utama', 'Makanan Pembuka', 'Minuman', 'Dessert'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </form>
      </div>

      {/* Menus Table / Cards */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Menu</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Kalori</th>
                <th className="py-3 px-4">Alergen</th>
                <th className="py-3 px-4">Ketersediaan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    Memuat data menu...
                  </td>
                </tr>
              ) : menus.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    Tidak ada menu hidangan ditemukan.
                  </td>
                </tr>
              ) : (
                menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50/80 transition">
                    {/* Menu Item & Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            menu.gambar ||
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60'
                          }
                          alt={menu.nama}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                        />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{menu.nama}</div>
                          <div className="text-gray-500 text-[11px] max-w-xs truncate">{menu.deskripsi}</div>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {menu.kategori}
                      </span>
                    </td>

                    {/* Harga */}
                    <td className="py-3.5 px-4 font-bold text-gray-900">{formatRupiah(menu.harga)}</td>

                    {/* Kalori */}
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {menu.kalori ? `${menu.kalori} kkal` : '-'}
                    </td>

                    {/* Alergen */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {menu.allergens && menu.allergens.length > 0 ? (
                          menu.allergens.map((a, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-medium"
                            >
                              {a}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-[11px]">- Bebas Alergen -</span>
                        )}
                      </div>
                    </td>

                    {/* Ketersediaan Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleAvailability(menu.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition ${
                          menu.status_tersedia
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80'
                            : 'bg-red-100 text-red-800 hover:bg-red-200/80'
                        }`}
                        title="Klik untuk mengubah ketersediaan stok"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${menu.status_tersedia ? 'bg-emerald-500' : 'bg-red-500'}`}
                        ></span>
                        {menu.status_tersedia ? 'Tersedia' : 'Habis'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(menu)}
                          className="p-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Edit Menu"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(menu.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Menu */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-600" />
                {editingMenu ? 'Edit Data Hidangan' : 'Tambah Hidangan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama Menu Hidangan *</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Nasi Goreng Kampung"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kategori *</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition capitalize"
                  >
                    <option value="Makanan Utama">Makanan Utama</option>
                    <option value="Makanan Pembuka">Makanan Pembuka</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Harga (Rupiah) *</label>
                  <input
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    placeholder="35000"
                    required
                    min="1000"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Estimasi Kalori (kkal)</label>
                <input
                  type="number"
                  value={formData.kalori}
                  onChange={(e) => setFormData({ ...formData, kalori: e.target.value })}
                  placeholder="500"
                  min="0"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deskripsi Hidangan</label>
                <textarea
                  rows="3"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Bahan utama, cita rasa, dan saran penyajian..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">URL Foto Gambar Menu</label>
                <input
                  type="url"
                  value={formData.gambar}
                  onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              {/* Allergens Checklist */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Kandungan Alergen (Pilih yang sesuai):
                </label>
                <div className="flex flex-wrap gap-2">
                  {allergensList.map((a) => {
                    const isSelected = formData.allergens.includes(a.nama_alergen);
                    return (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() => toggleAllergenSelection(a.nama_alergen)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {a.nama_alergen}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-md shadow-orange-500/20 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Hidangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Hapus Menu Hidangan?</h3>
            <p className="text-xs text-gray-500 mb-6">
              Tindakan ini akan menghapus menu dari katalog secara permanen.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteMenu(deleteConfirmId)}
                className="flex-1 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
