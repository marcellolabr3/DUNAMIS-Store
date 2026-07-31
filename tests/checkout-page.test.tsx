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
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (String(url) === '/api/settings') {
        return Promise.resolve(settingsResponse());
      }

      return Promise.resolve(
        orderResponse({
          orderNumber: 'DNS-2026-000123',
          lookupCode: 'A7K4M2',
          publicToken: 'public-token'
        })
      );
    });

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

  it('uploads a payment receipt after Pix is generated', async () => {
    const user = userEvent.setup();
    const product = demoProducts[2];
    const variant = product.variants[0];
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (String(url) === '/api/settings') {
        return Promise.resolve(settingsResponse());
      }

      if (String(url) === '/api/orders/public-token-receipt/receipt') {
        return Promise.resolve(
          new Response(
            JSON.stringify({
            receipt: {
              receiptId: 'receipt-id',
              orderNumber: 'DNS-2026-000124',
              status: 'RECEIPT_SUBMITTED',
              uploadedAt: '2026-07-31T18:10:00.000Z'
            }
            }),
            { status: 201, headers: { 'content-type': 'application/json' } }
          )
        );
      }

      return Promise.resolve(
        orderResponse({
          orderNumber: 'DNS-2026-000124',
          lookupCode: 'B8L5N3',
          publicToken: 'public-token-receipt'
        })
      );
    });

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
    await screen.findByText('DNS-2026-000124');

    await user.upload(
      screen.getByLabelText('Arquivo do comprovante'),
      new File(['demo'], 'comprovante.pdf', { type: 'application/pdf' })
    );
    await user.click(screen.getByRole('button', { name: 'Enviar comprovante' }));

    expect(
      await screen.findByText(/Comprovante enviado em/)
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/orders/public-token-receipt/receipt',
      expect.objectContaining({ method: 'POST' })
    );

    fetchMock.mockRestore();
  });
});

function settingsResponse() {
  return new Response(
    JSON.stringify({
      settings: {
        storeName: 'DUNAMIS STORE',
        storeDescription: 'Loja virtual de produtos da igreja.',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#F5C400',
        secondaryColor: '#111111',
        contactEmail: 'contato@dunamisstore.local',
        contactPhone: '',
        whatsappNumber: '',
        orderExpirationMinutes: 60,
        allowPickup: true,
        allowDelivery: false,
        pickupInstructions: 'Retirada na igreja.',
        deliveryInstructions: 'Entrega indisponivel.',
        minimumOrderValue: 0,
        storeActive: true
      }
    }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}

function orderResponse(input: {
  orderNumber: string;
  lookupCode: string;
  publicToken: string;
}) {
  return new Response(
    JSON.stringify({
      order: {
        orderNumber: input.orderNumber,
        lookupCode: input.lookupCode,
        publicToken: input.publicToken,
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
  );
}
