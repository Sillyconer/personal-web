import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Lock, LogOut } from 'lucide-react';

import { PageTransition } from '../effects/PageTransition';
import { navigation } from '../../config/navigation';
import { siteProfile } from '../../data/site';
import { useAuthStore } from '../../store/useAuthStore';
import './AppShell.css';

export const AppShell = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const currentPage = navigation.find((n) => n.to === location.pathname)?.label ?? 'home';

  return (
    <div className="shell">
      {/* ── Title bar ── */}
      <header className="shell__titlebar">
        <div className="shell__dots">
          <span className="shell__dot shell__dot--r" />
          <span className="shell__dot shell__dot--y" />
          <span className="shell__dot shell__dot--g" />
        </div>

        <NavLink to="/" className="shell__title">
          {siteProfile.name.toLowerCase()}@portfolio:~/{currentPage.toLowerCase()}
        </NavLink>

        <span className="shell__version">v2.0</span>
      </header>

      {/* ── Nav bar ── */}
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

      {/* ── Main content ── */}
      <main className="shell__main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* ── Status bar ── */}
      <footer className="shell__statusbar">
        <span className="shell__status-item">
          <span className="shell__status-dot" /> online
        </span>
        <span className="shell__status-item">page: {currentPage.toLowerCase()}</span>
        <span className="shell__status-item">visitor #0002</span>
        <span className="shell__status-item shell__status-right">
          {siteProfile.name.toLowerCase()} — hand-built portfolio terminal
        </span>
      </footer>
    </div>
  );
};
