export interface Env {
  DB: D1Database;
  RECEIPTS_BUCKET: R2Bucket;
  SESSION_SECRET: string;
  TURNSTILE_SECRET_KEY: string;
}
