# DUNAMIS STORE

DUNAMIS STORE e uma loja virtual de vendedor unico para venda de produtos da
igreja. O projeto usa uma arquitetura simples, com front-end em React e back-end
em Cloudflare Pages Functions, preparando o sistema para catalogo, carrinho,
checkout sem conta, Pix manual, envio de comprovante e painel administrativo.

## Status do Projeto

O projeto esta em desenvolvimento por etapas.

Implementado ate agora:

- base React, TypeScript, Vite e Tailwind CSS;
- tema visual inicial em amarelo e preto;
- tokens de cores centralizados em CSS/Tailwind;
- layout publico com cabecalho, menu responsivo, carrinho e rodape;
- layout administrativo inicial com menu lateral;
- pagina inicial;
- paginas placeholder para catalogo, carrinho e acompanhamento de pedido;
- endpoint de health check em `functions/api/health.ts`;
- configuracao inicial de ESLint, Prettier, Vitest e Cloudflare Wrangler;
- testes iniciais com React Testing Library.
- migrations iniciais do Cloudflare D1;
- seed de demonstracao com categorias, produtos, variacoes, banners e pedidos;
- comando para limpeza dos dados ficticios.
- loja publica inicial com home, catalogo, busca, filtros e pagina de produto.
- carrinho local com adicionar, remover, alterar quantidade e calculo visual.
- checkout sem conta com dados do cliente, recebimento, revisao e criacao de pedido via API.
- Pix manual com payload Copia e Cola, QR Code, valor do pedido e expiracao.
- upload privado de comprovante com validacao de arquivo e status `RECEIPT_SUBMITTED`.
- consulta publica de pedido por numero e codigo, com historico e dados limitados.
- consulta por token seguro no link de acompanhamento.
- autenticacao administrativa com login, sessao assinada em cookie HttpOnly e logout.
- administracao de produtos com criacao, edicao, duplicacao, publicacao, estoque,
  variacoes e imagens por URL.
- administracao de pedidos com filtros, detalhes, comprovantes privados, historico,
  atualizacao de status e confirmacao manual de pagamento.
- personalizacao administrativa de identidade, contatos, cores, Pix, retirada,
  entrega, ativacao da loja e banners.
- dashboard e relatorios com metricas reais, pedidos recentes, estoque baixo e
  exportacao CSV autenticada.
- headers de seguranca, rate limit em login/checkout, Turnstile configuravel e
  auditoria de login administrativo.
- testes automatizados reforcados para recalculo de pedido, estoque,
  idempotencia e seguranca.

## Funcionalidades Planejadas

Escopo funcional da DUNAMIS STORE:

- catalogo publico de produtos;
- busca por nome;
- filtros por categoria;
- ordenacao por preco e produtos recentes;
- pagina de produto com imagens, descricao, SKU, estoque e variacoes;
- produtos em destaque e produtos recentes;
- carrinho com alteracao de quantidade, remocao e subtotal;
- checkout sem criacao obrigatoria de conta;
- identificacao do cliente com nome, WhatsApp e e-mail opcional;
- retirada na igreja;
- entrega configuravel;
- revisao do pedido antes da criacao;
- recalculo de precos e estoque no servidor;
- criacao de pedido no Cloudflare D1;
- pagamento inicial por Pix manual;
- Pix Copia e Cola;
- QR Code Pix;
- prazo de expiracao do pedido;
- upload privado de comprovante em Cloudflare R2;
- status de pedido e historico de alteracoes;
- consulta publica de pedido por numero e codigo/token seguro;
- painel administrativo;
- gerenciamento de produtos;
- gerenciamento de categorias;
- gerenciamento de banners;
- gerenciamento de pedidos;
- confirmacao manual de pagamento;
- rejeicao de comprovante;
- configuracoes da loja;
- personalizacao de textos, cores, contatos, Pix e instrucoes;
- dashboard administrativo;
- relatorios;
- exportacao CSV;
- logs e auditoria;
- dados de demonstracao com comandos de seed e limpeza;
- workflow de validacao no GitHub Actions.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare D1
- Cloudflare R2
- Vitest
- React Testing Library
- ESLint
- Prettier
- Wrangler

## Como Rodar Localmente

