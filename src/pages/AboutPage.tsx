import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { aboutPillars, clientFitPoints, experienceHighlights, siteProfile } from '../data/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './AboutPage.css';

export const AboutPage = () => {
  return (
    <div className="page-stack about">
      {/* ── Hero ── */}
      <motion.section className="about__hero" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">&gt; man dark</p>
          <h1>building frontend systems that feel considered, not assembled.</h1>
        </motion.div>

        <motion.div className="about__meta t-frame t-frame--sunken" variants={pixelReveal}>
          <p><span className="text-teal">location:</span> {siteProfile.location}</p>
          <p><span className="text-teal">status:</span> {siteProfile.availability}</p>
        </motion.div>
      </motion.section>

      {/* ── Pillars ── */}
      <motion.section
        className="about__pillars"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerGroup}
      >
        <motion.p className="eyebrow" variants={pixelReveal}>&gt; cat principles.txt</motion.p>
        <div className="about__pillar-grid">
          {aboutPillars.map((pillar) => (
            <motion.div key={pillar} className="t-frame" variants={cardReveal}>
              <p>{pillar}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Timeline ── */}
      <motion.section
        className="about__timeline t-frame t-frame--sunken"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerGroup}
      >
        <div className="t-header">
          <div className="t-header__dots">
            <span className="t-header__dot t-header__dot--r" />
            <span className="t-header__dot t-header__dot--y" />
            <span className="t-header__dot t-header__dot--g" />
          </div>
          <span>history --highlights</span>
        </div>
        <div className="about__timeline-list">
          {experienceHighlights.map((item) => (
            <motion.div key={item.title} className="about__timeline-item" variants={cardReveal}>
              <span className="text-teal">{item.label}</span>
              <div>
                <h3>{item.title}</h3>
                <p className="muted">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Best fit ── */}
      <motion.section
        className="about__fit"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerGroup}
      >
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">&gt; where this approach adds value</p>
          <h2>best fit</h2>
        </motion.div>

        <div className="about__fit-grid">
          {clientFitPoints.map((point) => (
            <motion.div key={point} className="t-frame t-frame--raised" variants={cardReveal}>
              <p>{point}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={pixelReveal}>
          <Link to="/contact" className="px-btn px-btn--primary">&gt; talk about a project</Link>
        </motion.div>
      </motion.section>
    </div>
  );
};
