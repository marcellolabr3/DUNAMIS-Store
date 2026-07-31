import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { App } from '../src/app';
import { CartProvider } from '../src/hooks/cart-provider';
import { cartStorageKey } from '../src/services/cart-service';
import { demoProducts } from '../src/services/demo-catalog-data';

function renderCheckout() {
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('requires cart items before checkout', () => {
    renderCheckout();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Carrinho vazio' })
    ).toBeInTheDocument();
  });

  it('advances through customer and pickup steps', async () => {
    const user = userEvent.setup();
    const product = demoProducts[2];
    const variant = product.variants[0];

    window.localStorage.setItem(
      cartStorageKey,
      JSON.stringify([{ productId: product.id, variantId: variant.id, quantity: 1 }])
    );

    renderCheckout();

    await user.type(screen.getByLabelText('Nome completo'), 'Ana Souza');
    await user.type(screen.getByLabelText('WhatsApp'), '11990000001');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(
      screen.getByRole('heading', { level: 2, name: 'Forma de recebimento' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Revisar pedido' }));

    expect(
      screen.getByRole('heading', { level: 2, name: 'Revisao' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Devocional 30 Dias/)).toBeInTheDocument();
  });

  it('shows Pix payment data after creating an order', async () => {
    const user = userEvent.setup();
    const product = demoProducts[2];
    const variant = product.variants[0];
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          order: {
            orderNumber: 'DNS-2026-000123',
            lookupCode: 'A7K4M2',
            publicToken: 'public-token',
            total: 3990,
            status: 'PENDING_PAYMENT',
            payment: {
              method: 'pix',
              provider: 'manual_pix',
              pixPayload: '000201DEMO6304ABCD',
              qrCodeDataUrl: 'data:image/png;base64,demo',
              expiresAt: '2026-07-31T18:00:00.000Z'
            }
          }
        }),
        { status: 201, headers: { 'content-type': 'application/json' } }
      )
    );

    window.localStorage.setItem(
      cartStorageKey,
      JSON.stringify([{ productId: product.id, variantId: variant.id, quantity: 1 }])
    );

    renderCheckout();

    await user.type(screen.getByLabelText('Nome completo'), 'Ana Souza');
    await user.type(screen.getByLabelText('WhatsApp'), '11990000001');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(screen.getByRole('button', { name: 'Revisar pedido' }));
    await user.click(screen.getByRole('button', { name: 'Criar pedido' }));

    expect(await screen.findByText('DNS-2026-000123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('000201DEMO6304ABCD')).toBeInTheDocument();
    expect(
      screen.getByAltText('QR Code Pix do pedido DNS-2026-000123')
    ).toBeInTheDocument();

    fetchMock.mockRestore();
  });
});
