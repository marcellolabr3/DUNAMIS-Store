import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { App } from '../src/app';

describe('App', () => {
  it('renders the initial store page', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'DUNAMIS STORE' })
    ).toBeInTheDocument();
  });

  it('renders the admin layout route', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('navigation', { name: 'Menu administrativo' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Visao geral' })
    ).toBeInTheDocument();
  });

  it('renders the catalog route', () => {
    render(
      <MemoryRouter initialEntries={['/catalogo']}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Produtos DUNAMIS STORE' })
    ).toBeInTheDocument();
    expect(screen.getByText('Caneca Dunamis')).toBeInTheDocument();
  });

  it('renders a product detail route', () => {
    render(
      <MemoryRouter initialEntries={['/produto/caneca-dunamis']}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Caneca Dunamis' })
    ).toBeInTheDocument();
    expect(screen.getByText('SKU: DEMO-ACE-CANECA')).toBeInTheDocument();
  });
});
