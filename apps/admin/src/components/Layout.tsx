import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { signOutUser } from '../lib/firebase';

export function Layout() {
  const { user } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">KENREN</div>
        <nav className="sidebar-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/hero">Hero da Home</NavLink>
          <NavLink to="/news">Notícias</NavLink>
          <NavLink to="/news-categories" className="sidebar-sub">↳ Categorias</NavLink>
          <NavLink to="/events">Eventos</NavLink>
          <NavLink to="/kenjinkais">Kenjinkais</NavLink>
          <NavLink to="/transparency">Transparência</NavLink>
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-user">{user?.email}</span>
          <button className="link-btn" onClick={() => signOutUser()}>Sair</button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
