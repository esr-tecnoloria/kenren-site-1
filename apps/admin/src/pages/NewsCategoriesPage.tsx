import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

type Category = { id: string; slug: string; name: string; newsCount: number };

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function NewsCategoriesPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'news-categories'],
    queryFn: () => api.get<{ items: Category[] }>('/admin/news-categories'),
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);

  const create = useMutation({
    mutationFn: (body: { name: string; slug: string }) =>
      api.post('/admin/news-categories', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'news-categories'] });
      setName(''); setSlug('');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name: string; slug: string } }) =>
      api.put(`/admin/news-categories/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'news-categories'] });
      setEditing(null);
    },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.del(`/admin/news-categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'news-categories'] }),
  });

  function onSubmitNew(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({ name, slug: slug || slugify(name) });
  }

  function onSaveEdit() {
    if (!editing) return;
    update.mutate({ id: editing.id, body: { name: editing.name, slug: editing.slug } });
  }

  function onDelete(c: Category) {
    if (c.newsCount > 0) {
      alert(`"${c.name}" tem ${c.newsCount} notícia(s) vinculada(s). Remova ou troque a categoria antes.`);
      return;
    }
    if (!confirm(`Apagar a categoria "${c.name}"?`)) return;
    del.mutate(c.id);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Categorias de Notícias</h1>
      </div>

      <form className="form inline-form" onSubmit={onSubmitNew}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome da categoria" required />
        <input value={slug} onChange={e => setSlug(e.target.value)} placeholder={slugify(name) || 'slug'} />
        <button type="submit" className="btn-primary" disabled={create.isPending}>
          {create.isPending ? 'Criando…' : 'Criar'}
        </button>
      </form>
      {create.error && <div className="error">{(create.error as Error).message}</div>}

      {isLoading && <p>Carregando…</p>}
      {error && <div className="error">{(error as Error).message}</div>}

      {data?.items && data.items.length === 0 && (
        <div className="empty">Nenhuma categoria ainda. Crie a primeira acima.</div>
      )}

      {data?.items && data.items.length > 0 && (
        <table className="table" style={{ marginTop: '1.5rem' }}>
          <thead>
            <tr><th>Nome</th><th>Slug</th><th>Notícias</th><th></th></tr>
          </thead>
          <tbody>
            {data.items.map(c => editing?.id === c.id ? (
              <tr key={c.id}>
                <td><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></td>
                <td><input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></td>
                <td className="muted">{c.newsCount}</td>
                <td>
                  <button type="button" className="btn-primary" onClick={onSaveEdit} disabled={update.isPending}>Salvar</button>
                  {' '}
                  <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td className="muted">{c.slug}</td>
                <td>{c.newsCount}</td>
                <td>
                  <button type="button" className="link-btn" onClick={() => setEditing(c)}>Editar</button>
                  {' · '}
                  <button type="button" className="link-btn" style={{ color: 'var(--danger)' }} onClick={() => onDelete(c)}>Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
