import { NavLink, useLocation, useOutlet } from 'react-router-dom';
import { Lock, LogOut, Sparkles, Star } from 'lucide-react';

import { PageTransition } from '../effects/PageTransition';
import { navigation } from '../../config/navigation';
import { siteProfile } from '../../data/site';
import { useAuthStore } from '../../store/useAuthStore';
import './AppShell.css';

export const AppShell = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const outlet = useOutlet();

  const currentPage = navigation.find((n) => n.to === location.pathname)?.label ?? 'home';

  return (
    <div className="shell">
      <header className="shell__titlebar">
        <div className="shell__dots">
          <span className="shell__dot shell__dot--r" />
          <span className="shell__dot shell__dot--y" />
          <span className="shell__dot shell__dot--g" />
        </div>

        <NavLink to="/" className="shell__title">
          {siteProfile.name.toLowerCase()} :: dream cartridge :: {currentPage.toLowerCase()}
        </NavLink>

        <span className="shell__version">aap-64 / crt / v2.0</span>
      </header>

      <section className="shell__hero-strip">
        <div className="shell__hero-copy">
          <p className="eyebrow">pixel playground</p>
          <strong>{siteProfile.title}</strong>
        </div>
        <div className="shell__hero-badges">
          <span className="px-tag px-tag--yellow"><Star size={10} /> whimsical crt</span>
          <span className="px-tag px-tag--teal"><Sparkles size={10} /> handmade world</span>
        </div>
      </section>

      <nav className="shell__nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `shell__nav-btn ${isActive ? 'shell__nav-btn--active' : ''}`}
          >
            {item.label.toLowerCase()}
          </NavLink>
        ))}

        <div className="shell__nav-spacer" />

        {isAuthenticated ? (
          <>
            <NavLink to="/studio" className={({ isActive }) => `shell__nav-btn ${isActive ? 'shell__nav-btn--active' : ''}`}>
              <Lock size={12} /> studio
            </NavLink>
            <button type="button" className="shell__nav-btn" onClick={logout}>
              <LogOut size={12} /> logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="shell__nav-btn">
            <Lock size={12} /> access
          </NavLink>
        )}
      </nav>

      <main className="shell__main">
        <PageTransition routeKey={location.pathname}>
          {outlet}
        </PageTransition>
      </main>

      <footer className="shell__statusbar">
        <span className="shell__status-item">
          <span className="shell__status-dot" /> online
        </span>
        <span className="shell__status-item">page: {currentPage.toLowerCase()}</span>
        <span className="shell__status-item">visitor #0002</span>
        <span className="shell__status-item shell__status-right">
          {siteProfile.name.toLowerCase()} - whimsical pixel-art portfolio world
        </span>
      </footer>
    </div>
  );
};
