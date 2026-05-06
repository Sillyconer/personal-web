import { Link, Navigate } from 'react-router-dom';
import { FolderPlus, LockKeyhole, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { projects } from '../data/projects';
import { projectIngestionSteps, studioChecklist } from '../data/site';
import { useAuthStore } from '../store/useAuthStore';
import { cardReveal, sectionReveal, staggerGroup, viewport } from '../utils/motion';
import { hasPrivateProjectSections } from '../utils/projects';
import './StudioPage.css';

export const StudioPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profile = useAuthStore((state) => state.profile);
  const mode = useAuthStore((state) => state.mode);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const liveCount = projects.filter((project) => project.status === 'live').length;
  const privateCount = projects.filter((project) => hasPrivateProjectSections(project)).length;

  return (
    <div className="page-stack studio-page">
      <motion.section className="page-hero studio-hero surface-panel" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="content-cluster" variants={sectionReveal}>
          <p className="eyebrow">studio</p>
          <h1>Private control surface for the ecosystem</h1>
          <p>
            Public routes get the personality. Studio gets the maintenance notes, private surfaces, and future operations. Same world, different room.
          </p>
        </motion.div>

        <motion.div className="studio-badges" variants={cardReveal}>
          <span>{profile?.displayName ?? 'Owner'}</span>
          <span>{profile?.role ?? 'Private access'}</span>
          <span>{mode} auth mode</span>
        </motion.div>
      </motion.section>

      <motion.section className="metric-strip" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.article className="surface-panel stat-card" variants={cardReveal}>
          <p className="eyebrow">Projects</p>
          <h2>{projects.length}</h2>
          <p className="muted">Tracked in the new per-project content structure.</p>
        </motion.article>
        <motion.article className="surface-panel stat-card" variants={cardReveal}>
          <p className="eyebrow">Live surfaces</p>
          <h2>{liveCount}</h2>
          <p className="muted">Projects currently marked as live.</p>
        </motion.article>
        <motion.article className="surface-panel stat-card" variants={cardReveal}>
          <p className="eyebrow">Private-ready projects</p>
          <h2>{privateCount}</h2>
          <p className="muted">Projects already modeling owner-only sections.</p>
        </motion.article>
      </motion.section>

      <motion.section className="studio-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.article className="surface-panel studio-card" variants={cardReveal}>
          <div className="section-copy content-cluster">
            <FolderPlus size={18} />
            <p className="eyebrow">add a new project</p>
            <h2>Repeatable content flow</h2>
          </div>
          <div className="studio-list">
            {projectIngestionSteps.map((step, index) => (
              <article key={step} className="surface-faint studio-list-item">
                <span className="studio-list-item__index">0{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </motion.article>

        <motion.article className="surface-panel studio-card" variants={cardReveal}>
          <div className="section-copy content-cluster">
            <LockKeyhole size={18} />
            <p className="eyebrow">before production</p>
            <h2>Hardening checklist</h2>
          </div>
          <div className="studio-list">
            {studioChecklist.map((item, index) => (
              <article key={item} className="surface-faint studio-list-item">
                <span className="studio-list-item__index">0{index + 1}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </motion.article>
      </motion.section>

      <motion.section className="surface-panel studio-projects" initial="hidden" whileInView="show" viewport={viewport} variants={sectionReveal}>
        <div className="section-head">
          <div className="section-copy content-cluster">
            <p className="eyebrow">registry</p>
            <h2>Tracked projects</h2>
            <p>Use this as the management view until a fuller studio admin layer exists.</p>
          </div>
          <Link to="/work" className="inline-link">
            Open public work index
          </Link>
        </div>

        <div className="studio-project-grid">
          {projects.map((project) => (
            <motion.article key={project.slug} className="studio-project surface-faint" variants={cardReveal} whileHover={{ y: -5, rotate: -0.8 }}>
              <div className="content-cluster">
                <p className="eyebrow">{project.status}</p>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>
              <div className="studio-project__meta">
                <span>{project.sections.length} sections</span>
                {hasPrivateProjectSections(project) ? <span>private surfaces</span> : null}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="studio-note surface-subpanel">
          <Sparkles size={18} />
          <p>The next logical upgrade is real auth plus a content backend so studio actions can edit project data instead of just describing the workflow.</p>
        </div>
      </motion.section>
    </div>
  );
};
