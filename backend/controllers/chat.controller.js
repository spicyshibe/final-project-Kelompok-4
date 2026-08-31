const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const { sendResponse } = require('../utils/response');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(config.geminiApiKey || 'mock-key');

// Mock Menu Data (Temporary until database is ready)
const mockMenuContext = `
Data Menu Restoran (Gunakan informasi ini untuk menjawab pertanyaan pelanggan):
1. Nasi Goreng Spesial: Rp 35.000 (Nasi goreng dengan telur, ayam, sosis, dan udang. Alergen: Udang, Telur. Kalori: ~550 kcal)
2. Mie Goreng Seafood: Rp 40.000 (Mie goreng dengan cumi dan udang. Alergen: Seafood, Telur, Gluten. Kalori: ~600 kcal)
3. Sate Ayam Madura: Rp 30.000 (10 tusuk sate ayam dengan bumbu kacang. Alergen: Kacang. Kalori: ~450 kcal)
4. Salad Buah: Rp 25.000 (Buah segar dengan mayones dan keju. Alergen: Susu/Dairy. Kalori: ~200 kcal)
5. Es Teh Manis: Rp 8.000 (Kalori: ~120 kcal)

Penting:
- Anda adalah asisten virtual restoran.
- Jawab dengan ramah, profesional, dan membantu.
- Jika pengguna bertanya tentang menu, kalori, atau alergen, jawab berdasarkan data di atas.
- Jika pengguna bertanya di luar topik restoran, arahkan kembali ke konteks restoran.
- Jika informasi medis tentang alergi sangat penting, tambahkan disclaimer: "Pastikan untuk mengonfirmasi ke staf kami untuk alergi berat."
`;

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

    // Menggunakan model gemini-1.5-flash untuk respon cepat
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Menyusun history chat jika ada (untuk konteks percakapan)
    let chatHistory = [];
    
    // Inisialisasi system prompt sebagai bagian dari history
    chatHistory.push({
      role: 'user',
      parts: [{ text: `System Prompt: ${mockMenuContext}` }]
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
        maxOutputTokens: 1000,
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
