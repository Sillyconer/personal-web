import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { EcosystemGraph } from '../components/graph/EcosystemGraph';
import { GitHubWidget } from '../components/github/GitHubWidget';
import { ProjectCard } from '../components/projects/ProjectCard';
import { featuredProjects } from '../data/projects';
import { highlightStats, services, siteProfile } from '../data/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './HomePage.css';

export const HomePage = () => {
  return (
    <div className="page-stack home">
      {/* ── Boot sequence hero ── */}
      <motion.section
        className="home__hero"
        initial="hidden"
        animate="show"
        variants={staggerGroup}
      >
        <motion.div className="home__boot" variants={pixelReveal}>
          <p className="eyebrow">system boot // v2.0</p>
          <h1 className="home__title cursor-blink">{siteProfile.title}</h1>
          <p className="home__lead">{siteProfile.intro}</p>
          <p className="muted">{siteProfile.mission}</p>
        </motion.div>

        <motion.div className="home__actions" variants={pixelReveal}>
          <Link to="/work" className="px-btn px-btn--primary">&gt; browse work</Link>
          <Link to="/contact" className="px-btn px-btn--accent">&gt; get in touch</Link>
          <Link to="/about" className="px-btn">&gt; about</Link>
        </motion.div>

        <motion.div className="home__status t-frame t-frame--sunken" variants={pixelReveal}>
          <span className="eyebrow">status</span>
          <p>{siteProfile.availability}</p>
        </motion.div>
      </motion.section>

      {/* ── Stats as terminal output ── */}
      <motion.section
        className="home__stats t-frame t-frame--sunken"
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
          <span>stats --summary</span>
        </div>
        <div className="home__stats-grid">
          {highlightStats.map((stat) => (
            <motion.div key={stat.label} className="home__stat" variants={cardReveal}>
              <span className="text-teal">{stat.label}:</span>
              <span className="glow-text">{stat.value}</span>
              {stat.detail ? <span className="muted"> // {stat.detail}</span> : null}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Services ── */}
      <motion.section
        className="home__services"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerGroup}
      >
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">&gt; ls services/</p>
          <h2>capabilities</h2>
        </motion.div>

        <div className="home__services-grid">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className="home__service t-frame"
              variants={cardReveal}
            >
              <div className="home__service-head">
                <span className="text-red">0{index + 1}</span>
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

      {/* ── Featured work ── */}
      <motion.section
        className="home__work"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerGroup}
      >
        <motion.div className="home__work-head" variants={pixelReveal}>
          <div>
            <p className="eyebrow">&gt; ls projects/ --featured</p>
            <h2>featured work</h2>
          </div>
          <Link to="/work" className="px-btn">&gt; view all</Link>
        </motion.div>

        <div className="grid-auto">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </motion.section>

      {/* ── Ecosystem graph ── */}
      <EcosystemGraph />

      {/* ── GitHub ── */}
      <GitHubWidget />

      {/* ── CTA ── */}
      <motion.section
        className="home__cta t-frame t-frame--glow"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={pixelReveal}
      >
        <p className="eyebrow">&gt; prompt</p>
        <h2>ready to build something sharper?</h2>
        <p className="muted">
          if the current ui feels too generic, too stiff, or too polite for what the product actually is — that is exactly the kind of problem this work solves.
        </p>
        <Link to="/contact" className="px-btn px-btn--primary">&gt; start a conversation</Link>
      </motion.section>
    </div>
  );
};
