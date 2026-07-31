import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { CartContext } from './cart-context';
import { useLocalStorageCart } from './use-local-storage-cart';
import {
  calculateCartSummary,
  clampQuantity,
  hydrateCartItems,
  mergeCartItem,
  normalizeCartItems
} from '../services/cart-service';
import { getPublicCatalog } from '../services/public-catalog-service';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/catalog';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useLocalStorageCart();
  const [lastAddedLineId, setLastAddedLineId] = useState<string>();
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const lines = useMemo(
    () =>
      hydrateCartItems(
        items,
        catalogProducts.length > 0 ? catalogProducts : undefined
      ),
    [catalogProducts, items]
  );
  const summary = useMemo(() => calculateCartSummary(lines), [lines]);

  useEffect(() => {
    let active = true;

    async function loadCartProducts() {
      try {
        const catalog = await getPublicCatalog();

        if (active) {
          setCatalogProducts(Array.isArray(catalog.products) ? catalog.products : []);
        }
      } catch {
        if (active) {
          setCatalogProducts([]);
        }
      }
    }

    void loadCartProducts();

    return () => {
      active = false;
    };
  }, []);

  function addItem(item: CartItem) {
    setItems((currentItems) => {
      const products = catalogProducts.length > 0 ? catalogProducts : undefined;
      const normalizedItems = normalizeCartItems(
        mergeCartItem(currentItems, item),
        products
      );
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
        ),
        catalogProducts.length > 0 ? catalogProducts : undefined
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
