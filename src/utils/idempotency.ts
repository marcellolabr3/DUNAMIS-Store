export function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `idempotency-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
