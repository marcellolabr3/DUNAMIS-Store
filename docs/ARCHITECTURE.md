# Arquitetura

## Fluxo do Cliente

Catalogo -> Produto -> Carrinho -> Checkout -> Pix -> Comprovante ->
Acompanhamento.

## Consulta de Pedido

Pedidos podem ser acompanhados publicamente por numero + codigo de consulta ou
por token seguro no link. A resposta publica mostra apenas dados necessarios:
status, itens, totais, recebimento e historico resumido, sem observacoes internas
ou dados administrativos.
