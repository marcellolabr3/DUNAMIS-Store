PRAGMA foreign_keys = ON;

INSERT INTO categories (
  id,
  name,
  slug,
  description,
  image_url,
  active,
  display_order
) VALUES
  (
    'demo-cat-camisetas',
    'Camisetas',
    'camisetas',
    'Camisetas da DUNAMIS STORE para uso diario e eventos.',
    '/demo/categories/camisetas.svg',
    1,
    1
  ),
  (
    'demo-cat-livros',
    'Livros',
    'livros',
    'Livros, devocionais e materiais de estudo.',
    '/demo/categories/livros.svg',
    1,
    2
  ),
  (
    'demo-cat-acessorios',
    'Acessorios',
    'acessorios',
    'Canecas, pulseiras e itens de apoio.',
    '/demo/categories/acessorios.svg',
    1,
    3
  ),
  (
    'demo-cat-eventos',
    'Eventos',
    'eventos',
    'Inscricoes e materiais para eventos da igreja.',
    '/demo/categories/eventos.svg',
    1,
    4
  ),
  (
    'demo-cat-infantil',
    'Infantil',
    'infantil',
    'Produtos para criancas.',
    '/demo/categories/infantil.svg',
    1,
    5
  )
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  image_url = excluded.image_url,
  active = excluded.active,
  display_order = excluded.display_order,
  updated_at = CURRENT_TIMESTAMP,
  deleted_at = NULL;

INSERT INTO products (
  id,
  category_id,
  name,
  slug,
  short_description,
  description,
  sku,
  price,
  promotional_price,
  active,
  featured,
  track_stock
) VALUES
  (
    'demo-prod-camiseta-classica',
    'demo-cat-camisetas',
    'Camiseta Dunamis Classica',
    'camiseta-dunamis-classica',
    'Camiseta classica com identidade Dunamis.',
    'Produto ficticio para demonstracao do catalogo.',
    'DEMO-CAM-CLASSICA',
    6990,
    NULL,
    1,
    1,
    1
  ),
  (
    'demo-prod-camiseta-fe',
    'demo-cat-camisetas',
    'Camiseta Fe em Movimento',
    'camiseta-fe-em-movimento',
    'Camiseta preta com mensagem de fe.',
    'Produto ficticio para demonstracao do catalogo.',
    'DEMO-CAM-FE',
    7490,
    NULL,
    1,
    0,
    1
  ),
  (
    'demo-prod-devocional-30-dias',
    'demo-cat-livros',
    'Devocional 30 Dias',
    'devocional-30-dias',
    'Devocional para leitura diaria.',
    'Produto ficticio para demonstracao do catalogo.',
    'DEMO-LIV-DEV30',
    3990,
    NULL,
    1,
    1,
    1
  ),
  (
    'demo-prod-biblia-estudo',
    'demo-cat-livros',
    'Biblia de Estudo',
    'biblia-de-estudo',
    'Biblia de estudo para aprofundamento.',
    'Produto ficticio para demonstracao do catalogo.',
    'DEMO-LIV-BIBLIA',
    12990,
    NULL,
    1,
    0,
    1
  ),
  (
    'demo-prod-caneca-dunamis',
    'demo-cat-acessorios',
    'Caneca Dunamis',
    'caneca-dunamis',
    'Caneca personalizada Dunamis.',
    'Produto ficticio para demonstracao do catalogo.',
    'DEMO-ACE-CANECA',
    3490,
    NULL,
    1,
    0,
    1
  ),
  (
    'demo-prod-pulseira-dunamis',
    'demo-cat-acessorios',
    'Pulseira Dunamis',
    'pulseira-dunamis',
    'Pulseira simples com identidade Dunamis.',
    'Produto ficticio para demonstracao do catalogo.',
    'DEMO-ACE-PULSEIRA',
    1490,
    NULL,
    1,
    0,
    1
  ),
  (
    'demo-prod-conferencia-dunamis',
    'demo-cat-eventos',
    'Conferencia Dunamis',
    'conferencia-dunamis',
    'Inscricao ficticia para conferencia.',
    'Produto ficticio para demonstracao do catalogo.',
    'DEMO-EVE-CONF',
    4990,
    NULL,
    1,
    0,
    1
  ),
  (
    'demo-prod-camiseta-kids',
    'demo-cat-infantil',
    'Camiseta Dunamis Kids',
    'camiseta-dunamis-kids',
    'Camiseta infantil Dunamis.',
    'Produto ficticio para demonstracao do catalogo.',
    'DEMO-INF-CAMKIDS',
    5490,
    NULL,
    1,
    0,
    1
  )
