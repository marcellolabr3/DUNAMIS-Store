import { verifyPassword } from '../functions/utils/password';
import {
  createSessionCookie,
  readSessionFromRequest
} from '../functions/utils/session';

const demoPasswordHash =
  'pbkdf2$210000$dunamis-demo-admin-salt$M9CaIL4RhgJs1Jt9ENxbHAgjpY3jsiVBwXZcXurGR/I=';

describe('admin authentication helpers', () => {
  it('validates PBKDF2 password hashes', async () => {
    await expect(verifyPassword('Dunamis@123', demoPasswordHash)).resolves.toBe(
      true
    );
    await expect(verifyPassword('wrong-password', demoPasswordHash)).resolves.toBe(
      false
    );
  });

  it('creates and reads a signed session cookie', async () => {
    const cookie = await createSessionCookie(
      {
        adminId: 'admin-id',
        email: 'admin@dunamisstore.local',
        role: 'owner'
      },
      'test-secret'
    );
    const request = new Request('https://example.com/admin', {
      headers: {
        cookie
      }
    });

    await expect(readSessionFromRequest(request, 'test-secret')).resolves.toMatchObject(
      {
        adminId: 'admin-id',
        email: 'admin@dunamisstore.local',
        role: 'owner'
      }
    );
  });
});
