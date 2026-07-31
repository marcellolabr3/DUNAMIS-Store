import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { App } from '../src/app';
import { CartProvider } from '../src/hooks/cart-provider';
import { cartStorageKey } from '../src/services/cart-service';
import { demoProducts } from '../src/services/demo-catalog-data';

function renderCart() {
  return render(
    <MemoryRouter initialEntries={['/carrinho']}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders cart lines from local storage and updates quantity', async () => {
    const user = userEvent.setup();
    const product = demoProducts[0];
    const variant = product.variants[0];

    window.localStorage.setItem(
      cartStorageKey,
      JSON.stringify([{ productId: product.id, variantId: variant.id, quantity: 1 }])
    );

    renderCart();

    expect(screen.getByText('Camiseta Dunamis Classica')).toBeInTheDocument();
    expect(screen.getAllByText('R$ 69,90').length).toBeGreaterThan(0);

    await user.click(
      screen.getByRole('button', {
        name: 'Aumentar quantidade de Camiseta Dunamis Classica'
      })
    );

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getAllByText('R$ 139,80').length).toBeGreaterThan(0);
  });

  it('removes an item from the cart', async () => {
    const user = userEvent.setup();
    const product = demoProducts[4];
    const variant = product.variants[0];

    window.localStorage.setItem(
      cartStorageKey,
      JSON.stringify([{ productId: product.id, variantId: variant.id, quantity: 1 }])
    );

    renderCart();

    await user.click(screen.getByRole('button', { name: 'Remover Caneca Dunamis' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Seu carrinho esta vazio' })
    ).toBeInTheDocument();
  });
});
