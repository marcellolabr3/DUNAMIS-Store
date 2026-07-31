import { StoreSettingsRepository } from '../../repositories/store-settings-repository';
import { StoreSettingsService } from '../../services/store-settings-service';
import type { Env } from '../../types/bindings';
import { requireAdmin } from '../../utils/admin-request';
import { errorResponse, jsonResponse } from '../../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

function makeService(env: Env) {
  return new StoreSettingsService(new StoreSettingsRepository(env.DB));
}

export async function onRequestGet(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  const settings = await makeService(context.env).getSettings();

  return jsonResponse({ settings });
}

export async function onRequestPut(context: PagesFunctionContext) {
  const admin = await requireAdmin(context.request, context.env);

  if (!admin) {
    return errorResponse('Sessao invalida.', 401);
  }

  try {
    const settings = await makeService(context.env).updateSettings(
      await context.request.json()
    );

    return jsonResponse({ settings });
  } catch (error) {
    return errorResponse(
      'Nao foi possivel salvar as configuracoes.',
      400,
      error instanceof Error ? error.message : error
    );
  }
}
