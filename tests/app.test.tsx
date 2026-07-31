import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { App } from '../src/app';
import { AdminAuthProvider } from '../src/hooks/admin-auth-provider';
import { CartProvider } from '../src/hooks/cart-provider';

function renderApp(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <CartProvider>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </CartProvider>
    </MemoryRouter>
  );
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the initial store page', () => {
    renderApp();

    expect(
      screen.getByRole('heading', { level: 1, name: 'DUNAMIS STORE' })
    ).toBeInTheDocument();
  });

  it('renders the admin login route', () => {
    renderApp(['/admin/login']);

    expect(
      screen.getByRole('heading', { name: 'Entrar na DUNAMIS STORE' })
    ).toBeInTheDocument();
  });

  it('renders the catalog route', () => {
    renderApp(['/catalogo']);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Produtos DUNAMIS STORE' })
    ).toBeInTheDocument();
    expect(screen.getByText('Caneca Dunamis')).toBeInTheDocument();
  });

  it('renders a product detail route', () => {
    renderApp(['/produto/caneca-dunamis']);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Caneca Dunamis' })
    ).toBeInTheDocument();
    expect(screen.getByText('SKU: DEMO-ACE-CANECA')).toBeInTheDocument();
  });

  it('renders the cart route empty state', () => {
    renderApp(['/carrinho']);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Seu carrinho esta vazio' })
    ).toBeInTheDocument();
  });
});
