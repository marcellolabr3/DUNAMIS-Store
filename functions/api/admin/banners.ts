import { AdminBannerRepository } from '../../repositories/admin-banner-repository';
import { AdminBannerService } from '../../services/admin-banner-service';
import type { Env } from '../../types/bindings';
import { requireAdmin } from '../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

function makeService(env: Env) {
  return new AdminBannerService(new AdminBannerRepository(env.DB));
}

export async function onRequestGet(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const banners = await makeService(context.env).list();

  return jsonResponse({ banners });
}

export async function onRequestPost(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  try {
    const banner = await makeService(context.env).create(
      await context.request.json()
    );

    return jsonResponse({ banner }, { status: 201 });
  } catch (error) {
    return errorResponse(
      'Nao foi possivel criar o banner.',
      400,
      error instanceof Error ? error.message : error
    );
  }
}
