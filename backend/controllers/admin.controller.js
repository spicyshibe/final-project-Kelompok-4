const AdminModel = require('../models/admin.model');
const MenuModel = require('../models/menu.model');
const ReservationModel = require('../models/reservation.model');
const OrderModel = require('../models/order.model');
const sendResponse = require('../utils/response');

const AdminController = {
  /**
   * Ambil ringkasan statistik operasional
   */
  async getStats(req, res) {
    try {
      const stats = AdminModel.getStats();
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Statistik dashboard berhasil diambil.',
        data: stats
      });
    } catch (error) {
      console.error('Error saat getStats:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan saat memuat statistik.'
      });
    }
  },

  // ===================== KELOLA MENU (FR-8) =====================

  /**
   * Ambil daftar menu dengan filter
   */
  async getMenus(req, res) {
    try {
      const { kategori, search, isAvailable } = req.query;
      const menus = MenuModel.findAll({ kategori, search, isAvailable });
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Daftar menu berhasil diambil.',
        data: { menus }
      });
    } catch (error) {
      console.error('Error saat getMenus:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan saat memuat data menu.'
      });
    }
  },

  /**
   * Tambah menu hidangan baru (FR-2.3 / FR-8)
   */
  async createMenu(req, res) {
    try {
      const { nama, deskripsi, harga, kategori, kalori, gambar, allergens } = req.body;

      if (!nama || !harga || !kategori) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Nama hidangan, harga, dan kategori wajib diisi.'
        });
      }

      if (isNaN(harga) || Number(harga) <= 0) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Harga harus berupa angka positif.'
        });
      }

      const newMenu = MenuModel.create({
        nama: nama.trim(),
        deskripsi: deskripsi ? deskripsi.trim() : '',
        harga: Number(harga),
        kategori,
        kalori: kalori ? Number(kalori) : 0,
        gambar: gambar ? gambar.trim() : '',
        allergens: Array.isArray(allergens) ? allergens : []
      });

      return sendResponse(res, {
        code: 201,
        success: true,
        message: 'Menu hidangan berhasil ditambahkan ke katalog!',
        data: { menu: newMenu }
      });
    } catch (error) {
      console.error('Error saat createMenu:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal menambahkan menu hidangan.'
      });
    }
  },

  /**
   * Edit / update menu hidangan (FR-2.3 / FR-8)
   */
  async updateMenu(req, res) {
    try {
      const { id } = req.params;
      const { nama, deskripsi, harga, kategori, kalori, gambar, allergens, is_available } = req.body;

      const existingMenu = MenuModel.findById(id);
      if (!existingMenu) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: 'Menu tidak ditemukan.'
        });
      }

      const updatedMenu = MenuModel.update(id, {
        nama: nama ? nama.trim() : undefined,
        deskripsi: deskripsi !== undefined ? deskripsi.trim() : undefined,
        harga: harga !== undefined ? Number(harga) : undefined,
        kategori: kategori !== undefined ? kategori : undefined,
        kalori: kalori !== undefined ? Number(kalori) : undefined,
        gambar: gambar !== undefined ? gambar.trim() : undefined,
        allergens: allergens !== undefined ? allergens : undefined,
        is_available: is_available !== undefined ? is_available : undefined
      });

      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Data menu hidangan berhasil diperbarui!',
        data: { menu: updatedMenu }
      });
    } catch (error) {
      console.error('Error saat updateMenu:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal memperbarui menu hidangan.'
      });
    }
  },

  /**
   * Toggle ketersediaan menu (tersedia vs habis)
   */
  async toggleMenuAvailability(req, res) {
    try {
      const { id } = req.params;
      const updatedMenu = MenuModel.toggleAvailability(id);

      if (!updatedMenu) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: 'Menu tidak ditemukan.'
        });
      }

      return sendResponse(res, {
        code: 200,
        success: true,
        message: `Status ketersediaan menu "${updatedMenu.nama}" berhasil diubah menjadi ${
          updatedMenu.is_available ? 'Tersedia' : 'Habis'
        }.`,
        data: { menu: updatedMenu }
      });
    } catch (error) {
      console.error('Error saat toggleMenuAvailability:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal mengubah status ketersediaan menu.'
      });
    }
  },

  /**
   * Hapus menu dari katalog
   */
  async deleteMenu(req, res) {
    try {
      const { id } = req.params;
      const success = MenuModel.delete(id);

      if (!success) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: 'Menu tidak ditemukan atau sudah dihapus.'
        });
      }

      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Menu hidangan berhasil dihapus dari katalog.'
      });
    } catch (error) {
      console.error('Error saat deleteMenu:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal menghapus menu.'
      });
    }
  },

  /**
   * Ambil daftar jenis alergen
   */
  async getAllergens(req, res) {
    try {
      const allergens = MenuModel.getAllAllergens();
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Daftar alergen berhasil diambil.',
        data: { allergens }
      });
    } catch (error) {
      console.error('Error saat getAllergens:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal memuat data alergen.'
      });
    }
  },

  // ===================== KELOLA RESERVASI (FR-9) =====================

  /**
   * Ambil semua reservasi meja
   */
  async getReservations(req, res) {
    try {
      const { status, tanggal, search } = req.query;
      const reservations = ReservationModel.findAll({ status, tanggal, search });
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Daftar reservasi meja berhasil diambil.',
        data: { reservations }
      });
    } catch (error) {
      console.error('Error saat getReservations:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan saat memuat reservasi.'
      });
    }
  },

  /**
   * Ubah status reservasi meja (FR-5.3 / FR-9)
   */
  async updateReservationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['menunggu', 'dikonfirmasi', 'dibatalkan'];
      if (!validStatuses.includes(status)) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Status reservasi tidak valid. Pilihan: menunggu, dikonfirmasi, dibatalkan.'
        });
      }

      const updated = ReservationModel.updateStatus(id, status);
      if (!updated) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: 'Data reservasi tidak ditemukan.'
        });
      }

      return sendResponse(res, {
        code: 200,
        success: true,
        message: `Status reservasi untuk ${updated.nama_pemesan} berhasil diubah menjadi "${status}".`,
        data: { reservation: updated }
      });
    } catch (error) {
      console.error('Error saat updateReservationStatus:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal memperbarui status reservasi.'
      });
    }
  },

  /**
   * Hapus reservasi
   */
  async deleteReservation(req, res) {
    try {
      const { id } = req.params;
      const success = ReservationModel.delete(id);
      if (!success) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: 'Reservasi tidak ditemukan.'
        });
      }
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Data reservasi berhasil dihapus.'
      });
    } catch (error) {
      console.error('Error saat deleteReservation:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal menghapus reservasi.'
      });
    }
  },

  // ===================== KELOLA STATUS PESANAN (FR-10) =====================

  /**
   * Ambil semua pesanan masuk
   */
  async getOrders(req, res) {
    try {
      const { status, search } = req.query;
      const orders = OrderModel.findAll({ status, search });
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Daftar pesanan berhasil diambil.',
        data: { orders }
      });
    } catch (error) {
      console.error('Error saat getOrders:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Terjadi kesalahan saat memuat pesanan.'
      });
    }
  },

  /**
   * Ubah status pesanan (FR-6.3 / FR-10)
   */
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['baru', 'diproses', 'siap', 'selesai', 'dibatalkan'];
      if (!validStatuses.includes(status)) {
        return sendResponse(res, {
          code: 400,
          success: false,
          message: 'Status pesanan tidak valid. Pilihan: baru, diproses, siap, selesai, dibatalkan.'
        });
      }

      const updated = OrderModel.updateStatus(id, status);
      if (!updated) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: 'Pesanan tidak ditemukan.'
        });
      }

      return sendResponse(res, {
        code: 200,
        success: true,
        message: `Status pesanan #${updated.id} berhasil diperbarui menjadi "${status}".`,
        data: { order: updated }
      });
    } catch (error) {
      console.error('Error saat updateOrderStatus:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal memperbarui status pesanan.'
      });
    }
  },

  /**
   * Hapus pesanan
   */
  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const success = OrderModel.delete(id);
      if (!success) {
        return sendResponse(res, {
          code: 404,
          success: false,
          message: 'Pesanan tidak ditemukan.'
        });
      }
      return sendResponse(res, {
        code: 200,
        success: true,
        message: 'Pesanan berhasil dihapus.'
      });
    } catch (error) {
      console.error('Error saat deleteOrder:', error);
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gagal menghapus pesanan.'
      });
    }
  }
};

module.exports = AdminController;
