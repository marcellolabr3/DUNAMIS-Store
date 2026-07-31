import type { StoreSettings } from '../types/store-settings';

export type PublicStoreSettings = Omit<
  StoreSettings,
  'pixKey' | 'pixReceiverName' | 'pixReceiverCity'
>;

export async function getPublicSettings() {
  const response = await fetch('/api/settings');

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar as configuracoes da loja.');
  }

  const payload = (await response.json()) as { settings: PublicStoreSettings };

  return payload.settings;
}
