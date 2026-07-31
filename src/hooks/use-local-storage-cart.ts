import { useEffect, useState } from 'react';

import { cartStorageKey } from '../services/cart-service';
import type { CartItem } from '../types/cart';

export function useLocalStorageCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCartItems());

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [items]);

  return [items, setItems] as const;
}

function readCartItems(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawCart = window.localStorage.getItem(cartStorageKey);

  if (!rawCart) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawCart) as CartItem[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        typeof item.productId === 'string' &&
        typeof item.variantId === 'string' &&
        typeof item.quantity === 'number'
    );
  } catch {
    return [];
  }
}
