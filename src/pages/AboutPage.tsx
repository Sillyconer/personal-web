import { Link } from 'react-router-dom';
import { NotebookTabs, ScanSearch } from 'lucide-react';
import { motion } from 'framer-motion';

import { aboutPillars, clientFitPoints, experienceHighlights, siteProfile } from '../data/site';
import { cardReveal, sectionReveal, staggerGroup, viewport } from '../utils/motion';
import './AboutPage.css';

const aboutBadges = ['profile dossier', 'frontend atlas', 'creative systems'];

export const AboutPage = () => {
  return (
    <div className="page-stack about-page">
      <motion.section className="page-hero about-hero surface-panel" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="content-cluster" variants={sectionReveal}>
          <div className="about-badges">
            {aboutBadges.map((badge) => (
              <span key={badge} className="status-chip">
                {badge}
              </span>
            ))}
          </div>
          <p className="eyebrow">about</p>
          <h1>Building frontend systems that feel considered, not assembled.</h1>
          <p>
            The work sits at the overlap of product thinking, reusable architecture, and visual direction. The aim is to make interfaces clearer, more memorable, and easier to grow over time.
          </p>
        </motion.div>

        <motion.div className="about-hero__meta surface-subpanel" variants={cardReveal}>
          <div className="about-hero__meta-head">
            <NotebookTabs size={18} />
            <p className="eyebrow">current focus</p>
          </div>
          <p>{siteProfile.availability}</p>
          <p>{siteProfile.location}</p>
        </motion.div>
      </motion.section>

      <motion.section className="cards-grid about-pillars-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {aboutPillars.map((pillar, index) => (
          <motion.article key={pillar} className={`surface-panel about-pillar about-pillar--${index + 1}`} variants={cardReveal} whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}>
            <p>{pillar}</p>
          </motion.article>
        ))}
      </motion.section>

      <motion.section className="about-story-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.article className="surface-panel about-timeline" variants={cardReveal}>
          <div className="section-copy content-cluster">
            <p className="eyebrow">trajectory</p>
            <h2>What the work is optimized for now</h2>
          </div>

          <div className="timeline-list">
            {experienceHighlights.map((item) => (
              <article key={item.title} className="timeline-item">
                <span className="timeline-label eyebrow">{item.label}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </motion.article>

        <motion.article className="surface-panel about-fit-panel" variants={cardReveal}>
          <div className="section-copy content-cluster">
            <ScanSearch size={18} />
            <p className="eyebrow">best fit</p>
            <h2>Where this approach adds the most value</h2>
          </div>

          <div className="about-fit-list">
            {clientFitPoints.map((point) => (
              <article key={point} className="surface-faint about-fit-item">
                {point}
              </article>
            ))}
          </div>

          <Link to="/contact" className="button-link">
            Talk about a project
          </Link>
        </motion.article>
      </motion.section>
    </div>
  );
};
