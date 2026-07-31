INSERT INTO admins (
  id,
  name,
  email,
  password_hash,
  role,
  active
) VALUES (
  'demo-admin-owner',
  'Administrador Dunamis',
  'admin@dunamisstore.local',
  'pbkdf2$100000$dunamis-demo-admin-salt$sJq7JNVwFAZwOUOqZA96ZLIQzR2ato1uuwns4EyyPiA=',
  'owner',
  1
) ON CONFLICT(email) DO NOTHING;
