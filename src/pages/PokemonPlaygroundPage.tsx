import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { PokemonWorld } from '../components/worlds/PokemonWorld';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './PlaygroundWorldPage.css';

export const PokemonPlaygroundPage = () => {
  return (
    <div className="page-stack pworld pworld--pokemon">
      <motion.section className="pworld__hero t-frame" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">playground / pokemon meadow</p>
          <h1>Procedural pixel meadow and sprite tooling.</h1>
          <p className="muted">
            Walkers, caught roster, seasonal tiles, sprite metadata, and the editor live here instead of taking over the professional contact route.
          </p>
        </motion.div>
        <motion.div className="pworld__actions" variants={cardReveal}>
          <Link to="/playground/pokemon/editor" className="px-btn px-btn--primary">open sprite editor</Link>
          <Link to="/playground" className="px-btn">world select</Link>
        </motion.div>
      </motion.section>

      <motion.section className="pworld__stage pworld__stage--pokemon" initial="hidden" whileInView="show" viewport={viewport} variants={cardReveal}>
        <PokemonWorld />
      </motion.section>
    </div>
  );
};
