import { Link } from 'react-router-dom';
import { Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { EcosystemGraph } from '../components/graph/EcosystemGraph';
import { GitHubWidget } from '../components/github/GitHubWidget';
import { ProjectCard } from '../components/projects/ProjectCard';
import { featuredProjects } from '../data/projects';
import { highlightStats, services, siteProfile } from '../data/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './HomePage.css';

const floatingBadges = ['whimsical crt', 'pixel-art ui', 'map worlds', 'frontend magic'];

export const HomePage = () => {
  return (
    <div className="page-stack home">
      <motion.section className="home__hero t-frame t-frame--glow" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="home__hero-copy" variants={pixelReveal}>
          <p className="eyebrow">dream zone / start screen</p>
          <h1 className="home__title">{siteProfile.title}</h1>
          <p className="home__lead">{siteProfile.intro}</p>
          <p className="muted">{siteProfile.mission}</p>
        </motion.div>

        <motion.div className="home__hero-actions" variants={pixelReveal}>
          <Link to="/work" className="px-btn px-btn--primary">explore projects</Link>
          <Link to="/contact" className="px-btn px-btn--accent">summon collaboration</Link>
          <Link to="/about" className="px-btn">player profile</Link>
        </motion.div>

        <motion.div className="home__hero-window t-frame t-frame--raised" variants={cardReveal}>
          <div className="t-header">
            <div className="t-header__dots">
              <span className="t-header__dot t-header__dot--r" />
              <span className="t-header__dot t-header__dot--y" />
              <span className="t-header__dot t-header__dot--g" />
            </div>
            <span>field notes / overworld</span>
          </div>

          <div className="home__hero-scene">
            <div className="home__scene-moon" />
            <div className="home__scene-hills" />
            <div className="home__scene-stars" />
            {floatingBadges.map((badge, index) => (
              <span key={badge} className={`home__scene-badge home__scene-badge--${index + 1}`}>
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.section className="home__stats grid-auto" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {highlightStats.map((stat) => (
          <motion.article key={stat.label} className="home__stat t-frame" variants={cardReveal}>
            <p className="eyebrow">{stat.label}</p>
            <h3>{stat.value}</h3>
            {stat.detail ? <p className="muted">{stat.detail}</p> : null}
          </motion.article>
        ))}
      </motion.section>

      <motion.section className="home__services" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="home__section-head" variants={pixelReveal}>
          <div>
            <p className="eyebrow">power set</p>
            <h2>stylized product work with actual structure</h2>
          </div>
        </motion.div>

        <div className="grid-auto">
          {services.map((service, index) => (
            <motion.article key={service.title} className={`home__service t-frame home__service--${index + 1}`} variants={cardReveal}>
              <div className="home__service-head">
                <span className="px-tag px-tag--yellow">0{index + 1}</span>
                <h3>{service.title}</h3>
              </div>
              <p className="muted">{service.summary}</p>
              <div className="home__service-tags">
                {service.outcomes.map((outcome) => (
                  <span key={outcome} className="px-tag px-tag--teal">{outcome}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="home__work" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="home__section-head" variants={pixelReveal}>
          <div>
            <p className="eyebrow">featured levels</p>
            <h2>projects with enough room to feel like worlds</h2>
          </div>
          <Link to="/work" className="px-btn">open archive</Link>
        </motion.div>

        <div className="grid-auto">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </motion.section>

      <EcosystemGraph />

      <GitHubWidget />

      <motion.section className="home__cta t-frame t-frame--raised" initial="hidden" whileInView="show" viewport={viewport} variants={pixelReveal}>
        <div className="home__cta-copy">
          <p className="eyebrow">co-op invite</p>
          <h2>need a frontend that feels alive instead of assembled?</h2>
          <p className="muted">Good fit for products that need stronger atmosphere, clearer hierarchy, and a UI system that can keep evolving without losing its charm.</p>
        </div>
        <div className="home__cta-icons">
          <span className="px-tag px-tag--yellow"><Star size={10} /> ui signal</span>
          <span className="px-tag px-tag--red"><Sparkles size={10} /> product polish</span>
        </div>
        <Link to="/contact" className="px-btn px-btn--primary">start the next level</Link>
      </motion.section>
    </div>
  );
};
