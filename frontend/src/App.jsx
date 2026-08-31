import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ChatWidget />
    </BrowserRouter>
  );
}

export default App;
