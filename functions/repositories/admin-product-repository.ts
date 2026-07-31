import type {
  AdminCategoryRow,
  AdminProductImageRow,
  AdminProductRow,
  AdminProductVariantRow
} from '../types/admin-product';
import type { AdminProductInput } from '../schemas/admin-product-schema';

export class AdminProductRepository {
  constructor(private readonly db: D1Database) {}

  getCategories() {
    return this.db
      .prepare(
        `SELECT id, name, slug
        FROM categories
        WHERE deleted_at IS NULL
        ORDER BY active DESC, display_order ASC, name ASC`
      )
      .all<AdminCategoryRow>();
  }

  getProducts(options: { query?: string; categoryId?: string }) {
    const conditions = ['p.deleted_at IS NULL'];
    const bindings: string[] = [];

    if (options.query) {
      conditions.push('(p.name LIKE ? OR p.sku LIKE ?)');
      bindings.push(`%${options.query}%`, `%${options.query}%`);
    }

    if (options.categoryId) {
      conditions.push('p.category_id = ?');
      bindings.push(options.categoryId);
    }

    return this.db
      .prepare(
        `SELECT
          p.id,
          p.category_id,
          c.name AS category_name,
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
          p.created_at,
          p.updated_at
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE ${conditions.join(' AND ')}
        ORDER BY p.created_at DESC`
      )
      .bind(...bindings)
      .all<AdminProductRow>();
  }

  getProductById(id: string) {
    return this.db
      .prepare(
        `SELECT
          p.id,
          p.category_id,
          c.name AS category_name,
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
          p.created_at,
          p.updated_at
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE p.id = ? AND p.deleted_at IS NULL
        LIMIT 1`
      )
      .bind(id)
      .first<AdminProductRow>();
  }

  getImages(productIds: string[]) {
    if (productIds.length === 0) {
      return Promise.resolve({ results: [] as AdminProductImageRow[] });
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
      .all<AdminProductImageRow>();
  }

  getVariants(productIds: string[]) {
    if (productIds.length === 0) {
      return Promise.resolve({ results: [] as AdminProductVariantRow[] });
    }

    const placeholders = productIds.map(() => '?').join(', ');

    return this.db
      .prepare(
        `SELECT id, product_id, name, sku, size, color, price_adjustment, stock_quantity, active
        FROM product_variants
        WHERE product_id IN (${placeholders})
        ORDER BY created_at ASC`
      )
      .bind(...productIds)
      .all<AdminProductVariantRow>();
  }

  createProduct(input: AdminProductInput & { id: string; slug: string }) {
    const statements = [
      this.db
        .prepare(
          `INSERT INTO products (
            id, category_id, name, slug, short_description, description, sku,
            price, promotional_price, active, featured, home_display_order, track_stock
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          input.id,
          input.categoryId,
          input.name,
          input.slug,
          input.shortDescription,
          input.description,
          input.sku,
          input.price,
          input.promotionalPrice ?? null,
          input.active ? 1 : 0,
          input.featured ? 1 : 0,
          input.homeDisplayOrder,
          input.trackStock ? 1 : 0
        ),
      ...input.variants.map((variant) =>
        this.db
          .prepare(
            `INSERT INTO product_variants (
              id, product_id, name, sku, size, color, price_adjustment, stock_quantity, active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            variant.id || crypto.randomUUID(),
            input.id,
            variant.name,
            variant.sku,
            variant.size || null,
            variant.color || null,
            variant.priceAdjustment,
            variant.stockQuantity,
            variant.active ? 1 : 0
          )
      ),
      ...input.images.map((image, index) =>
        this.db
          .prepare(
            `INSERT INTO product_images (
              id, product_id, url, alt_text, display_order, is_main
            ) VALUES (?, ?, ?, ?, ?, ?)`
          )
          .bind(
            crypto.randomUUID(),
            input.id,
            image.url,
            image.altText,
            image.displayOrder || index,
            image.isMain ? 1 : 0
          )
      )
    ];

    return this.db.batch(statements);
  }

  async updateProduct(id: string, input: AdminProductInput & { slug: string }) {
    const existingVariants = await this.getVariants([id]);
    const submittedVariantIds = input.variants
      .map((variant) => variant.id)
      .filter((variantId): variantId is string => Boolean(variantId));
    const omittedVariantIds = existingVariants.results
      .map((variant) => variant.id)
      .filter((variantId) => !submittedVariantIds.includes(variantId));

    const statements: D1PreparedStatement[] = [
      this.db
        .prepare(
          `UPDATE products
          SET category_id = ?,
            name = ?,
            slug = ?,
            short_description = ?,
            description = ?,
            sku = ?,
            price = ?,
            promotional_price = ?,
            active = ?,
            featured = ?,
            home_display_order = ?,
            track_stock = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND deleted_at IS NULL`
        )
        .bind(
          input.categoryId,
          input.name,
          input.slug,
          input.shortDescription,
          input.description,
          input.sku,
          input.price,
          input.promotionalPrice ?? null,
          input.active ? 1 : 0,
          input.featured ? 1 : 0,
          input.homeDisplayOrder,
          input.trackStock ? 1 : 0,
          id
        ),
      this.db.prepare('DELETE FROM product_images WHERE product_id = ?').bind(id)
    ];

    statements.push(
      ...omittedVariantIds.map((variantId) =>
        this.db
          .prepare(
            `UPDATE product_variants
            SET active = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`
          )
          .bind(variantId)
      )
    );

    statements.push(
      ...input.variants.map((variant) =>
        variant.id
          ? this.db
              .prepare(
                `UPDATE product_variants
                SET name = ?,
                  sku = ?,
                  size = ?,
                  color = ?,
                  price_adjustment = ?,
                  stock_quantity = ?,
                  active = ?,
                  updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND product_id = ?`
              )
              .bind(
                variant.name,
                variant.sku,
                variant.size || null,
                variant.color || null,
                variant.priceAdjustment,
                variant.stockQuantity,
                variant.active ? 1 : 0,
                variant.id,
                id
              )
          : this.db
              .prepare(
                `INSERT INTO product_variants (
                  id, product_id, name, sku, size, color, price_adjustment, stock_quantity, active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
              )
              .bind(
                crypto.randomUUID(),
                id,
                variant.name,
                variant.sku,
                variant.size || null,
                variant.color || null,
                variant.priceAdjustment,
                variant.stockQuantity,
                variant.active ? 1 : 0
              )
      ),
      ...input.images.map((image, index) =>
        this.db
          .prepare(
            `INSERT INTO product_images (
              id, product_id, url, alt_text, display_order, is_main
            ) VALUES (?, ?, ?, ?, ?, ?)`
          )
          .bind(
            crypto.randomUUID(),
            id,
            image.url,
            image.altText,
            image.displayOrder || index,
            image.isMain ? 1 : 0
          )
      )
    );

    return this.db.batch(statements);
  }

  setProductActive(id: string, active: boolean) {
    return this.db
      .prepare(
        `UPDATE products
        SET active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL`
      )
      .bind(active ? 1 : 0, id)
      .run();
  }

  softDeleteProduct(id: string) {
    return this.db
      .prepare(
        `UPDATE products
        SET active = 0, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL`
      )
      .bind(id)
      .run();
  }
}
