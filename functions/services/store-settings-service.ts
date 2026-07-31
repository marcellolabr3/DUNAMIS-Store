import { StoreSettingsRepository } from '../repositories/store-settings-repository';
import { storeSettingsSchema } from '../schemas/store-settings-schema';
import type { StoreSettings } from '../types/store-settings';

export class StoreSettingsService {
  constructor(private readonly repository: StoreSettingsRepository) {}

  getSettings(): Promise<StoreSettings> {
    return this.repository.get();
  }

  async updateSettings(input: unknown): Promise<StoreSettings> {
    const settings = storeSettingsSchema.parse(input);

    return this.repository.upsert(settings);
  }
}
