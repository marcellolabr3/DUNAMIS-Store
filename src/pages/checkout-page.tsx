import { FormEvent, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { TurnstileField } from '../components/turnstile-field';
import { useCart } from '../hooks/use-cart';
import { createCheckoutOrder } from '../services/checkout-service';
import {
  type PublicStoreSettings,
  getPublicSettings
} from '../services/public-settings-service';
import { uploadPaymentReceipt } from '../services/receipt-service';
import type {
  CheckoutAddress,
  CheckoutCustomer,
  CreatedOrder,
  DeliveryMethod,
  CheckoutPaymentMethod,
  UploadedReceipt
} from '../types/checkout';
import { createIdempotencyKey } from '../utils/idempotency';
import { formatMoney } from '../utils/money';

type CheckoutStep = 1 | 2 | 3 | 4;

const initialCustomer: CheckoutCustomer = {
  fullName: '',
  whatsapp: '',
  email: '',
  notes: ''
};

const initialAddress: CheckoutAddress = {
  postalCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: ''
};

export function CheckoutPage() {
  const { lines, summary, items, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>('manual_pix');
  const [address, setAddress] = useState<CheckoutAddress>(initialAddress);
  const [idempotencyKey] = useState(() => createIdempotencyKey());
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder>();
  const [createdOrderItemCount, setCreatedOrderItemCount] = useState(0);
  const [pixCopied, setPixCopied] = useState(false);
  const [receipt, setReceipt] = useState<UploadedReceipt>();
  const [receiptFile, setReceiptFile] = useState<File>();
  const [receiptError, setReceiptError] = useState<string>();
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [settings, setSettings] = useState<PublicStoreSettings>();
  const allowPickup = settings?.allowPickup ?? true;
  const allowDelivery = settings?.allowDelivery ?? false;
  const customerValid =
    customer.fullName.trim().length >= 3 && customer.whatsapp.trim().length >= 8;
  const receivingValid =
    (deliveryMethod === 'pickup' && allowPickup) ||
    (deliveryMethod === 'delivery' &&
      allowDelivery &&
      Boolean(
        address.postalCode.trim() &&
          address.street.trim() &&
          address.number.trim() &&
          address.neighborhood.trim() &&
          address.city.trim() &&
          address.state.trim().length === 2
      ));
  const canReview = customerValid && receivingValid;
  const visibleSummary = createdOrder
    ? {
        itemCount: createdOrderItemCount,
        subtotal: createdOrder.total,
        deliveryAmount: 0,
        discountAmount: 0,
        total: createdOrder.total
      }
    : summary;

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const loadedSettings = await getPublicSettings();

        if (!active) {
          return;
        }

        setSettings(loadedSettings);

        if (!loadedSettings.allowPickup && loadedSettings.allowDelivery) {
          setDeliveryMethod('delivery');
        } else if (!loadedSettings.allowDelivery) {
          setDeliveryMethod('pickup');
        }
      } catch {
        if (active) {
          setSettings(undefined);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  if (lines.length === 0 && !createdOrder) {
    return (
      <section className="mx-auto grid min-h-[50vh] max-w-4xl content-center gap-4 px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-secondary">
          Carrinho vazio
        </h1>
        <p className="text-text-light">
          Adicione produtos antes de iniciar o checkout.
        </p>
        <Link
          className="mx-auto rounded-md bg-secondary px-5 py-3 text-sm font-bold text-white"
          to="/catalogo"
        >
          Ver catalogo
        </Link>
      </section>
    );
  }

  async function handleCreateOrder() {
    setError(undefined);
    setIsSubmitting(true);

    try {
      const order = await createCheckoutOrder({
        customer,
        deliveryMethod,
        paymentMethod,
        address: deliveryMethod === 'delivery' ? address : undefined,
        items,
        idempotencyKey,
        turnstileToken
      });

      setCreatedOrder(order);
      setCreatedOrderItemCount(summary.itemCount);
      clearCart();
      setStep(4);
    } catch {
      setError('Nao foi possivel criar o pedido agora. Verifique os dados.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyPixPayload(payload?: string) {
    if (!payload) {
      return;
    }

    await navigator.clipboard.writeText(payload);
    setPixCopied(true);
  }

  async function handleReceiptUpload() {
    if (!createdOrder || !receiptFile) {
      setReceiptError('Selecione um comprovante.');
      return;
    }

    setReceiptError(undefined);
    setIsUploadingReceipt(true);

    try {
      const uploadedReceipt = await uploadPaymentReceipt({
        publicToken: createdOrder.publicToken,
        file: receiptFile
      });
      setReceipt(uploadedReceipt);
    } catch {
      setReceiptError('Nao foi possivel enviar o comprovante.');
    } finally {
      setIsUploadingReceipt(false);
    }
  }

  function submitCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (customerValid) {
      setStep(2);
    }
  }

  function submitReceiving(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (receivingValid) {
      setStep(3);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-primary-hover">Checkout</p>
        <h1 className="mt-2 text-3xl font-black text-secondary">
          Finalizar compra
        </h1>
      </div>

      <StepIndicator currentStep={step} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="rounded-md border border-border bg-surface p-5 shadow-sm">
          {step === 1 && (
            <form className="grid gap-4" onSubmit={submitCustomer}>
              <h2 className="text-xl font-black text-secondary">
                Dados do cliente
              </h2>
              <TextInput
                label="Nome completo"
                onChange={(value) => setCustomer({ ...customer, fullName: value })}
                required
                value={customer.fullName}
              />
              <TextInput
                label="WhatsApp"
                onChange={(value) => setCustomer({ ...customer, whatsapp: value })}
                required
                value={customer.whatsapp}
              />
              <TextInput
                label="E-mail opcional"
                onChange={(value) => setCustomer({ ...customer, email: value })}
                type="email"
                value={customer.email ?? ''}
              />
              <label className="grid gap-2 text-sm font-bold text-secondary">
                Observacoes opcionais
                <textarea
                  className="min-h-24 rounded-md border border-border bg-surface px-3 py-2 text-sm font-normal outline-none focus:border-primary"
                  onChange={(event) =>
                    setCustomer({ ...customer, notes: event.target.value })
                  }
                  value={customer.notes ?? ''}
                />
              </label>
              <button
                className="h-12 rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover disabled:opacity-60"
                disabled={!customerValid}
                type="submit"
              >
                Continuar
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="grid gap-4" onSubmit={submitReceiving}>
              <h2 className="text-xl font-black text-secondary">
                Forma de recebimento
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {allowPickup && (
                  <button
                    className={`rounded-md border p-4 text-left ${
                      deliveryMethod === 'pickup'
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border'
                    }`}
                    onClick={() => setDeliveryMethod('pickup')}
                    type="button"
                  >
                    <p className="font-black text-secondary">Retirada na igreja</p>
                    <p className="mt-1 text-sm text-text-light">
                      {settings?.pickupInstructions ||
                        'Retirada conforme instrucoes do pedido.'}
                    </p>
                  </button>
                )}
                {allowDelivery && (
                  <button
                    className={`rounded-md border p-4 text-left ${
                      deliveryMethod === 'delivery'
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border'
                    }`}
                    onClick={() => setDeliveryMethod('delivery')}
                    type="button"
                  >
                    <p className="font-black text-secondary">Entrega</p>
                    <p className="mt-1 text-sm text-text-light">
                      {settings?.deliveryInstructions ||
                        'Endereco necessario para envio futuro.'}
                    </p>
                  </button>
                )}
              </div>

              {!allowPickup && !allowDelivery && (
                <p className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm font-semibold text-warning">
                  A loja nao possui forma de recebimento ativa no momento.
                </p>
              )}

              {deliveryMethod === 'delivery' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="CEP" onChange={(value) => setAddress({ ...address, postalCode: value })} required value={address.postalCode} />
                  <TextInput label="Rua" onChange={(value) => setAddress({ ...address, street: value })} required value={address.street} />
                  <TextInput label="Numero" onChange={(value) => setAddress({ ...address, number: value })} required value={address.number} />
                  <TextInput label="Complemento" onChange={(value) => setAddress({ ...address, complement: value })} value={address.complement ?? ''} />
                  <TextInput label="Bairro" onChange={(value) => setAddress({ ...address, neighborhood: value })} required value={address.neighborhood} />
                  <TextInput label="Cidade" onChange={(value) => setAddress({ ...address, city: value })} required value={address.city} />
                  <TextInput label="Estado" maxLength={2} onChange={(value) => setAddress({ ...address, state: value.toUpperCase() })} required value={address.state} />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  className="h-12 rounded-md border border-border px-5 text-sm font-bold text-secondary"
                  onClick={() => setStep(1)}
                  type="button"
                >
                  Voltar
                </button>
                <button
                  className="h-12 rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover disabled:opacity-60"
                  disabled={!receivingValid}
                  type="submit"
                >
                  Revisar pedido
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="grid gap-5">
              <h2 className="text-xl font-black text-secondary">Revisao</h2>
              <ReviewBlock title="Cliente">
                <p>{customer.fullName}</p>
                <p>{customer.whatsapp}</p>
                {customer.email && <p>{customer.email}</p>}
              </ReviewBlock>
              <ReviewBlock title="Recebimento">
                <p>
                  {deliveryMethod === 'pickup' ? 'Retirada na igreja' : 'Entrega'}
                </p>
                {deliveryMethod === 'delivery' && (
                  <p>
                    {address.street}, {address.number} - {address.neighborhood},{' '}
                    {address.city}/{address.state}
                  </p>
                )}
              </ReviewBlock>
              <ReviewBlock title="Produtos">
                <div className="grid gap-2">
                  {lines.map((line) => (
                    <div className="flex justify-between gap-4" key={line.id}>
                      <span>
                        {line.item.quantity}x {line.product.name} -{' '}
                        {line.variant.name}
                      </span>
                      <strong>{formatMoney(line.total)}</strong>
                    </div>
                  ))}
                </div>
              </ReviewBlock>
              <ReviewBlock title="Pagamento">
                <div className="grid gap-3 sm:grid-cols-2">
                  <PaymentMethodButton
                    active={paymentMethod === 'manual_pix'}
                    description="Gera QR Code e Pix Copia e Cola. O comprovante deve ser enviado em seguida."
                    label="Pix"
                    onClick={() => setPaymentMethod('manual_pix')}
                  />
                  <PaymentMethodButton
                    active={paymentMethod === 'manual_card'}
                    description="Use quando o pagamento por cartao for combinado com a igreja e envie o comprovante."
                    label="Cartao"
                    onClick={() => setPaymentMethod('manual_card')}
                  />
                </div>
              </ReviewBlock>
              <TurnstileField onVerify={setTurnstileToken} />
              {error && <p className="text-sm font-semibold text-danger">{error}</p>}
              <div className="flex gap-3">
                <button
                  className="h-12 rounded-md border border-border px-5 text-sm font-bold text-secondary"
                  onClick={() => setStep(2)}
                  type="button"
                >
                  Voltar
                </button>
                <button
                  className="h-12 rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover disabled:opacity-60"
                  disabled={!canReview || isSubmitting}
                  onClick={handleCreateOrder}
                  type="button"
                >
                  {isSubmitting ? 'Criando pedido...' : 'Criar pedido'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdOrder && (
            <div className="grid gap-4">
              <p className="w-fit rounded bg-primary px-3 py-1 text-xs font-bold uppercase text-secondary">
                Pagamento
              </p>
              <h2 className="text-2xl font-black text-secondary">
                Pedido criado
              </h2>
              <div className="grid gap-3 rounded-md border border-primary/40 bg-primary/10 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase text-text-light">
                    Numero do pedido
                  </p>
                  <p className="mt-1 break-all text-xl font-black text-secondary">
                    {createdOrder.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-text-light">
                    Codigo de consulta
                  </p>
                  <p className="mt-1 break-all text-xl font-black text-secondary">
                    {createdOrder.lookupCode}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-text-light">
                Guarde esses dados. Eles tambem estao no botao de acompanhamento
                abaixo, mas o numero e o codigo permitem consultar o pedido
                manualmente depois.
              </p>
              <p className="text-text-light">
                Total: <strong>{formatMoney(createdOrder.total)}</strong>
              </p>
              <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
                {createdOrder.payment.method === 'pix' ? (
                  <div className="rounded-md border border-border bg-background p-4">
                    <img
                      alt={`QR Code Pix do pedido ${createdOrder.orderNumber}`}
                      className="mx-auto aspect-square w-full max-w-72 rounded bg-white"
                      src={createdOrder.payment.qrCodeDataUrl ?? ''}
                    />
                  </div>
                ) : (
                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="text-sm font-bold uppercase text-primary-hover">
                      Cartao
                    </p>
                    <p className="mt-3 text-sm leading-6 text-text-light">
                      Pagamento por cartao selecionado. A loja ainda usa
                      conferencia manual, entao envie o comprovante do pagamento
                      feito pelo celular ou computador.
                    </p>
                  </div>
                )}
                <div className="grid content-start gap-4">
                  {createdOrder.payment.method === 'pix' && (
                    <>
                      <div>
                        <h3 className="font-black text-secondary">
                          Pix Copia e Cola
                        </h3>
                        <textarea
                          className="mt-2 min-h-32 w-full rounded-md border border-border bg-background p-3 text-xs text-text-light outline-none"
                          readOnly
                          value={createdOrder.payment.pixPayload ?? ''}
                        />
                      </div>
                      <button
                        className="h-12 rounded-md bg-primary px-5 text-sm font-black text-secondary hover:bg-primary-hover"
                        onClick={() =>
                          copyPixPayload(createdOrder.payment.pixPayload)
                        }
                        type="button"
                      >
                        {pixCopied ? 'Codigo copiado' : 'Copiar codigo Pix'}
                      </button>
                    </>
                  )}
                  <p className="rounded-md border border-border bg-background p-4 text-sm leading-6 text-text-light">
                    {createdOrder.payment.method === 'pix' &&
                    createdOrder.payment.expiresAt ? (
                      <>
                        Pague ate{' '}
                        <strong>
                          {formatPaymentExpiration(
                            createdOrder.payment.expiresAt
                          )}
                        </strong>
                        . Depois envie o comprovante.
                      </>
                    ) : (
                      <>
                        Envie o comprovante do pagamento por cartao para que o
                        pedido entre em analise.
                      </>
                    )}{' '}
                    O pedido permanece aguardando conferencia manual.
                  </p>
                  <div className="grid gap-3 rounded-md border border-border bg-surface p-4">
                    <h3 className="font-black text-secondary">
                      Enviar comprovante
                    </h3>
                    <input
                      aria-label="Arquivo do comprovante"
                      accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                      className="block w-full text-sm text-text-light file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-secondary"
                      onChange={(event) =>
                        setReceiptFile(event.target.files?.[0] ?? undefined)
                      }
                      type="file"
                    />
                    <button
                      className="h-11 rounded-md bg-secondary px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={!receiptFile || isUploadingReceipt || Boolean(receipt)}
                      onClick={handleReceiptUpload}
                      type="button"
                    >
                      {isUploadingReceipt ? 'Enviando...' : 'Enviar comprovante'}
                    </button>
                    {receiptError && (
                      <p className="text-sm font-semibold text-danger">
                        {receiptError}
                      </p>
                    )}
                    {receipt && (
                      <p className="rounded-md bg-success/10 p-3 text-sm font-semibold text-success">
                        Comprovante enviado em{' '}
                        {formatPaymentExpiration(receipt.uploadedAt)}. O pedido
                        aguardara conferencia manual.
                      </p>
                    )}
                  </div>
                  <Link
                    className="w-fit rounded-md bg-secondary px-5 py-3 text-sm font-bold text-white"
                    to={`/pedido?token=${createdOrder.publicToken}`}
                  >
                    Acompanhar pedido
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-md border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-xl font-black text-secondary">Resumo</h2>
          <dl className="mt-5 grid gap-3 text-sm">
            <SummaryRow label="Itens" value={String(visibleSummary.itemCount)} />
            <SummaryRow label="Subtotal" value={formatMoney(visibleSummary.subtotal)} />
            <SummaryRow
              label="Entrega"
              value={formatMoney(visibleSummary.deliveryAmount)}
            />
            <SummaryRow
              label="Desconto"
              value={formatMoney(visibleSummary.discountAmount)}
            />
            <div className="mt-2 flex items-center justify-between border-t border-border pt-4 text-base font-black text-secondary">
              <dt>Total</dt>
              <dd>{formatMoney(visibleSummary.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

function formatPaymentExpiration(expiresAt: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(expiresAt));
}

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  maxLength?: number;
}

function TextInput({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  maxLength
}: TextInputProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-secondary">
      {label}
      <input
        className="h-11 rounded-md border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-primary"
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

interface StepIndicatorProps {
  currentStep: CheckoutStep;
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Cliente' },
    { number: 2, label: 'Recebimento' },
    { number: 3, label: 'Revisao' },
    { number: 4, label: 'Pagamento' }
  ];

  return (
    <ol className="grid gap-2 sm:grid-cols-4">
      {steps.map((step) => (
        <li
          className={`rounded-md border px-3 py-2 text-sm font-bold ${
            currentStep >= step.number
              ? 'border-primary bg-primary/20 text-secondary'
              : 'border-border bg-surface text-text-light'
          }`}
          key={step.number}
        >
          {step.number}. {step.label}
        </li>
      ))}
    </ol>
  );
}

interface ReviewBlockProps {
  title: string;
  children: ReactNode;
}

function ReviewBlock({ title, children }: ReviewBlockProps) {
  return (
    <section className="rounded-md border border-border bg-background p-4">
      <h3 className="font-black text-secondary">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-text-light">{children}</div>
    </section>
  );
}

function PaymentMethodButton({
  active,
  description,
  label,
  onClick
}: {
  active: boolean;
  description: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-md border p-4 text-left ${
        active ? 'border-primary ring-2 ring-primary/30' : 'border-border'
      }`}
      onClick={onClick}
      type="button"
    >
      <p className="font-black text-secondary">{label}</p>
      <p className="mt-1 text-sm text-text-light">{description}</p>
    </button>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between text-text-light">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