ON CONFLICT(id) DO UPDATE SET
  category_id = excluded.category_id,
  name = excluded.name,
  slug = excluded.slug,
  short_description = excluded.short_description,
  description = excluded.description,
  sku = excluded.sku,
  price = excluded.price,
  promotional_price = excluded.promotional_price,
  active = excluded.active,
  featured = excluded.featured,
  track_stock = excluded.track_stock,
  updated_at = CURRENT_TIMESTAMP,
  deleted_at = NULL;

INSERT INTO product_images (
  id,
  product_id,
  url,
  alt_text,
  display_order,
  is_main
) VALUES
  ('demo-img-camiseta-classica-1', 'demo-prod-camiseta-classica', '/demo/products/camiseta-classica.svg', 'Imagem demonstrativa da Camiseta Dunamis Classica', 1, 1),
  ('demo-img-camiseta-fe-1', 'demo-prod-camiseta-fe', '/demo/products/camiseta-fe.svg', 'Imagem demonstrativa da Camiseta Fe em Movimento', 1, 1),
  ('demo-img-devocional-1', 'demo-prod-devocional-30-dias', '/demo/products/devocional-30-dias.svg', 'Imagem demonstrativa do Devocional 30 Dias', 1, 1),
  ('demo-img-biblia-1', 'demo-prod-biblia-estudo', '/demo/products/biblia-estudo.svg', 'Imagem demonstrativa da Biblia de Estudo', 1, 1),
  ('demo-img-caneca-1', 'demo-prod-caneca-dunamis', '/demo/products/caneca-dunamis.svg', 'Imagem demonstrativa da Caneca Dunamis', 1, 1),
  ('demo-img-pulseira-1', 'demo-prod-pulseira-dunamis', '/demo/products/pulseira-dunamis.svg', 'Imagem demonstrativa da Pulseira Dunamis', 1, 1),
  ('demo-img-conferencia-1', 'demo-prod-conferencia-dunamis', '/demo/products/conferencia-dunamis.svg', 'Imagem demonstrativa da Conferencia Dunamis', 1, 1),
  ('demo-img-kids-1', 'demo-prod-camiseta-kids', '/demo/products/camiseta-kids.svg', 'Imagem demonstrativa da Camiseta Dunamis Kids', 1, 1)
ON CONFLICT(id) DO UPDATE SET
  product_id = excluded.product_id,
  url = excluded.url,
  alt_text = excluded.alt_text,
  display_order = excluded.display_order,
  is_main = excluded.is_main;

