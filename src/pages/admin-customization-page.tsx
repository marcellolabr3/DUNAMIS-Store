import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Image, Plus, Save, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import {
  createAdminBanner,
  deleteAdminBanner,
  getAdminBanners,
  getAdminSettings,
  uploadAdminBannerImage,
  uploadAdminStoreAsset,
  updateAdminBanner,
  updateAdminSettings
} from '../services/admin-customization-service';
import type { AdminBanner, StoreSettings } from '../types/store-settings';

const emptyBanner: Omit<AdminBanner, 'id'> = {
  title: '',
  description: '',
  imageUrl: '',
  buttonLabel: '',
  buttonLink: '',
  active: true,
  displayOrder: 0,
  layoutMode: 'split',
  aspectRatio: '16/7',
  imageFit: 'cover',
  backgroundColor: '#FFFFFF',
  textColor: '#171717'
};

export function AdminCustomizationPage() {
  const location = useLocation();
  const [settings, setSettings] = useState<StoreSettings>();
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [bannerDraft, setBannerDraft] = useState<AdminBanner | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState(false);
  const [uploadingStoreAsset, setUploadingStoreAsset] = useState<
    'logo' | 'favicon' | undefined
  >();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const showBanners = location.pathname.includes('/banners');
  const showSettings = !showBanners;

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [settingsData, bannersData] = await Promise.all([
          getAdminSettings(),
          getAdminBanners()
        ]);

        if (!active) {
          return;
        }

        setSettings(settingsData.settings);
        setBanners(bannersData.banners);
        setBannerDraft(bannersData.banners[0]);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar a personalizacao.'
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  async function reloadBanners() {
    const data = await getAdminBanners();
    setBanners(data.banners);
  }

  async function handleSettingsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings) {
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const data = await updateAdminSettings(settings);
      setSettings(data.settings);
      applyDocumentBranding(data.settings);
      setMessage('Configuracoes salvas.');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Nao foi possivel salvar as configuracoes.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleBannerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!bannerDraft) {
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const input = {
        title: bannerDraft.title,
        description: bannerDraft.description,
        imageUrl: bannerDraft.imageUrl,
        buttonLabel: bannerDraft.buttonLabel,
        buttonLink: bannerDraft.buttonLink,
        active: bannerDraft.active,
        displayOrder: bannerDraft.displayOrder,
        layoutMode: bannerDraft.layoutMode,
        aspectRatio: bannerDraft.aspectRatio,
        imageFit: bannerDraft.imageFit,
        backgroundColor: bannerDraft.backgroundColor,
        textColor: bannerDraft.textColor
      };
      const result = bannerDraft.id
        ? await updateAdminBanner(bannerDraft.id, input)
        : await createAdminBanner(input);

      await reloadBanners();
      setBannerDraft(result.banner);
      setMessage('Banner salvo.');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Nao foi possivel salvar o banner.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleBannerDelete() {
    if (!bannerDraft?.id) {
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      await deleteAdminBanner(bannerDraft.id);
      await reloadBanners();
      setBannerDraft(undefined);
      setMessage('Banner removido.');
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Nao foi possivel remover o banner.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleBannerImageUpload(file?: File) {
    if (!file || !bannerDraft) {
      return;
    }

    setIsUploadingBannerImage(true);
    setMessage('');
    setError('');

    try {
      const result = await uploadAdminBannerImage(file);
      setBannerDraft({
        ...bannerDraft,
        imageUrl: result.image.url
      });
      setMessage('Imagem enviada. Salve o banner para publicar a alteracao.');
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Nao foi possivel enviar a imagem.'
      );
    } finally {
      setIsUploadingBannerImage(false);
    }
  }

  async function handleStoreAssetUpload(
    kind: 'logo' | 'favicon',
    file?: File
  ) {
    if (!file || !settings) {
      return;
    }

    setUploadingStoreAsset(kind);
    setMessage('');
    setError('');

    try {
      const result = await uploadAdminStoreAsset(file, kind);
      setSettings({
        ...settings,
        [kind === 'logo' ? 'logoUrl' : 'faviconUrl']: result.asset.url
      });
      setMessage(
        `${kind === 'logo' ? 'Logo' : 'Favicon'} enviado. Salve as configuracoes para aplicar.`
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Nao foi possivel enviar o arquivo.'
      );
    } finally {
      setUploadingStoreAsset(undefined);
    }
  }

  if (isLoading || !settings) {
    return <p className="text-sm text-text-light">Carregando personalizacao...</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">
          {showBanners ? 'Banners' : 'Configuracoes'}
        </h2>
        <p className="mt-2 text-sm text-text-light">
          {showBanners
            ? 'Cadastre e ordene os banners exibidos na pagina inicial.'
            : 'Ajuste identidade, contatos, Pix e formas de recebimento.'}
        </p>
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

      <div
        className={
          showSettings
            ? 'grid gap-6 xl:grid-cols-[1fr_26rem]'
            : 'grid gap-6 xl:grid-cols-[18rem_1fr]'
        }
      >
        {showSettings && (
        <form
          className="space-y-5 rounded-md border border-border bg-surface p-4"
          onSubmit={handleSettingsSubmit}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-secondary">Configuracoes da loja</h3>
            <button
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-bold text-white hover:bg-black"
              disabled={isSaving}
              type="submit"
            >
              <Save aria-hidden="true" size={16} />
              Salvar
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Nome da loja">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, storeName: event.target.value })
                }
                value={settings.storeName}
              />
            </Field>
            <Field label="E-mail de contato">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, contactEmail: event.target.value })
                }
                type="email"
                value={settings.contactEmail}
              />
            </Field>
            <Field label="Telefone">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, contactPhone: event.target.value })
                }
                value={settings.contactPhone}
              />
            </Field>
            <Field label="WhatsApp">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, whatsappNumber: event.target.value })
                }
                value={settings.whatsappNumber}
              />
            </Field>
            <Field label="Logo URL">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, logoUrl: event.target.value })
                }
                value={settings.logoUrl}
              />
            </Field>
            <Field label="Favicon URL">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, faviconUrl: event.target.value })
                }
                value={settings.faviconUrl}
              />
            </Field>
            <Field label="Carregar logo do computador">
              <input
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="block w-full text-sm text-text-light file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-secondary"
                disabled={Boolean(uploadingStoreAsset)}
                onChange={(event) =>
                  void handleStoreAssetUpload('logo', event.target.files?.[0])
                }
                type="file"
              />
            </Field>
            <Field label="Carregar favicon do computador">
              <input
                accept=".png,.webp,.ico,image/png,image/webp,image/x-icon,image/vnd.microsoft.icon"
                className="block w-full text-sm text-text-light file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-secondary"
                disabled={Boolean(uploadingStoreAsset)}
                onChange={(event) =>
                  void handleStoreAssetUpload('favicon', event.target.files?.[0])
                }
                type="file"
              />
            </Field>
            <Field label="Cor principal">
              <input
                className="input h-11"
                onChange={(event) =>
                  setSettings({ ...settings, primaryColor: event.target.value })
                }
                type="color"
                value={settings.primaryColor}
              />
            </Field>
            <Field label="Cor secundaria">
              <input
                className="input h-11"
                onChange={(event) =>
                  setSettings({ ...settings, secondaryColor: event.target.value })
                }
                type="color"
                value={settings.secondaryColor}
              />
            </Field>
          </div>

          <Field label="Descricao">
            <textarea
              className="input min-h-20"
              onChange={(event) =>
                setSettings({ ...settings, storeDescription: event.target.value })
              }
              value={settings.storeDescription}
            />
            <span className="text-xs font-semibold text-text-light">
              Este texto aparece na pagina inicial, no catalogo e no rodape.
            </span>
          </Field>

          {uploadingStoreAsset && (
            <p className="text-sm font-semibold text-text-light">
              Enviando {uploadingStoreAsset === 'logo' ? 'logo' : 'favicon'}...
            </p>
          )}

          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Chave Pix">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, pixKey: event.target.value })
                }
                value={settings.pixKey}
              />
            </Field>
            <Field label="Recebedor Pix">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, pixReceiverName: event.target.value })
                }
                value={settings.pixReceiverName}
              />
            </Field>
            <Field label="Cidade Pix">
              <input
                className="input"
                onChange={(event) =>
                  setSettings({ ...settings, pixReceiverCity: event.target.value })
                }
                value={settings.pixReceiverCity}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Instrucao de retirada">
              <textarea
                className="input min-h-24"
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    pickupInstructions: event.target.value
                  })
                }
                value={settings.pickupInstructions}
              />
            </Field>
            <Field label="Instrucao de entrega">
              <textarea
                className="input min-h-24"
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    deliveryInstructions: event.target.value
                  })
                }
                value={settings.deliveryInstructions}
              />
            </Field>
          </div>

          <div className="grid gap-2 text-sm font-semibold text-secondary md:grid-cols-3">
            <Checkbox
              checked={settings.storeActive}
              label="Loja ativa"
              onChange={(checked) =>
                setSettings({ ...settings, storeActive: checked })
              }
            />
            <Checkbox
              checked={settings.allowPickup}
              label="Permitir retirada"
              onChange={(checked) =>
                setSettings({ ...settings, allowPickup: checked })
              }
            />
            <Checkbox
              checked={settings.allowDelivery}
              label="Permitir entrega"
              onChange={(checked) =>
                setSettings({ ...settings, allowDelivery: checked })
              }
            />
          </div>
        </form>
        )}

        {showSettings && (
        <aside className="space-y-4">
          <div className="rounded-md border border-border bg-surface p-4">
            <h3 className="font-bold text-secondary">Pre-visualizacao</h3>
            <div
              className="mt-4 rounded-md border border-border p-4"
              style={{
                borderColor: settings.primaryColor,
                color: settings.secondaryColor
              }}
            >
              <p className="text-xs font-bold uppercase">Loja</p>
              {settings.logoUrl && (
                <img
                  alt={`Logo ${settings.storeName}`}
                  className="mt-3 max-h-16 max-w-40 object-contain"
                  src={settings.logoUrl}
                />
              )}
              <p className="mt-1 text-2xl font-black">{settings.storeName}</p>
              <p className="mt-2 text-sm text-text-light">
                {settings.storeDescription}
              </p>
              {settings.faviconUrl && (
                <p className="mt-3 truncate text-xs font-semibold text-text-light">
                  Favicon: {settings.faviconUrl}
                </p>
              )}
            </div>
          </div>
        </aside>
        )}

        {showBanners && (
          <aside className="rounded-md border border-border bg-surface p-4">
            <h3 className="font-bold text-secondary">Banners cadastrados</h3>
            <div className="mt-4 grid gap-2">
              {banners.map((banner) => (
                <button
                  className={`rounded-md border px-3 py-2 text-left text-sm font-semibold ${
                    bannerDraft?.id === banner.id
                      ? 'border-primary bg-primary/20 text-secondary'
                      : 'border-border text-text-light'
                  }`}
                  key={banner.id}
                  onClick={() => setBannerDraft(banner)}
                  type="button"
                >
                  {banner.title}
                </button>
              ))}
            </div>
          </aside>
        )}

        {showBanners && (
          <form
            className="space-y-4 rounded-md border border-border bg-surface p-4"
            onSubmit={handleBannerSubmit}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-secondary">Banners</h3>
              <button
                className="inline-flex items-center gap-1 text-sm font-bold text-primary-hover"
                onClick={() => setBannerDraft({ id: '', ...emptyBanner })}
                type="button"
              >
                <Plus aria-hidden="true" size={16} />
                Novo
              </button>
            </div>
            {bannerDraft ? (
              <>
                <Field label="Titulo">
                  <input
                    className="input"
                    onChange={(event) =>
                      setBannerDraft({
                        ...bannerDraft,
                        title: event.target.value
                      })
                    }
                    value={bannerDraft.title}
                  />
                </Field>
                <Field label="Imagem URL">
                  <input
                    className="input"
                    onChange={(event) =>
                      setBannerDraft({
                        ...bannerDraft,
                        imageUrl: event.target.value
                      })
                    }
                    value={bannerDraft.imageUrl}
                  />
                </Field>
                <Field label="Carregar imagem do computador">
                  <input
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="block w-full text-sm text-text-light file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-secondary"
                    disabled={isUploadingBannerImage}
                    onChange={(event) =>
                      void handleBannerImageUpload(event.target.files?.[0])
                    }
                    type="file"
                  />
                </Field>
                {isUploadingBannerImage && (
                  <p className="text-sm font-semibold text-text-light">
                    Enviando imagem...
                  </p>
                )}
                {bannerDraft.imageUrl && (
                  <img
                    alt={bannerDraft.title || 'Pre-visualizacao do banner'}
                    className={`w-full rounded-md border border-border bg-background object-center ${
                      bannerDraft.aspectRatio === '21/9'
                        ? 'aspect-[21/9]'
                        : bannerDraft.aspectRatio === '4/3'
                          ? 'aspect-[4/3]'
                          : bannerDraft.aspectRatio === '1/1'
                            ? 'aspect-square'
                            : 'aspect-[16/7]'
                    } ${
                      bannerDraft.imageFit === 'contain'
                        ? 'object-contain'
                        : 'object-cover'
                    }`}
                    style={{ backgroundColor: bannerDraft.backgroundColor }}
                    src={bannerDraft.imageUrl}
                  />
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Modo do banner">
                    <select
                      className="input"
                      onChange={(event) =>
                        setBannerDraft({
                          ...bannerDraft,
                          layoutMode: event.target.value as 'split' | 'full'
                        })
                      }
                      value={bannerDraft.layoutMode}
                    >
                      <option value="split">Texto ao lado da imagem</option>
                      <option value="full">Imagem como fundo da tela</option>
                    </select>
                  </Field>
                  <Field label="Proporcao">
                    <select
                      className="input"
                      onChange={(event) =>
                        setBannerDraft({
                          ...bannerDraft,
                          aspectRatio: event.target.value as AdminBanner['aspectRatio']
                        })
                      }
                      value={bannerDraft.aspectRatio}
                    >
                      <option value="16/7">Largo</option>
                      <option value="21/9">Panoramico</option>
                      <option value="4/3">Padrao</option>
                      <option value="1/1">Quadrado</option>
                    </select>
                  </Field>
                  <Field label="Ajuste da imagem">
                    <select
                      className="input"
                      onChange={(event) =>
                        setBannerDraft({
                          ...bannerDraft,
                          imageFit: event.target.value as 'cover' | 'contain'
                        })
                      }
                      value={bannerDraft.imageFit}
                    >
                      <option value="cover">Preencher cortando</option>
                      <option value="contain">Mostrar inteira</option>
                    </select>
                  </Field>
                  <Field label="Cor de fundo">
                    <input
                      className="input h-11"
                      onChange={(event) =>
                        setBannerDraft({
                          ...bannerDraft,
                          backgroundColor: event.target.value
                        })
                      }
                      type="color"
                      value={bannerDraft.backgroundColor}
                    />
                  </Field>
                  <Field label="Cor do texto">
                    <input
                      className="input h-11"
                      onChange={(event) =>
                        setBannerDraft({
                          ...bannerDraft,
                          textColor: event.target.value
                        })
                      }
                      type="color"
                      value={bannerDraft.textColor}
                    />
                  </Field>
                </div>
                <Field label="Descricao">
                  <textarea
                    className="input min-h-20"
                    onChange={(event) =>
                      setBannerDraft({
                        ...bannerDraft,
                        description: event.target.value
                      })
                    }
                    value={bannerDraft.description}
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Botao">
                    <input
                      className="input"
                      onChange={(event) =>
                        setBannerDraft({
                          ...bannerDraft,
                          buttonLabel: event.target.value
                        })
                      }
                      value={bannerDraft.buttonLabel}
                    />
                  </Field>
                  <Field label="Link">
                    <input
                      className="input"
                      onChange={(event) =>
                        setBannerDraft({
                          ...bannerDraft,
                          buttonLink: event.target.value
                        })
                      }
                      value={bannerDraft.buttonLink}
                    />
                  </Field>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Checkbox
                    checked={bannerDraft.active}
                    label="Banner ativo"
                    onChange={(checked) =>
                      setBannerDraft({ ...bannerDraft, active: checked })
                    }
                  />
                  <div className="flex gap-2">
                    {bannerDraft.id && (
                      <button
                        className="inline-grid size-10 place-items-center rounded-md border border-border text-danger hover:border-danger"
                        onClick={() => void handleBannerDelete()}
                        title="Remover banner"
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={17} />
                      </button>
                    )}
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-bold text-secondary hover:bg-primary-hover"
                      disabled={isSaving}
                      type="submit"
                    >
                      <Image aria-hidden="true" size={16} />
                      Salvar banner
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-text-light">
                Nenhum banner selecionado.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function applyDocumentBranding(settings: StoreSettings) {
  document.title = settings.storeName || 'DUNAMIS STORE';

  if (!settings.faviconUrl) {
    return;
  }

  let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");

  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }

  favicon.href = settings.faviconUrl;
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
