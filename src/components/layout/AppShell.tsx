import { Outlet, NavLink } from 'react-router-dom';
import { Compass, Lock, MapPinned } from 'lucide-react';

import { navigation } from '../../config/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { ThemePicker } from '../theme/ThemePicker';
import './AppShell.css';

export const AppShell = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="app-shell">
      <header className="app-header surface-panel">
        <div className="brand-block">
          <div className="brand-mark">
            <MapPinned size={18} />
          </div>
          <div className="brand-meta">
            <div>
              <p className="eyebrow">Personal atlas</p>
              <h1>PersonalWeb</h1>
            </div>
            <span className="brand-note">A living CV, project launcher, and owner-ready control surface.</span>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <NavLink to="/projects/mapper" className="header-chip">
            <Compass size={16} />
            Mapper
          </NavLink>

          {isAuthenticated ? (
            <button type="button" className="header-chip" onClick={logout}>
              <Lock size={16} />
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="header-chip">
              <Lock size={16} />
              Owner Login
            </NavLink>
          )}
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <aside className="theme-dock surface-panel">
        <div className="panel-head">
          <span className="eyebrow">Theme dock</span>
          <h2>Mapper-style modes</h2>
          <p>Swap the atmosphere without changing the structure. Each mode carries its own contrast, accent balance, and tone.</p>
        </div>
        <ThemePicker />
      </aside>
    </div>
  );
};