Requisitos:

- Node.js 24 ou superior;
- npm;
- Git;
- conta Cloudflare para etapas com D1, R2 e deploy.

Clone o repositorio:

```bash
git clone https://github.com/marcellolabr3/DUNAMIS-Store.git
cd DUNAMIS-Store
```

Instale as dependencias:

```bash
npm install
```

Crie o arquivo de ambiente local:

```bash
cp .env.example .env
```

No Windows PowerShell, se `cp` nao estiver disponivel, use:

```powershell
Copy-Item .env.example .env
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Depois abra a URL exibida pelo Vite no terminal, normalmente:

```text
http://localhost:5173
```

Para preparar o banco local e carregar os dados de demonstracao:

```bash
npm run db:migrate
npm run seed:demo
```

O painel administrativo local fica em:

```text
http://localhost:5173/admin/login
```

Credenciais de desenvolvimento:

```text
E-mail: admin@dunamisstore.local
Senha: Dunamis@123
```

Troque estas credenciais antes de qualquer ambiente real.

## Como Validar

Execute os comandos abaixo antes de commits e entregas:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Verifique vulnerabilidades conhecidas nas dependencias:

```bash
npm audit
```

## Scripts Disponiveis

`npm run dev`

Inicia o servidor local do Vite.

`npm run build`

Executa o typecheck e gera o build de producao em `dist/`.

`npm run preview`

Serve localmente o build gerado.

`npm run lint`

Executa ESLint no projeto.

`npm run typecheck`

Executa a validacao TypeScript sem emitir arquivos.

`npm run test`

Executa os testes automatizados com Vitest.

`npm run test:coverage`

Executa os testes com relatorio de cobertura.

`npm run db:migrate`

Aplica migrations locais no banco D1 configurado.

`npm run seed:demo`

Executa o seed de demonstracao no D1 local. Rode `npm run db:migrate` antes.

`npm run seed:clear`

Remove os dados ficticios do D1 local usando os prefixos `demo-*`.

`npm run deploy`

Envia o build para Cloudflare Pages usando Wrangler.

## Variaveis de Ambiente

Copie `.env.example` para `.env` e preencha conforme o ambiente:

```env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
D1_DATABASE_ID=
R2_BUCKET_NAME=
SESSION_SECRET=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
VITE_APP_NAME="DUNAMIS STORE"
```

Nunca versione `.env` nem valores reais de secrets.

## Banco de Dados

O banco usa Cloudflare D1. As migrations versionadas ficam em `migrations/`.
Em desenvolvimento, `npm run db:migrate` cria a estrutura e tambem adiciona o
administrador de demonstracao.

Comandos planejados:

```bash
npm run db:migrate
npm run seed:demo
npm run seed:clear
```

## Cloudflare

O deploy sera feito em Cloudflare Pages. O back-end usara Pages Functions, D1
para dados relacionais e R2 para imagens privadas e comprovantes.

O arquivo `wrangler.toml` contem a estrutura inicial de bindings para D1 e R2.
Os IDs reais devem ser configurados fora do repositorio.

## Seguranca

Medidas previstas no escopo:

- validacao de entrada no servidor;
- consultas parametrizadas;
- hash de senha para administradores;
- sessao segura com cookie HttpOnly, Secure e SameSite;
- protecao contra CSRF quando aplicavel;
- Cloudflare Turnstile no checkout e login;
- rate limit;
- validacao de uploads;
- comprovantes privados no R2;
- logs administrativos;
- auditoria;
- headers de seguranca e Content Security Policy;
- recalculo de precos e estoque no servidor;
- idempotencia na criacao de pedidos;
- secrets fora do repositorio.

## Versionamento

Use Conventional Commits:

```text
chore: initialize dunamis store project
feat: add public product catalog
fix: correct stock validation
docs: update project readme
test: add checkout integration tests
security: harden application security
```

## Roadmap

- Pix dinamico com webhook;
- integracao com Stone, Asaas, Efi, Mercado Pago ou PagBank;
- pagamento por cartao;
- notificacoes para cliente e administracao;
- conta opcional de cliente;
- melhorias de relatorios.

## Licenca

Projeto privado. Todos os direitos reservados.
