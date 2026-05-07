import { motion } from 'framer-motion';

import { aboutPillars, clientFitPoints, experienceHighlights, siteProfile } from '../data/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './StoryPage.css';

const storyActs = [
  {
    era: 'past',
    title: 'Learning to care about atmosphere as much as structure',
    copy:
      'The work starts with a dislike of generic product shells. The aim has always been to make interfaces feel authored, atmospheric, and built with actual intention.',
    tone: 'lavender',
  },
  {
    era: 'present',
    title: 'Building frontend systems that still feel handmade',
    copy:
      'Right now the focus is product-facing React work, portfolio ecosystems, and richer UI worlds that can still survive real growth and actual use.',
    tone: 'teal',
  },
  {
    era: 'future',
    title: 'Turning the portfolio into a universe of distinct cartridges',
    copy:
      'The next step is pushing every section further apart stylistically while keeping them connected by CRT texture, pixel art, and strong frontend craft.',
    tone: 'yellow',
  },
];

export const StoryPage = () => {
  return (
    <div className="page-stack story-page">
      <motion.section className="story-hero" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="story-hero__copy story-panel" variants={pixelReveal}>
          <p className="eyebrow">chrono archive / story cartridge</p>
          <h1>A timeline of how the work got here, and where it is heading next.</h1>
          <p className="story-hero__lead">{siteProfile.mission}</p>
          <div className="story-hero__chips">
            <span className="story-chip story-chip--lavender">time gate</span>
            <span className="story-chip story-chip--teal">present build</span>
            <span className="story-chip story-chip--yellow">future route</span>
          </div>
        </motion.div>

        <motion.div className="story-hero__scene story-panel story-panel--bright" variants={cardReveal}>
          <div className="story-timegate" aria-hidden="true">
            <div className="story-timegate__ring story-timegate__ring--one" />
            <div className="story-timegate__ring story-timegate__ring--two" />
            <div className="story-timegate__ring story-timegate__ring--three" />
            <div className="story-timegate__core" />
            <div className="story-timegate__island story-timegate__island--past" />
            <div className="story-timegate__island story-timegate__island--present" />
            <div className="story-timegate__island story-timegate__island--future" />
          </div>
        </motion.div>
      </motion.section>

      <motion.section className="story-acts" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {storyActs.map((act) => (
          <motion.article key={act.era} className={`story-card story-card--${act.tone}`} variants={cardReveal}>
            <p className="eyebrow">era: {act.era}</p>
            <h2>{act.title}</h2>
            <p>{act.copy}</p>
          </motion.article>
        ))}
      </motion.section>

      <motion.section className="story-constellation" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="story-section-head" variants={pixelReveal}>
          <div>
            <p className="eyebrow">signal constellation</p>
            <h2>What keeps showing up across the timeline</h2>
          </div>
        </motion.div>

        <div className="story-grid">
          {aboutPillars.map((pillar) => (
            <motion.div key={pillar} className="story-panel story-panel--soft" variants={cardReveal}>
              <p>{pillar}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="story-timeline story-panel" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="story-section-head" variants={pixelReveal}>
          <div>
            <p className="eyebrow">era snapshots</p>
            <h2>Current focus through a Chrono-style lens</h2>
          </div>
        </motion.div>

        <div className="story-timeline__list">
          {experienceHighlights.map((item) => (
            <motion.article key={item.title} className="story-timeline__item" variants={cardReveal}>
              <span className="story-timeline__label">{item.label}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="story-future" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="story-section-head" variants={pixelReveal}>
          <div>
            <p className="eyebrow">future party members</p>
            <h2>The kinds of projects that fit best</h2>
          </div>
        </motion.div>

        <div className="story-grid">
          {clientFitPoints.map((point) => (
            <motion.div key={point} className="story-panel story-panel--gold" variants={cardReveal}>
              <p>{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