INSERT INTO product_variants (
  id,
  product_id,
  name,
  sku,
  size,
  color,
  price_adjustment,
  stock_quantity,
  active
) VALUES
  ('demo-var-classica-p-preta', 'demo-prod-camiseta-classica', 'P / Preta', 'DEMO-CAM-CLASSICA-P-PRETA', 'P', 'Preta', 0, 20, 1),
  ('demo-var-classica-m-preta', 'demo-prod-camiseta-classica', 'M / Preta', 'DEMO-CAM-CLASSICA-M-PRETA', 'M', 'Preta', 0, 20, 1),
  ('demo-var-classica-g-preta', 'demo-prod-camiseta-classica', 'G / Preta', 'DEMO-CAM-CLASSICA-G-PRETA', 'G', 'Preta', 0, 20, 1),
  ('demo-var-classica-gg-preta', 'demo-prod-camiseta-classica', 'GG / Preta', 'DEMO-CAM-CLASSICA-GG-PRETA', 'GG', 'Preta', 0, 20, 1),
  ('demo-var-classica-p-amarela', 'demo-prod-camiseta-classica', 'P / Amarela', 'DEMO-CAM-CLASSICA-P-AMARELA', 'P', 'Amarela', 0, 20, 1),
  ('demo-var-classica-m-amarela', 'demo-prod-camiseta-classica', 'M / Amarela', 'DEMO-CAM-CLASSICA-M-AMARELA', 'M', 'Amarela', 0, 20, 1),
  ('demo-var-classica-g-amarela', 'demo-prod-camiseta-classica', 'G / Amarela', 'DEMO-CAM-CLASSICA-G-AMARELA', 'G', 'Amarela', 0, 20, 1),
  ('demo-var-classica-gg-amarela', 'demo-prod-camiseta-classica', 'GG / Amarela', 'DEMO-CAM-CLASSICA-GG-AMARELA', 'GG', 'Amarela', 0, 20, 1),
  ('demo-var-fe-p-preta', 'demo-prod-camiseta-fe', 'P / Preta', 'DEMO-CAM-FE-P-PRETA', 'P', 'Preta', 0, 15, 1),
  ('demo-var-fe-m-preta', 'demo-prod-camiseta-fe', 'M / Preta', 'DEMO-CAM-FE-M-PRETA', 'M', 'Preta', 0, 15, 1),
  ('demo-var-fe-g-preta', 'demo-prod-camiseta-fe', 'G / Preta', 'DEMO-CAM-FE-G-PRETA', 'G', 'Preta', 0, 15, 1),
  ('demo-var-fe-gg-preta', 'demo-prod-camiseta-fe', 'GG / Preta', 'DEMO-CAM-FE-GG-PRETA', 'GG', 'Preta', 0, 15, 1),
  ('demo-var-devocional-unico', 'demo-prod-devocional-30-dias', 'Unico', 'DEMO-LIV-DEV30-UNICO', NULL, NULL, 0, 40, 1),
  ('demo-var-biblia-unico', 'demo-prod-biblia-estudo', 'Unico', 'DEMO-LIV-BIBLIA-UNICO', NULL, NULL, 0, 12, 1),
  ('demo-var-caneca-unico', 'demo-prod-caneca-dunamis', 'Unico', 'DEMO-ACE-CANECA-UNICO', NULL, NULL, 0, 30, 1),
  ('demo-var-pulseira-unico', 'demo-prod-pulseira-dunamis', 'Unico', 'DEMO-ACE-PULSEIRA-UNICO', NULL, NULL, 0, 50, 1),
  ('demo-var-conferencia-unico', 'demo-prod-conferencia-dunamis', 'Unico', 'DEMO-EVE-CONF-UNICO', NULL, NULL, 0, 100, 1),
  ('demo-var-kids-4', 'demo-prod-camiseta-kids', 'Tamanho 4', 'DEMO-INF-CAMKIDS-4', '4', NULL, 0, 10, 1),
  ('demo-var-kids-6', 'demo-prod-camiseta-kids', 'Tamanho 6', 'DEMO-INF-CAMKIDS-6', '6', NULL, 0, 10, 1),
  ('demo-var-kids-8', 'demo-prod-camiseta-kids', 'Tamanho 8', 'DEMO-INF-CAMKIDS-8', '8', NULL, 0, 10, 1),
  ('demo-var-kids-10', 'demo-prod-camiseta-kids', 'Tamanho 10', 'DEMO-INF-CAMKIDS-10', '10', NULL, 0, 10, 1),
  ('demo-var-kids-12', 'demo-prod-camiseta-kids', 'Tamanho 12', 'DEMO-INF-CAMKIDS-12', '12', NULL, 0, 10, 1)
ON CONFLICT(id) DO UPDATE SET
  product_id = excluded.product_id,
  name = excluded.name,
  sku = excluded.sku,
  size = excluded.size,
  color = excluded.color,
  price_adjustment = excluded.price_adjustment,
  stock_quantity = excluded.stock_quantity,
  active = excluded.active,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO banners (
  id,
  title,
  description,
  image_url,
  button_label,
  button_link,
  active,
  display_order
) VALUES
  ('demo-banner-principal', 'DUNAMIS STORE', 'Produtos da igreja com retirada local e Pix manual.', '/demo/banners/banner-principal.svg', 'Ver catalogo', '/catalogo', 1, 1),
  ('demo-banner-livros', 'Livros e devocionais', 'Materiais para leitura e estudo.', '/demo/banners/banner-livros.svg', 'Conhecer livros', '/catalogo?categoria=livros', 1, 2)
ON CONFLICT(id) DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  button_label = excluded.button_label,
  button_link = excluded.button_link,
  active = excluded.active,
  display_order = excluded.display_order,
  updated_at = CURRENT_TIMESTAMP,
  deleted_at = NULL;

INSERT INTO customers (
  id,
  full_name,
  whatsapp,
  email
) VALUES
  ('demo-customer-ana', 'Ana Souza', '11990000001', 'ana.demo@example.com'),
  ('demo-customer-bruno', 'Bruno Lima', '11990000002', 'bruno.demo@example.com'),
  ('demo-customer-carla', 'Carla Mendes', '11990000003', NULL),
  ('demo-customer-daniel', 'Daniel Rocha', '11990000004', 'daniel.demo@example.com'),
  ('demo-customer-elisa', 'Elisa Martins', '11990000005', NULL)
