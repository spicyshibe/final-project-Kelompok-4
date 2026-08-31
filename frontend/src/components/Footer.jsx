import { Heart, Utensils, MapPin, Phone, Clock } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">Resto Nusantara</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Menghadirkan kelezatan kuliner nusantara dengan bahan pilihan, transparan gizi & kalori, serta ramah alergi.
            </p>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Jam Buka Restoran
            </h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex justify-between">
                <span>Senin - Jumat:</span>
                <span className="text-gray-200 font-medium">10:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sabtu - Minggu:</span>
                <span className="text-gray-200 font-medium">09:00 - 23:00</span>
              </li>
              <li className="text-orange-400 pt-1 font-medium">Layanan Pesanan Daring Siap Sedia</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" /> Lokasi & Kontak
            </h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li>Jl. Ringroad Barat, Tamantirto, Kasihan, Bantul, D.I. Yogyakarta</li>
              <li className="flex items-center gap-1.5 pt-1">
                <Phone className="w-3.5 h-3.5 text-orange-400" /> +62 812-3456-7890
              </li>
              <li>info@restonusantara.com</li>
            </ul>
          </div>

          {/* Team / Academic Info */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Tim Pengembang (Kelompok 4)</h4>
            <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700/60 text-xs space-y-1.5">
              <p className="text-orange-400 font-semibold">Tugas Akhir PAW (2026)</p>
              <p className="text-gray-300 font-medium">Gandhi Muhammad Bagas Saputra</p>
              <p className="text-gray-400">NIM: 20240140045 (Katalog Menu & Keranjang)</p>
              <p className="text-gray-400">Bersama Rekan Kelompok 4</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800/80 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Resto Nusantara — Final Project PAW Kelompok 4.</p>
          <p className="flex items-center justify-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> menggunakan Express, React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
