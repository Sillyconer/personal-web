import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ZeldaDungeonWorld } from '../components/worlds/ZeldaDungeonWorld';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './PlaygroundWorldPage.css';

export const ZeldaPlaygroundPage = () => {
  return (
    <div className="page-stack pworld pworld--zelda">
      <motion.section className="pworld__hero t-frame" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">playground / zelda dungeon</p>
          <h1>Dungeon map scene with sprite patrols.</h1>
          <p className="muted">
            The Zelda homage becomes a dedicated experiment: map staging, actor routes, combat timing, and cursor effects without framing the work index.
          </p>
        </motion.div>
        <motion.div className="pworld__actions" variants={cardReveal}>
          <Link to="/work/mapper" className="px-btn px-btn--primary">open mapper case study</Link>
          <Link to="/playground" className="px-btn">world select</Link>
        </motion.div>
      </motion.section>

      <motion.section className="pworld__stage pworld__stage--zelda" initial="hidden" whileInView="show" viewport={viewport} variants={cardReveal}>
        <ZeldaDungeonWorld />
      </motion.section>
    </div>
  );
};
