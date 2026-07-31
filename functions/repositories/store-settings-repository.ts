import { defaultStoreSettings } from '../config/default-store-settings';
import type {
  StoreSettings,
  StoreSettingsRow
} from '../types/store-settings';

export class StoreSettingsRepository {
  constructor(private readonly db: D1Database) {}

  async get(): Promise<StoreSettings> {
    const row = await this.db
      .prepare(
        `SELECT
          store_name,
          store_description,
          logo_url,
          favicon_url,
          primary_color,
          secondary_color,
          contact_email,
          contact_phone,
          whatsapp_number,
          pix_key,
          pix_receiver_name,
          pix_receiver_city,
          order_expiration_minutes,
          allow_pickup,
          allow_delivery,
          pickup_instructions,
          delivery_instructions,
          minimum_order_value,
          store_active
        FROM store_settings
        WHERE id = 1`
      )
      .first<StoreSettingsRow>();

    return row ? mapSettingsRow(row) : defaultStoreSettings;
  }

  async upsert(settings: StoreSettings): Promise<StoreSettings> {
    await this.db
      .prepare(
        `INSERT INTO store_settings (
          id,
          store_name,
          store_description,
          logo_url,
          favicon_url,
          primary_color,
          secondary_color,
          contact_email,
          contact_phone,
          whatsapp_number,
          pix_key,
          pix_receiver_name,
          pix_receiver_city,
          order_expiration_minutes,
          allow_pickup,
          allow_delivery,
          pickup_instructions,
          delivery_instructions,
          minimum_order_value,
          store_active,
          updated_at
        ) VALUES (
          1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
        )
        ON CONFLICT(id) DO UPDATE SET
          store_name = excluded.store_name,
          store_description = excluded.store_description,
          logo_url = excluded.logo_url,
          favicon_url = excluded.favicon_url,
          primary_color = excluded.primary_color,
          secondary_color = excluded.secondary_color,
          contact_email = excluded.contact_email,
          contact_phone = excluded.contact_phone,
          whatsapp_number = excluded.whatsapp_number,
          pix_key = excluded.pix_key,
          pix_receiver_name = excluded.pix_receiver_name,
          pix_receiver_city = excluded.pix_receiver_city,
          order_expiration_minutes = excluded.order_expiration_minutes,
          allow_pickup = excluded.allow_pickup,
          allow_delivery = excluded.allow_delivery,
          pickup_instructions = excluded.pickup_instructions,
          delivery_instructions = excluded.delivery_instructions,
          minimum_order_value = excluded.minimum_order_value,
          store_active = excluded.store_active,
          updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        settings.storeName,
        settings.storeDescription,
        settings.logoUrl,
        settings.faviconUrl,
        settings.primaryColor,
        settings.secondaryColor,
        settings.contactEmail,
        settings.contactPhone,
        settings.whatsappNumber,
        settings.pixKey,
        settings.pixReceiverName,
        settings.pixReceiverCity,
        settings.orderExpirationMinutes,
        settings.allowPickup ? 1 : 0,
        settings.allowDelivery ? 1 : 0,
        settings.pickupInstructions,
        settings.deliveryInstructions,
        settings.minimumOrderValue,
        settings.storeActive ? 1 : 0
      )
      .run();

    return settings;
  }
}

function mapSettingsRow(row: StoreSettingsRow): StoreSettings {
  return {
    storeName: row.store_name,
    storeDescription: row.store_description,
    logoUrl: row.logo_url,
    faviconUrl: row.favicon_url,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    whatsappNumber: row.whatsapp_number,
    pixKey: row.pix_key,
    pixReceiverName: row.pix_receiver_name,
    pixReceiverCity: row.pix_receiver_city,
    orderExpirationMinutes: row.order_expiration_minutes,
    allowPickup: row.allow_pickup === 1,
    allowDelivery: row.allow_delivery === 1,
    pickupInstructions: row.pickup_instructions,
    deliveryInstructions: row.delivery_instructions,
    minimumOrderValue: row.minimum_order_value,
    storeActive: row.store_active === 1
  };
}
