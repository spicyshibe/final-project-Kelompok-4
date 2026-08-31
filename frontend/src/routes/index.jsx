import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Reservation from '../pages/Reservation';
import OrderTracking from '../pages/OrderTracking';

/**
 * Semua route halaman didaftarin di sini. App.jsx cuma manggil
 * <AppRoutes /> ini, gak perlu tau detail path apa aja yang ada -
 * kalo nambah halaman baru, cukup import + tambah <Route> di sini.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reservasi" element={<Reservation />} />
      <Route path="/pesanan" element={<OrderTracking />} />
    </Routes>
  );
}

export default AppRoutes;
