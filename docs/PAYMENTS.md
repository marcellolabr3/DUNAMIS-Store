# Pagamentos

A primeira forma de pagamento da DUNAMIS STORE e Pix manual.

## Pix Manual

O checkout cria o pedido no D1 antes de exibir o pagamento. Depois disso a
camada de pagamentos gera:

- payload Pix Copia e Cola;
- QR Code em Data URL;
- referencia baseada no numero publico do pedido;
- expiracao conforme `orderExpirationMinutes`;
- registro `payments.provider = manual_pix`.

O envio de comprovante e a confirmacao manual do pagamento ficam para as etapas
seguintes. O sistema nao marca o pedido como pago automaticamente.

## Comprovante

O cliente pode enviar comprovante apos a geracao do Pix. O endpoint aceita
somente JPG, JPEG, PNG e PDF, com limite de 5 MB. O arquivo e salvo no R2 privado
com nome aleatorio, sem usar o nome original como caminho.

Ao receber o arquivo, o pedido muda para `RECEIPT_SUBMITTED` e o pagamento fica
com status `RECEIPT_SUBMITTED`. A confirmacao `PAID` continua dependendo de
acao manual no painel administrativo.

## Camada de Pagamentos

Os providers ficam em `functions/services/payments`.

- `payment-provider.ts`: interface comum.
- `manual-pix-provider.ts`: provider atual.
- `payment-service.ts`: fachada para uso por pedidos.

Essa separacao permite adicionar Stone, Asaas, Efi, Mercado Pago, PagBank ou
outro gateway futuramente sem misturar regras de pedido com regras de pagamento.
