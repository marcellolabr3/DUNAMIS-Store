export interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  active: number;
  display_order: number;
}

export class AdminCategoryRepository {
  constructor(private readonly db: D1Database) {}

  getCategories() {
    return this.db
      .prepare(
        `SELECT id, name, slug, description, image_url, active, display_order
        FROM categories
        WHERE deleted_at IS NULL
        ORDER BY display_order ASC, name ASC`
      )
      .all<AdminCategoryRow>();
  }

  getCategory(id: string) {
    return this.db
      .prepare(
        `SELECT id, name, slug, description, image_url, active, display_order
        FROM categories
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1`
      )
      .bind(id)
      .first<AdminCategoryRow>();
  }

  async setActive(id: string, active: boolean) {
    await this.db
      .prepare(
        `UPDATE categories
        SET active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL`
      )
      .bind(active ? 1 : 0, id)
      .run();

    return this.getCategory(id);
  }
}
