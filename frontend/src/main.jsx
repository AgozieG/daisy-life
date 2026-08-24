import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

const rootApp = (
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);

createRoot(document.getElementById('root')).render(rootApp);
