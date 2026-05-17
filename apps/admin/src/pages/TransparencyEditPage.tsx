import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

type Status = 'planned' | 'accounting' | 'executed' | 'archived';
type Doc = { id?: string; label: string; url: string | null; fileType: string | null };
type Project = {
  id: string;
  slug: string;
  year: number;
  title: string;
  ministry: string | null;
  sphere: 'Estadual' | 'Federal' | 'Municipal';
  value: string;
  status: Status;
  parliamentarian: string | null;
  amendment: string | null;
  agreement: string | null;
  notes: string | null;
  displayOrder: number;
  docs: Doc[];
};

type SignResponse = { uploadUrl: string; gcsPath: string; publicUrl: string };

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function uploadDoc(file: File): Promise<{ url: string; fileType: string }> {
  const sign = await api.post<SignResponse>('/media/sign-upload', {
    filename: file.name, contentType: file.type, folder: 'transparencia',
  });
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', sign.uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload falhou ${xhr.status}`));
    xhr.onerror = () => reject(new Error('Erro de rede'));
    xhr.send(file);
  });
  const ext = file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
  return { url: sign.publicUrl, fileType: ext };
}

export function TransparencyEditPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [ministry, setMinistry] = useState('');
  const [sphere, setSphere] = useState<'Estadual' | 'Federal' | 'Municipal'>('Estadual');
  const [value, setValue] = useState<string>('');
  const [status, setStatus] = useState<Status>('planned');
  const [parliamentarian, setParliamentarian] = useState('');
  const [amendment, setAmendment] = useState('');
  const [agreement, setAgreement] = useState('');
  const [notes, setNotes] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const existing = useQuery({
    queryKey: ['admin', 'transparency', id],
    queryFn: () => api.get<Project>(`/admin/transparency/${id}`),
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing.data) {
      const p = existing.data;
      setTitle(p.title);
      setSlug(p.slug);
      setYear(p.year);
      setMinistry(p.ministry ?? '');
      setSphere(p.sphere);
      setValue(String(p.value));
      setStatus(p.status);
      setParliamentarian(p.parliamentarian ?? '');
      setAmendment(p.amendment ?? '');
      setAgreement(p.agreement ?? '');
      setNotes(p.notes ?? '');
      setDocs(p.docs.map(d => ({ id: d.id, label: d.label, url: d.url, fileType: d.fileType })));
    }
  }, [existing.data]);

  const save = useMutation({
    mutationFn: (body: unknown) => isNew
      ? api.post('/admin/transparency', body)
      : api.put(`/admin/transparency/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'transparency'] });
      navigate('/transparency');
    },
  });

  const del = useMutation({
    mutationFn: () => api.del(`/admin/transparency/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'transparency'] });
      navigate('/transparency');
    },
  });

  function addDoc() {
    setDocs(d => [...d, { label: '', url: null, fileType: null }]);
  }
  function updateDoc(i: number, patch: Partial<Doc>) {
    setDocs(d => d.map((x, idx) => idx === i ? { ...x, ...patch } : x));
  }
  function removeDoc(i: number) {
    setDocs(d => d.filter((_, idx) => idx !== i));
  }
  async function uploadDocAt(i: number, file: File) {
    setUploadingIdx(i);
    try {
      const { url, fileType } = await uploadDoc(file);
      updateDoc(i, { url, fileType });
    } finally {
      setUploadingIdx(null);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    save.mutate({
      title,
      slug: slug || slugify(title),
      year,
      ministry: ministry || null,
      sphere,
      value: Number(value),
      status,
      parliamentarian: parliamentarian || null,
      amendment: amendment || null,
      agreement: agreement || null,
      notes: notes || null,
      docs: docs.filter(d => d.label).map(d => ({
        label: d.label,
        url: d.url || null,
        fileType: d.fileType || null,
      })),
    });
  }

  function onDelete() {
    if (!confirm('Apagar este projeto e todos os seus documentos?')) return;
    del.mutate();
  }

  if (!isNew && existing.isLoading) return <div className="loading">Carregando…</div>;
  if (!isNew && existing.error) return <div className="error">{(existing.error as Error).message}</div>;

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="page-header">
        <h1>{isNew ? 'Novo projeto' : 'Editar projeto'}</h1>
        <div className="actions">
          {!isNew && (
            <button type="button" className="btn-danger" onClick={onDelete} disabled={del.isPending}>
              {del.isPending ? 'Apagando…' : 'Apagar'}
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={() => navigate('/transparency')}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={save.isPending}>
            {save.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="form-row">
        <label>Título<input value={title} onChange={e => setTitle(e.target.value)} required /></label>
      </div>
      <div className="form-row">
        <label>Slug<input value={slug} onChange={e => setSlug(e.target.value)} placeholder={slugify(title)} /></label>
      </div>

      <div className="form-row form-row-double">
        <label>Ano<input type="number" value={year} onChange={e => setYear(Number(e.target.value))} required min={2000} max={2100} /></label>
        <label>Esfera
          <select value={sphere} onChange={e => setSphere(e.target.value as 'Estadual' | 'Federal' | 'Municipal')}>
            <option value="Estadual">Estadual</option>
            <option value="Federal">Federal</option>
            <option value="Municipal">Municipal</option>
          </select>
        </label>
      </div>

      <div className="form-row form-row-double">
        <label>Valor (R$)<input type="number" value={value} onChange={e => setValue(e.target.value)} required min={0} step="0.01" /></label>
        <label>Status
          <select value={status} onChange={e => setStatus(e.target.value as Status)}>
            <option value="planned">Planejado</option>
            <option value="accounting">Em prestação de contas</option>
            <option value="executed">Executado</option>
            <option value="archived">Arquivado</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>Órgão / Ministério<input value={ministry} onChange={e => setMinistry(e.target.value)} placeholder="Ex: Ministério da Cultura" /></label>
      </div>
      <div className="form-row form-row-double">
        <label>Parlamentar<input value={parliamentarian} onChange={e => setParliamentarian(e.target.value)} /></label>
        <label>Tipo de emenda<input value={amendment} onChange={e => setAmendment(e.target.value)} placeholder="Emenda Federal" /></label>
      </div>
      <div className="form-row">
        <label>Convênio<input value={agreement} onChange={e => setAgreement(e.target.value)} placeholder="Termo de Fomento" /></label>
      </div>
      <div className="form-row">
        <label>Notas internas<textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></label>
      </div>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0' }}>Documentos</h3>
      <div className="docs-list">
        {docs.map((d, i) => (
          <div key={i} className="doc-row">
            <input
              placeholder="Nome do documento (ex: Termo de Fomento)"
              value={d.label}
              onChange={e => updateDoc(i, { label: e.target.value })}
              required
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              disabled={uploadingIdx === i}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) uploadDocAt(i, f);
              }}
            />
            {d.url && (
              <a href={d.url} target="_blank" rel="noopener noreferrer" className="link-btn">
                Ver {d.fileType ?? 'arquivo'}
              </a>
            )}
            {uploadingIdx === i && <span className="muted">Enviando…</span>}
            <button type="button" className="link-btn" style={{ color: 'var(--danger)' }} onClick={() => removeDoc(i)}>Remover</button>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={addDoc} style={{ marginTop: '0.5rem' }}>+ Adicionar documento</button>
      </div>

      {save.error && <div className="error">{(save.error as Error).message}</div>}
      {del.error && <div className="error">{(del.error as Error).message}</div>}
    </form>
  );
}
