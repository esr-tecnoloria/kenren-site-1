import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const heroSlides = [
  { src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=90', alt: 'Templo Japonês' },
  { src: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&q=90', alt: 'Cerejeiras do Japão' },
  { src: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=90', alt: 'Monte Fuji' },
];

export default function HomePage() {
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
      img.src = slide.src;
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
            <div key={index} className={getSlideClassName(index)}>
              <img src={slide.src} alt={slide.alt} className="hero-bg-img" loading="eager" />
              <div className="hero-overlay"></div>
            </div>
          ))}
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-logo-watermark">
              <img src={`${import.meta.env.BASE_URL}assets/logo_kenren.png`} alt="KENREN Logo" className="hero-logo-img" />
            </div>
            <p className="hero-subtitle">Federação das Associações de Províncias do Japão no Brasil</p>
            <p className="hero-description">Fundada em 1966, a KENREN é uma entidade que visa incentivar e apoiar os emigrantes japoneses, preservar e divulgar a cultura japonesa, fortalecer os kenjinkais das 47 províncias.</p>
            <a href="#federacao" className="btn btn-primary" onClick={handleAnchorClick}>Saiba Mais</a>
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

      {/* Eventos Section */}
      <section className="eventos-section" id="eventos">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Agenda de Eventos</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Não perca os eventos dos Kenjinkais!</p>
          </div>
          <div className="eventos-list">
            <div className="evento-card">
              <div className="evento-date">
                <span className="evento-day">26</span>
                <span className="evento-month">JAN</span>
              </div>
              <div className="evento-content">
                <h3>YAKISOBA KENJINKAI</h3>
                <p className="evento-time">11:00 – 17:00</p>
                <p className="evento-location">📍 Indaiatuba, R. Goiás - Cidade Nova II, Indaiatuba - SP</p>
                <a href="#" className="evento-link">Mais Informações</a>
              </div>
            </div>
            <div className="evento-card featured">
              <div className="evento-badge">Destaque</div>
              <div className="evento-date">
                <span className="evento-day">10</span>
                <span className="evento-month">JUL</span>
              </div>
              <div className="evento-content">
                <h3>FESTIVAL JAPÃO 2026</h3>
                <p className="evento-time">11:00 – 21:00</p>
                <p className="evento-location">📍 São Paulo Expo, Rod. dos Imigrantes, 1 - 5 km - Vila Água Funda, São Paulo - SP</p>
                <p className="evento-description">O maior evento de cultura japonesa da América Latina chega à sua 27ª edição, reunindo tradições, gastronomia, arte e tecnologia em um só lugar.</p>
                <a href="#" className="evento-link">Veja Mais</a>
              </div>
            </div>
          </div>
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
              <p>Fundada em 1966, a KENREN é uma entidade que visa incentivar e apoiar os emigrantes japoneses, preservar e divulgar a cultura japonesa, fortalecer os kenjinkais das 47 províncias.</p>
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
          <div className="atividades-grid">
            <div className="atividade-card">
              <div className="atividade-image">
                <img src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80" alt="Memorial Ireihi" />
              </div>
              <div className="atividade-content">
                <h3>Memorial Ireihi</h3>
                <p>Construção do Memorial em Homenagem aos Imigrantes Pioneiros Falecidos - Ireihi (Parque Ibirapuera / SP)</p>
              </div>
            </div>
            <div className="atividade-card">
              <div className="atividade-image">
                <img src={`${import.meta.env.BASE_URL}assets/images/monumento_desembarque.jpg`} alt="Monumento do Desembarque" />
              </div>
              <div className="atividade-content">
                <h3>Monumento do Desembarque</h3>
                <p>De 18 de junho de 1908, quando a primeira leva de imigrantes desembarcou no porto de Santos, do Kasato Maru, até 27 de março de 1973, aproximadamente 240.000 japoneses migraram-se para Brasil.</p>
                <p>Foi sugerida a construção do Monumento do Desembarque de Imigrantes Japoneses em Santos, na ocasião do 90º. Aniversário da Imigração Japonesa, local considerado como ponto de origem da imigração japonesa ao Brasil.</p>
                <p>Em 21 de junho de 1998, o Monumento foi solenemente inaugurado na Ponta da Praia.</p>
              </div>
            </div>
            <div className="atividade-card">
              <div className="atividade-image">
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80" alt="Festival do Japão" />
              </div>
              <div className="atividade-content">
                <h3>Festival do Japão</h3>
                <p>Festival do Japão (Expo / SP) - O maior evento de cultura japonesa da América Latina</p>
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
      <section className="monumentos-section" id="monumentos">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Monumentos</h2>
            <div className="title-underline"></div>
          </div>
          <div className="monumentos-grid">
            <div className="monumento-card">
              <img src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80" alt="Memorial Ireihi" />
              <div className="monumento-info">
                <h3>Memorial Ireihi</h3>
                <p className="monumento-location">📍 Parque Ibirapuera, São Paulo - SP</p>
                <p>Memorial em Homenagem aos Imigrantes Pioneiros Falecidos, localizado no coração do Parque Ibirapuera.</p>
              </div>
            </div>
            <div className="monumento-card">
              <img src={`${import.meta.env.BASE_URL}assets/images/monumento_desembarque.jpg`} alt="Monumento do Desembarque" />
              <div className="monumento-info">
                <h3>Monumento do Desembarque</h3>
                <p className="monumento-location">📍 Santos, São Paulo - SP</p>
                <p>De 18 de junho de 1908, quando a primeira leva de imigrantes desembarcou no porto de Santos, do Kasato Maru, até 27 de março de 1973, aproximadamente 240.000 japoneses migraram-se para Brasil.</p>
                <p>Foi sugerida a construção do Monumento do Desembarque de Imigrantes Japoneses em Santos, na ocasião do 90º. Aniversário da Imigração Japonesa, local considerado como ponto de origem da imigração japonesa ao Brasil.</p>
                <p>Em 21 de junho de 1998, o Monumento foi solenemente inaugurado na Ponta da Praia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <p>Av. Bernardino de Campos, 98<br />SP - CEP: 12345-678</p>
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
                  <p>(11) 3456-7890</p>
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
