# Arquitetura

DUNAMIS STORE e um e-commerce de vendedor unico para produtos da igreja. A
arquitetura separa front-end React, Cloudflare Pages Functions, D1 e R2.

## Fluxo do Cliente

Catalogo -> Produto -> Carrinho -> Checkout -> Pix -> Comprovante ->
Acompanhamento.

O cliente compra sem conta. O carrinho fica no navegador, mas pedido, precos,
estoque e Pix sao recalculados no servidor.

## Front-end

- React + TypeScript + Vite.
- Tailwind CSS com tokens de tema em `src/styles/index.css`.
- React Router para loja publica e painel administrativo.
- Services em `src/services` encapsulam chamadas HTTP.
- Tipos em `src/types` evitam contratos soltos entre telas.

## Pages Functions

As APIs ficam em `functions/api`. Repositories acessam D1 com queries
parametrizadas, services concentram regras de negocio e schemas Zod validam
entrada.

Rotas publicas principais:

- `/api/home`
- `/api/catalog`
- `/api/product/[slug]`
- `/api/orders`
- `/api/orders/track`
- `/api/orders/[publicToken]/receipt`
- `/api/health`

Rotas administrativas ficam em `/api/admin` e exigem sessao assinada.

## D1

D1 armazena catalogo, clientes, pedidos, pagamentos, historico, configuracoes,
auditoria e rate limits. Valores monetarios ficam em centavos.

## R2

R2 armazena comprovantes privados. O cliente envia o arquivo, mas somente o
painel autenticado acessa o download.

## Pagamentos

A camada de pagamentos fica em `functions/services/payments`. O provider atual e
`ManualPixProvider`, que gera Pix Copia e Cola e QR Code. Gateways futuros devem
implementar a mesma interface sem alterar regras centrais de pedido.

## Administracao

O painel inclui login, produtos, pedidos, banners, configuracoes e relatorios.
Confirmacao de pagamento e sempre manual. Comprovante enviado apenas move o
pedido para conferencia.

## Seguranca

Entradas sao validadas com Zod, queries usam bind parametrizado, sessoes usam
cookie `HttpOnly`, `Secure` e `SameSite=Lax`, uploads sao validados, headers de
seguranca sao aplicados por middleware e Turnstile/rate limit protegem login e
checkout quando configurados.
