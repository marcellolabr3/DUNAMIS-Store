import { AdminAuthRepository } from '../../../repositories/admin-auth-repository';
import { AdminAuthService } from '../../../services/admin-auth-service';
import type { Env } from '../../../types/bindings';
import { errorResponse, jsonResponse } from '../../../utils/http';
import { enforceRateLimit } from '../../../utils/rate-limit';
import { getClientIp } from '../../../utils/security';
import { verifyTurnstile } from '../../../utils/turnstile';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

export async function onRequestPost(context: PagesFunctionContext) {
  try {
    const body = (await context.request.json()) as Record<string, unknown>;
    const ipAddress = getClientIp(context.request);

    await enforceRateLimit({
      db: context.env.DB,
      scope: 'admin-login',
      identifier: ipAddress,
      limit: 10,
      windowSeconds: 300
    });
    await verifyTurnstile({
      token:
        typeof body.turnstileToken === 'string' ? body.turnstileToken : undefined,
      secret: context.env.TURNSTILE_SECRET_KEY,
      ipAddress
    });

    const service = new AdminAuthService(
      new AdminAuthRepository(context.env.DB),
      context.env.SESSION_SECRET
    );
    const result = await service.login(body);

    return jsonResponse(
      { admin: result.admin },
      {
        headers: {
          'set-cookie': result.cookie
        }
      }
    );
  } catch (error) {
    return errorResponse(
      'Nao foi possivel autenticar.',
      401,
      error instanceof Error ? error.message : undefined
    );
  }
}
