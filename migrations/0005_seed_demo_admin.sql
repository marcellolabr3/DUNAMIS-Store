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
  'pbkdf2$210000$dunamis-demo-admin-salt$M9CaIL4RhgJs1Jt9ENxbHAgjpY3jsiVBwXZcXurGR/I=',
  'owner',
  1
) ON CONFLICT(email) DO NOTHING;
