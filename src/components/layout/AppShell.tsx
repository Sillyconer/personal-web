import { useEffect, type CSSProperties } from 'react';
import { NavLink, useLocation, useOutlet } from 'react-router-dom';
import { Lock, LogOut } from 'lucide-react';

import { PageTransition } from '../effects/PageTransition';
import { getCartridgeByPath } from '../../config/cartridges';
import { navigation } from '../../config/navigation';
import { siteProfile } from '../../data/site';
import { useAuthStore } from '../../store/useAuthStore';
import './AppShell.css';

export const AppShell = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const outlet = useOutlet();
  const cartridge = getCartridgeByPath(location.pathname);

  const currentPage =
    navigation.find((n) => n.to === location.pathname)?.label ??
    location.pathname.split('/').filter(Boolean).pop() ??
    'home';

  useEffect(() => {
    document.documentElement.dataset.cartridge = cartridge.id;

    return () => {
      delete document.documentElement.dataset.cartridge;
    };
  }, [cartridge.id]);

  const shellStyle: CSSProperties = {
    ['--shell-tint-a' as string]: cartridge.vars.shellTintA,
    ['--shell-tint-b' as string]: cartridge.vars.shellTintB,
    ['--shell-tint-c' as string]: cartridge.vars.shellTintC,
    ['--shell-panel-start' as string]: cartridge.vars.panelStart,
    ['--shell-panel-end' as string]: cartridge.vars.panelEnd,
    ['--shell-accent' as string]: cartridge.vars.accent,
    ['--shell-accent-soft' as string]: cartridge.vars.accentSoft,
    ['--shell-accent-alt' as string]: cartridge.vars.accentAlt,
    ['--transition-primary' as string]: cartridge.vars.transitionPrimary,
    ['--transition-secondary' as string]: cartridge.vars.transitionSecondary,
  };

  return (
    <div className="shell" data-cartridge={cartridge.id} style={shellStyle}>
      <header className="shell__titlebar">
        <div className="shell__dots">
          <span className="shell__dot shell__dot--r" />
          <span className="shell__dot shell__dot--y" />
          <span className="shell__dot shell__dot--g" />
        </div>

        <NavLink to="/" className="shell__title">
          {siteProfile.name.toLowerCase()} :: {cartridge.shellTitle.toLowerCase()} :: {currentPage.toLowerCase()}
        </NavLink>

        <span className="shell__version">aap-64 / crt / {cartridge.id}</span>
      </header>

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
          {cartridge.footer}
        </span>
      </footer>
    </div>
  );
};
