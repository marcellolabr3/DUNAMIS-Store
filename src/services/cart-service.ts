import { demoProducts } from './demo-catalog-data';
import type { CartItem, CartLine, CartSummary } from '../types/cart';
import type { Product, ProductVariant } from '../types/catalog';

export const cartStorageKey = 'dunamis-store-cart';

export function getCartLineId(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export function getUnitPrice(product: Product, variant: ProductVariant) {
  return (product.promotionalPrice ?? product.price) + variant.priceAdjustment;
}

export function hydrateCartItems(
  items: CartItem[],
  products: Product[] = demoProducts
): CartLine[] {
  return items
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      const variant = product?.variants.find(
        (candidate) => candidate.id === item.variantId
      );

      if (!product || !variant || !product.active || variant.stockQuantity <= 0) {
        return undefined;
      }

      const maxQuantity = variant.stockQuantity;
      const quantity = clampQuantity(item.quantity, maxQuantity);
      const unitPrice = getUnitPrice(product, variant);

      return {
        id: getCartLineId(product.id, variant.id),
        item: {
          productId: product.id,
          variantId: variant.id,
          quantity
        },
        product,
        variant,
        unitPrice,
        total: unitPrice * quantity,
        maxQuantity
      };
    })
    .filter((line): line is CartLine => Boolean(line));
}

export function calculateCartSummary(lines: CartLine[]): CartSummary {
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.item.quantity, 0);
  const deliveryAmount = 0;
  const discountAmount = 0;

  return {
    subtotal,
    deliveryAmount,
    discountAmount,
    total: subtotal + deliveryAmount - discountAmount,
    itemCount
  };
}

export function mergeCartItem(items: CartItem[], nextItem: CartItem): CartItem[] {
  const existing = items.find(
    (item) =>
      item.productId === nextItem.productId && item.variantId === nextItem.variantId
  );

  if (!existing) {
    return [...items, nextItem];
  }

  return items.map((item) =>
    item.productId === nextItem.productId && item.variantId === nextItem.variantId
      ? { ...item, quantity: item.quantity + nextItem.quantity }
      : item
  );
}

export function normalizeCartItems(
  items: CartItem[],
  products: Product[] = demoProducts
): CartItem[] {
  return hydrateCartItems(items, products).map((line) => line.item);
}

export function clampQuantity(quantity: number, maxQuantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.min(Math.max(Math.trunc(quantity), 1), maxQuantity);
}
