import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X
} from 'lucide-react';

import {
  createAdminProduct,
  deleteAdminProduct,
  duplicateAdminProduct,
  getAdminProducts,
  setAdminProductActive,
  updateAdminProduct,
  uploadAdminProductImage
} from '../services/admin-product-service';
import type {
  AdminCategoryOption,
  AdminProduct,
  AdminProductInput,
  AdminProductVariant
} from '../types/admin-product';
import { formatMoney } from '../utils/money';

type DraftProduct = AdminProductInput & { id?: string };

const emptyVariant: AdminProductVariant = {
  name: 'Padrao',
  sku: '',
  size: '',
  color: '',
  priceAdjustment: 0,
  stockQuantity: 0,
  active: true
};

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [draft, setDraft] = useState<DraftProduct>(() => makeEmptyDraft(''));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const formPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getAdminProducts({ query, categoryId });

        if (!active) {
          return;
        }

        setProducts(data.products);
        setCategories(data.categories);
        setDraft((current) =>
          current.categoryId ? current : makeEmptyDraft(data.categories[0]?.id ?? '')
        );
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar os produtos.'
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, [categoryId, query]);

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((product) => product.active).length,
      lowStock: products.filter((product) => product.stockQuantity <= 5).length
    }),
    [products]
  );

  function startCreate() {
    setMessage('Preencha o formulario para cadastrar um novo produto.');
    setError('');
    setDraft(makeEmptyDraft(categories[0]?.id ?? ''));
    window.setTimeout(() => {
      formPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  function startEdit(product: AdminProduct) {
    setMessage('');
    setError('');
    setDraft({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      sku: product.sku,
      price: product.price,
      promotionalPrice: product.promotionalPrice,
      active: product.active,
      featured: product.featured,
      homeDisplayOrder: product.homeDisplayOrder,
      trackStock: product.trackStock,
      images: product.images,
      variants: product.variants
    });
    window.setTimeout(() => {
      formPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  async function reload() {
    const data = await getAdminProducts({ query, categoryId });
    setProducts(data.products);
    setCategories(data.categories);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const input = cleanDraft(draft);

      if (draft.id) {
        await updateAdminProduct(draft.id, input);
        setMessage('Produto atualizado.');
      } else {
        const result = await createAdminProduct(input);
        setDraft(productToDraft(result.product));
        setMessage('Produto criado.');
      }

      await reload();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Nao foi possivel salvar o produto.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDuplicate(product: AdminProduct) {
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const result = await duplicateAdminProduct(product.id);
      await reload();
      setDraft(productToDraft(result.product));
      setMessage('Produto duplicado como rascunho.');
    } catch (duplicateError) {
      setError(
        duplicateError instanceof Error
          ? duplicateError.message
          : 'Nao foi possivel duplicar o produto.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(product: AdminProduct) {
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      await setAdminProductActive(product.id, !product.active);
      await reload();
      setMessage(product.active ? 'Produto desativado.' : 'Produto publicado.');
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : 'Nao foi possivel alterar o produto.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: AdminProduct) {
    const confirmed = window.confirm(
      `Excluir "${product.name}"? O produto sera removido do catalogo sem apagar pedidos antigos.`
    );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      await deleteAdminProduct(product.id);
      await reload();
      if (draft.id === product.id) {
        startCreate();
      }
      setMessage('Produto excluido logicamente.');
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Nao foi possivel excluir o produto.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-secondary">Produtos</h2>
          <p className="mt-2 text-sm text-text-light">
            Cadastre produtos, variacoes, estoque, imagens e publicacao do
            catalogo.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-secondary hover:bg-primary-hover"
          onClick={startCreate}
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
          Novo produto
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Produtos listados" value={stats.total} />
        <Metric label="Publicados" value={stats.active} />
        <Metric label="Estoque baixo" value={stats.lowStock} />
      </div>

      {(message || error) && (
        <div
          className={`rounded-md border px-4 py-3 text-sm font-semibold ${
            error
              ? 'border-danger/30 bg-danger/10 text-danger'
              : 'border-success/30 bg-success/10 text-success'
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-4">
          <div className="grid gap-3 rounded-md border border-border bg-surface p-4 md:grid-cols-[1fr_14rem]">
            <label className="relative block">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
                size={17}
              />
              <span className="sr-only">Buscar produto</span>
              <input
                className="w-full rounded-md border border-border py-2 pl-10 pr-3 text-sm outline-none focus:border-primary"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome ou SKU"
                value={query}
              />
            </label>
            <label>
              <span className="sr-only">Categoria</span>
              <select
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                onChange={(event) => setCategoryId(event.target.value)}
                value={categoryId}
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-surface">
            {isLoading ? (
              <p className="p-6 text-sm text-text-light">Carregando produtos...</p>
            ) : products.length === 0 ? (
              <p className="p-6 text-sm text-text-light">
                Nenhum produto encontrado.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-left text-sm">
                  <thead className="bg-background text-xs uppercase text-text-light">
                    <tr>
                      <th className="px-4 py-3">Produto</th>
                      <th className="px-4 py-3">Preco</th>
                      <th className="px-4 py-3">Estoque</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-3">
                          <button
                            className="text-left font-bold text-secondary hover:text-primary-hover"
                            onClick={() => startEdit(product)}
                            type="button"
                          >
                            {product.name}
                          </button>
                          <p className="mt-1 text-xs text-text-light">
                            {product.categoryName} | SKU {product.sku}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-secondary">
                            {formatMoney(product.promotionalPrice ?? product.price)}
                          </p>
                          {product.promotionalPrice && (
                            <p className="text-xs text-text-light line-through">
                              {formatMoney(product.price)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              product.stockQuantity <= 5
                                ? 'text-warning'
                                : 'text-secondary'
                            }`}
                          >
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-1 text-xs font-bold ${
                              product.active
                                ? 'bg-success/10 text-success'
                                : 'bg-background text-text-light'
                            }`}
                          >
                            {product.active ? 'Publicado' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <IconButton
                              label={product.active ? 'Desativar' : 'Publicar'}
                              onClick={() => void handleToggle(product)}
                            >
                              {product.active ? (
                                <EyeOff aria-hidden="true" size={16} />
                              ) : (
                                <Eye aria-hidden="true" size={16} />
                              )}
                            </IconButton>
                            <IconButton
                              label="Duplicar"
                              onClick={() => void handleDuplicate(product)}
                            >
                              <Copy aria-hidden="true" size={16} />
                            </IconButton>
                            <IconButton
                              label="Excluir"
                              onClick={() => void handleDelete(product)}
                            >
                              <Trash2 aria-hidden="true" size={16} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div ref={formPanelRef}>
          <ProductForm
            categories={categories}
            draft={draft}
            isSaving={isSaving}
            onChange={setDraft}
            onError={setError}
            onMessage={setMessage}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
}

function ProductForm({
  categories,
  draft,
  isSaving,
  onChange,
  onError,
  onMessage,
  onSubmit
}: {
  categories: AdminCategoryOption[];
  draft: DraftProduct;
  isSaving: boolean;
  onChange: (draft: DraftProduct) => void;
  onError: (message: string) => void;
  onMessage: (message: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  function updateField<K extends keyof DraftProduct>(
    key: K,
    value: DraftProduct[K]
  ) {
    onChange({ ...draft, [key]: value });
  }

  function updateVariant(index: number, variant: AdminProductVariant) {
    onChange({
      ...draft,
      variants: draft.variants.map((item, itemIndex) =>
        itemIndex === index ? variant : item
      )
    });
  }

  function removeVariant(index: number) {
    if (draft.variants.length === 1) {
      return;
    }

    onChange({
      ...draft,
      variants: draft.variants.filter((_, itemIndex) => itemIndex !== index)
    });
  }

  async function handleImageUpload(files?: FileList | null) {
    const selectedFiles = Array.from(files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    setIsUploadingImage(true);
    onError('');
    onMessage('');

    try {
      const remainingSlots = Math.max(8 - draft.images.length, 0);
      const filesToUpload = selectedFiles.slice(0, remainingSlots);
      const uploadedImages = await Promise.all(
        filesToUpload.map((file) => uploadAdminProductImage(file))
      );
      const nextImages = [
        ...draft.images,
        ...uploadedImages.map((result, index) => ({
          url: result.image.url,
          altText: draft.name,
          displayOrder: draft.images.length + index,
          isMain: draft.images.length === 0 && index === 0
        }))
      ].map((image, index) => ({
        ...image,
        displayOrder: index,
        isMain: image.isMain || index === 0
      }));

      updateField('images', ensureSingleMainImage(nextImages));
      onMessage('Imagens enviadas. Salve o produto para gravar a alteracao.');
    } catch (uploadError) {
      onError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Nao foi possivel enviar a imagem.'
      );
    } finally {
      setIsUploadingImage(false);
    }
  }

  function removeImage(index: number) {
    updateField(
      'images',
      ensureSingleMainImage(
        draft.images.filter((_, imageIndex) => imageIndex !== index)
      )
    );
  }

  function setMainImage(index: number) {
    updateField(
      'images',
      draft.images.map((image, imageIndex) => ({
        ...image,
        isMain: imageIndex === index
      }))
    );
  }

  return (
    <form
      className="space-y-5 rounded-md border border-border bg-surface p-4"
      onSubmit={onSubmit}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-secondary">
          {draft.id ? 'Editar produto' : 'Novo produto'}
        </h3>
        <button
          className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-bold text-white hover:bg-black"
          disabled={isSaving}
          type="submit"
        >
          <Save aria-hidden="true" size={16} />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <Field label="Nome">
        <input
          className="input"
          onChange={(event) => updateField('name', event.target.value)}
          required
          value={draft.name}
        />
      </Field>

      <Field label="Categoria">
        <select
          className="input"
          onChange={(event) => updateField('categoryId', event.target.value)}
          required
          value={draft.categoryId}
        >
          <option value="">Selecione</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="SKU">
          <input
            className="input"
            onChange={(event) => updateField('sku', event.target.value)}
            required
            value={draft.sku}
          />
        </Field>
        <Field label="Slug">
          <input
            className="input"
            onChange={(event) => updateField('slug', event.target.value)}
            placeholder="gerado automaticamente"
            value={draft.slug}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Preco">
          <MoneyInput
            onChange={(value) => updateField('price', value)}
            value={draft.price}
          />
        </Field>
        <Field label="Promocional">
          <MoneyInput
            onChange={(value) =>
              updateField('promotionalPrice', value > 0 ? value : null)
            }
            value={draft.promotionalPrice ?? 0}
          />
        </Field>
      </div>

      <Field label="Descricao curta">
        <textarea
          className="input min-h-20"
          onChange={(event) => updateField('shortDescription', event.target.value)}
          required
          value={draft.shortDescription}
        />
      </Field>

      <Field label="Descricao completa">
        <textarea
          className="input min-h-28"
          onChange={(event) => updateField('description', event.target.value)}
          value={draft.description}
        />
      </Field>

      <div className="grid gap-2 text-sm text-secondary">
        <Checkbox
          checked={draft.active}
          label="Produto publicado"
          onChange={(checked) => updateField('active', checked)}
        />
        <Checkbox
          checked={draft.featured}
          label="Exibir na pagina inicial"
          onChange={(checked) => updateField('featured', checked)}
        />
        <Checkbox
          checked={draft.trackStock}
          label="Controlar estoque"
          onChange={(checked) => updateField('trackStock', checked)}
        />
      </div>

      <Field label="Ordem na pagina inicial">
        <input
          className="input"
          min="0"
          onChange={(event) =>
            updateField('homeDisplayOrder', Number(event.target.value))
          }
          type="number"
          value={draft.homeDisplayOrder}
        />
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-secondary">Variacoes</h4>
          <button
            className="inline-flex items-center gap-1 text-sm font-bold text-primary-hover"
            onClick={() =>
              updateField('variants', [...draft.variants, { ...emptyVariant }])
            }
            type="button"
          >
            <Plus aria-hidden="true" size={16} />
            Adicionar
          </button>
        </div>
        {draft.variants.map((variant, index) => (
          <div className="rounded-md border border-border p-3" key={variant.id ?? index}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase text-text-light">
                Variacao {index + 1}
              </p>
              <button
                aria-label="Remover variacao"
                className="inline-grid size-8 place-items-center rounded-md border border-border text-text-light hover:text-danger"
                onClick={() => removeVariant(index)}
                type="button"
              >
                <X aria-hidden="true" size={15} />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className="input"
                onChange={(event) =>
                  updateVariant(index, { ...variant, name: event.target.value })
                }
                placeholder="Nome"
                required
                value={variant.name}
              />
              <input
                className="input"
                onChange={(event) =>
                  updateVariant(index, { ...variant, sku: event.target.value })
                }
                placeholder="SKU"
                required
                value={variant.sku}
              />
              <input
                className="input"
                onChange={(event) =>
                  updateVariant(index, { ...variant, size: event.target.value })
                }
                placeholder="Tamanho"
                value={variant.size ?? ''}
              />
              <input
                className="input"
                onChange={(event) =>
                  updateVariant(index, { ...variant, color: event.target.value })
                }
                placeholder="Cor"
                value={variant.color ?? ''}
              />
              <input
                className="input"
                min="0"
                onChange={(event) =>
                  updateVariant(index, {
                    ...variant,
                    stockQuantity: Number(event.target.value)
                  })
                }
                placeholder="Estoque"
                type="number"
                value={variant.stockQuantity}
              />
              <Checkbox
                checked={variant.active}
                label="Ativa"
                onChange={(checked) =>
                  updateVariant(index, { ...variant, active: checked })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        <Field label="Imagens do produto">
          <input
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-text-light file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-secondary"
            disabled={isUploadingImage}
            multiple
            onChange={(event) => void handleImageUpload(event.target.files)}
            type="file"
          />
        </Field>
        <Field label="Adicionar imagem por URL">
          <input
            className="input"
            onBlur={(event) => {
              const url = event.target.value.trim();

              if (!url) {
                return;
              }

              updateField(
                'images',
                ensureSingleMainImage([
                  ...draft.images,
                  {
                    url,
                    altText: draft.name,
                    displayOrder: draft.images.length,
                    isMain: draft.images.length === 0
                  }
                ])
              );
              event.target.value = '';
            }}
            placeholder="/assets/demo-produto.svg"
          />
        </Field>
        {draft.images.length > 0 && (
          <div className="grid gap-2">
            {draft.images.map((image, index) => (
              <div
                className="grid gap-3 rounded-md border border-border p-2 sm:grid-cols-[4.5rem_1fr_auto]"
                key={`${image.url}-${index}`}
              >
                <img
                  alt={image.altText || draft.name || 'Imagem do produto'}
                  className="aspect-square w-full rounded-md bg-background object-cover"
                  src={image.url}
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-text-light">
                    {image.url}
                  </p>
                  <button
                    className={`mt-2 rounded-md border px-3 py-1 text-xs font-bold ${
                      image.isMain
                        ? 'border-primary bg-primary/20 text-secondary'
                        : 'border-border text-text-light'
                    }`}
                    onClick={() => setMainImage(index)}
                    type="button"
                  >
                    {image.isMain ? 'Imagem principal' : 'Definir principal'}
                  </button>
                </div>
                <button
                  aria-label="Remover imagem"
                  className="inline-grid size-9 place-items-center rounded-md border border-border text-danger hover:bg-danger/10"
                  onClick={() => removeImage(index)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="flex items-center gap-2 text-xs font-semibold text-text-light">
          <Upload aria-hidden="true" size={14} />
          {isUploadingImage
            ? 'Enviando imagem...'
            : 'Aceita ate 8 imagens em JPG, PNG ou WebP de ate 4 MB cada.'}
        </p>
      </div>
    </form>
  );
}

function ensureSingleMainImage(images: DraftProduct['images']) {
  if (images.length === 0) {
    return [];
  }

  const mainIndex = images.findIndex((image) => image.isMain);

  return images.map((image, index) => ({
    ...image,
    displayOrder: index,
    isMain: mainIndex === -1 ? index === 0 : index === mainIndex
  }));
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-md border border-border bg-surface p-4">
      <p className="text-sm text-text-light">{label}</p>
      <p className="mt-2 text-2xl font-bold text-secondary">{value}</p>
    </article>
  );
}

function Field({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-secondary">
      {label}
      {children}
    </label>
  );
}

function Checkbox({
  checked,
  label,
  onChange
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-secondary">
      <input
        checked={checked}
        className="size-4 accent-primary"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      {label}
    </label>
  );
}

function IconButton({
  children,
  label,
  onClick
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="inline-grid size-9 place-items-center rounded-md border border-border text-text-light hover:border-primary hover:text-secondary"
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function MoneyInput({
  onChange,
  value
}: {
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <input
      className="input"
      min="0"
      onChange={(event) => {
        onChange(Math.round(Number(event.target.value) * 100));
      }}
      step="0.01"
      type="number"
      value={value / 100}
    />
  );
}

function makeEmptyDraft(categoryId: string): DraftProduct {
  return {
    categoryId,
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    sku: '',
    price: 0,
    promotionalPrice: null,
    active: true,
    featured: false,
    homeDisplayOrder: 0,
    trackStock: true,
    images: [],
    variants: [{ ...emptyVariant }]
  };
}

function productToDraft(product: AdminProduct): DraftProduct {
  return {
    id: product.id,
    categoryId: product.categoryId,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    sku: product.sku,
    price: product.price,
    promotionalPrice: product.promotionalPrice,
    active: product.active,
    featured: product.featured,
    homeDisplayOrder: product.homeDisplayOrder,
    trackStock: product.trackStock,
    images: product.images,
    variants: product.variants
  };
}

function cleanDraft(draft: DraftProduct): AdminProductInput {
  return {
    categoryId: draft.categoryId,
    name: draft.name,
    slug: draft.slug,
    shortDescription: draft.shortDescription,
    description: draft.description,
    sku: draft.sku,
    price: draft.price,
    promotionalPrice: draft.promotionalPrice,
    active: draft.active,
    featured: draft.featured,
    homeDisplayOrder: Number(draft.homeDisplayOrder),
    trackStock: draft.trackStock,
    images: draft.images.filter((image) => image.url.trim()),
    variants: draft.variants.map((variant) => ({
      ...variant,
      size: variant.size || '',
      color: variant.color || '',
      stockQuantity: Number(variant.stockQuantity)
    }))
  };
}
