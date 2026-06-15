import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useEvents } from '../data/useEvents';
import { useNews } from '../data/useNews';
import { useHero } from '../data/useHero';
import { resizedUrl, resizedSrcSet } from '../utils/image';
import MonumentosSection from '../components/MonumentosSection';

export default function HomePage() {
  const { settings: heroSettings, slides: heroSlides } = useHero();
  const { items: events, loading: eventsLoading } = useEvents();
  const { items: news, loading: newsLoading } = useNews();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlideIdx, setPrevSlideIdx] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const intervalRef = useRef(null);
  const formRef = useRef(null);
  const location = useLocation();

  // Scroll to hash on mount
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const goToSlide = useCallback((index) => {
    if (index === currentSlide) return;
    setPrevSlideIdx(currentSlide);
    setCurrentSlide(index);
    setTimeout(() => setPrevSlideIdx(null), 800);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, nextSlide]);

  // Preload images
  useEffect(() => {
    heroSlides.forEach(slide => {
      const img = new Image();
      img.src = resizedUrl(slide.imageUrl, 1600);
    });
  }, []);

  // Intersection observer for fade-in animations
  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.atividade-card, .monumento-card, .evento-card, .kenjinkai-item');
    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Active navigation on scroll
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavigation = () => {
      const scrollY = window.pageYOffset;
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', highlightNavigation);
    return () => window.removeEventListener('scroll', highlightNavigation);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormMessage({ text: 'Enviando mensagem...', type: '' });
    setTimeout(() => {
      setFormMessage({ text: 'Obrigado pelo envio! Entraremos em contato em breve.', type: 'success' });
      formRef.current?.reset();
    }, 1500);
  };

  const handleAnchorClick = (e) => {
    e.preventDefault();
    const hash = e.currentTarget.getAttribute('href');
    const target = document.querySelector(hash);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const getSlideClassName = (index) => {
    let cls = 'hero-slide';
    if (index === currentSlide) cls += ' active';
    if (index === prevSlideIdx) cls += ' prev';
    return cls;
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero"
        id="home"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div key={slide.id ?? index} className={getSlideClassName(index)}>
              <img
                src={resizedUrl(slide.imageUrl, 1600)}
                srcSet={resizedSrcSet(slide.imageUrl)}
                sizes="100vw"
                alt={slide.alt ?? ''}
                className="hero-bg-img"
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => { e.currentTarget.src = slide.imageUrl; }}
              />
              <div className="hero-overlay"></div>
            </div>
          ))}
        </div>
        <div className="hero-content">
          <div className="container">
            {heroSettings.showLogo && (
              <div className="hero-logo-watermark">
                <img src={`${import.meta.env.BASE_URL}assets/logo_kenren.png`} alt="KENREN Logo" className="hero-logo-img" />
              </div>
            )}
            {heroSettings.title && <h1 className="hero-title">{heroSettings.title}</h1>}
            {heroSettings.subtitle && <p className="hero-subtitle">{heroSettings.subtitle}</p>}
            {heroSettings.description && <p className="hero-description">{heroSettings.description}</p>}
            {heroSettings.ctaLabel && heroSettings.ctaHref && (
              heroSettings.ctaHref.startsWith('#') ? (
                <a href={heroSettings.ctaHref} className="btn btn-primary" onClick={handleAnchorClick}>{heroSettings.ctaLabel}</a>
              ) : (
                <Link to={heroSettings.ctaHref} className="btn btn-primary">{heroSettings.ctaLabel}</Link>
              )
            )}
          </div>
        </div>
        <div className="hero-controls">
          <button className="hero-arrow hero-arrow-prev" aria-label="Imagem anterior" onClick={() => { setIsPaused(true); prevSlide(); setTimeout(() => setIsPaused(false), 100); }}>&#8249;</button>
          <button className="hero-arrow hero-arrow-next" aria-label="Próxima imagem" onClick={() => { setIsPaused(true); nextSlide(); setTimeout(() => setIsPaused(false), 100); }}>&#8250;</button>
        </div>
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-indicator${index === currentSlide ? ' active' : ''}`}
              data-slide={index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => { setIsPaused(true); goToSlide(index); setTimeout(() => setIsPaused(false), 100); }}
            />
          ))}
        </div>
      </section>

      {/* Notícias Section */}
      <section className="home-news-section" id="noticias-home">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Últimas Notícias</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Acompanhe o que está acontecendo na Kenren e nos Kenjinkais</p>
          </div>

          {newsLoading ? (
            <p style={{ textAlign: 'center', padding: '2rem 0', color: '#666' }}>Carregando notícias…</p>
          ) : news.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem 0', color: '#666' }}>Nenhuma notícia publicada no momento.</p>
          ) : (
            <>
              <div className="home-news-grid">
                {news.slice(0, 3).map(item => (
                  <Link key={item.id} to={item.link} className="home-news-card">
                    <div className="home-news-card-image">
                      {item.image ? (
                        <img
                          src={resizedUrl(item.image, 400)}
                          srcSet={resizedSrcSet(item.image)}
                          sizes="(max-width: 768px) 100vw, 400px"
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = item.image; }}
                        />
                      ) : (
                        <div className="home-news-card-placeholder">📰</div>
                      )}
                    </div>
                    <div className="home-news-card-body">
                      <div className="home-news-card-meta">
                        {item.categories.slice(0, 1).map(cat => (
                          <span key={cat} className="news-cat-pill">{cat}</span>
                        ))}
                        {item.date && (
                          <span className="home-news-card-date">
                            {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h3 className="home-news-card-title">{item.title}</h3>
                      <p className="home-news-card-excerpt">{item.excerpt}</p>
                      <span className="home-news-card-cta">Ler mais →</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link to="/noticias" className="btn btn-primary">Ver todas as notícias</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Eventos Section */}
      <section className="eventos-section" id="eventos">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Agenda de Eventos</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Não perca os eventos dos Kenjinkais!</p>
          </div>
          {eventsLoading ? (
            <p style={{ textAlign: 'center', padding: '2rem 0', color: '#666' }}>Carregando eventos…</p>
          ) : events.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem 0', color: '#666' }}>Nenhum evento programado no momento.</p>
          ) : (
            <>
              <div className="eventos-list">
                {events.slice(0, 4).map(ev => (
                  <Link key={ev.id} to={`/eventos/${ev.slug}`} className={`evento-card${ev.featured ? ' featured' : ''}`}>
                    {ev.featured && <div className="evento-badge">Destaque</div>}
                    <div className="evento-date">
                      <span className="evento-day">{ev.day}</span>
                      <span className="evento-month">{ev.month}</span>
                    </div>
                    <div className="evento-content">
                      <h3>{ev.title}</h3>
                      <p className="evento-time">{ev.timeRange}</p>
                      {ev.location && <p className="evento-location">📍 {ev.location}</p>}
                      {ev.description && <p className="evento-description">{ev.description}</p>}
                      <span className="evento-link">
                        {ev.featured ? 'Veja Mais' : 'Mais Informações'} →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link to="/agenda" className="btn btn-primary">Ver agenda completa</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sobre Section */}
      <section className="sobre-section" id="federacao">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">O que é KENREN</h2>
            <div className="title-underline"></div>
          </div>
          <div className="sobre-content">
            <div className="sobre-text">
              <p>Fundada em 1966, a KENREN é uma entidade que visa incentivar e apoiar os imigrantes japoneses, preservar e divulgar a cultura japonesa, fortalecer os kenjinkais das 47 províncias.</p>
              <p>A federação trabalha para manter viva a tradição e os valores culturais japoneses no Brasil, promovendo eventos, atividades culturais e fortalecendo os laços entre as comunidades.</p>
            </div>
            <div className="sobre-image">
              <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80" alt="Cultura Japonesa no Brasil" />
            </div>
          </div>
        </div>
      </section>

      {/* Atividades Section */}
      <section className="atividades-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Atividades KENREN</h2>
            <div className="title-underline"></div>
          </div>
          <p className="atividades-intro">A KENREN é a Federação das Associações de Províncias do Japão no Brasil — entidade que reúne e coordena os kenjinkais das 47 províncias dentro da comunidade nipo-brasileira.</p>
          <div className="atividades-grid">
            <div className="atividade-card">
              <div className="atividade-icon">🤝</div>
              <div className="atividade-content">
                <h3>Coordenação dos Kenjinkais</h3>
                <p>Atua como entidade "guarda-chuva" das 47 províncias, integrando agendas, ações, colaboração e representação institucional das associações provinciais.</p>
              </div>
            </div>
            <div className="atividade-card">
              <div className="atividade-icon">🎌</div>
              <div className="atividade-content">
                <h3>Festival do Japão</h3>
                <p>Carro-chefe da federação: organiza, em São Paulo, o maior evento de cultura japonesa da América Latina.</p>
              </div>
            </div>
            <div className="atividade-card">
              <div className="atividade-icon">🌸</div>
              <div className="atividade-content">
                <h3>Cultura, Memória e Tradições</h3>
                <p>Preserva e divulga as tradições japonesas para as novas gerações e mantém viva a memória da imigração, incluindo iniciativas e memoriais.</p>
              </div>
            </div>
            <div className="atividade-card">
              <div className="atividade-icon">🫂</div>
              <div className="atividade-content">
                <h3>Apoio à Comunidade</h3>
                <p>Articulação histórica de suporte às famílias de imigrantes e à organização comunitária nipo-brasileira.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kenjinkais Section */}
      <section className="kenjinkais-section" id="kenjinkais">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Kenjinkais</h2>
            <div className="title-underline"></div>
          </div>
          <div className="kenjinkais-content">
            <p className="kenjinkais-intro">Os Kenjinkais são associações formadas por pessoas originárias da mesma província do Japão. A KENREN reúne e fortalece os kenjinkais das 47 províncias japonesas no Brasil.</p>
            <div className="kenjinkais-grid">
              <div className="kenjinkai-item">
                <div className="kenjinkai-icon">都</div>
                <h4>Tokyo</h4>
              </div>
              <div className="kenjinkai-item">
                <div className="kenjinkai-icon">府</div>
                <h4>Osaka</h4>
              </div>
              <div className="kenjinkai-item">
                <div className="kenjinkai-icon">県</div>
                <h4>Kyoto</h4>
              </div>
              <div className="kenjinkai-item">
                <div className="kenjinkai-icon">県</div>
                <h4>Hokkaido</h4>
              </div>
              <div className="kenjinkai-item">
                <div className="kenjinkai-icon">県</div>
                <h4>Okinawa</h4>
              </div>
              <div className="kenjinkai-item">
                <div className="kenjinkai-icon">県</div>
                <h4>E mais 41 províncias</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monumentos Section */}
      <MonumentosSection />

      {/* Contato Section */}
      <section className="contato-section" id="contato">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Contate-nos</h2>
            <div className="title-underline"></div>
          </div>
          <div className="contato-wrapper">
            <div className="contato-info">
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h4>ENDEREÇO</h4>
                  <p>R. São Joaquim, 381 - 51 - Liberdade<br />São Paulo - SP, CEP: 01508-001</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div className="info-content">
                  <h4>EMAIL</h4>
                  <p>info@kenren.org.br</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <h4>TELEFONE</h4>
                  <p>(11) 3277-8569</p>
                  <p>Cel.: (11) 95071-1475</p>
                  <p>Cel.: (11) 91170-5963</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🌐</div>
                <div className="info-content">
                  <h4>REDES SOCIAIS</h4>
                  <div className="social-links">
                    <a href="#" className="social-link" aria-label="Facebook">Facebook</a>
                    <a href="#" className="social-link" aria-label="Instagram">Instagram</a>
                    <a href="#" className="social-link" aria-label="Twitter">Twitter</a>
                    <a href="#" className="social-link" aria-label="LinkedIn">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="contato-form">
              <form ref={formRef} onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input type="text" name="nome" placeholder="Nome" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" name="telefone" placeholder="Telefone" />
                </div>
                <div className="form-group">
                  <textarea name="mensagem" rows="5" placeholder="Mensagem" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>
              </form>
              {formMessage && (
                <div className={`form-message${formMessage.type ? ` ${formMessage.type}` : ''}`} style={{ display: 'block' }}>
                  {formMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
