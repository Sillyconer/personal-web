import { Navigate } from 'react-router-dom';
import { Images, Lock, PanelsTopLeft } from 'lucide-react';

import { useAuthStore } from '../store/useAuthStore';
import './AdminPage.css';

export const AdminPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profile = useAuthStore((state) => state.profile);
  const mode = useAuthStore((state) => state.mode);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-page">
      <section className="surface-panel admin-hero">
        <p className="eyebrow">Admin</p>
        <h2>Owner control surface</h2>
        <p>
          This is the first private surface for your site. Right now it proves the owner flow and
          acts as the place where project visibility, private embeds, and future content controls can live.
        </p>
        <div className="admin-badges">
          <span>{profile?.displayName ?? 'Owner'}</span>
          <span>{profile?.role ?? 'Private access'}</span>
          <span>{mode} auth mode</span>
        </div>
      </section>

      <section className="admin-grid">
        <article className="surface-panel admin-card">
          <PanelsTopLeft size={18} />
          <h3>Project registry</h3>
          <p>Add tabs, embeds, tags, or new portfolio entries through the shared project config.</p>
        </article>

        <article className="surface-panel admin-card">
          <Images size={18} />
          <h3>Private media</h3>
          <p>Owner-only Mapper tabs can now appear on project pages when you are logged in.</p>
        </article>

        <article className="surface-panel admin-card">
          <Lock size={18} />
          <h3>Next auth step</h3>
          <p>Swap the placeholder store for real backend auth or GitHub OAuth when you are ready.</p>
        </article>

        <article className="surface-panel admin-card">
          <PanelsTopLeft size={18} />
          <h3>Embed readiness</h3>
          <p>Mapper now points at embed-mode URLs so the next step is making the embedded app hide extra chrome cleanly.</p>
        </article>
      </section>
    </div>
  );
};
