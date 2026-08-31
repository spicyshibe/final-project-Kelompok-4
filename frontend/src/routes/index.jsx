import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MenuCatalog from '../pages/MenuCatalog';

/**
 * Semua route halaman didaftarin di sini. App.jsx cuma manggil
 * <AppRoutes /> ini, gak perlu tau detail path apa aja yang ada -
 * kalo nambah halaman baru, cukup import + tambah <Route> di sini.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<MenuCatalog />} />
      <Route path="/menu/:id" element={<MenuCatalog />} />
    </Routes>
  );
}

export default AppRoutes;
