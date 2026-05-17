import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollShadow, setScrollShadow] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleScroll = useCallback(() => {
    setScrollShadow(window.pageYOffset > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleAnchorClick = (e, hash) => {
    if (isHome) {
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
    closeMenu();
  };

  return (
    <header
      className="header"
      id="header"
      style={{ boxShadow: scrollShadow ? '0 4px 6px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <div className="logo-container">
              <Link to="/" className="logo">
                <img src={`${import.meta.env.BASE_URL}assets/logo_kenren.png`} alt="KENREN Logo" className="logo-img" />
              </Link>
            </div>
            <button
              className={`mobile-menu-toggle${menuOpen ? ' active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <ul className={`nav-menu${menuOpen ? ' active' : ''}`} id="navMenu">
              <li>
                {isHome ? (
                  <a href="#home" className={`nav-link${isHome ? ' active' : ''}`} onClick={(e) => handleAnchorClick(e, '#home')}>HOME</a>
                ) : (
                  <Link to="/" className="nav-link" onClick={closeMenu}>HOME</Link>
                )}
              </li>
              <li className="dropdown">
                {isHome ? (
                  <a href="#federacao" className="nav-link" onClick={(e) => handleAnchorClick(e, '#federacao')}>
                    FEDERAÇÃO <span className="dropdown-arrow">▼</span>
                  </a>
                ) : (
                  <Link to="/#federacao" className="nav-link" onClick={closeMenu}>
                    FEDERAÇÃO <span className="dropdown-arrow">▼</span>
                  </Link>
                )}
                <ul className="dropdown-menu">
                  <li>
                    {isHome ? (
                      <a href="#federacao" onClick={(e) => handleAnchorClick(e, '#federacao')}>O que é Kenren</a>
                    ) : (
                      <Link to="/#federacao" onClick={closeMenu}>O que é Kenren</Link>
                    )}
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  to="/kenjinkais"
                  className={`nav-link${location.pathname === '/kenjinkais' ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  KENJINKAIS
                </Link>
              </li>
              <li>
                {isHome ? (
                  <a href="#monumentos" className="nav-link" onClick={(e) => handleAnchorClick(e, '#monumentos')}>MONUMENTOS</a>
                ) : (
                  <Link to="/#monumentos" className="nav-link" onClick={closeMenu}>MONUMENTOS</Link>
                )}
              </li>
              <li>
                {isHome ? (
                  <a href="#eventos" className="nav-link" onClick={(e) => handleAnchorClick(e, '#eventos')}>EVENTOS</a>
                ) : (
                  <Link to="/#eventos" className="nav-link" onClick={closeMenu}>EVENTOS</Link>
                )}
              </li>
              <li>
                <Link
                  to="/noticias"
                  className={`nav-link${location.pathname === '/noticias' ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  NOTÍCIAS
                </Link>
              </li>
              <li>
                <Link
                  to="/transparencia"
                  className={`nav-link${location.pathname === '/transparencia' ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  TRANSPARÊNCIA
                </Link>
              </li>
              <li>
                {isHome ? (
                  <a href="#contato" className="nav-link" onClick={(e) => handleAnchorClick(e, '#contato')}>CONTATO</a>
                ) : (
                  <Link to="/#contato" className="nav-link" onClick={closeMenu}>CONTATO</Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
