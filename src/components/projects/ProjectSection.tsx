import { LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';

import { EcosystemGraph } from '../graph/EcosystemGraph';
import type { ProjectSection as ProjectSectionDefinition } from '../../types/site';
import { cardReveal, viewport } from '../../utils/motion';
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
        className="psec psec--locked t-frame"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={cardReveal}
      >
        <LockKeyhole size={14} />
        <span className="text-red">[{sectionIndex}]</span>
        <span className="eyebrow">owner surface</span>
        <h3>{section.title}</h3>
        <p className="muted">{section.description}</p>
      </motion.section>
    );
  }

  if (section.type === 'embed') {
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={cardReveal}
      >
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

  if (section.type === 'graph') {
    return (
      <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={cardReveal}>
        <EcosystemGraph />
      </motion.div>
    );
  }

  return (
    <motion.section
      className="psec t-frame"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={cardReveal}
    >
      <div className="psec__head">
        <span className="text-red">[{sectionIndex}]</span>
        <h3>{section.title}</h3>
      </div>
      <p className="muted">{section.description}</p>

      {section.type === 'narrative' ? (
        <div className="psec__narrative">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {section.type === 'bullets' ? (
        <div className="psec__items">
          {section.items.map((item) => (
            <div key={item} className="psec__item">
              <span className="text-teal">*</span> {item}
            </div>
          ))}
        </div>
      ) : null}

      {section.type === 'metrics' ? (
        <div className="psec__metrics">
          {section.metrics.map((metric) => (
            <div key={metric.label} className="t-frame t-frame--sunken psec__metric">
              <span className="eyebrow">{metric.label}</span>
              <h4>{metric.value}</h4>
              {metric.detail ? <p className="muted">{metric.detail}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {section.type === 'gallery' ? (
        <div className="psec__gallery">
          {section.items.map((item) => (
            <div key={item.title} className="t-frame t-frame--raised">
              {item.eyebrow ? <span className="eyebrow">{item.eyebrow}</span> : null}
              <h4>{item.title}</h4>
              <p className="muted">{item.description}</p>
            </div>
          ))}
        </div>
      ) : null}

      {section.type === 'code' ? (
        <div className="psec__code">
          <div className="psec__code-head">
            <span>{section.filename}</span>
            <span>{section.language}</span>
          </div>
          <pre>
            <code>{section.code}</code>
          </pre>
          {section.notes?.length ? (
            <div className="psec__items">
              {section.notes.map((note) => (
                <div key={note} className="psec__item">
                  <span className="text-teal">*</span> {note}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </motion.section>
  );
};
