import {
  calculateCartSummary,
  getUnitPrice,
  hydrateCartItems,
  mergeCartItem
} from '../src/services/cart-service';
import { demoProducts } from '../src/services/demo-catalog-data';

describe('cart-service', () => {
  it('hydrates cart items with product and variant data', () => {
    const product = demoProducts[0];
    const variant = product.variants[0];
    const [line] = hydrateCartItems([
      { productId: product.id, variantId: variant.id, quantity: 2 }
    ]);

    expect(line.product.name).toBe('Camiseta Dunamis Classica');
    expect(line.variant.name).toBe('P / Preta');
    expect(line.total).toBe(13980);
  });

  it('calculates subtotal and item count', () => {
    const firstProduct = demoProducts[0];
    const secondProduct = demoProducts[2];
    const lines = hydrateCartItems([
      {
        productId: firstProduct.id,
        variantId: firstProduct.variants[0].id,
        quantity: 1
      },
      {
        productId: secondProduct.id,
        variantId: secondProduct.variants[0].id,
        quantity: 2
      }
    ]);

    expect(calculateCartSummary(lines)).toMatchObject({
      subtotal: 14970,
      deliveryAmount: 0,
      discountAmount: 0,
      total: 14970,
      itemCount: 3
    });
  });

  it('merges equal product variants', () => {
    const product = demoProducts[0];
    const variant = product.variants[0];
    const items = mergeCartItem(
      [{ productId: product.id, variantId: variant.id, quantity: 1 }],
      { productId: product.id, variantId: variant.id, quantity: 2 }
    );

    expect(items).toEqual([
      { productId: product.id, variantId: variant.id, quantity: 3 }
    ]);
  });

  it('uses promotional price when available', () => {
    const product = {
      ...demoProducts[0],
      promotionalPrice: 5990
    };

    expect(getUnitPrice(product, product.variants[0])).toBe(5990);
  });
});
