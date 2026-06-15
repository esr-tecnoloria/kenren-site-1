import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useKenjinkais } from '../data/useKenjinkais';
import { fullKanji } from '../data/prefectures';
import { resizedUrl } from '../utils/image';

export default function IndividualKenjinkaiPage() {
  const { slug } = useParams();
  const { bySlug, loading } = useKenjinkais();
  const data = bySlug[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <div style={{ padding: '4rem 0', textAlign: 'center' }}>Carregando…</div>;
  }
  if (!data) {
    return <Navigate to="/kenjinkais" replace />;
  }

  return (
    <>
      <section
        className={`kenjinkai-hero${data.coverUrl ? ' has-cover' : ''}`}
        style={data.coverUrl
          ? {
              backgroundImage:
                `linear-gradient(135deg, ${data.regionColor}cc 0%, rgba(26,26,26,0.85) 100%), ` +
                `url("${resizedUrl(data.coverUrl, 1600)}")`,
            }
          : { background: `linear-gradient(135deg, ${data.regionColor}cc 0%, rgba(26,26,26,0.85) 100%)` }
        }
      >
        <div className="container">
          <Link to="/kenjinkais" className="kenjinkai-back">← Voltar ao mapa</Link>
          <div className="kenjinkai-hero-inner">
            <span className="kenjinkai-hero-kanji">{fullKanji(data.slug, data.kanji)}</span>
            <div>
              <span className="kenjinkai-hero-region" style={{ background: data.regionColor }}>{data.region}</span>
              <h1 className="kenjinkai-hero-title">{data.name}</h1>
              <p className="kenjinkai-hero-subtitle">{data.nomeKenjinkai || data.kenjinkai}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="kenjinkai-content-section">
        <div className="container">
          <div className="kenjinkai-grid">
            <div className="kenjinkai-main">
              <div className="kenjinkai-block">
                <h2>Sobre o Kenjinkai</h2>
                <p>{data.resumo || data.desc}</p>
              </div>

              <div className="kenjinkai-highlights">
                <div className="kenjinkai-highlight">
                  <span className="kenjinkai-highlight-icon">⛩️</span>
                  <div>
                    <h4>Principal ponto turístico</h4>
                    <p>{data.pontoTuristico || '—'}</p>
                  </div>
                </div>
                <div className="kenjinkai-highlight">
                  <span className="kenjinkai-highlight-icon">🍱</span>
                  <div>
                    <h4>Prato típico</h4>
                    <p>{data.pratoTipico || '—'}</p>
                  </div>
                </div>
                <div className="kenjinkai-highlight">
                  <span className="kenjinkai-highlight-icon">🏯</span>
                  <div>
                    <h4>Capital da província</h4>
                    <p>{data.capital}</p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="kenjinkai-sidebar">
              <h3>Contato</h3>
              <div className="kenjinkai-info-row">
                <strong>Endereço</strong>
                <span>{data.endereco || 'São Paulo - SP'}</span>
              </div>
              {data.site && (
                <div className="kenjinkai-info-row">
                  <strong>Site</strong>
                  <a href={data.site} target="_blank" rel="noopener noreferrer">{data.site}</a>
                </div>
              )}
              {(data.facebook || data.instagram) && (
                <div className="kenjinkai-info-row">
                  <strong>Redes sociais</strong>
                  <div className="kenjinkai-social">
                    {data.facebook && (
                      <a href={data.facebook} target="_blank" rel="noopener noreferrer" className="kenjinkai-social-link">
                        Facebook
                      </a>
                    )}
                    {data.instagram && (
                      <a href={data.instagram} target="_blank" rel="noopener noreferrer" className="kenjinkai-social-link">
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
              {!data.site && !data.facebook && !data.instagram && (
                <p className="kenjinkai-no-contact">Canais oficiais ainda não identificados.</p>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
