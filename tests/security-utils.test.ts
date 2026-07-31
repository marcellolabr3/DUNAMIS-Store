import { hashValue } from '../functions/utils/security';
import { verifyTurnstile } from '../functions/utils/turnstile';

describe('security utilities', () => {
  it('hashes values without returning the original input', async () => {
    const hash = await hashValue('127.0.0.1');

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toBe('127.0.0.1');
  });

  it('skips Turnstile verification when no secret is configured', async () => {
    await expect(verifyTurnstile({ token: undefined })).resolves.toBeUndefined();
  });
});
