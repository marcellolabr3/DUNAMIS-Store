import { AdminBannerRepository } from '../../../repositories/admin-banner-repository';
import { AdminBannerService } from '../../../services/admin-banner-service';
import type { Env } from '../../../types/bindings';
import { requireAdmin } from '../../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
  params: {
    id: string;
  };
}

function makeService(env: Env) {
  return new AdminBannerService(new AdminBannerRepository(env.DB));
}

export async function onRequestPut(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  try {
    const banner = await makeService(context.env).update(
      context.params.id,
      await context.request.json()
    );

    if (!banner) {
      return errorResponse('Banner nao encontrado.', 404);
    }

    return jsonResponse({ banner });
  } catch (error) {
    return errorResponse(
      'Nao foi possivel salvar o banner.',
      400,
      error instanceof Error ? error.message : error
    );
  }
}

export async function onRequestDelete(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const removed = await makeService(context.env).remove(context.params.id);

  if (!removed) {
    return errorResponse('Banner nao encontrado.', 404);
  }

  return jsonResponse({ ok: true });
}
