# Seguranca

Nao versione arquivos `.env`, secrets, comprovantes, dados reais ou chaves de
producao. Vulnerabilidades devem ser tratadas antes de deploy em producao.

Comprovantes enviados por clientes devem ficar em bucket R2 privado. O sistema
valida extensao, MIME type e tamanho antes do armazenamento.
