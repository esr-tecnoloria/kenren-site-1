import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';

type Kenjinkai = {
  id: string;
  slug: string;
  name: string;
  kanji: string;
  region: string;
  regionColor: string;
  capital: string;
  nomeKenjinkai: string | null;
};

export function KenjinkaisListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'kenjinkais'],
    queryFn: () => api.get<{ items: Kenjinkai[] }>('/admin/kenjinkais'),
  });

  const [region, setRegion] = useState('Todas');

  const regions = data?.items
    ? ['Todas', ...Array.from(new Set(data.items.map(k => k.region)))]
    : ['Todas'];

  const filtered = data?.items?.filter(k => region === 'Todas' || k.region === region) ?? [];

  return (
    <div>
      <div className="page-header">
        <h1>Kenjinkais</h1>
        <span className="muted">47 províncias</span>
      </div>

      {isLoading && <p>Carregando…</p>}
      {error && <div className="error">{(error as Error).message}</div>}

      {data?.items && (
        <>
          <div className="region-filter-row">
            {regions.map(r => (
              <button
                key={r}
                className={`region-chip${region === r ? ' active' : ''}`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <table className="table">
            <thead>
              <tr><th></th><th>Província</th><th>Kanji</th><th>Região</th><th>Capital</th><th>Kenjinkai</th></tr>
            </thead>
            <tbody>
              {filtered.map(k => (
                <tr key={k.id}>
                  <td><span className="region-dot" style={{ background: k.regionColor }} /></td>
                  <td><Link to={`/kenjinkais/${k.id}`}>{k.name}</Link></td>
                  <td className="kanji-cell">{k.kanji}</td>
                  <td>{k.region}</td>
                  <td className="muted">{k.capital}</td>
                  <td className="muted">{k.nomeKenjinkai ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
