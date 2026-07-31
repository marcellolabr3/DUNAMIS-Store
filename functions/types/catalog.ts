export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

export interface BannerRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_label: string;
  button_link: string;
  display_order: number;
}

export interface ProductRow {
  id: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  sku: string;
  price: number;
  promotional_price: number | null;
  active: number;
  featured: number;
  track_stock: number;
  created_at: string;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  display_order: number;
  is_main: number;
}

export interface ProductVariantRow {
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
