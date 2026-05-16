import { Download, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import { aboutPillars, clientFitPoints, experienceHighlights, siteProfile } from '../data/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './CVPage.css';

const capabilityRows = [
  ['Frontend', 'React, TypeScript, routing, state, interaction systems'],
  ['Product UI', 'Information hierarchy, case-study flows, dense tool surfaces'],
  ['Creative systems', 'Retro visual language, pixel art framing, restrained motion'],
];

export const CVPage = () => {
  return (
    <div className="page-stack cv-page">
      <motion.section className="cv-hero t-frame" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="cv-hero__copy" variants={pixelReveal}>
          <p className="eyebrow">cv / professional signal</p>
          <h1>{siteProfile.title}</h1>
          <p className="cv-hero__lead">{siteProfile.mission}</p>
          <div className="cv-hero__actions">
            <a href={`mailto:${siteProfile.email}`} className="px-btn px-btn--primary">
              <Mail size={14} /> contact
            </a>
            <a href="/work" className="px-btn">
              <Download size={14} /> view work
            </a>
          </div>
        </motion.div>

        <motion.aside className="cv-hero__card t-frame t-frame--sunken" variants={cardReveal}>
          <p className="eyebrow">profile</p>
          <h2>{siteProfile.name}</h2>
          <p>{siteProfile.location}</p>
          <p className="muted">{siteProfile.availability}</p>
        </motion.aside>
      </motion.section>

      <motion.section className="cv-section" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">capability map</p>
          <h2>What I bring into product work</h2>
        </motion.div>
        <div className="cv-table t-frame">
          {capabilityRows.map(([label, value]) => (
            <motion.div key={label} className="cv-table__row" variants={cardReveal}>
              <strong>{label}</strong>
              <span>{value}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="cv-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {experienceHighlights.map((item) => (
          <motion.article key={item.title} className="t-frame cv-card" variants={cardReveal}>
            <p className="eyebrow">{item.label}</p>
            <h3>{item.title}</h3>
            <p className="muted">{item.description}</p>
          </motion.article>
        ))}
      </motion.section>

      <motion.section className="cv-section" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">working style</p>
          <h2>Useful in teams that need structure and taste</h2>
        </motion.div>
        <div className="cv-grid">
          {[...aboutPillars, ...clientFitPoints].map((point) => (
            <motion.div key={point} className="t-frame cv-card cv-card--compact" variants={cardReveal}>
              <p>{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
