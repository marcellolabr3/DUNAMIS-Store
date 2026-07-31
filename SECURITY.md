# Seguranca

Nao versione arquivos `.env`, secrets, comprovantes, dados reais ou chaves de
producao. Vulnerabilidades devem ser tratadas antes de deploy em producao.

## Autenticacao

Administradores usam senha com hash PBKDF2. Sessoes sao assinadas e enviadas em
cookie `HttpOnly`, `Secure` e `SameSite=Lax`.

Credenciais de demonstracao existem apenas para desenvolvimento local e devem
ser substituidas antes de preview publico ou producao.

## Protecoes Implementadas

- Validacao de entrada com Zod no servidor.
- Queries parametrizadas para D1.
- Recalculo de preco e estoque no servidor.
- Idempotencia na criacao de pedido.
- Rate limit persistido no D1 para login e checkout.
- Cloudflare Turnstile quando `TURNSTILE_SECRET_KEY` esta configurada.
- Headers de seguranca e CSP via Pages Functions middleware.
- Upload de comprovante com extensao, MIME type e tamanho validados.
- Comprovantes em R2 privado.
- Auditoria inicial para login administrativo.

## Turnstile

Configure:

- `TURNSTILE_SECRET_KEY` no ambiente das Functions.
- `VITE_TURNSTILE_SITE_KEY` no build do front-end.

Sem secret, a verificacao e ignorada para facilitar desenvolvimento local.

## Relato de Vulnerabilidade

Registre a vulnerabilidade em canal privado do projeto. Nao abra issue publica
com dados sensiveis, credenciais ou comprovantes reais.
