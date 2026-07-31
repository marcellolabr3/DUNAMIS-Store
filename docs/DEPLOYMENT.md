# Deploy

Este projeto foi desenhado para Cloudflare Pages, Pages Functions, D1 e R2. Nao
ha servidor tradicional para manter ligado.

## Ambientes

- Desenvolvimento local: Vite, Wrangler D1 local e dados ficticios.
- Preview: branch ou pull request no Cloudflare Pages.
- Producao: branch principal publicada no Cloudflare Pages.

## Preparacao

1. Instale dependencias:

```bash
npm install
```

2. Crie o D1:

```bash
wrangler d1 create dunamis-store-db
```

3. Crie o bucket R2 privado:

```bash
wrangler r2 bucket create dunamis-store-receipts
```

4. Atualize `wrangler.toml` com os IDs reais fora de commits com secrets.

## Variaveis

Configure no Cloudflare Pages:

- `SESSION_SECRET`
- `TURNSTILE_SECRET_KEY`
- `VITE_TURNSTILE_SITE_KEY`
- IDs e bindings de D1/R2 conforme o projeto Cloudflare

Nao configure secrets reais em `.env` versionado.

## Migracoes

Preview/local:

```bash
npm run db:migrate
```

Producao:

```bash
wrangler d1 migrations apply dunamis-store-db --remote
```

Execute migrations antes do deploy que dependa de novas tabelas.

## Validacao

Antes de publicar:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm audit
```

## Deploy

```bash
npm run deploy
```

O comando publica `dist/` via Wrangler Pages. Configure o projeto no painel da
Cloudflare para usar Pages Functions da pasta `functions/`.

## Rollback

Use o historico de deployments do Cloudflare Pages para voltar a uma versao
anterior. Para banco, mantenha backup/exportacao antes de migrations sensiveis e
documente manualmente qualquer reversao de schema.
