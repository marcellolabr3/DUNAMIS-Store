export interface AdminOrderRow {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  delivery_method: string;
  subtotal: number;
  delivery_amount: number;
  discount_amount: number;
  total: number;
  customer_notes: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_email: string | null;
}

export interface AdminOrderItemRow {
  product_name: string;
  variant_name: string | null;
  sku: string;
  unit_price: number;
  quantity: number;
  total: number;
}

export interface AdminOrderPaymentRow {
  id: string;
  provider: string;
  provider_reference: string;
  method: string;
  status: string;
  amount: number;
  confirmed_at: string | null;
  confirmed_by_name: string | null;
}

export interface AdminOrderReceiptRow {
  id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  uploaded_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
}

export interface AdminOrderHistoryRow {
  previous_status: string | null;
  new_status: string;
  note: string | null;
  created_at: string;
  admin_name: string | null;
}

export interface AdminOrderAddressRow {
  postal_code: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
}
