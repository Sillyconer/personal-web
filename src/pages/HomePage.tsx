import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Compass, Layers3, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { GitHubWidget } from '../components/github/GitHubWidget';
import { ProjectCard } from '../components/projects/ProjectCard';
import { featuredProjects } from '../data/projects';
import { ecosystemModules, highlightStats, homeHeroLinks, processSteps, services, siteProfile } from '../data/site';
import { cardReveal, motionEase, sectionReveal, staggerGroup, viewport } from '../utils/motion';
import './HomePage.css';

const heroPins = [
  {
    label: 'signal',
    title: 'Client-ready case studies',
    copy: 'The homepage now points toward real proof, not just a generic shell.',
  },
  {
    label: 'world',
    title: 'Personal web atmosphere',
    copy: 'Retro badges, web-ring energy, and more personality without sacrificing clarity.',
  },
  {
    label: 'system',
    title: 'Ecosystem underneath',
    copy: 'Flagship apps, source previews, and future studio tooling stay connected.',
  },
];

const heroStickers = ['best viewed now', 'handmade internet', 'frontend atlas', 'open for work'];

export const HomePage = () => {
  return (
    <div className="page-stack home-page">
      <motion.section
        className="page-hero hero-panel surface-panel"
        initial="hidden"
        animate="show"
        variants={staggerGroup}
      >
        <motion.div className="hero-panel__copy content-cluster" variants={sectionReveal}>
          <div className="hero-panel__badge-row">
            <span className="pill eyebrow">version 2.0</span>
            <span className="hero-panel__microtag">a retro personal-web shell for serious product work</span>
          </div>

          <h1>{siteProfile.title}</h1>
          <p className="hero-lead">{siteProfile.intro}</p>
          <p className="hero-support">{siteProfile.mission}</p>

          <motion.div className="hero-actions" variants={staggerGroup}>
            {homeHeroLinks.map((link) => {
              const className = link.emphasis === 'primary' ? 'button-link' : 'inline-link';

              return link.external ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  variants={cardReveal}
                  whileHover={{ y: -4, rotate: -1, transition: { duration: 0.2, ease: motionEase } }}
                >
                  {link.label}
                </motion.a>
              ) : (
                <motion.div key={link.label} variants={cardReveal} whileHover={{ y: -4, rotate: -1, transition: { duration: 0.2, ease: motionEase } }}>
                  <Link to={link.href} className={className}>
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div className="hero-availability surface-faint content-cluster" variants={cardReveal}>
            <span className="eyebrow">availability</span>
            <p>{siteProfile.availability}</p>
          </motion.div>
        </motion.div>

        <motion.div className="hero-panel__aside" variants={sectionReveal}>
          <motion.article
            className="hero-window surface-subpanel"
            animate={{ rotate: [-0.9, 0.6, -0.9] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          >
            <div className="hero-window__chrome">
              <span />
              <span />
              <span />
            </div>

            <div className="hero-window__map">
              <div className="hero-window__grid" aria-hidden="true" />
              <div className="hero-window__compass" aria-hidden="true">
                <Compass size={16} />
              </div>
              {heroPins.map((pin, index) => (
                <motion.article
                  key={pin.title}
                  className={`hero-note-card hero-note-card--${index + 1}`}
                  initial={{ opacity: 0, y: 18, rotate: index % 2 === 0 ? -4 : 3 }}
                  animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -2 : 2 }}
                  transition={{ delay: 0.2 + index * 0.12, duration: 0.7, ease: motionEase }}
                >
                  <span className="eyebrow">{pin.label}</span>
                  <strong>{pin.title}</strong>
                  <p>{pin.copy}</p>
                </motion.article>
              ))}
            </div>
          </motion.article>

          <motion.div className="hero-sticker-row" variants={staggerGroup}>
            {heroStickers.map((sticker, index) => (
              <motion.span
                key={sticker}
                className="hero-sticker"
                variants={cardReveal}
                animate={{ y: [0, index % 2 === 0 ? -5 : -3, 0], rotate: [index % 2 === 0 ? -3 : 2, index % 2 === 0 ? 1 : -1, index % 2 === 0 ? -3 : 2] }}
                transition={{ duration: 4 + index, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              >
                {sticker}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section className="metric-strip" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {highlightStats.map((stat) => (
          <motion.article key={stat.label} className="stat-card surface-panel" variants={cardReveal} whileHover={{ y: -6, rotate: -0.8 }}>
            <p className="eyebrow">{stat.label}</p>
            <h3>{stat.value}</h3>
            {stat.detail ? <p className="muted">{stat.detail}</p> : null}
          </motion.article>
        ))}
      </motion.section>

      <motion.section className="section-block" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="section-head" variants={sectionReveal}>
          <div className="section-copy content-cluster">
            <p className="eyebrow">offerings</p>
            <h2>Work shaped for ambitious interfaces</h2>
            <p>A little more theatrical than a normal portfolio, but still disciplined where it matters.</p>
          </div>
        </motion.div>

        <div className="cards-grid services-grid">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className={`service-card service-card--${index + 1} surface-panel`}
              variants={cardReveal}
              whileHover={{ y: -8, rotate: index % 2 === 0 ? -1.4 : 1.2, transition: { duration: 0.2 } }}
            >
              <div className="service-card__head">
                <span className="service-card__index">0{index + 1}</span>
                <BriefcaseBusiness size={18} />
              </div>
              <div className="content-cluster">
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
              </div>
              <div className="service-outcomes">
                {service.outcomes.map((outcome) => (
                  <span key={outcome} className="status-chip">
                    {outcome}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="section-block" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="section-head" variants={sectionReveal}>
          <div className="section-copy content-cluster">
            <p className="eyebrow">featured work</p>
            <h2>Flagship projects with enough room to breathe</h2>
            <p>The case studies are now built like chapters, not just glossy cards with tags.</p>
          </div>
          <Link to="/work" className="inline-link">
            Browse all work
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="cards-grid feature-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </motion.section>

      <motion.section className="home-process-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.article className="surface-panel process-panel" variants={cardReveal}>
          <div className="section-copy content-cluster">
            <p className="eyebrow">signal map</p>
            <h2>How the work gets shaped</h2>
            <p>Less smooth-corporate, more annotated field guide. The process stays clear even when the presentation gets playful.</p>
          </div>

          <div className="timeline-list">
            {processSteps.map((step) => (
              <article key={step.label} className="timeline-item">
                <span className="timeline-label eyebrow">{step.label}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </motion.article>

        <motion.article className="surface-panel ecosystem-panel" variants={cardReveal}>
          <div className="section-copy content-cluster">
            <p className="eyebrow">web ring</p>
            <h2>One portfolio, multiple connected rooms</h2>
            <p>This site acts like a front door, directory, and world map for the wider ecosystem.</p>
          </div>

          <div className="ecosystem-grid">
            {ecosystemModules.map((module) =>
              module.internal ? (
                <motion.div key={module.title} whileHover={{ y: -6, rotate: -1 }}>
                  <Link to={module.href} className="ecosystem-card surface-faint">
                    <div className="ecosystem-card__head">
                      <Star size={14} />
                      <p className="eyebrow">room</p>
                    </div>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={module.title}
                  href={module.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ecosystem-card surface-faint"
                  whileHover={{ y: -6, rotate: 1 }}
                >
                  <div className="ecosystem-card__head">
                    <Layers3 size={14} />
                    <p className="eyebrow">outpost</p>
                  </div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </motion.a>
              ),
            )}
          </div>
        </motion.article>
      </motion.section>

      <GitHubWidget />

      <motion.section className="cta-panel surface-panel" initial="hidden" whileInView="show" viewport={viewport} variants={sectionReveal}>
        <div className="content-cluster">
          <p className="eyebrow">guestbook prompt</p>
          <h2>Let&apos;s make the product clearer, stranger, sharper, and more memorable.</h2>
          <p>
            If the current UI feels too generic, too stiff, or too polite for what the product actually is, that is exactly the kind of problem this work is good at solving.
          </p>
        </div>
        <Link to="/contact" className="button-link">
          Start a conversation
          <ArrowRight size={16} />
        </Link>
      </motion.section>
    </div>
  );
};
