import { type ReactNode, useMemo, useState } from 'react';

import { CartContext } from './cart-context';
import { useLocalStorageCart } from './use-local-storage-cart';
import {
  calculateCartSummary,
  clampQuantity,
  hydrateCartItems,
  mergeCartItem,
  normalizeCartItems
} from '../services/cart-service';
import type { CartItem } from '../types/cart';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useLocalStorageCart();
  const [lastAddedLineId, setLastAddedLineId] = useState<string>();
  const lines = useMemo(() => hydrateCartItems(items), [items]);
  const summary = useMemo(() => calculateCartSummary(lines), [lines]);

  function addItem(item: CartItem) {
    setItems((currentItems) => {
      const normalizedItems = normalizeCartItems(mergeCartItem(currentItems, item));
      setLastAddedLineId(`${item.productId}:${item.variantId}`);

      return normalizedItems;
    });
  }

  function updateQuantity(productId: string, variantId: string, quantity: number) {
    setItems((currentItems) =>
      normalizeCartItems(
        currentItems.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: clampQuantity(quantity, Number.MAX_SAFE_INTEGER) }
            : item
        )
      )
    );
  }

  function removeItem(productId: string, variantId: string) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId || item.variantId !== variantId
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        lines,
        summary,
        lastAddedLineId,
        addItem,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
