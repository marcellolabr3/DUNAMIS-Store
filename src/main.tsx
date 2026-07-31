import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';
import { AdminAuthProvider } from './hooks/admin-auth-provider';
import { CartProvider } from './hooks/cart-provider';
import './styles/index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
