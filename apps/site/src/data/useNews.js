import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-178834661181.us-central1.run.app';

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
    link: `/noticias/${apiItem.slug}`,
    featured: (apiItem.categories ?? []).some(c => c.category?.slug === 'destaques'),
  };
}

export function useNews() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(['Todas']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`${API_URL}/kenren/news`).then(r => {
        if (!r.ok) throw new Error(`HTTP news ${r.status}`);
        return r.json();
      }),
      fetch(`${API_URL}/kenren/news-categories`).then(r => r.ok ? r.json() : { items: [] }),
    ])
      .then(([newsJson, catJson]) => {
        if (!alive) return;
        setItems((newsJson.items ?? []).map(mapItem));
        setCategories(['Todas', ...(catJson.items ?? []).map(c => c.name)]);
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
