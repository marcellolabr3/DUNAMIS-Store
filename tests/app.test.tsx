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
});
