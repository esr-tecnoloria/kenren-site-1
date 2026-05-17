import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-mvxj6ljnkq-rj.a.run.app';

const MONTHS = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

const pad = (n) => n.toString().padStart(2, '0');

function mapEvent(ev) {
  const start = new Date(ev.startsAt);
  const end = ev.endsAt ? new Date(ev.endsAt) : null;
  return {
    id: ev.id,
    slug: ev.slug,
    title: ev.title,
    description: ev.description,
    bodyHtml: ev.bodyHtml,
    location: ev.location,
    startsAt: ev.startsAt,
    endsAt: ev.endsAt,
    coverUrl: ev.coverUrl,
    linkUrl: ev.linkUrl,
    featured: ev.featured,
    allDay: ev.allDay,
    // Convenience display fields
    day: pad(start.getDate()),
    month: MONTHS[start.getMonth()],
    timeRange: ev.allDay
      ? 'Dia inteiro'
      : end
      ? `${pad(start.getHours())}:${pad(start.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`
      : `${pad(start.getHours())}:${pad(start.getMinutes())}`,
  };
}

export function useEvents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/kenren/events`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (!alive) return;
        setItems((json.items ?? []).map(mapEvent));
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
