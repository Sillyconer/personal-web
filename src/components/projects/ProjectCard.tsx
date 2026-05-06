import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import type { ProjectDefinition } from '../../types/site';
import { cardReveal, viewport } from '../../utils/motion';
import { getProjectLink } from '../../utils/projects';
import './ProjectCard.css';

export const ProjectCard = ({ project }: { project: ProjectDefinition }) => {
  const liveLink = getProjectLink(project, 'live');

  return (
    <motion.article
      className="pcard t-frame"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={cardReveal}
    >
      <div className="pcard__head">
        <div className="flex-row">
          <span className="px-tag px-tag--teal">{project.status}</span>
          <span className="px-tag">{project.type}</span>
          <span className="px-tag">{project.year}</span>
        </div>
        <div className="pcard__title">
          <h3>{project.name}</h3>
          <span className="text-teal pcard__slug">/{project.slug}</span>
        </div>
      </div>

      <p className="muted">{project.summary}</p>

      <div className="pcard__meta">
        <span><span className="text-teal">role:</span> {project.roles.join(', ')}</span>
        <span><span className="text-teal">outcome:</span> {project.outcome}</span>
      </div>

      <div className="pcard__tags">
        {project.tags.map((tag) => (
          <span key={tag} className="px-tag">{tag}</span>
        ))}
      </div>

      <div className="pcard__actions">
        <Link to={`/work/${project.slug}`} className="px-btn px-btn--primary">
          &gt; view case study
        </Link>
        {liveLink ? (
          <a href={liveLink.href} target="_blank" rel="noreferrer" className="px-btn">
            &gt; live
          </a>
        ) : null}
      </div>
    </motion.article>
  );
};
