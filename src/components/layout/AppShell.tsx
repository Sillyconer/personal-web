import { Outlet, NavLink } from 'react-router-dom';
import { ArrowUpRight, Lock, LogOut, Mail, MapPinned, Sparkles, Star } from 'lucide-react';

import { PageTransition } from '../effects/PageTransition';
import { navigation } from '../../config/navigation';
import { siteProfile } from '../../data/site';
import { useAuthStore } from '../../store/useAuthStore';
import './AppShell.css';

const shellTickerItems = [
  'frontend systems',
  'retro web atmosphere',
  'maps + media',
  'product case studies',
  'open for selected work',
  'portfolio ecosystem',
];

const footerGardenLinks = [
  { label: 'work archive', to: '/work' },
  { label: 'about page', to: '/about' },
  { label: 'contact desk', to: '/contact' },
];

export const AppShell = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="app-shell">
      <header className="app-header surface-panel">
        <div className="app-header__topline">
          <p className="app-header__stamp">best viewed now // hand-built // no template energy allowed</p>
          <div className="app-status">
            <span className="app-status__dot" aria-hidden="true" />
            <span>Open for selected frontend, product UI, and portfolio ecosystem work.</span>
          </div>
        </div>

        <div className="app-header__core">
          <NavLink to="/" className="brand-block">
            <div className="brand-mark">
              <MapPinned size={18} />
            </div>
            <div className="brand-meta">
              <div>
                <p className="eyebrow">Neighbourhood atlas / v2</p>
                <h1>{siteProfile.name}</h1>
              </div>
              <span className="brand-note">A hand-built portfolio world for product work, flagship experiments, and the ecosystem around them.</span>
            </div>
          </NavLink>

          <div className="brand-souvenirs" aria-label="Site badges">
            <span className="souvenir-chip">
              <Star size={14} /> guestbook energy
            </span>
            <span className="souvenir-chip">
              <Sparkles size={14} /> case study archive
            </span>
            <span className="souvenir-chip">
              <Mail size={14} /> available now
            </span>
          </div>
        </div>

        <div className="app-marquee" aria-hidden="true">
          <div className="app-marquee__track">
            {[...shellTickerItems, ...shellTickerItems].map((item, index) => (
              <span key={`${item}-${index}`} className="app-marquee__item">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="app-header__navline">
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
            <NavLink to="/contact" className="header-chip header-chip--primary">
              Let&apos;s work together
              <ArrowUpRight size={16} />
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/studio" className="header-chip">
                  <Lock size={16} />
                  Studio
                </NavLink>
                <button type="button" className="header-chip" onClick={logout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="header-chip">
                <Lock size={16} />
                Owner access
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <footer className="app-footer">
        <section className="footer-summary surface-panel">
          <div className="panel-head">
            <span className="eyebrow">Signal note</span>
            <h2>Retro shell outside, serious product thinking underneath</h2>
            <p>
              The portfolio leans into internet-personal atmosphere, but the structure stays client-friendly: flagship work
              first, sharper case studies, and room for the wider ecosystem without turning into clutter.
            </p>
          </div>
          <div className="footer-summary__meta">
            <p className="footer-note">Built to feel like a place, not a dashboard. Good for products that need a point of view.</p>
            <NavLink to="/work" className="inline-link">
              Explore the work
              <ArrowUpRight size={16} />
            </NavLink>
          </div>
        </section>

        <section className="footer-garden surface-panel">
          <div className="panel-head">
            <span className="eyebrow">Link garden</span>
            <h2>Quick exits and side doors</h2>
            <p>Old personal sites always had a little garden of links. This one just happens to lead into a better organized system.</p>
          </div>

          <div className="footer-garden__links">
            {footerGardenLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className="garden-link">
                {item.label}
              </NavLink>
            ))}
            <a href={siteProfile.githubUrl} target="_blank" rel="noreferrer" className="garden-link">
              github outpost
            </a>
          </div>

          <p className="footer-counter">visitor no. 0002 // handmade portfolio world // signal atlas build</p>
        </section>
      </footer>
    </div>
  );
};
