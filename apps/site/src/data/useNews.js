import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-mvxj6ljnkq-rj.a.run.app';

const DEFAULT_CATEGORIES = [
  'Todas',
  'Destaques',
  'Notícias',
  'Notícias Kenjinkai',
  'Notícias Relacionadas',
  'Informações Kenren',
  'Informativo',
];

function mapItem(apiItem) {
  return {
    id: apiItem.slug,
    slug: apiItem.slug,
    title: apiItem.title,
    date: apiItem.publishedAt ? apiItem.publishedAt.slice(0, 10) : '',
    categories: (apiItem.categories ?? []).map(c => c.category?.name).filter(Boolean),
    author: 'Kenren',
    image: apiItem.coverUrl || '',
    excerpt: apiItem.excerpt || '',
    bodyHtml: apiItem.bodyHtml || '',
    youtubeId: apiItem.youtubeId || null,
    link: `#/noticias/${apiItem.slug}`,
    featured: (apiItem.categories ?? []).some(c => c.category?.slug === 'destaques'),
  };
}

export function useNews() {
  const [items, setItems] = useState([]);
  const [categories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/kenren/news`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (!alive) return;
        const mapped = (json.items ?? []).map(mapItem);
        setItems(mapped);
        setLoading(false);
      })
      .catch(e => {
        if (!alive) return;
        setError(e.message);
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  return { items, categories, loading, error };
}
