UPDATE admins
SET password_hash = 'pbkdf2$100000$dunamis-demo-admin-salt$sJq7JNVwFAZwOUOqZA96ZLIQzR2ato1uuwns4EyyPiA=',
  updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@dunamisstore.local'
  AND password_hash = 'pbkdf2$210000$dunamis-demo-admin-salt$M9CaIL4RhgJs1Jt9ENxbHAgjpY3jsiVBwXZcXurGR/I=';
