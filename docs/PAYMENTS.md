# Pagamentos

A primeira forma de pagamento da DUNAMIS STORE e Pix manual.

## Fluxo Pix Manual

1. Cliente revisa o checkout.
2. API cria o pedido no D1.
3. Servidor recalcula precos e estoque.
4. `ManualPixProvider` gera payload Pix e QR Code.
5. Pagamento e salvo com `provider = manual_pix`.
6. Cliente envia comprovante.
7. Pedido fica `RECEIPT_SUBMITTED`.
8. Administrador confirma, coloca em analise ou rejeita manualmente.

O envio de comprovante nunca marca o pedido como `PAID` automaticamente.

## Camada de Pagamentos

Arquivos:

- `functions/services/payments/payment-provider.ts`
- `functions/services/payments/manual-pix-provider.ts`
- `functions/services/payments/payment-service.ts`
- `functions/services/payments/payment-types.ts`

Essa camada evita misturar regras de pedido com regras de provedor.

## Limites Atuais

- Sem webhook.
- Sem conciliacao bancaria automatica.
- Sem cartao de credito.
- Sem Pix dinamico com expiracao bancaria real.

## Futuras Integracoes

Para adicionar Stone, Asaas, Efi, Mercado Pago, PagBank ou outro gateway:

1. Crie um provider que implemente `PaymentProvider`.
2. Mantenha status e metadados no registro `payments`.
3. Adicione webhook autenticado em rota propria.
4. Registre alteracoes no historico do pedido.
5. Nunca confirme pagamento sem validacao do provedor.
