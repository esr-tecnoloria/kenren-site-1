import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function NewsEditPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverAlt, setCoverAlt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const create = useMutation({
    mutationFn: (data: unknown) => api.post('/kenren/news', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news'] });
      navigate('/news');
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({
      title,
      slug: slug || slugify(title),
      excerpt: excerpt || undefined,
      bodyHtml,
      coverUrl: coverUrl || undefined,
      coverAlt: coverAlt || undefined,
      youtubeId: youtubeId || undefined,
      status,
      categoryIds: [],
    });
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="page-header">
        <h1>Nova notícia</h1>
        <div className="actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/news')}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={create.isPending}>
            {create.isPending ? 'Salvando…' : 'Salvar'}
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
          <select value={status} onChange={e => setStatus(e.target.value as 'draft' | 'published')}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicar agora</option>
          </select>
        </label>
      </div>

      {create.error && <div className="error">{(create.error as Error).message}</div>}
    </form>
  );
}
