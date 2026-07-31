import type { Product, ProductVariant } from './catalog';

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartLine {
  id: string;
  item: CartItem;
  product: Product;
  variant: ProductVariant;
  unitPrice: number;
  total: number;
  maxQuantity: number;
}

export interface CartSummary {
  subtotal: number;
  deliveryAmount: number;
  discountAmount: number;
  total: number;
  itemCount: number;
}
