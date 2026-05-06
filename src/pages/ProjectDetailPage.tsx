import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { ProjectSection } from '../components/projects/ProjectSection';
import { useAuthStore } from '../store/useAuthStore';
import { cardReveal, sectionReveal, staggerGroup, viewport } from '../utils/motion';
import { getProjectBySlug } from '../utils/projects';
import { hasPrivateProjectSections } from '../utils/projects';
import './ProjectDetailPage.css';

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const visibleLinks = project.links.filter((link) => !link.ownerOnly || isAuthenticated);
  const mapperEmbedNote =
    project.slug === 'mapper'
      ? 'Mapper currently points at a local development URL. Add an embed-safe deploy or dedicated embed route next.'
      : null;

  return (
    <div className="project-detail-page">
      <motion.section className="surface-panel project-hero" initial="hidden" animate="show" variants={staggerGroup}>
        <div className="project-hero__top">
          <Link to="/work" className="inline-link">
            <ArrowLeft size={16} />
            Back to work
          </Link>
          <div className="chip-row project-chip-row">
            <span className="project-pill status-chip">{project.status}</span>
            <span className="project-pill status-chip">{project.type}</span>
            {hasPrivateProjectSections(project) ? <span className="project-pill status-chip">owner surfaces</span> : null}
          </div>
        </div>

        <div className="project-hero__content">
          <div className="content-cluster">
            <p className="eyebrow">{project.year}</p>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <p className="project-outcome">{project.outcome}</p>
            <div className="detail-list surface-faint">
              <div>
                <span className="eyebrow">Roles</span>
                <p>{project.roles.join(' · ')}</p>
              </div>
              <div>
                <span className="eyebrow">Services</span>
                <p>{project.services.join(' · ')}</p>
              </div>
              <div>
                <span className="eyebrow">Best for</span>
                <p>{project.idealFor.join(' · ')}</p>
              </div>
            </div>

            <div className="project-links">
              {visibleLinks.map((link) => (
                <a key={link.label} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined} className="inline-link">
                  {link.label}
                  {link.external ? <ArrowUpRight size={16} /> : null}
                </a>
              ))}
            </div>
          </div>
          <div className="surface-subpanel project-sidebar">
            <Sparkles size={18} />
            <h3>{project.tagline}</h3>
            <p>{project.summary}</p>
            <div className="stack-list">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="metric-strip project-metrics" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {project.metrics.map((metric) => (
          <motion.article key={metric.label} className="surface-panel stat-card" variants={cardReveal} whileHover={{ y: -6, rotate: -0.8 }}>
            <p className="eyebrow">{metric.label}</p>
            <h2>{metric.value}</h2>
            {metric.detail ? <p className="muted">{metric.detail}</p> : null}
          </motion.article>
        ))}
      </motion.section>

      {mapperEmbedNote ? (
        <motion.div className="surface-panel mapper-note" initial="hidden" whileInView="show" viewport={viewport} variants={sectionReveal}>
          {mapperEmbedNote}
        </motion.div>
      ) : null}

      <div className="project-section-stack">
        {project.sections.map((section, index) => (
          <ProjectSection key={section.id} section={section} isAuthenticated={isAuthenticated} index={index} />
        ))}
      </div>
    </div>
  );
};
