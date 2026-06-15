import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { resizedUrl } from '../utils/image';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-178834661181.us-central1.run.app';

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_SHORT = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

const pad = (n) => n.toString().padStart(2, '0');

const fmtTime = (iso, allDay) => {
  if (allDay) return 'Dia inteiro';
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const monthKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};

const monthLabel = (key) => {
  const [y, m] = key.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
};

export default function AgendaPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming'); // upcoming | past | all

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_URL}/kenren/events?past=1&limit=200`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => { setAllEvents(json.items ?? []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const now = Date.now();

  const filtered = useMemo(() => {
    return allEvents.filter(ev => {
      const end = new Date(ev.endsAt || ev.startsAt).getTime();
      const start = new Date(ev.startsAt).getTime();
      const isPast = end < now - 1000 * 60 * 60 * 12;
      const isUpcoming = start >= now - 1000 * 60 * 60 * 12;
      if (filter === 'past') return isPast;
      if (filter === 'upcoming') return isUpcoming;
      return true;
    });
  }, [allEvents, filter, now]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => filter === 'past'
      ? new Date(b.startsAt) - new Date(a.startsAt)
      : new Date(a.startsAt) - new Date(b.startsAt));
    return arr;
  }, [filtered, filter]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const ev of sorted) {
      const key = monthKey(ev.startsAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return Array.from(map.entries());
  }, [sorted]);

  return (
    <>
      <section className="page-banner">
        <div className="page-banner-overlay"></div>
        <div className="container">
          <h1 className="page-banner-title">Agenda</h1>
          <p className="page-banner-subtitle">Eventos da Kenren e dos Kenjinkais</p>
        </div>
      </section>

      <section className="agenda-section">
        <div className="container">
          <div className="agenda-filters" role="tablist">
            {[
              { id: 'upcoming', label: 'Próximos' },
              { id: 'past', label: 'Passados' },
              { id: 'all', label: 'Todos' },
            ].map(f => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={`agenda-filter${filter === f.id ? ' active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading && <p style={{ textAlign: 'center', padding: '3rem 0' }}>Carregando agenda…</p>}
          {error && <div className="news-empty">Erro: {error}</div>}
          {!loading && !error && sorted.length === 0 && (
            <div className="news-empty">
              <div className="news-empty-icon">📭</div>
              <h3>Nenhum evento {filter === 'past' ? 'passado' : filter === 'upcoming' ? 'futuro' : ''}</h3>
              <p>Volte em breve.</p>
            </div>
          )}

          {groups.map(([key, evs]) => (
            <div key={key} className="agenda-month-group">
              <h2 className="agenda-month-title">{monthLabel(key)}</h2>
              <ol className="agenda-list">
                {evs.map(ev => {
                  const d = new Date(ev.startsAt);
                  return (
                    <li key={ev.id} className="agenda-item">
                      <Link to={`/eventos/${ev.slug}`} className="agenda-item-link">
                        <div className="agenda-item-date">
                          <span className="agenda-item-day">{pad(d.getDate())}</span>
                          <span className="agenda-item-month">{MONTHS_SHORT[d.getMonth()]}</span>
                        </div>
                        {ev.coverUrl && (
                          <div className="agenda-item-thumb">
                            <img
                              src={resizedUrl(ev.coverUrl, 400)}
                              alt=""
                              loading="lazy"
                              onError={(e) => { e.currentTarget.src = ev.coverUrl; }}
                            />
                          </div>
                        )}
                        <div className="agenda-item-content">
                          <div className="agenda-item-meta">
                            <span className="agenda-item-time">{fmtTime(ev.startsAt, ev.allDay)}</span>
                            {ev.featured && <span className="news-cat-pill" style={{ background: '#b22222', color: '#fff' }}>Destaque</span>}
                          </div>
                          <h3 className="agenda-item-title">{ev.title}</h3>
                          {ev.location && <p className="agenda-item-location">📍 {ev.location}</p>}
                          {ev.description && <p className="agenda-item-desc">{ev.description}</p>}
                        </div>
                        <span className="agenda-item-arrow">→</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
