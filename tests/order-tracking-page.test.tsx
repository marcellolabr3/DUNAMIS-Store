import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { App } from '../src/app';
import { CartProvider } from '../src/hooks/cart-provider';

function renderOrderTracking() {
  return render(
    <MemoryRouter initialEntries={['/pedido']}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('OrderTrackingPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('tracks a demo order by number', async () => {
    const user = userEvent.setup();
    renderOrderTracking();

    await user.type(screen.getByLabelText('Numero do pedido'), 'DNS-2026-000001');
    await user.click(screen.getByRole('button', { name: 'Consultar pedido' }));

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Aguardando pagamento'
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/Camiseta Dunamis Classica/)).toBeInTheDocument();
    expect(screen.getByText(/M \/ Preta/)).toBeInTheDocument();
  });

  it('shows an error for invalid tracking data', async () => {
    const user = userEvent.setup();
    renderOrderTracking();

    await user.type(screen.getByLabelText('Numero do pedido'), 'DNS-2026-999999');
    await user.click(screen.getByRole('button', { name: 'Consultar pedido' }));

    expect(
      await screen.findByText('Pedido nao encontrado. Confira o numero informado.')
    ).toBeInTheDocument();
  });
});
