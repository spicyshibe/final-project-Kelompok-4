import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ChatWidget from './components/ChatWidget';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
          </div>
          <CartDrawer />
          <ChatWidget />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
