import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MediaUpload } from '../components/MediaUpload';

// TinyMCE self-hosted imports
import 'tinymce/tinymce';
import 'tinymce/models/dom/model';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.js';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/media';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/wordcount';

type Status = 'draft' | 'published' | 'archived';
type Category = { id: string; slug: string; name: string };
type News = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyHtml: string;
  coverUrl: string | null;
  coverAlt: string | null;
  youtubeId: string | null;
  status: Status;
  categories?: Array<{ categoryId: string; category: Category }>;
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function NewsEditPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverAlt, setCoverAlt] = useState('');
  const [status, setStatus] = useState<Status>('draft');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const categories = useQuery({
    queryKey: ['admin', 'news-categories'],
    queryFn: () => api.get<{ items: Category[] }>('/admin/news-categories'),
  });

  const existing = useQuery({
    queryKey: ['admin', 'news', id],
    queryFn: () => api.get<News>(`/admin/news/${id}`),
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing.data) {
      const n = existing.data;
      setTitle(n.title);
      setSlug(n.slug);
      setExcerpt(n.excerpt ?? '');
      setBodyHtml(n.bodyHtml);
      setYoutubeId(n.youtubeId ?? '');
      setCoverUrl(n.coverUrl ?? '');
      setCoverAlt(n.coverAlt ?? '');
      setStatus(n.status);
      setCategoryIds((n.categories ?? []).map(c => c.categoryId));
    }
  }, [existing.data]);

  function toggleCategory(id: string) {
    setCategoryIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const save = useMutation({
    mutationFn: (data: unknown) =>
      isNew
        ? api.post<News>('/admin/news', data)
        : api.put<News>(`/admin/news/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'news'] });
      navigate('/news');
    },
  });

  const del = useMutation({
    mutationFn: () => api.del<void>(`/admin/news/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'news'] });
      navigate('/news');
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate({
      title,
      slug: slug || slugify(title),
      excerpt: excerpt || null,
      bodyHtml,
      coverUrl: coverUrl || null,
      coverAlt: coverAlt || null,
      youtubeId: youtubeId || null,
      status,
      categoryIds,
    });
  }

  function onDelete() {
    if (!confirm('Apagar esta notícia? Esta ação não pode ser desfeita.')) return;
    del.mutate();
  }

  if (!isNew && existing.isLoading) return <div className="loading">Carregando notícia…</div>;
  if (!isNew && existing.error) return <div className="error">Erro: {(existing.error as Error).message}</div>;

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="page-header">
        <h1>{isNew ? 'Nova notícia' : 'Editar notícia'}</h1>
        <div className="actions">
          {!isNew && (
            <button type="button" className="btn-danger" onClick={onDelete} disabled={del.isPending}>
              {del.isPending ? 'Apagando…' : 'Apagar'}
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={() => navigate('/news')}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={save.isPending}>
            {save.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="form-row">
        <label>Título<input value={title} onChange={e => setTitle(e.target.value)} required /></label>
      </div>
      <div className="form-row">
        <label>Slug (URL)<input value={slug} onChange={e => setSlug(e.target.value)} placeholder={slugify(title)} /></label>
      </div>
      <div className="form-row">
        <label>Resumo<textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} /></label>
      </div>
      <div className="form-row">
        <MediaUpload folder="news" value={coverUrl} onChange={setCoverUrl} label="Imagem de capa" />
      </div>
      {coverUrl && (
        <div className="form-row">
          <label>Texto alternativo (acessibilidade)
            <input value={coverAlt} onChange={e => setCoverAlt(e.target.value)} placeholder="Descreva a imagem" />
          </label>
        </div>
      )}
      <div className="form-row">
        <label>YouTube ID (opcional)<input value={youtubeId} onChange={e => setYoutubeId(e.target.value)} placeholder="ex: dQw4w9WgXcQ" /></label>
      </div>
      <div className="form-row">
        <label>Categorias</label>
        {categories.isLoading ? (
          <p className="muted">Carregando categorias…</p>
        ) : categories.data?.items.length === 0 ? (
          <p className="muted">Nenhuma categoria ainda. Crie em "Categorias" no menu.</p>
        ) : (
          <div className="category-picker">
            {categories.data?.items.map(c => (
              <label key={c.id} className={`category-chip${categoryIds.includes(c.id) ? ' active' : ''}`}>
                <input
                  type="checkbox"
                  checked={categoryIds.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="form-row">
        <label>Conteúdo</label>
        <Editor
          licenseKey="gpl"
          init={{
            height: 480,
            menubar: false,
            plugins: 'lists link image code table media autolink wordcount',
            toolbar:
              'undo redo | blocks | bold italic underline | bullist numlist | link image media table | code',
            branding: false,
            skin_url: undefined,
            content_css: undefined,
            promotion: false,
          }}
          value={bodyHtml}
          onEditorChange={(v) => setBodyHtml(v)}
        />
      </div>
      <div className="form-row">
        <label>
          Status
          <select value={status} onChange={e => setStatus(e.target.value as Status)}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicada</option>
            <option value="archived">Arquivada</option>
          </select>
        </label>
      </div>

      {save.error && <div className="error">{(save.error as Error).message}</div>}
      {del.error && <div className="error">{(del.error as Error).message}</div>}
    </form>
  );
}
