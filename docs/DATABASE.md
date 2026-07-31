# Banco de Dados

O banco principal da DUNAMIS STORE sera Cloudflare D1.

## Migrations

As migrations ficam em `migrations/` e devem ser versionadas no Git.

- `0001_initial_schema.sql`: cria as tabelas minimas do e-commerce.
- `0002_seed_store_settings.sql`: cria as configuracoes padrao da loja.

## Tabelas Iniciais

- `admins`
- `store_settings`
- `categories`
- `products`
- `product_images`
- `product_variants`
- `customers`
- `addresses`
- `orders`
- `order_items`
- `payments`
- `payment_receipts`
- `order_status_history`
- `banners`
- `audit_logs`

Valores monetarios sao armazenados como inteiros em centavos para evitar erro de
ponto flutuante.

## Comando Local

```bash
npm run db:migrate
```

O comando usa Wrangler para aplicar as migrations no D1 local configurado.
