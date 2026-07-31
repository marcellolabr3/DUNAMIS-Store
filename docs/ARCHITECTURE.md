# Arquitetura

## Fluxo do Cliente

Catalogo -> Produto -> Carrinho -> Checkout -> Pix -> Comprovante ->
Acompanhamento.

## Consulta de Pedido

Pedidos podem ser acompanhados publicamente por numero + codigo de consulta ou
por token seguro no link. A resposta publica mostra apenas dados necessarios:
status, itens, totais, recebimento e historico resumido, sem observacoes internas
ou dados administrativos.

## Administracao

As rotas administrativas ficam abaixo de `/api/admin` e exigem sessao assinada
por cookie. A gestao de produtos usa service e repository proprios para manter
as regras de catalogo separadas da interface do painel.

A gestao de pedidos tambem fica isolada em service/repository. A confirmacao de
pagamento e sempre uma acao manual do administrador; comprovante enviado apenas
altera o pedido para conferencia.

Configuracoes da loja sao mantidas em `store_settings` e expostas publicamente
sem dados sensiveis de Pix. O painel administrativo consome a versao completa
por rota autenticada.
