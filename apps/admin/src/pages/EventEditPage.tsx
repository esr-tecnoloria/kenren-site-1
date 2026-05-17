import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MediaUpload } from '../components/MediaUpload';

import 'tinymce/tinymce';
import 'tinymce/models/dom/model';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.js';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/autolink';

type Status = 'draft' | 'published' | 'archived';
type EventModel = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  bodyHtml: string | null;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  allDay: boolean;
  coverUrl: string | null;
  coverAlt: string | null;
  linkUrl: string | null;
  featured: boolean;
  status: Status;
};

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Convert ISO datetime to value usable in <input type="datetime-local">
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromLocalInput = (local: string) =>
  local ? new Date(local).toISOString() : null;

export function EventEditPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [coverUrl, setCoverUrl] = useState('');
  const [coverAlt, setCoverAlt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<Status>('draft');

  const existing = useQuery({
    queryKey: ['admin', 'events', id],
    queryFn: () => api.get<EventModel>(`/admin/events/${id}`),
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing.data) {
      const e = existing.data;
      setTitle(e.title);
      setSlug(e.slug);
      setDescription(e.description ?? '');
      setBodyHtml(e.bodyHtml ?? '');
      setLocation(e.location ?? '');
      setStartsAt(toLocalInput(e.startsAt));
      setEndsAt(toLocalInput(e.endsAt));
      setAllDay(e.allDay);
      setCoverUrl(e.coverUrl ?? '');
      setCoverAlt(e.coverAlt ?? '');
      setLinkUrl(e.linkUrl ?? '');
      setFeatured(e.featured);
      setStatus(e.status);
    }
  }, [existing.data]);

  const save = useMutation({
    mutationFn: (data: unknown) =>
      isNew ? api.post('/admin/events', data) : api.put(`/admin/events/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'events'] });
      navigate('/events');
    },
  });

  const del = useMutation({
    mutationFn: () => api.del(`/admin/events/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'events'] });
      navigate('/events');
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate({
      title,
      slug: slug || slugify(title),
      description: description || null,
      bodyHtml: bodyHtml || null,
      location: location || null,
      startsAt: fromLocalInput(startsAt),
      endsAt: endsAt ? fromLocalInput(endsAt) : null,
      allDay,
      coverUrl: coverUrl || null,
      coverAlt: coverAlt || null,
      linkUrl: linkUrl || null,
      featured,
      status,
    });
  }

  function onDelete() {
    if (!confirm('Apagar este evento? Esta ação não pode ser desfeita.')) return;
    del.mutate();
  }

  if (!isNew && existing.isLoading) return <div className="loading">Carregando…</div>;
  if (!isNew && existing.error) return <div className="error">{(existing.error as Error).message}</div>;

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="page-header">
        <h1>{isNew ? 'Novo evento' : 'Editar evento'}</h1>
        <div className="actions">
          {!isNew && (
            <button type="button" className="btn-danger" onClick={onDelete} disabled={del.isPending}>
              {del.isPending ? 'Apagando…' : 'Apagar'}
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={() => navigate('/events')}>Cancelar</button>
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
        <label>Descrição curta<textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} maxLength={500} /></label>
      </div>

      <div className="form-row form-row-double">
        <label>Início<input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} required /></label>
        <label>Fim (opcional)<input type="datetime-local" value={endsAt} onChange={e => setEndsAt(e.target.value)} /></label>
      </div>
      <div className="form-row">
        <label className="checkbox-row">
          <input type="checkbox" checked={allDay} onChange={e => setAllDay(e.target.checked)} />
          Evento de dia inteiro
        </label>
      </div>

      <div className="form-row">
        <label>Local<input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: São Paulo Expo, Vila Água Funda - SP" /></label>
      </div>
      <div className="form-row">
        <label>Link externo (opcional)<input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." /></label>
      </div>

      <div className="form-row">
        <MediaUpload folder="events" value={coverUrl} onChange={setCoverUrl} label="Imagem de capa" />
      </div>
      {coverUrl && (
        <div className="form-row">
          <label>Texto alternativo<input value={coverAlt} onChange={e => setCoverAlt(e.target.value)} /></label>
        </div>
      )}

      <div className="form-row">
        <label>Conteúdo completo (opcional)</label>
        <Editor
          licenseKey="gpl"
          init={{
            height: 360,
            menubar: false,
            plugins: 'lists link code autolink',
            toolbar: 'undo redo | blocks | bold italic | bullist numlist | link | code',
            branding: false,
            promotion: false,
          }}
          value={bodyHtml}
          onEditorChange={(v) => setBodyHtml(v)}
        />
      </div>

      <div className="form-row form-row-double">
        <label className="checkbox-row">
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
          Marcar como destaque
        </label>
        <label>
          Status
          <select value={status} onChange={e => setStatus(e.target.value as Status)}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </label>
      </div>

      {save.error && <div className="error">{(save.error as Error).message}</div>}
      {del.error && <div className="error">{(del.error as Error).message}</div>}
    </form>
  );
}
