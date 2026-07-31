import type { AdminBannerInput } from '../schemas/admin-banner-schema';

export interface AdminBannerRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_label: string;
  button_link: string;
  active: number;
  display_order: number;
}

export class AdminBannerRepository {
  constructor(private readonly db: D1Database) {}

  getBanners() {
    return this.db
      .prepare(
        `SELECT id, title, description, image_url, button_label, button_link, active, display_order
        FROM banners
        WHERE deleted_at IS NULL
        ORDER BY display_order ASC, created_at DESC`
      )
      .all<AdminBannerRow>();
  }

  getBanner(id: string) {
    return this.db
      .prepare(
        `SELECT id, title, description, image_url, button_label, button_link, active, display_order
        FROM banners
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1`
      )
      .bind(id)
      .first<AdminBannerRow>();
  }

  createBanner(id: string, input: AdminBannerInput) {
    return this.db
      .prepare(
        `INSERT INTO banners (
          id, title, description, image_url, button_label, button_link, active, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.title,
        input.description,
        input.imageUrl,
        input.buttonLabel,
        input.buttonLink,
        input.active ? 1 : 0,
        input.displayOrder
      )
      .run();
  }

  updateBanner(id: string, input: AdminBannerInput) {
    return this.db
      .prepare(
        `UPDATE banners
        SET title = ?,
          description = ?,
          image_url = ?,
          button_label = ?,
          button_link = ?,
          active = ?,
          display_order = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL`
      )
      .bind(
        input.title,
        input.description,
        input.imageUrl,
        input.buttonLabel,
        input.buttonLink,
        input.active ? 1 : 0,
        input.displayOrder,
        id
      )
      .run();
  }

  softDeleteBanner(id: string) {
    return this.db
      .prepare(
        `UPDATE banners
        SET active = 0, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL`
      )
      .bind(id)
      .run();
  }
}
