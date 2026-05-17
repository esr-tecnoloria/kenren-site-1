import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../data/useNews';
import { resizedUrl, resizedSrcSet } from '../utils/image';

const PAGE_SIZE = 9;

const formatDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const monthShort = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
};

const dayOf = (iso) => new Date(iso + 'T00:00:00').getDate().toString().padStart(2, '0');
const yearOf = (iso) => new Date(iso + 'T00:00:00').getFullYear();

export default function NewsPage() {
  const { items: newsItems, categories: newsCategories, loading, error } = useNews();
  const [category, setCategory] = useState('Todas');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sortedNews = useMemo(
    () => [...newsItems].sort((a, b) => b.date.localeCompare(a.date)),
    [newsItems]
  );

  const featured = useMemo(() => {
    const explicit = sortedNews.find(n => n.featured);
    return explicit || sortedNews[0] || null;
  }, [sortedNews]);

  const recent = useMemo(
    () => featured ? sortedNews.filter(n => n.id !== featured.id).slice(0, 4) : [],
    [sortedNews, featured]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedNews.filter(item => {
      if (category !== 'Todas' && !item.categories.includes(category)) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.categories.some(c => c.toLowerCase().includes(q))
      );
    });
  }, [sortedNews, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <>
      <section className="page-banner news-banner">
        <div className="page-banner-overlay"></div>
        <div className="container">
          <span className="news-eyebrow">Comunicação Kenren</span>
          <h1 className="page-banner-title">Notícias</h1>
          <p className="page-banner-subtitle">
            Acompanhe os eventos, comunicados e novidades da nossa federação e kenjinkais
          </p>
        </div>
      </section>

      {loading && (
        <section className="news-featured-section">
          <div className="container"><p style={{ textAlign: 'center', padding: '2rem' }}>Carregando notícias…</p></div>
        </section>
      )}

      {error && (
        <section className="news-featured-section">
          <div className="container"><p style={{ textAlign: 'center', padding: '2rem', color: '#b22222' }}>Erro ao carregar notícias: {error}</p></div>
        </section>
      )}

      {!loading && !error && featured && (
      <section className="news-featured-section">
        <div className="container">
          <div className="news-featured-grid">
            <Link to={featured.link} className="news-featured">
              <div className="news-featured-image">
                <img
                  src={resizedUrl(featured.image, 800)}
                  srcSet={resizedSrcSet(featured.image)}
                  sizes="(max-width: 768px) 100vw, 800px"
                  alt={featured.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = featured.image; }}
                />
                <span className="news-featured-badge">
                  <span className="news-featured-badge-dot"></span>
                  Em destaque
                </span>
              </div>
              <div className="news-featured-body">
                <div className="news-meta">
                  {featured.categories.slice(0, 2).map(cat => (
                    <span key={cat} className="news-cat-pill">{cat}</span>
                  ))}
                  <span className="news-meta-date">{formatDate(featured.date)}</span>
                </div>
                <h2 className="news-featured-title">{featured.title}</h2>
                <p className="news-featured-excerpt">{featured.excerpt}</p>
                <span className="news-featured-cta">
                  Ler matéria completa
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            <aside className="news-sidebar">
              <h3 className="news-sidebar-title">
                <span className="news-sidebar-bar" aria-hidden="true"></span>
                Mais recentes
              </h3>
              <ul className="news-sidebar-list">
                {recent.map(item => (
                  <li key={item.id}>
                    <Link to={item.link} className="news-sidebar-item">
                      <div className="news-sidebar-thumb">
                        <img
                          src={resizedUrl(item.image, 400)}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = item.image; }}
                        />
                      </div>
                      <div className="news-sidebar-content">
                        <span className="news-sidebar-date">{formatDate(item.date)}</span>
                        <h4>{item.title}</h4>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
      )}

      <section className="news-list-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Todas as notícias</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Filtre por categoria ou pesquise por palavra-chave</p>
          </div>

          <div className="news-toolbar">
            <div className="news-categories" role="tablist">
              {newsCategories.map(cat => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={category === cat}
                  className={`news-category-btn${category === cat ? ' active' : ''}`}
                  onClick={() => handleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="news-search">
              <svg className="news-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                placeholder="Buscar notícias..."
                value={query}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="news-results-info">
            <span>
              {filtered.length === 0
                ? 'Nenhuma notícia encontrada'
                : `${filtered.length} ${filtered.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}`}
            </span>
          </div>

          {paginated.length === 0 ? (
            <div className="news-empty">
              <div className="news-empty-icon">📭</div>
              <h3>Nenhuma notícia para esses filtros</h3>
              <p>Tente outra categoria ou termo de busca.</p>
              <button className="btn btn-primary" onClick={() => { setCategory('Todas'); setQuery(''); }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="news-grid">
              {paginated.map(item => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="news-card"
                >
                  <div className="news-card-image">
                    <img
                      src={resizedUrl(item.image, 400)}
                      srcSet={resizedSrcSet(item.image)}
                      sizes="(max-width: 768px) 100vw, 400px"
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = item.image; }}
                    />
                    <div className="news-card-date">
                      <span className="news-card-date-day">{dayOf(item.date)}</span>
                      <span className="news-card-date-month">{monthShort(item.date)}</span>
                      <span className="news-card-date-year">{yearOf(item.date)}</span>
                    </div>
                  </div>
                  <div className="news-card-body">
                    <div className="news-card-cats">
                      {item.categories.slice(0, 2).map(cat => (
                        <span key={cat} className="news-cat-pill">{cat}</span>
                      ))}
                    </div>
                    <h3 className="news-card-title">{item.title}</h3>
                    <p className="news-card-excerpt">{item.excerpt}</p>
                    <div className="news-card-footer">
                      <span className="news-card-author">por {item.author}</span>
                      <span className="news-card-cta">
                        Ler mais
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="news-pagination" aria-label="Paginação">
              <button
                className="news-page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Página anterior"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`news-page-btn${p === safePage ? ' active' : ''}`}
                  onClick={() => setPage(p)}
                  aria-current={p === safePage ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}
              <button
                className="news-page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Próxima página"
              >
                ›
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
