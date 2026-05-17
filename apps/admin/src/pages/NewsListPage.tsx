import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  updatedAt: string;
};

const statusLabel = (s: NewsItem['status']) =>
  s === 'published' ? 'Publicada' : s === 'draft' ? 'Rascunho' : 'Arquivada';

export function NewsListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'news'],
    queryFn: () => api.get<{ items: NewsItem[] }>('/admin/news'),
  });

  return (
    <div>
      <div className="page-header">
        <h1>Notícias</h1>
        <Link to="/news/new" className="btn-primary">Nova notícia</Link>
      </div>

      {isLoading && <p>Carregando…</p>}
      {error && <div className="error">Erro: {(error as Error).message}</div>}

      {data?.items && data.items.length === 0 && (
        <div className="empty">Nenhuma notícia ainda. Crie a primeira.</div>
      )}

      {data?.items && data.items.length > 0 && (
        <table className="table">
          <thead>
            <tr><th>Título</th><th>Status</th><th>Publicação</th><th>Atualização</th></tr>
          </thead>
          <tbody>
            {data.items.map(item => (
              <tr key={item.id}>
                <td><Link to={`/news/${item.id}`}>{item.title}</Link></td>
                <td><span className={`status-pill status-${item.status}`}>{statusLabel(item.status)}</span></td>
                <td>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('pt-BR') : '—'}</td>
                <td>{new Date(item.updatedAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
