import { LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';

import type { ProjectSection as ProjectSectionDefinition } from '../../types/site';
import { cardReveal, motionEase, viewport } from '../../utils/motion';
import { ProjectEmbed } from './ProjectEmbed';
import './ProjectSection.css';

interface ProjectSectionProps {
  section: ProjectSectionDefinition;
  isAuthenticated: boolean;
  index: number;
}

export const ProjectSection = ({ section, isAuthenticated, index }: ProjectSectionProps) => {
  const sectionIndex = String(index + 1).padStart(2, '0');

  if (section.ownerOnly && !isAuthenticated) {
    return (
      <motion.section
        className="project-section project-section--locked surface-panel"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={cardReveal}
        whileHover={{ y: -6, rotate: -0.7, transition: { duration: 0.2, ease: motionEase } }}
      >
        <div className="project-section__index">{sectionIndex}</div>
        <LockKeyhole size={18} />
        <div className="content-cluster">
          <p className="eyebrow">owner surface</p>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </div>
      </motion.section>
    );
  }

  if (section.type === 'embed') {
    return (
      <motion.div
        className="project-embed-wrap"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={cardReveal}
      >
        <div className="project-section__index project-section__index--floating">{sectionIndex}</div>
        <ProjectEmbed
          title={section.title}
          description={section.description}
          url={section.embedUrl}
          height={section.embedHeight}
          ctaLabel={section.ctaLabel}
        />
      </motion.div>
    );
  }

  return (
    <motion.section
      className="project-section surface-panel"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={cardReveal}
      whileHover={{ y: -6, rotate: -0.6, transition: { duration: 0.2, ease: motionEase } }}
    >
      <div className="project-section__header content-cluster">
        <div className="project-section__eyebrow-row">
          <div className="project-section__index">{sectionIndex}</div>
          <p className="eyebrow">section</p>
        </div>
        <h3>{section.title}</h3>
        <p>{section.description}</p>
      </div>

      {section.type === 'narrative' ? (
        <div className="project-section__narrative content-cluster">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {section.type === 'bullets' ? (
        <div className="project-section__bullet-grid">
          {section.items.map((item) => (
            <article key={item} className="project-section__bullet surface-faint">
              {item}
            </article>
          ))}
        </div>
      ) : null}

      {section.type === 'metrics' ? (
        <div className="project-section__metrics">
          {section.metrics.map((metric) => (
            <article key={metric.label} className="project-section__metric surface-faint">
              <p className="eyebrow">{metric.label}</p>
              <h4>{metric.value}</h4>
              {metric.detail ? <p>{metric.detail}</p> : null}
            </article>
          ))}
        </div>
      ) : null}

      {section.type === 'gallery' ? (
        <div className="project-section__gallery">
          {section.items.map((item) => (
            <article key={item.title} className="project-section__gallery-item surface-faint">
              {item.eyebrow ? <p className="eyebrow">{item.eyebrow}</p> : null}
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      ) : null}
    </motion.section>
  );
};
