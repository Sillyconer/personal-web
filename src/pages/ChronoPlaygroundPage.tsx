import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './PlaygroundWorldPage.css';

const eras = [
  ['past', 'prototype atmosphere', 'The first direction pushed personality hard and proved the site could feel authored.'],
  ['present', 'clean professional split', 'CV and work now stay readable, with the high-energy ideas moved into Playground.'],
  ['future', 'more simulations', 'The next pass can add richer code demos, graphs, embedded apps, and small technical scenes.'],
];

export const ChronoPlaygroundPage = () => {
  return (
    <div className="page-stack pworld pworld--chrono">
      <motion.section className="pworld__hero t-frame" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">playground / chrono time gate</p>
          <h1>A separated time-gate concept.</h1>
          <p className="muted">
            This keeps the Chrono-inspired framing as a visual experiment while the CV route uses the same information in a cleaner professional format.
          </p>
        </motion.div>
        <motion.div className="pworld__actions" variants={cardReveal}>
          <Link to="/cv" className="px-btn px-btn--primary">open clean CV</Link>
          <Link to="/playground" className="px-btn">world select</Link>
        </motion.div>
      </motion.section>

      <motion.section className="pworld__chrono-stage t-frame" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="pworld__timegate" variants={cardReveal} aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </motion.div>
        <div className="pworld__era-grid">
          {eras.map(([label, title, copy]) => (
            <motion.article key={label} className="t-frame" variants={cardReveal}>
              <p className="eyebrow">era: {label}</p>
              <h2>{title}</h2>
              <p className="muted">{copy}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