ON CONFLICT(id) DO UPDATE SET
  full_name = excluded.full_name,
  whatsapp = excluded.whatsapp,
  email = excluded.email,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO orders (
  id,
  order_number,
  public_token,
  lookup_code,
  customer_id,
  status,
  payment_status,
  payment_method,
  delivery_method,
  subtotal,
  delivery_amount,
  discount_amount,
  total,
  customer_notes,
  internal_notes,
  pix_payload,
  pix_expiration_at
) VALUES
  ('demo-order-001', 'DNS-2026-000001', 'demo-token-order-001', 'A7K4M2', 'demo-customer-ana', 'PENDING_PAYMENT', 'PENDING', 'manual_pix', 'pickup', 6990, 0, 0, 6990, 'Pedido ficticio.', NULL, 'DEMO-PIX-PAYLOAD-001', '2026-08-01T12:00:00.000Z'),
  ('demo-order-002', 'DNS-2026-000002', 'demo-token-order-002', 'B8L5N3', 'demo-customer-bruno', 'RECEIPT_SUBMITTED', 'RECEIPT_SUBMITTED', 'manual_pix', 'pickup', 3990, 0, 0, 3990, 'Comprovante ficticio enviado.', NULL, 'DEMO-PIX-PAYLOAD-002', '2026-08-01T12:00:00.000Z'),
  ('demo-order-003', 'DNS-2026-000003', 'demo-token-order-003', 'C9M6P4', 'demo-customer-carla', 'PAID', 'PAID', 'manual_pix', 'pickup', 12990, 0, 0, 12990, NULL, 'Pagamento confirmado manualmente.', 'DEMO-PIX-PAYLOAD-003', '2026-08-01T12:00:00.000Z'),
  ('demo-order-004', 'DNS-2026-000004', 'demo-token-order-004', 'D1N7Q5', 'demo-customer-daniel', 'PREPARING', 'PAID', 'manual_pix', 'pickup', 8980, 0, 0, 8980, NULL, NULL, 'DEMO-PIX-PAYLOAD-004', '2026-08-01T12:00:00.000Z'),
  ('demo-order-005', 'DNS-2026-000005', 'demo-token-order-005', 'E2P8R6', 'demo-customer-elisa', 'READY_FOR_PICKUP', 'PAID', 'manual_pix', 'pickup', 1490, 0, 0, 1490, NULL, NULL, 'DEMO-PIX-PAYLOAD-005', '2026-08-01T12:00:00.000Z')
ON CONFLICT(id) DO UPDATE SET
  order_number = excluded.order_number,
  public_token = excluded.public_token,
  lookup_code = excluded.lookup_code,
  customer_id = excluded.customer_id,
  status = excluded.status,
  payment_status = excluded.payment_status,
  payment_method = excluded.payment_method,
  delivery_method = excluded.delivery_method,
  subtotal = excluded.subtotal,
  delivery_amount = excluded.delivery_amount,
  discount_amount = excluded.discount_amount,
  total = excluded.total,
  customer_notes = excluded.customer_notes,
  internal_notes = excluded.internal_notes,
  pix_payload = excluded.pix_payload,
  pix_expiration_at = excluded.pix_expiration_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO order_items (
  id,
  order_id,
  product_id,
  variant_id,
  product_name,
  variant_name,
  sku,
  unit_price,
  quantity,
  total
) VALUES
  ('demo-item-001-1', 'demo-order-001', 'demo-prod-camiseta-classica', 'demo-var-classica-m-preta', 'Camiseta Dunamis Classica', 'M / Preta', 'DEMO-CAM-CLASSICA-M-PRETA', 6990, 1, 6990),
  ('demo-item-002-1', 'demo-order-002', 'demo-prod-devocional-30-dias', 'demo-var-devocional-unico', 'Devocional 30 Dias', 'Unico', 'DEMO-LIV-DEV30-UNICO', 3990, 1, 3990),
  ('demo-item-003-1', 'demo-order-003', 'demo-prod-biblia-estudo', 'demo-var-biblia-unico', 'Biblia de Estudo', 'Unico', 'DEMO-LIV-BIBLIA-UNICO', 12990, 1, 12990),
  ('demo-item-004-1', 'demo-order-004', 'demo-prod-camiseta-kids', 'demo-var-kids-8', 'Camiseta Dunamis Kids', 'Tamanho 8', 'DEMO-INF-CAMKIDS-8', 5490, 1, 5490),
  ('demo-item-004-2', 'demo-order-004', 'demo-prod-caneca-dunamis', 'demo-var-caneca-unico', 'Caneca Dunamis', 'Unico', 'DEMO-ACE-CANECA-UNICO', 3490, 1, 3490),
  ('demo-item-005-1', 'demo-order-005', 'demo-prod-pulseira-dunamis', 'demo-var-pulseira-unico', 'Pulseira Dunamis', 'Unico', 'DEMO-ACE-PULSEIRA-UNICO', 1490, 1, 1490)
