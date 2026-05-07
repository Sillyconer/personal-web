import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import portraitUrl from '../../WhatsApp Image 2026-05-07 at 12.28.43.jpeg';
import { siteProfile } from '../data/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './HomePage.css';

const worldCards = [
  {
    to: '/work',
    title: 'Work',
    homage: 'Zelda dungeon',
    copy: 'Torchlit archive of project chambers, relic doors, and explorable case studies.',
    className: 'is-work',
    badges: ['keys', 'maps', 'treasure'],
  },
  {
    to: '/story',
    title: 'Story',
    homage: 'Chrono Trigger',
    copy: 'A time-gate narrative world for your background, direction, and how the work evolved.',
    className: 'is-story',
    badges: ['past', 'present', 'future'],
  },
  {
    to: '/arcade',
    title: 'Arcade',
    homage: 'Minecraft toy world',
    copy: 'A playable build board with local persistence, little experiments, and interactive demos.',
    className: 'is-arcade',
    badges: ['blocks', 'craft', 'save'],
  },
  {
    to: '/contact',
    title: 'Contact',
    homage: 'Pokemon link center',
    copy: 'A bright communication world for collaboration, enquiries, and reaching out.',
    className: 'is-contact',
    badges: ['signal', 'connect', 'trainer'],
  },
];

export const HomePage = () => {
  return (
    <div className="page-stack home-hub home-hub--dream">
      <motion.section className="home-hub__hero t-frame t-frame--glow" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="home-hub__copy" variants={pixelReveal}>
          <p className="eyebrow">dream cartridge / world select</p>
          <h1>{siteProfile.name} builds frontend worlds with strong atmosphere and real structure.</h1>
          <p className="home-hub__lead">{siteProfile.intro}</p>
          <p className="muted">{siteProfile.availability}</p>
          <div className="home-hub__chips">
            <span className="px-tag px-tag--yellow"><Star size={10} /> world select</span>
            <span className="px-tag px-tag--teal"><Sparkles size={10} /> separate cartridges</span>
          </div>
        </motion.div>

        <motion.div className="home-hub__portrait t-frame t-frame--raised" variants={cardReveal}>
          <img src={portraitUrl} alt="Stylized portrait logo for Dark" className="home-hub__portrait-image" />
          <div className="home-hub__portrait-meta">
            <p className="eyebrow">player card</p>
            <strong>Dark</strong>
            <span>frontend systems / ui atmospheres / product worlds</span>
          </div>
        </motion.div>

        <motion.div className="home-hub__scene t-frame t-frame--raised" variants={cardReveal}>
          <div className="home-hub__scene-core" aria-hidden="true">
            <div className="home-hub__scene-moon" />
            <div className="home-hub__scene-stars" />
            <div className="home-hub__scene-hills" />
            <div className="home-hub__scene-castle" />
            <div className="home-hub__scene-cartridge home-hub__scene-cartridge--1" />
            <div className="home-hub__scene-cartridge home-hub__scene-cartridge--2" />
            <div className="home-hub__scene-sign home-hub__scene-sign--1">work</div>
            <div className="home-hub__scene-sign home-hub__scene-sign--2">story</div>
            <div className="home-hub__scene-sign home-hub__scene-sign--3">arcade</div>
            <div className="home-hub__scene-sign home-hub__scene-sign--4">contact</div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section className="home-hub__router" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="home-hub__section-head" variants={pixelReveal}>
          <div>
            <p className="eyebrow">world select</p>
            <h2>Choose a cartridge</h2>
          </div>
          <p className="muted">Each route now plays as its own little cartridge: dungeon archive, time gate, block board, and link center.</p>
        </motion.div>

        <div className="home-hub__world-grid">
          {worldCards.map((world) => (
            <motion.div key={world.to} variants={cardReveal}>
              <Link to={world.to} className={`home-hub__world-card ${world.className}`}>
                <div className="home-hub__world-card-head">
                  <div>
                    <p className="eyebrow">{world.homage}</p>
                    <h3>{world.title}</h3>
                  </div>
                  <ArrowRight size={18} />
                </div>

                <div className="home-hub__world-preview" aria-hidden="true">
                  <div className="home-hub__world-preview-layer home-hub__world-preview-layer--1" />
                  <div className="home-hub__world-preview-layer home-hub__world-preview-layer--2" />
                  <div className="home-hub__world-preview-layer home-hub__world-preview-layer--3" />
                </div>

                <p>{world.copy}</p>

                <div className="home-hub__world-badges">
                  {world.badges.map((badge) => (
                    <span key={badge}>{badge}</span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
