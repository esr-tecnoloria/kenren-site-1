import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribing(true);
    setTimeout(() => {
      setSubscribed(true);
      e.target.reset();
      setTimeout(() => {
        setSubscribed(false);
        setSubscribing(false);
      }, 2000);
    }, 1000);
  };

  const footerLink = (hash, label) => {
    if (isHome) {
      return <a href={hash}>{label}</a>;
    }
    return <Link to={`/${hash}`}>{label}</Link>;
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>KENREN</h4>
            <p>Federação das Associações de Províncias do Japão no Brasil</p>
          </div>
          <div className="footer-section">
            <h4>Links Rápidos</h4>
            <ul>
              <li>{isHome ? <a href="#home">Home</a> : <Link to="/">Home</Link>}</li>
              <li>{footerLink('#federacao', 'Federação')}</li>
              <li><Link to="/kenjinkais">Kenjinkais</Link></li>
              <li>{footerLink('#monumentos', 'Monumentos')}</li>
              <li>{footerLink('#eventos', 'Eventos')}</li>
              <li><Link to="/noticias">Notícias</Link></li>
              <li><Link to="/transparencia">Transparência</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Fique atualizado sobre nossos eventos e novidades</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Seu email" required />
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={subscribing}
                style={subscribed ? { background: '#28a745' } : {}}
              >
                {subscribed ? 'Inscrito!' : subscribing ? 'Inscrevendo...' : 'Inscrever-se'}
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 KENREN. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
