import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { projects } from '../data/projects';
import { projectIngestionSteps, studioChecklist } from '../data/site';
import { useAuthStore } from '../store/useAuthStore';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import { hasPrivateProjectSections } from '../utils/projects';
import './StudioPage.css';

export const StudioPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profile = useAuthStore((state) => state.profile);
  const mode = useAuthStore((state) => state.mode);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const liveCount = projects.filter((project) => project.status === 'live').length;
  const privateCount = projects.filter((project) => hasPrivateProjectSections(project)).length;

  return (
    <div className="page-stack studio">
      {/* ── Hero ── */}
      <motion.section className="studio__hero" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">maker room / backstage</p>
          <h1>private workshop</h1>
          <p className="muted">Maintenance notes, private surfaces, and world-building tools. Same universe, hidden door.</p>
        </motion.div>

        <motion.div className="studio__badges flex-row" variants={pixelReveal}>
          <span className="px-tag px-tag--teal">{profile?.displayName ?? 'owner'}</span>
          <span className="px-tag">{profile?.role ?? 'private'}</span>
          <span className="px-tag px-tag--yellow">{mode} gate</span>
        </motion.div>
      </motion.section>

      {/* ── Stats ── */}
      <motion.section className="studio__stats t-frame t-frame--sunken" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <div className="t-header">
          <div className="t-header__dots">
            <span className="t-header__dot t-header__dot--r" />
            <span className="t-header__dot t-header__dot--y" />
            <span className="t-header__dot t-header__dot--g" />
          </div>
          <span>workshop counters</span>
        </div>
        <div className="studio__stat-list">
          <motion.div className="studio__stat" variants={cardReveal}>
            <span className="text-teal">projects:</span> {projects.length}
          </motion.div>
          <motion.div className="studio__stat" variants={cardReveal}>
            <span className="text-teal">live:</span> {liveCount}
          </motion.div>
          <motion.div className="studio__stat" variants={cardReveal}>
            <span className="text-teal">private-ready:</span> {privateCount}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Workflows ── */}
      <motion.section className="grid-2" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="t-frame" variants={cardReveal}>
          <p className="eyebrow">new world recipe</p>
          <h3>repeatable content flow</h3>
          <div className="studio__steps">
            {projectIngestionSteps.map((step, index) => (
              <div key={step} className="studio__step">
                <span className="text-red">0{index + 1}</span> {step}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="t-frame" variants={cardReveal}>
          <p className="eyebrow">boss fight prep</p>
          <h3>before production</h3>
          <div className="studio__steps">
            {studioChecklist.map((item, index) => (
              <div key={item} className="studio__step">
                <span className="text-red">0{index + 1}</span> {item}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* ── Registry ── */}
      <motion.section className="studio__registry t-frame t-frame--sunken" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <div className="t-header">
          <div className="t-header__dots">
            <span className="t-header__dot t-header__dot--r" />
            <span className="t-header__dot t-header__dot--y" />
            <span className="t-header__dot t-header__dot--g" />
          </div>
          <span>world registry</span>
          <Link to="/work" className="px-btn" style={{ marginLeft: 'auto' }}>public archive</Link>
        </div>
        <div className="studio__project-list">
          {projects.map((project) => (
            <motion.div key={project.slug} className="studio__project" variants={cardReveal}>
              <span className="px-tag px-tag--teal">{project.status}</span>
              <Link to={`/work/${project.slug}`} className="text-teal">{project.name}</Link>
              <span className="muted">{project.summary}</span>
              <span className="muted">{project.sections.length} sections</span>
              {hasPrivateProjectSections(project) ? <span className="px-tag px-tag--red">private</span> : null}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
