import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type Doc = { id: string; label: string; url: string | null; fileType: string | null };
type Project = {
  id: string;
  slug: string;
  year: number;
  title: string;
  sphere: 'Estadual' | 'Federal' | 'Municipal';
  value: string;
  status: 'planned' | 'accounting' | 'executed' | 'archived';
  docs: Doc[];
};

const statusLabel = (s: Project['status']) =>
  ({ planned: 'Planejado', accounting: 'Em prestação', executed: 'Executado', archived: 'Arquivado' })[s];

const fmtBRL = (v: string | number) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export function TransparencyListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'transparency'],
    queryFn: () => api.get<{ items: Project[] }>('/admin/transparency'),
  });

  return (
    <div>
      <div className="page-header">
        <h1>Transparência</h1>
        <Link to="/transparency/new" className="btn-primary">Novo projeto</Link>
      </div>

      {isLoading && <p>Carregando…</p>}
      {error && <div className="error">{(error as Error).message}</div>}

      {data?.items && data.items.length === 0 && (
        <div className="empty">Nenhum projeto. Crie o primeiro.</div>
      )}

      {data?.items && data.items.length > 0 && (
        <table className="table">
          <thead>
            <tr><th>Ano</th><th>Projeto</th><th>Esfera</th><th>Valor</th><th>Status</th><th>Docs</th></tr>
          </thead>
          <tbody>
            {data.items.map(p => (
              <tr key={p.id}>
                <td>{p.year}</td>
                <td><Link to={`/transparency/${p.id}`}>{p.title}</Link></td>
                <td>{p.sphere}</td>
                <td>{fmtBRL(p.value)}</td>
                <td><span className={`status-pill status-${p.status === 'executed' ? 'published' : p.status === 'accounting' ? 'draft' : 'archived'}`}>{statusLabel(p.status)}</span></td>
                <td className="muted">{p.docs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