ON CONFLICT(id) DO UPDATE SET
  order_id = excluded.order_id,
  product_id = excluded.product_id,
  variant_id = excluded.variant_id,
  product_name = excluded.product_name,
  variant_name = excluded.variant_name,
  sku = excluded.sku,
  unit_price = excluded.unit_price,
  quantity = excluded.quantity,
  total = excluded.total;

INSERT INTO payments (
  id,
  order_id,
  provider,
  provider_reference,
  method,
  status,
  amount,
  metadata,
  confirmed_by,
  confirmed_at
) VALUES
  ('demo-payment-001', 'demo-order-001', 'manual_pix', 'DNS-2026-000001', 'pix', 'PENDING', 6990, '{"demo":true}', NULL, NULL),
  ('demo-payment-002', 'demo-order-002', 'manual_pix', 'DNS-2026-000002', 'pix', 'RECEIPT_SUBMITTED', 3990, '{"demo":true}', NULL, NULL),
  ('demo-payment-003', 'demo-order-003', 'manual_pix', 'DNS-2026-000003', 'pix', 'PAID', 12990, '{"demo":true}', NULL, '2026-07-31T10:00:00.000Z'),
  ('demo-payment-004', 'demo-order-004', 'manual_pix', 'DNS-2026-000004', 'pix', 'PAID', 8980, '{"demo":true}', NULL, '2026-07-31T10:30:00.000Z'),
  ('demo-payment-005', 'demo-order-005', 'manual_pix', 'DNS-2026-000005', 'pix', 'PAID', 1490, '{"demo":true}', NULL, '2026-07-31T11:00:00.000Z')
ON CONFLICT(id) DO UPDATE SET
  order_id = excluded.order_id,
  provider = excluded.provider,
  provider_reference = excluded.provider_reference,
  method = excluded.method,
  status = excluded.status,
  amount = excluded.amount,
  metadata = excluded.metadata,
  confirmed_by = excluded.confirmed_by,
  confirmed_at = excluded.confirmed_at,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO payment_receipts (
  id,
  order_id,
  payment_id,
  r2_key,
  file_name,
  mime_type,
  file_size,
  uploaded_ip_hash
) VALUES
  ('demo-receipt-002', 'demo-order-002', 'demo-payment-002', 'demo/receipts/demo-order-002.pdf', 'comprovante-demo-002.pdf', 'application/pdf', 102400, 'demo-ip-hash')
ON CONFLICT(id) DO UPDATE SET
  order_id = excluded.order_id,
  payment_id = excluded.payment_id,
  r2_key = excluded.r2_key,
  file_name = excluded.file_name,
  mime_type = excluded.mime_type,
  file_size = excluded.file_size,
  uploaded_ip_hash = excluded.uploaded_ip_hash;

INSERT INTO order_status_history (
  id,
  order_id,
  previous_status,
  new_status,
  note
) VALUES
  ('demo-history-001-1', 'demo-order-001', NULL, 'PENDING_PAYMENT', 'Pedido de demonstracao criado.'),
  ('demo-history-002-1', 'demo-order-002', NULL, 'PENDING_PAYMENT', 'Pedido de demonstracao criado.'),
  ('demo-history-002-2', 'demo-order-002', 'PENDING_PAYMENT', 'RECEIPT_SUBMITTED', 'Comprovante ficticio enviado.'),
  ('demo-history-003-1', 'demo-order-003', NULL, 'PENDING_PAYMENT', 'Pedido de demonstracao criado.'),
  ('demo-history-003-2', 'demo-order-003', 'PENDING_PAYMENT', 'PAID', 'Pagamento confirmado manualmente.'),
  ('demo-history-004-1', 'demo-order-004', NULL, 'PAID', 'Pagamento confirmado manualmente.'),
  ('demo-history-004-2', 'demo-order-004', 'PAID', 'PREPARING', 'Pedido em preparacao.'),
  ('demo-history-005-1', 'demo-order-005', NULL, 'PAID', 'Pagamento confirmado manualmente.'),
  ('demo-history-005-2', 'demo-order-005', 'PAID', 'READY_FOR_PICKUP', 'Pedido pronto para retirada.')
ON CONFLICT(id) DO UPDATE SET
  order_id = excluded.order_id,
  previous_status = excluded.previous_status,
  new_status = excluded.new_status,
  note = excluded.note;
