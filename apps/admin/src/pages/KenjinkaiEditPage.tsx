import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MediaUpload } from '../components/MediaUpload';

type Kenjinkai = {
  id: string;
  slug: string;
  name: string;
  kanji: string;
  region: string;
  regionColor: string;
  capital: string;
  nomeKenjinkai: string | null;
  descricao: string | null;
  resumo: string | null;
  pontoTuristico: string | null;
  pratoTipico: string | null;
  endereco: string | null;
  site: string | null;
  facebook: string | null;
  instagram: string | null;
  coverUrl: string | null;
  coverAlt: string | null;
};

export function KenjinkaiEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [nomeKenjinkai, setNomeKenjinkai] = useState('');
  const [resumo, setResumo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pontoTuristico, setPontoTuristico] = useState('');
  const [pratoTipico, setPratoTipico] = useState('');
  const [endereco, setEndereco] = useState('');
  const [site, setSite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverAlt, setCoverAlt] = useState('');

  const existing = useQuery({
    queryKey: ['admin', 'kenjinkais', id],
    queryFn: () => api.get<Kenjinkai>(`/admin/kenjinkais/${id}`),
    enabled: !!id,
  });

  useEffect(() => {
    if (existing.data) {
      const k = existing.data;
      setNomeKenjinkai(k.nomeKenjinkai ?? '');
      setResumo(k.resumo ?? '');
      setDescricao(k.descricao ?? '');
      setPontoTuristico(k.pontoTuristico ?? '');
      setPratoTipico(k.pratoTipico ?? '');
      setEndereco(k.endereco ?? '');
      setSite(k.site ?? '');
      setFacebook(k.facebook ?? '');
      setInstagram(k.instagram ?? '');
      setCoverUrl(k.coverUrl ?? '');
      setCoverAlt(k.coverAlt ?? '');
    }
  }, [existing.data]);

  const save = useMutation({
    mutationFn: (data: unknown) => api.put<Kenjinkai>(`/admin/kenjinkais/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'kenjinkais'] });
      navigate('/kenjinkais');
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate({
      nomeKenjinkai: nomeKenjinkai || null,
      resumo: resumo || null,
      descricao: descricao || null,
      pontoTuristico: pontoTuristico || null,
      pratoTipico: pratoTipico || null,
      endereco: endereco || null,
      site: site || null,
      facebook: facebook || null,
      instagram: instagram || null,
      coverUrl: coverUrl || null,
      coverAlt: coverAlt || null,
    });
  }

  if (existing.isLoading) return <div className="loading">Carregando…</div>;
  if (existing.error) return <div className="error">{(existing.error as Error).message}</div>;
  if (!existing.data) return null;

  const k = existing.data;

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="region-dot" style={{ background: k.regionColor, width: 14, height: 14 }} />
            {k.name} <span className="kanji-cell">{k.kanji}</span>
          </h1>
          <p className="muted" style={{ margin: '0.25rem 0 0' }}>
            {k.region} · Capital: {k.capital}
          </p>
        </div>
        <div className="actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/kenjinkais')}>Voltar</button>
          <button type="submit" className="btn-primary" disabled={save.isPending}>
            {save.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="form-row">
        <label>Nome do Kenjinkai
          <input value={nomeKenjinkai} onChange={e => setNomeKenjinkai(e.target.value)} placeholder="Ex: Associação Tokyo Kenjin do Brasil" />
        </label>
      </div>

      <div className="form-row">
        <label>Resumo (aparece na ficha lateral do mapa)
          <textarea value={resumo} onChange={e => setResumo(e.target.value)} rows={3} />
        </label>
      </div>

      <div className="form-row">
        <label>Descrição completa (aparece na página individual)
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={4} />
        </label>
      </div>

      <div className="form-row form-row-double">
        <label>Principal ponto turístico
          <input value={pontoTuristico} onChange={e => setPontoTuristico(e.target.value)} />
        </label>
        <label>Prato típico
          <input value={pratoTipico} onChange={e => setPratoTipico(e.target.value)} />
        </label>
      </div>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0' }}>Contato</h3>
      <div className="form-row">
        <label>Endereço<input value={endereco} onChange={e => setEndereco(e.target.value)} /></label>
      </div>
      <div className="form-row">
        <label>Site<input value={site} onChange={e => setSite(e.target.value)} placeholder="https://..." /></label>
      </div>
      <div className="form-row form-row-double">
        <label>Facebook<input value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/..." /></label>
        <label>Instagram<input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/..." /></label>
      </div>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0' }}>Imagem de capa</h3>
      <div className="form-row">
        <MediaUpload folder="kenjinkais" value={coverUrl} onChange={setCoverUrl} label="" />
      </div>
      {coverUrl && (
        <div className="form-row">
          <label>Texto alternativo<input value={coverAlt} onChange={e => setCoverAlt(e.target.value)} /></label>
        </div>
      )}

      {save.error && <div className="error">{(save.error as Error).message}</div>}
    </form>
  );
}
