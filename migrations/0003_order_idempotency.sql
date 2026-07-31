CREATE TABLE IF NOT EXISTS order_idempotency_keys (
  idempotency_key TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders (id)
);
