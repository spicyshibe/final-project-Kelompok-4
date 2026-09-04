import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ChatWidget from './components/ChatWidget';
import AppRoutes from './routes';

// Halaman yang gak perlu bubble chat AI (dashboard admin & halaman login)
const HIDE_CHAT_PREFIXES = ['/admin', '/login'];

function AppLayout() {
  const location = useLocation();
  const hideChat = HIDE_CHAT_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
        <Navbar />
        <main className="flex-1">
          <AppRoutes />
        </main>
      </div>
      <CartDrawer />
      {!hideChat && <ChatWidget />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
