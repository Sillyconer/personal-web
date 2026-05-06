import { Link } from 'react-router-dom';
import { ArrowRight, LayoutPanelTop, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { GitHubWidget } from '../components/github/GitHubWidget';
import { ProjectCard } from '../components/projects/ProjectCard';
import { capabilityPoints, heroLinks, highlightStats, profileCopy, timelineMoments } from '../data/profile';
import { featuredProjects } from '../data/projects';
import './HomePage.css';

export const HomePage = () => {
  return (
    <div className="page-grid home-page">
      <motion.section
        className="hero surface-panel"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="hero-copy content-cluster">
          <span className="pill eyebrow">Living CV</span>
          <h2>{profileCopy.title}</h2>
          <p className="hero-lead">{profileCopy.intro}</p>
          <p className="hero-support">{profileCopy.mission}</p>

          <div className="hero-links">
            {heroLinks.map((link, index) => {
              const className = index === 0 ? 'button-link' : 'inline-link';

              return link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={className}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.href} className={className}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hero-availability surface-faint">
            <span className="eyebrow">Availability</span>
            <p>{profileCopy.availability}</p>
          </div>
        </div>

        <div className="hero-orbit">
          <div className="hero-orbit__ring" />
          <div className="hero-orbit__card surface-subpanel">
            <span className="eyebrow">Now building</span>
            <strong>Portfolio shell + embedded product surfaces</strong>
            <p>Public profile, project launch points, GitHub previews, and room for owner-only tools.</p>
          </div>
          <div className="hero-orbit__status surface-faint">
            <Sparkles size={16} />
            <span>{profileCopy.currentlyExploring}</span>
          </div>
        </div>
      </motion.section>

      <section className="stats-grid metric-strip">
        {highlightStats.map((stat) => (
          <article key={stat.label} className="stat-card surface-panel">
            <p className="eyebrow">{stat.label}</p>
            <h3>{stat.value}</h3>
            {stat.detail ? <p className="muted">{stat.detail}</p> : null}
          </article>
        ))}
      </section>

      <section className="home-story-grid">
        <article className="surface-panel story-panel">
          <div className="section-copy content-cluster">
            <p className="eyebrow">What this site is for</p>
            <h2>A project hub that still reads like a person</h2>
            <p>
              The portfolio is moving away from static pages toward a reusable system: launch projects, explain the thinking,
              preview source work, and keep space for private owner tooling without splitting everything into separate apps.
            </p>
          </div>

          <div className="bullet-column capabilities-grid">
            {capabilityPoints.map((item) => (
              <article key={item} className="bullet-card surface-faint">
                {item}
              </article>
            ))}
          </div>
        </article>

        <article className="surface-panel timeline-panel">
          <div className="section-copy content-cluster">
            <p className="eyebrow">Trajectory</p>
            <h2>Where the platform is heading</h2>
          </div>

          <div className="timeline-list">
            {timelineMoments.map((item) => (
              <article key={item.label} className="timeline-item">
                <span className="timeline-label eyebrow">{item.label}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div className="section-copy content-cluster">
            <p className="eyebrow">Featured projects</p>
            <h2>Work that defines the direction</h2>
            <p>These are the projects setting the tone for the wider system: one anchor product, one portfolio shell around it.</p>
          </div>
          <Link to="/projects" className="inline-link">
            Browse all
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="cards-grid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <GitHubWidget />

      <section className="dual-grid home-footer-grid">
        <article className="surface-panel info-panel">
          <LayoutPanelTop size={18} />
          <h2>Built to stay editable</h2>
          <p>
            Navigation, projects, theme modes, and content blocks are kept config-driven so the site can evolve without
            rewriting its foundations each time.
          </p>
        </article>

        <article className="surface-panel info-panel">
          <ShieldCheck size={18} />
          <h2>Public by default, private when needed</h2>
          <p>
            The portfolio view stays clean for visitors, while owner login creates a path for protected embeds, admin panels,
            and future media workflows.
          </p>
        </article>
      </section>
    </div>
  );
};
