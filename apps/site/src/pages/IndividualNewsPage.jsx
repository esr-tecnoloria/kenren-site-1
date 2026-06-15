import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resizedUrl, resizedSrcSet } from '../utils/image';

const API_URL = import.meta.env.VITE_API_URL || 'https://kenren-api-178834661181.us-central1.run.app';

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function IndividualNewsPage() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/kenren/news/${slug}`)
      .then(r => {
        if (r.status === 404) throw new Error('Notícia não encontrada');
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => { setNews(data); setLoading(false); })
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
          <Link to="/noticias" className="news-back">← Voltar às notícias</Link>
          <div className="news-empty">
            <h3>{error}</h3>
            <Link to="/noticias" className="btn btn-primary">Ver todas as notícias</Link>
          </div>
        </div>
      </section>
    );
  }

  const categories = (news.categories ?? []).map(c => c.category?.name).filter(Boolean);

  return (
    <>
      <section className="news-article-hero">
        {news.coverUrl && (
          <div className="news-article-cover">
            <img
              src={resizedUrl(news.coverUrl, 1600)}
              srcSet={resizedSrcSet(news.coverUrl)}
              sizes="(max-width: 1200px) 100vw, 1200px"
              alt={news.coverAlt || news.title}
              onError={(e) => { e.currentTarget.src = news.coverUrl; }}
            />
          </div>
        )}
      </section>

      <article className="news-article-section">
        <div className="container news-article-container">
          <Link to="/noticias" className="news-back">← Voltar às notícias</Link>

          <div className="news-article-meta">
            {categories.map(cat => (
              <span key={cat} className="news-cat-pill">{cat}</span>
            ))}
            {news.publishedAt && (
              <span className="news-meta-date">{formatDate(news.publishedAt)}</span>
            )}
          </div>

          <h1 className="news-article-title">{news.title}</h1>
          {news.excerpt && <p className="news-article-excerpt">{news.excerpt}</p>}

          {news.youtubeId && (
            <div className="news-article-video">
              <iframe
                src={`https://www.youtube.com/embed/${news.youtubeId}`}
                title={news.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          <div
            className="news-article-body"
            dangerouslySetInnerHTML={{ __html: news.bodyHtml }}
          />
        </div>
      </article>
    </>
  );
}
