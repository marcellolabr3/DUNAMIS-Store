import type {
  BannerRow,
  CategoryRow,
  ProductImageRow,
  ProductRow,
  ProductVariantRow
} from '../types/catalog';

export class CatalogRepository {
  constructor(private readonly db: D1Database) {}

  getCategories() {
    return this.db
      .prepare(
        `SELECT id, name, slug, description, image_url, display_order
        FROM categories
        WHERE active = 1 AND deleted_at IS NULL
        ORDER BY display_order ASC, name ASC`
      )
      .all<CategoryRow>();
  }

  getBanners() {
    return this.db
      .prepare(
        `SELECT id, title, description, image_url, button_label, button_link, display_order
        FROM banners
        WHERE active = 1 AND deleted_at IS NULL
        ORDER BY display_order ASC, created_at DESC`
      )
      .all<BannerRow>();
  }

  getProducts(options: {
    category?: string;
    query?: string;
    sort?: string;
    limit?: number;
    featuredOnly?: boolean;
    homeOrder?: boolean;
  }) {
    const conditions = ['p.active = 1', 'p.deleted_at IS NULL'];
    const bindings: string[] = [];

    if (options.category) {
      conditions.push('c.slug = ?');
      bindings.push(options.category);
    }

    if (options.query) {
      conditions.push('(p.name LIKE ? OR p.short_description LIKE ?)');
      bindings.push(`%${options.query}%`, `%${options.query}%`);
    }

    if (options.featuredOnly) {
      conditions.push('p.featured = 1');
    }

    const orderBy =
      options.homeOrder
        ? 'p.home_display_order ASC, p.created_at DESC'
        : options.sort === 'price_asc'
        ? 'COALESCE(p.promotional_price, p.price) ASC'
        : options.sort === 'price_desc'
          ? 'COALESCE(p.promotional_price, p.price) DESC'
          : 'p.created_at DESC';

    return this.db
      .prepare(
        `SELECT
          p.id,
          p.category_id,
          c.name AS category_name,
          c.slug AS category_slug,
          p.name,
          p.slug,
          p.short_description,
          p.description,
          p.sku,
          p.price,
          p.promotional_price,
          p.active,
          p.featured,
          p.home_display_order,
          p.track_stock,
          p.created_at
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE ${conditions.join(' AND ')}
        ORDER BY ${orderBy}
        LIMIT ?`
      )
      .bind(...bindings, options.limit ?? 48)
      .all<ProductRow>();
  }

  getProductBySlug(slug: string) {
    return this.db
      .prepare(
        `SELECT
          p.id,
          p.category_id,
          c.name AS category_name,
          c.slug AS category_slug,
          p.name,
          p.slug,
          p.short_description,
          p.description,
          p.sku,
          p.price,
          p.promotional_price,
          p.active,
          p.featured,
          p.home_display_order,
          p.track_stock,
          p.created_at
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE p.slug = ? AND p.active = 1 AND p.deleted_at IS NULL
        LIMIT 1`
      )
      .bind(slug)
      .first<ProductRow>();
  }

  getImages(productIds: string[]) {
    if (productIds.length === 0) {
      return Promise.resolve({ results: [] as ProductImageRow[] });
    }

    const placeholders = productIds.map(() => '?').join(', ');

    return this.db
      .prepare(
        `SELECT id, product_id, url, alt_text, display_order, is_main
        FROM product_images
        WHERE product_id IN (${placeholders})
        ORDER BY display_order ASC`
      )
      .bind(...productIds)
      .all<ProductImageRow>();
  }

  getVariants(productIds: string[]) {
    if (productIds.length === 0) {
      return Promise.resolve({ results: [] as ProductVariantRow[] });
    }

    const placeholders = productIds.map(() => '?').join(', ');

    return this.db
      .prepare(
        `SELECT id, product_id, name, sku, size, color, price_adjustment, stock_quantity, active
        FROM product_variants
        WHERE product_id IN (${placeholders}) AND active = 1
        ORDER BY created_at ASC`
      )
      .bind(...productIds)
      .all<ProductVariantRow>();
  }
}
