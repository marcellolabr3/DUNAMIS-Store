import type { AdminRow, AdminUser } from '../types/admin-auth';

export class AdminAuthRepository {
  constructor(private readonly db: D1Database) {}

  findByEmail(email: string) {
    return this.db
      .prepare(
        `SELECT
          id,
          name,
          email,
          password_hash,
          role,
          active,
          failed_login_attempts,
          locked_until
        FROM admins
        WHERE email = ?
        LIMIT 1`
      )
      .bind(email)
      .first<AdminRow>();
  }

  findUserById(id: string) {
    return this.db
      .prepare(
        `SELECT id, name, email, role
        FROM admins
        WHERE id = ? AND active = 1
        LIMIT 1`
      )
      .bind(id)
      .first<AdminUser>();
  }

  async recordFailedLogin(admin: AdminRow) {
    const attempts = admin.failed_login_attempts + 1;
    const lockedUntil =
      attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;

    await this.db
      .prepare(
        `UPDATE admins
        SET failed_login_attempts = ?,
          locked_until = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`
      )
      .bind(attempts, lockedUntil, admin.id)
      .run();
  }

  async recordSuccessfulLogin(adminId: string) {
    await this.db.batch([
      this.db
        .prepare(
          `UPDATE admins
          SET failed_login_attempts = 0,
            locked_until = NULL,
            last_login_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`
        )
        .bind(adminId),
      this.db
        .prepare(
          `INSERT INTO audit_logs (id, admin_id, action, entity_type, entity_id, metadata)
          VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          crypto.randomUUID(),
          adminId,
          'admin.login',
          'admin',
          adminId,
          '{}'
        )
    ]);
  }
}
