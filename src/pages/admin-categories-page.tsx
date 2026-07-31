import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import {
  type AdminCategory,
  getAdminCategories,
  setAdminCategoryActive
} from '../services/admin-category-service';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getAdminCategories();

        if (active) {
          setCategories(data.categories);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Nao foi possivel carregar as categorias.'
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  async function handleToggle(category: AdminCategory) {
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const result = await setAdminCategoryActive(category.id, !category.active);
      setCategories((current) =>
        current.map((item) =>
          item.id === category.id ? result.category : item
        )
      );
      setMessage(
        category.active
          ? 'Categoria removida da loja publica.'
          : 'Categoria liberada na loja publica.'
      );
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : 'Nao foi possivel alterar a categoria.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary">Categorias</h2>
        <p className="mt-2 text-sm text-text-light">
          Ative somente as categorias que devem aparecer na pagina publica.
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

      <div className="overflow-hidden rounded-md border border-border bg-surface">
        {isLoading ? (
          <p className="p-6 text-sm text-text-light">Carregando categorias...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-text-light">
            Nenhuma categoria cadastrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-background text-xs uppercase text-text-light">
                <tr>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Ordem</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-4 py-3">
                      <p className="font-bold text-secondary">{category.name}</p>
                      <p className="mt-1 text-xs text-text-light">
                        {category.description || 'Sem descricao.'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-text-light">{category.slug}</td>
                    <td className="px-4 py-3 text-text-light">
                      {category.displayOrder}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-bold ${
                          category.active
                            ? 'bg-success/10 text-success'
                            : 'bg-background text-text-light'
                        }`}
                      >
                        {category.active ? 'Visivel' : 'Oculta'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-bold text-secondary hover:border-primary"
                        disabled={isSaving}
                        onClick={() => void handleToggle(category)}
                        type="button"
                      >
                        {category.active ? (
                          <EyeOff aria-hidden="true" size={16} />
                        ) : (
                          <Eye aria-hidden="true" size={16} />
                        )}
                        {category.active ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
