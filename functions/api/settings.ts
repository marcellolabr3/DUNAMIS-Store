import { StoreSettingsRepository } from '../repositories/store-settings-repository';
import { StoreSettingsService } from '../services/store-settings-service';
import type { Env } from '../types/bindings';
import type { StoreSettings } from '../types/store-settings';
import { jsonResponse } from '../utils/http';

interface PagesFunctionContext {
  env: Env;
  request: Request;
}

function makeService(env: Env) {
  return new StoreSettingsService(new StoreSettingsRepository(env.DB));
}

export async function onRequestGet(context: PagesFunctionContext) {
  const settings = await makeService(context.env).getSettings();

  return jsonResponse({ settings: toPublicSettings(settings) });
}

function toPublicSettings(settings: StoreSettings) {
  const {
    pixKey,
    pixReceiverName,
    pixReceiverCity,
    ...publicSettings
  } = settings;

  void pixKey;
  void pixReceiverName;
  void pixReceiverCity;

  return publicSettings;
}
