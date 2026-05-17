import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type Event = {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  featured: boolean;
};

const statusLabel = (s: Event['status']) =>
  s === 'published' ? 'Publicado' : s === 'draft' ? 'Rascunho' : 'Arquivado';

const fmt = (iso: string) => new Date(iso).toLocaleString('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export function EventsListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'events'],
    queryFn: () => api.get<{ items: Event[] }>('/admin/events'),
  });

  return (
    <div>
      <div className="page-header">
        <h1>Eventos</h1>
        <Link to="/events/new" className="btn-primary">Novo evento</Link>
      </div>

      {isLoading && <p>Carregando…</p>}
      {error && <div className="error">Erro: {(error as Error).message}</div>}

      {data?.items && data.items.length === 0 && (
        <div className="empty">Nenhum evento ainda. Crie o primeiro.</div>
      )}

      {data?.items && data.items.length > 0 && (
        <table className="table">
          <thead>
            <tr><th>Título</th><th>Início</th><th>Local</th><th>Status</th><th>Destaque</th></tr>
          </thead>
          <tbody>
            {data.items.map(ev => (
              <tr key={ev.id}>
                <td><Link to={`/events/${ev.id}`}>{ev.title}</Link></td>
                <td>{fmt(ev.startsAt)}</td>
                <td className="muted">{ev.location ?? '—'}</td>
                <td><span className={`status-pill status-${ev.status}`}>{statusLabel(ev.status)}</span></td>
                <td>{ev.featured ? '⭐' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
