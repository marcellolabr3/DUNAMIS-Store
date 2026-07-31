import { AdminAuthRepository } from '../repositories/admin-auth-repository';
import { adminLoginSchema } from '../schemas/admin-auth-schema';
import { verifyPassword } from '../utils/password';
import {
  clearSessionCookie,
  createSessionCookie,
  readSessionFromRequest
} from '../utils/session';

export class AdminAuthService {
  constructor(
    private readonly repository: AdminAuthRepository,
    private readonly sessionSecret: string
  ) {}

  async login(input: unknown) {
    const credentials = adminLoginSchema.parse(input);
    const admin = await this.repository.findByEmail(credentials.email.toLowerCase());

    if (!admin || admin.active !== 1) {
      throw new Error('Credenciais invalidas.');
    }

    if (admin.locked_until && new Date(admin.locked_until).getTime() > Date.now()) {
      throw new Error('Login temporariamente bloqueado.');
    }

    const passwordValid = await verifyPassword(
      credentials.password,
      admin.password_hash
    );

    if (!passwordValid) {
      await this.repository.recordFailedLogin(admin);
      throw new Error('Credenciais invalidas.');
    }

    await this.repository.recordSuccessfulLogin(admin.id);

    const cookie = await createSessionCookie(
      {
        adminId: admin.id,
        email: admin.email,
        role: admin.role
      },
      this.sessionSecret
    );

    return {
      cookie,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    };
  }

  async getCurrentAdmin(request: Request) {
    const session = await readSessionFromRequest(request, this.sessionSecret);

    if (!session) {
      return undefined;
    }

    return this.repository.findUserById(session.adminId);
  }

  logoutCookie() {
    return clearSessionCookie();
  }
}
