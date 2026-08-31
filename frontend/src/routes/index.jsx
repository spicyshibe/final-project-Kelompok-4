import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Reservation from '../pages/Reservation';
import OrderTracking from '../pages/OrderTracking';
import AdminReservations from '../pages/AdminReservations';
import AdminOrders from '../pages/AdminOrders';

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
      <Route path="/admin/reservasi" element={<AdminReservations />} />
      <Route path="/admin/pesanan" element={<AdminOrders />} />
    </Routes>
  );
}

export default AppRoutes;
