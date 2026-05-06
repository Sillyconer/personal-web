import { Link } from 'react-router-dom';
import { ArrowUpRight, RadioTower } from 'lucide-react';

import type { ProjectDefinition } from '../../types/site';
import './ProjectCard.css';

export const ProjectCard = ({ project }: { project: ProjectDefinition }) => {
  return (
    <article className="project-card surface-panel">
      <div className="project-card__head">
        <div>
          <p className="project-card__status status-chip">{project.status}</p>
          <h3>{project.name}</h3>
        </div>
        <span className="project-card__year">{project.year}</span>
      </div>

      <p className="project-card__tagline">{project.tagline}</p>
      <p className="project-card__summary">{project.summary}</p>

      <div className="project-card__tags">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="project-card__actions">
        <Link to={`/projects/${project.slug}`} className="project-link">
          <RadioTower size={16} />
          Open project
        </Link>
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link alt">
            <ArrowUpRight size={16} />
            Live app
          </a>
        ) : null}
      </div>
    </article>
  );
};
