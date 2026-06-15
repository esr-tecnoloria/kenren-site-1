import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-178834661181.us-central1.run.app';

const STATUS_LABELS = {
  planned: 'Planejado',
  accounting: 'Em prestação de contas',
  executed: 'Executado',
  archived: 'Arquivado',
};

function mapItem(item) {
  return {
    id: item.id,
    slug: item.slug,
    year: item.year,
    title: item.title,
    ministry: item.ministry || '',
    sphere: item.sphere,
    value: Number(item.value),
    status: item.status,
    statusLabel: STATUS_LABELS[item.status] || item.status,
    parliamentarian: item.parliamentarian || '',
    amendment: item.amendment || '',
    agreement: item.agreement || '',
    docs: (item.docs || []).map(d => ({
      label: d.label,
      type: d.fileType || 'PDF',
      url: d.url || null,
    })),
  };
}

export function useTransparency() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/kenren/transparency`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (!alive) return;
        setItems((json.items ?? []).map(mapItem));
        setLoading(false);
      })
      .catch(e => {
        if (!alive) return;
        setError(e.message);
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  return { items, loading, error };
}
