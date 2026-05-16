import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './PlaygroundPage.css';

const worlds = [
  {
    to: '/playground/pokemon',
    title: 'Pokemon meadow',
    eyebrow: 'sprite systems / capture loop',
    copy: 'A procedural pixel world, walking sprites, caught roster, and a coordinate editor for sprite-sheet work.',
    className: 'is-pokemon',
  },
  {
    to: '/playground/zelda',
    title: 'Zelda dungeon',
    eyebrow: 'map scene / combat loop',
    copy: 'A full-screen dungeon homage with sprite actors, patrol routes, sword clashes, and click effects.',
    className: 'is-zelda',
  },
  {
    to: '/playground/chrono',
    title: 'Chrono time gate',
    eyebrow: 'timeline / motion concept',
    copy: 'A calmer concept page for the time-gate visual language, now separated from the professional CV.',
    className: 'is-chrono',
  },
  {
    to: '/playground/minecraft',
    title: 'Block craft',
    eyebrow: 'local save / toy interface',
    copy: 'A small block board with palette tools, local persistence, counters, and saved signs.',
    className: 'is-minecraft',
  },
];

export const PlaygroundPage = () => {
  return (
    <div className="page-stack playground-page">
      <motion.section className="playground-hero t-frame t-frame--glow" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">playground / world select</p>
          <h1>All the loud custom worlds live here.</h1>
          <p className="muted">
            This route keeps the personal experiments, game homages, interaction tests, and richer pixel systems separate from the CV and portfolio.
          </p>
        </motion.div>
      </motion.section>

      <motion.section className="playground-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {worlds.map((world) => (
          <motion.div key={world.to} variants={cardReveal}>
            <Link to={world.to} className={`playground-card ${world.className}`}>
              <div className="playground-card__head">
                <div>
                  <p className="eyebrow">{world.eyebrow}</p>
                  <h2>{world.title}</h2>
                </div>
                <ArrowRight size={18} />
              </div>
              <div className="playground-card__preview" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>{world.copy}</p>
            </Link>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
};
