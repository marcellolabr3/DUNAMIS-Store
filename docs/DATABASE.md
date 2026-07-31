# Banco de Dados

O banco principal da DUNAMIS STORE e Cloudflare D1. Valores monetarios sao
armazenados como inteiros em centavos.

## Migrations

As migrations ficam em `migrations/` e devem ser versionadas:

- `0001_initial_schema.sql`: tabelas centrais do e-commerce.
- `0002_seed_store_settings.sql`: configuracoes padrao.
- `0003_order_idempotency.sql`: protecao contra pedido duplicado.
- `0004_default_manual_pix_settings.sql`: Pix ficticio para desenvolvimento.
- `0005_seed_demo_admin.sql`: admin demo local.
- `0006_security_rate_limits.sql`: rate limit persistido.

## Tabelas

- `admins`: usuarios administrativos e bloqueio de login.
- `store_settings`: identidade, contatos, Pix e regras da loja.
- `categories`: categorias do catalogo.
- `products`: produtos principais.
- `product_images`: imagens por produto.
- `product_variants`: variacoes, SKU e estoque.
- `customers`: dados do comprador sem conta obrigatoria.
- `addresses`: endereco de entrega quando usado.
- `orders`: pedido, totais, status e Pix.
- `order_items`: snapshot dos itens comprados.
- `payments`: pagamento relacionado ao pedido.
- `payment_receipts`: comprovantes privados no R2.
- `order_status_history`: historico de status.
- `order_idempotency_keys`: idempotencia do checkout.
- `banners`: banners editaveis.
- `audit_logs`: auditoria administrativa.
- `rate_limits`: controle de tentativas por escopo.

## Relacionamentos

Produtos pertencem a categorias. Variacoes e imagens pertencem a produtos.
Pedidos pertencem a clientes e podem ter endereco. Pagamentos, comprovantes,
itens e historico pertencem a pedidos.

## Dados de Demonstracao

```bash
npm run db:migrate
npm run seed:demo
```

Limpeza:

```bash
npm run seed:clear
```

Os registros demo usam IDs com prefixo `demo-*`.

## Backup e Restauracao

Antes de migrations em producao, exporte o D1 pelo painel/CLI da Cloudflare.
Para restaurar, use o backup exportado e valide em preview antes de promover.
