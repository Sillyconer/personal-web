import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ProjectSection } from '../components/projects/ProjectSection';
import { useAuthStore } from '../store/useAuthStore';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
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
  const homageLabel =
    project.slug === 'mapper'
      ? 'zelda tribute'
      : project.slug === 'personalweb'
        ? 'street fighter tribute'
        : 'side quest tribute';

  return (
    <div className={`page-stack detail detail--${project.slug}`}>
      {/* ── Hero ── */}
      <motion.section className="detail__hero" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="detail__nav" variants={pixelReveal}>
          <Link to="/work" className="px-btn">back to archive</Link>
          <div className="flex-row">
            <span className="px-tag px-tag--teal">{project.status}</span>
            <span className="px-tag px-tag--yellow">{project.type}</span>
            {hasPrivateProjectSections(project) ? <span className="px-tag px-tag--red">owner-only</span> : null}
          </div>
        </motion.div>

        <motion.div className="detail__hero-copy" variants={pixelReveal}>
          <p className="eyebrow">world dossier / {project.slug}</p>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <p className="muted">{project.outcome}</p>
        </motion.div>

        <motion.div className="detail__world-card t-frame t-frame--raised" variants={cardReveal}>
          <p className="eyebrow">mini cartridge / {homageLabel}</p>
          <div className="detail__world-scene" aria-hidden="true">
            <div className="detail__world-layer detail__world-layer--1" />
            <div className="detail__world-layer detail__world-layer--2" />
            <div className="detail__world-marker detail__world-marker--1" />
            <div className="detail__world-marker detail__world-marker--2" />
          </div>
          <h3>{project.tagline}</h3>
          <p className="muted">{project.summary}</p>
        </motion.div>

        <motion.div className="detail__meta grid-2" variants={pixelReveal}>
          <div className="t-frame t-frame--sunken">
            <div className="detail__info-grid">
              <div><span className="text-teal">year:</span> {project.year}</div>
              <div><span className="text-teal">roles:</span> {project.roles.join(', ')}</div>
              <div><span className="text-teal">services:</span> {project.services.join(', ')}</div>
              <div><span className="text-teal">ideal for:</span> {project.idealFor.join(', ')}</div>
            </div>
          </div>

          <div className="t-frame detail__stack-card">
            <p className="eyebrow">loadout</p>
            <h3>stack + kit</h3>
            <p className="muted">The tools and frontend systems shaping this cartridge.</p>
            <div className="detail__stack">
              {project.stack.map((item) => (
                <span key={item} className="px-tag">{item}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {visibleLinks.length > 0 ? (
          <motion.div className="detail__links flex-row" variants={pixelReveal}>
            {visibleLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="px-btn"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        ) : null}
      </motion.section>

      {/* ── Metrics ── */}
      <motion.section className="detail__metrics" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {project.metrics.map((metric) => (
          <motion.div key={metric.label} className="t-frame detail__metric" variants={cardReveal}>
            <span className="eyebrow">{metric.label}</span>
            <h2>{metric.value}</h2>
            {metric.detail ? <p className="muted">{metric.detail}</p> : null}
          </motion.div>
        ))}
      </motion.section>

      {/* ── Sections ── */}
      <div className="detail__sections">
        {project.sections.map((section, index) => (
          <ProjectSection key={section.id} section={section} isAuthenticated={isAuthenticated} index={index} />
        ))}
      </div>
    </div>
  );
};
