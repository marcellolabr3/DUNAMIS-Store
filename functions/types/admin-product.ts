export interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProductRow {
  id: string;
  category_id: string;
  category_name: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  sku: string;
  price: number;
  promotional_price: number | null;
  active: number;
  featured: number;
  home_display_order: number;
  track_stock: number;
  created_at: string;
  updated_at: string;
}

export interface AdminProductImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  display_order: number;
  is_main: number;
}

export interface AdminProductVariantRow {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  size: string | null;
  color: string | null;
  price_adjustment: number;
  stock_quantity: number;
  active: number;
}
