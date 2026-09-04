const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const sendResponse = require('../utils/response');
const MenuModel = require('../models/menu.model');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(config.geminiApiKey || 'mock-key');

// FR-3.3: konteks menu diambil dari database asli, bukan data hardcode
function buildMenuContext() {
  const menuItems = MenuModel.findAll({ isAvailable: 1 });

  const daftarMenu = menuItems
    .map((m, i) => {
      const alergen = m.allergens.length ? m.allergens.join(', ') : 'Tidak ada alergen tercatat';
      return `${i + 1}. ${m.nama}: Rp ${m.harga.toLocaleString('id-ID')} (${m.deskripsi}. Kategori: ${m.kategori}. Alergen: ${alergen}. Kalori: ~${m.kalori} kcal)`;
    })
    .join('\n');

  return `
Data Menu Restoran (Gunakan informasi ini untuk menjawab pertanyaan pelanggan):
${daftarMenu || 'Belum ada menu tersedia di database.'}

Aturan wajib:
- Anda adalah asisten virtual restoran ini SAJA. Topik yang boleh dijawab: menu, harga, kalori, alergen, bahan, rekomendasi hidangan, reservasi, dan pesanan di restoran ini.
- Kalau pengguna nanya di luar topik itu (coding, politik, hal umum, curhat, dll), TOLAK dengan sopan dan arahkan balik ke topik restoran - jangan dijawab sama sekali walau kamu tahu jawabannya.
- Jawab HANYA berdasarkan data menu di atas - jangan mengarang menu yang tidak ada di daftar.
- Format jawaban HARUS plain text biasa, TANPA markdown - jangan pakai tanda bintang (*), pagar (#), garis bawah, atau simbol formatting lainnya. Kalau perlu daftar, pakai penomoran biasa "1. 2. 3." atau tanda hubung "-" saja.
- Jika informasi medis tentang alergi sangat penting, tambahkan kalimat: "Pastikan untuk mengonfirmasi ke staf kami untuk alergi berat."
- Khusus pertanyaan soal ALERGEN (menu apa yang aman/bahaya buat alergi tertentu) atau REKOMENDASI hidangan: kasih MAKSIMAL 3 menu saja, dan JANGAN tampilkan harga - cukup nama menu dan alasan singkat kenapa direkomendasikan/dihindari.
`;
}

const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'Pesan tidak boleh kosong'
      });
    }

    if (!config.geminiApiKey) {
      return sendResponse(res, {
        code: 500,
        success: false,
        message: 'Gemini API Key belum dikonfigurasi di server.'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    // Menyusun history chat jika ada (untuk konteks percakapan)
    let chatHistory = [];
    
    // Inisialisasi system prompt sebagai bagian dari history
    chatHistory.push({
      role: 'user',
      parts: [{ text: `System Prompt: ${buildMenuContext()}` }]
    });
    chatHistory.push({
      role: 'model',
      parts: [{ text: 'Baik, saya siap membantu pelanggan dengan informasi menu restoran.' }]
    });

    // Format history dari request jika ada
    if (history && Array.isArray(history)) {
      history.forEach(item => {
        chatHistory.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      });
    }

    // Inisialisasi chat session dengan history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        // ponytail: gemini-3.6-flash motong sebagian token buat "thinking" internal,
        // budget dinaikin biar jawaban gak kepotong - naikin lagi kalau masih terjadi
        maxOutputTokens: 3000,
        temperature: 0.7,
      },
    });

    // Mengirim pesan dari pengguna
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mendapatkan respon dari AI',
      data: { reply: text }
    });

  } catch (error) {
    console.error('Error in chat controller:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Gagal memproses percakapan dengan AI',
      data: { error: error.message }
    });
  }
};

module.exports = {
  handleChat
};
