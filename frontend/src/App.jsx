import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import ChatWidget from './components/ChatWidget';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
        <CartDrawer />
        <ChatWidget />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
