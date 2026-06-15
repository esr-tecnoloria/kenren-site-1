import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-178834661181.us-central1.run.app';

// Map API response to the legacy prefectureData shape used by JapanMap / pages.
function mapApiItem(item) {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    kanji: item.kanji,
    region: item.region,
    regionColor: item.regionColor,
    capital: item.capital,
    nomeKenjinkai: item.nomeKenjinkai || `Associação ${item.name} Kenjin do Brasil`,
    kenjinkai: item.nomeKenjinkai || `${item.name} Kenjinkai do Brasil`,
    desc: item.descricao || '',
    resumo: item.resumo || '',
    pontoTuristico: item.pontoTuristico || '',
    pratoTipico: item.pratoTipico || '',
    endereco: item.endereco || 'São Paulo - SP',
    site: item.site || '',
    facebook: item.facebook || '',
    instagram: item.instagram || '',
    coverUrl: item.coverUrl || '',
    coverAlt: item.coverAlt || '',
  };
}

export function useKenjinkais() {
  const [bySlug, setBySlug] = useState({});
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/kenren/kenjinkais`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (!alive) return;
        const items = (json.items ?? []).map(mapApiItem);
        const map = {};
        for (const it of items) map[it.slug] = it;
        setList(items);
        setBySlug(map);
        setLoading(false);
      })
      .catch(e => {
        if (!alive) return;
        setError(e.message);
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  return { list, bySlug, loading, error };
}
