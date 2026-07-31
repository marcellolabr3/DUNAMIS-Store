ALTER TABLE products ADD COLUMN home_display_order INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_home_display
  ON products (featured, home_display_order, created_at);
