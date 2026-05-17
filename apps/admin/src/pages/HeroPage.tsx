import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MediaUpload } from '../components/MediaUpload';

type Settings = {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  showLogo: boolean;
};

type Slide = {
  id: string;
  imageUrl: string;
  alt: string | null;
  active: boolean;
  displayOrder: number;
};

type HeroResponse = { settings: Settings | null; slides: Slide[] };

export function HeroPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'hero'],
    queryFn: () => api.get<HeroResponse>('/admin/hero'),
  });

  const [settings, setSettings] = useState<Settings>({
    title: '', subtitle: '', description: '', ctaLabel: '', ctaHref: '', showLogo: true,
  });

  useEffect(() => {
    if (data?.settings) {
      setSettings({
        title: data.settings.title ?? '',
        subtitle: data.settings.subtitle ?? '',
        description: data.settings.description ?? '',
        ctaLabel: data.settings.ctaLabel ?? '',
        ctaHref: data.settings.ctaHref ?? '',
        showLogo: data.settings.showLogo,
      });
    }
  }, [data?.settings]);

  const saveSettings = useMutation({
    mutationFn: (body: Partial<Settings>) => api.put('/admin/hero/settings', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero'] }),
  });

  const addSlide = useMutation({
    mutationFn: (body: { imageUrl: string; alt: string }) =>
      api.post('/admin/hero/slides', { ...body, active: true, displayOrder: (data?.slides.length ?? 0) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero'] }),
  });

  const updateSlide = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Slide> }) =>
      api.put(`/admin/hero/slides/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero'] }),
  });

  const delSlide = useMutation({
    mutationFn: (id: string) => api.del(`/admin/hero/slides/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero'] }),
  });

  const reorder = useMutation({
    mutationFn: (ids: string[]) => api.put('/admin/hero/slides/reorder', { ids }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero'] }),
  });

  // Local form for new slide
  const [newImage, setNewImage] = useState('');
  const [newAlt, setNewAlt] = useState('');

  function move(slideId: string, dir: -1 | 1) {
    if (!data) return;
    const ids = [...data.slides].sort((a, b) => a.displayOrder - b.displayOrder).map(s => s.id);
    const i = ids.indexOf(slideId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    reorder.mutate(ids);
  }

  if (isLoading) return <div className="loading">Carregando…</div>;
  if (error) return <div className="error">{(error as Error).message}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Hero da Home</h1>
      </div>

      <h3 style={{ marginTop: '0', marginBottom: '0.5rem' }}>Texto e CTA</h3>
      <form
        className="form"
        onSubmit={(e) => { e.preventDefault(); saveSettings.mutate(settings); }}
      >
        <div className="form-row">
          <label>Subtítulo
            <input value={settings.subtitle ?? ''} onChange={e => setSettings({ ...settings, subtitle: e.target.value })} />
          </label>
        </div>
        <div className="form-row">
          <label>Descrição
            <textarea rows={4} value={settings.description ?? ''} onChange={e => setSettings({ ...settings, description: e.target.value })} />
          </label>
        </div>
        <div className="form-row form-row-double">
          <label>Texto do botão
            <input value={settings.ctaLabel ?? ''} onChange={e => setSettings({ ...settings, ctaLabel: e.target.value })} placeholder="Saiba Mais" />
          </label>
          <label>Link do botão
            <input value={settings.ctaHref ?? ''} onChange={e => setSettings({ ...settings, ctaHref: e.target.value })} placeholder="#federacao ou /agenda" />
          </label>
        </div>
        <div className="form-row">
          <label className="checkbox-row">
            <input type="checkbox" checked={settings.showLogo} onChange={e => setSettings({ ...settings, showLogo: e.target.checked })} />
            Mostrar logo grande no hero (recomendado)
          </label>
        </div>
        <div>
          <button type="submit" className="btn-primary" disabled={saveSettings.isPending}>
            {saveSettings.isPending ? 'Salvando…' : 'Salvar texto'}
          </button>
          {saveSettings.error && <span className="error" style={{ marginLeft: '1rem' }}>{(saveSettings.error as Error).message}</span>}
        </div>
      </form>

      <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Slides ({data?.slides.length ?? 0})</h3>
      <p className="muted" style={{ marginTop: 0 }}>Use as setas pra reordenar. Slides desativados não aparecem no site.</p>

      <div className="hero-slides-list">
        {data?.slides.sort((a, b) => a.displayOrder - b.displayOrder).map((s, idx, arr) => (
          <div key={s.id} className="hero-slide-row">
            <div className="hero-slide-thumb">
              <img src={s.imageUrl} alt={s.alt ?? ''} />
            </div>
            <div className="hero-slide-info">
              <input
                value={s.alt ?? ''}
                placeholder="Texto alternativo (acessibilidade)"
                onChange={e => updateSlide.mutate({ id: s.id, body: { alt: e.target.value } })}
              />
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={s.active}
                  onChange={e => updateSlide.mutate({ id: s.id, body: { active: e.target.checked } })}
                />
                Ativo
              </label>
            </div>
            <div className="hero-slide-actions">
              <button type="button" className="link-btn" disabled={idx === 0} onClick={() => move(s.id, -1)}>↑</button>
              <button type="button" className="link-btn" disabled={idx === arr.length - 1} onClick={() => move(s.id, 1)}>↓</button>
              <button
                type="button"
                className="link-btn"
                style={{ color: 'var(--danger)' }}
                onClick={() => { if (confirm('Remover este slide?')) delSlide.mutate(s.id); }}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <h4 style={{ marginTop: '1.5rem' }}>Adicionar novo slide</h4>
      <div className="hero-new-slide">
        <MediaUpload folder="hero" value={newImage} onChange={setNewImage} label="Imagem do slide" />
        {newImage && (
          <>
            <input
              value={newAlt}
              onChange={e => setNewAlt(e.target.value)}
              placeholder="Texto alternativo (ex: Monte Fuji ao entardecer)"
              style={{ marginTop: '0.5rem' }}
            />
            <button
              type="button"
              className="btn-primary"
              style={{ marginTop: '0.5rem' }}
              disabled={addSlide.isPending}
              onClick={() => {
                addSlide.mutate({ imageUrl: newImage, alt: newAlt });
                setNewImage(''); setNewAlt('');
              }}
            >
              {addSlide.isPending ? 'Adicionando…' : 'Adicionar slide'}
            </button>
          </>
        )}
        {addSlide.error && <div className="error">{(addSlide.error as Error).message}</div>}
      </div>
    </div>
  );
}
