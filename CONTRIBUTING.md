# Contribuindo

## Fluxo

1. Crie uma branch curta e descritiva.
2. Mantenha alteracoes pequenas e coerentes.
3. Execute validacoes locais.
4. Abra pull request para revisao.

## Validacao

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm audit
```

## Commits

Use Conventional Commits:

- `feat: add product catalog`
- `fix: correct stock validation`
- `test: add checkout integration tests`
- `docs: update deployment guide`
- `security: harden application security`

## Regras

- Nao versione `.env`, secrets, comprovantes ou dados reais.
- Nao adicione funcionalidades fora do escopo de vendedor unico.
- Preserve migrations existentes.
- Atualize README/docs quando mudar operacao, deploy ou seguranca.
