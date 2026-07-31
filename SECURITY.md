# Seguranca

Nao versione arquivos `.env`, secrets, comprovantes, dados reais ou chaves de
producao. Vulnerabilidades devem ser tratadas antes de deploy em producao.

Comprovantes enviados por clientes devem ficar em bucket R2 privado. O sistema
valida extensao, MIME type e tamanho antes do armazenamento.

Administradores usam senha com hash PBKDF2 e sessao assinada em cookie
`HttpOnly`, `Secure` e `SameSite=Lax`. O segredo de assinatura deve ser definido
por ambiente em `SESSION_SECRET` e nunca deve ser commitado.

As credenciais de demonstracao existem apenas para desenvolvimento local e devem
ser substituidas antes de preview publico ou producao.

Login administrativo e criacao de pedidos usam rate limit persistido no D1.
Cloudflare Turnstile e verificado quando `TURNSTILE_SECRET_KEY` esta configurada;
em desenvolvimento local, sem secret, a verificacao e ignorada.

As Pages Functions aplicam headers de seguranca, incluindo CSP, `nosniff`,
`DENY` para frame e politica restritiva de permissoes.
