import { createContext } from 'react';

import type { CartItem, CartLine, CartSummary } from '../types/cart';

export interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  summary: CartSummary;
  lastAddedLineId?: string;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
