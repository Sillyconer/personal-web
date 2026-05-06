import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import type { ProjectDefinition } from '../../types/site';
import { cardReveal, motionEase, viewport } from '../../utils/motion';
import { getProjectLink } from '../../utils/projects';
import './ProjectCard.css';

export const ProjectCard = ({ project }: { project: ProjectDefinition }) => {
  const liveLink = getProjectLink(project, 'live');

  return (
    <motion.article
      className="project-card surface-panel"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={cardReveal}
      whileHover={{ y: -8, rotate: -1.1, transition: { duration: 0.2, ease: motionEase } }}
    >
      <div className="project-card__stamp" aria-hidden="true">
        {project.featured ? <Star size={14} /> : null}
        <span>{project.featured ? 'flagship' : 'archive'}</span>
      </div>

      <div className="project-card__top">
        <div className="project-card__chips">
          <span className="status-chip project-card__status">{project.status}</span>
          <span className="status-chip">{project.type}</span>
          <span className="status-chip">{project.year}</span>
        </div>
        <div className="project-card__title-row">
          <h3>{project.name}</h3>
          <span className="project-card__slug">/{project.slug}</span>
        </div>
        <p className="project-card__tagline">{project.tagline}</p>
        <p className="project-card__summary">{project.summary}</p>
      </div>

      <div className="project-card__meta-grid">
        <div>
          <p className="eyebrow">role</p>
          <p>{project.roles.join(' / ')}</p>
        </div>
        <div>
          <p className="eyebrow">outcome</p>
          <p>{project.outcome}</p>
        </div>
      </div>

      <div className="project-card__metrics">
        {project.metrics.slice(0, 2).map((metric) => (
          <article key={metric.label} className="project-card__metric surface-faint">
            <p className="eyebrow">{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className="project-card__tags">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="project-card__actions">
        <Link to={`/work/${project.slug}`} className="project-link project-link--primary">
          View case study
          <ArrowRight size={16} />
        </Link>
        {liveLink ? (
          <a href={liveLink.href} target="_blank" rel="noreferrer" className="project-link alt">
            <ArrowUpRight size={16} />
            Live surface
          </a>
        ) : null}
      </div>
    </motion.article>
  );
};
