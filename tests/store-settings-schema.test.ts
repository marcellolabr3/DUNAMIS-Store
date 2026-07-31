import { defaultStoreSettings } from '../functions/config/default-store-settings';
import { storeSettingsSchema } from '../functions/schemas/store-settings-schema';

describe('storeSettingsSchema', () => {
  it('accepts the default store settings', () => {
    expect(() => storeSettingsSchema.parse(defaultStoreSettings)).not.toThrow();
  });

  it('rejects invalid color tokens', () => {
    const result = storeSettingsSchema.safeParse({
      ...defaultStoreSettings,
      primaryColor: 'yellow'
    });

    expect(result.success).toBe(false);
  });

  it('requires a valid payment expiration window', () => {
    const result = storeSettingsSchema.safeParse({
      ...defaultStoreSettings,
      orderExpirationMinutes: 5
    });

    expect(result.success).toBe(false);
  });
});
