import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminLogin from '../pages/admin/AdminLogin';
import ProtectedRoute from '../components/ProtectedRoute';
import Reservation from '../pages/Reservation';
import OrderTracking from '../pages/OrderTracking';
import MenuCatalog from '../pages/MenuCatalog';
import CartPage from '../pages/CartPage';

/**
 * Pendaftaran route aplikasi
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu" element={<MenuCatalog />} />
      <Route path="/menu/:id" element={<MenuCatalog />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/reservasi" element={<Reservation />} />
      <Route path="/pesanan" element={<OrderTracking />} />

      {/* Authenticated User Routes (Pelanggan / Admin) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Login (FR-1.2) - portal terpisah dari login pelanggan */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Only Routes (FR-1.3) - tabs: overview/menu/reservations/orders/users */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
