import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resizedUrl, resizedSrcSet } from '../utils/image';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-178834661181.us-central1.run.app';

const fmtDate = (iso) => new Date(iso).toLocaleDateString('pt-BR', {
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
});

const fmtTime = (iso) => new Date(iso).toLocaleTimeString('pt-BR', {
  hour: '2-digit', minute: '2-digit',
});

const fmtRange = (start, end, allDay) => {
  const startDate = fmtDate(start);
  if (allDay) return startDate;
  if (!end) return `${startDate} · ${fmtTime(start)}`;
  const sameDay = new Date(start).toDateString() === new Date(end).toDateString();
  if (sameDay) return `${startDate} · ${fmtTime(start)} – ${fmtTime(end)}`;
  return `${startDate} ${fmtTime(start)} → ${fmtDate(end)} ${fmtTime(end)}`;
};

export default function IndividualEventPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/kenren/events/${slug}`)
      .then(r => {
        if (r.status === 404) throw new Error('Evento não encontrado');
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => { setEvent(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <section className="news-article-section">
        <div className="container"><p style={{ textAlign: 'center', padding: '4rem 0' }}>Carregando…</p></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="news-article-section">
        <div className="container">
          <Link to="/agenda" className="news-back">← Voltar à agenda</Link>
          <div className="news-empty">
            <h3>{error}</h3>
            <Link to="/agenda" className="btn btn-primary">Ver agenda completa</Link>
          </div>
        </div>
      </section>
    );
  }

  const isPast = new Date(event.endsAt || event.startsAt) < new Date();

  return (
    <>
      <section className="news-article-hero">
        {event.coverUrl && (
          <div className="news-article-cover">
            <img
              src={resizedUrl(event.coverUrl, 1600)}
              srcSet={resizedSrcSet(event.coverUrl)}
              sizes="(max-width: 1200px) 100vw, 1200px"
              alt={event.coverAlt || event.title}
              onError={(e) => { e.currentTarget.src = event.coverUrl; }}
            />
          </div>
        )}
      </section>

      <article className="news-article-section">
        <div className="container news-article-container">
          <Link to="/agenda" className="news-back">← Voltar à agenda</Link>

          <div className="news-article-meta">
            {event.featured && <span className="news-cat-pill" style={{ background: '#b22222', color: '#fff' }}>Destaque</span>}
            {isPast && <span className="news-cat-pill" style={{ background: '#6b7280', color: '#fff' }}>Evento passado</span>}
          </div>

          <h1 className="news-article-title">{event.title}</h1>
          {event.description && <p className="news-article-excerpt">{event.description}</p>}

          <div className="event-info-card">
            <div className="event-info-row">
              <span className="event-info-icon">📅</span>
              <div>
                <span className="event-info-label">Quando</span>
                <span className="event-info-value">{fmtRange(event.startsAt, event.endsAt, event.allDay)}</span>
              </div>
            </div>
            {event.location && (
              <div className="event-info-row">
                <span className="event-info-icon">📍</span>
                <div>
                  <span className="event-info-label">Onde</span>
                  <span className="event-info-value">{event.location}</span>
                </div>
              </div>
            )}
            {event.linkUrl && (
              <a href={event.linkUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary event-info-cta">
                Mais informações / Inscrição
              </a>
            )}
          </div>

          {event.bodyHtml && (
            <div
              className="news-article-body"
              dangerouslySetInnerHTML={{ __html: event.bodyHtml }}
            />
          )}
        </div>
      </article>
    </>
  );
}
