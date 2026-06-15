import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-178834661181.us-central1.run.app';

const FALLBACK_SETTINGS = {
  subtitle: 'Federação das Associações de Províncias do Japão no Brasil',
  description: 'Fundada em 1966, a KENREN é uma entidade que visa incentivar e apoiar os imigrantes japoneses, preservar e divulgar a cultura japonesa, fortalecer os kenjinkais das 47 províncias.',
  ctaLabel: 'Saiba Mais',
  ctaHref: '#federacao',
  showLogo: true,
};

const FALLBACK_SLIDES = [
  { id: 'f1', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=90', alt: 'Templo Japonês' },
  { id: 'f2', imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&q=90', alt: 'Cerejeiras do Japão' },
  { id: 'f3', imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=90', alt: 'Monte Fuji' },
];

export function useHero() {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/kenren/hero`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(json => {
        if (!alive) return;
        if (json.settings) setSettings({ ...FALLBACK_SETTINGS, ...json.settings });
        if (Array.isArray(json.slides) && json.slides.length > 0) setSlides(json.slides);
        setLoading(false);
      })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return { settings, slides, loading };
}
