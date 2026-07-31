UPDATE store_settings
SET
  pix_key = 'pix-demo@dunamisstore.local',
  pix_receiver_name = 'DUNAMIS STORE',
  pix_receiver_city = 'SAO PAULO',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1 AND pix_key = '';
