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
      screen.getByRole('heading', { name: 'DUNAMIS STORE' })
    ).toBeInTheDocument();
  });
});
