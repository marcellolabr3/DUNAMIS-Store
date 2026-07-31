import { hashValue } from './security';

export async function enforceRateLimit(input: {
  db: D1Database;
  scope: string;
  identifier: string;
  limit: number;
  windowSeconds: number;
}) {
  const key = `${input.scope}:${await hashValue(input.identifier)}`;
  const now = Date.now();
  const existing = await input.db
    .prepare('SELECT count, reset_at FROM rate_limits WHERE key = ?')
    .bind(key)
    .first<{ count: number; reset_at: string }>();

  if (!existing || new Date(existing.reset_at).getTime() <= now) {
    await input.db
      .prepare(
        `INSERT INTO rate_limits (key, count, reset_at, updated_at)
        VALUES (?, 1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET
          count = 1,
          reset_at = excluded.reset_at,
          updated_at = CURRENT_TIMESTAMP`
      )
      .bind(key, new Date(now + input.windowSeconds * 1000).toISOString())
      .run();

    return;
  }

  if (existing.count >= input.limit) {
    throw new Error('Muitas tentativas. Aguarde alguns minutos.');
  }

  await input.db
    .prepare(
      `UPDATE rate_limits
      SET count = count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE key = ?`
    )
    .bind(key)
    .run();
}
