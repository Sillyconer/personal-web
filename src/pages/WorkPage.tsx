import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search, Waypoints } from 'lucide-react';
import { motion } from 'framer-motion';

import { GitHubWidget } from '../components/github/GitHubWidget';
import { ProjectCard } from '../components/projects/ProjectCard';
import { projects } from '../data/projects';
import { projectIngestionSteps } from '../data/site';
import type { ProjectStatus, ProjectType } from '../types/site';
import { cardReveal, sectionReveal, staggerGroup, viewport } from '../utils/motion';
import './WorkPage.css';

const statusFilters: Array<'all' | ProjectStatus> = ['all', 'live', 'building', 'concept'];
const archiveBadges = ['work archive', 'signal directory', 'ecosystem map'];

export const WorkPage = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ProjectType>('all');

  const typeFilters = useMemo(() => ['all', ...new Set(projects.map((project) => project.type))] as const, []);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesType = typeFilter === 'all' || project.type === typeFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [project.name, project.summary, project.tagline, ...project.tags, ...project.roles]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesType && matchesQuery;
    });
  }, [query, statusFilter, typeFilter]);

  return (
    <div className="page-stack work-page">
      <motion.section className="page-hero work-hero surface-panel" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="content-cluster" variants={sectionReveal}>
          <div className="work-hero__badges">
            {archiveBadges.map((badge) => (
              <span key={badge} className="status-chip">
                {badge}
              </span>
            ))}
          </div>
          <p className="eyebrow">work</p>
          <h1>Case studies, live surfaces, and the little world built around them</h1>
          <p>
            This is the public directory for the ecosystem. It behaves a bit like an old handmade portal, but the underlying structure is tuned for product credibility: strong summaries, richer chapters, and easier browsing.
          </p>
        </motion.div>

        <motion.div className="work-hero__aside surface-subpanel" variants={cardReveal}>
          <div className="work-hero__aside-head">
            <Waypoints size={18} />
            <p className="eyebrow">navigation note</p>
          </div>
          <h2>Scan wide, then dive deep</h2>
          <p>
            The directory view is meant to feel playful and browsable. Once something catches attention, the case-study page gets much more structured and editorial.
          </p>
          <Link to="/contact" className="inline-link">
            Need this kind of treatment?
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </motion.section>

      <motion.section className="surface-panel work-filter-panel" initial="hidden" whileInView="show" viewport={viewport} variants={sectionReveal}>
        <div className="work-filter-panel__head">
          <div>
            <p className="eyebrow">directory scanner</p>
            <h2>Filter the archive</h2>
          </div>
          <p>Search by project name, role, or tags to jump to the right corner of the site.</p>
        </div>

        <div className="work-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="search by project name, role, or tag"
            aria-label="Search projects"
          />
        </div>

        <div className="work-filter-groups">
          <div className="chip-row">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-chip ${statusFilter === filter ? 'is-active' : ''}`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="chip-row">
            {typeFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-chip ${typeFilter === filter ? 'is-active' : ''}`}
                onClick={() => setTypeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="section-block" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="section-head" variants={sectionReveal}>
          <div className="section-copy content-cluster">
            <p className="eyebrow">results</p>
            <h2>{filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'} currently in view</h2>
            <p>Use the filters like a directory index, then follow the most relevant path into the full write-up.</p>
          </div>
        </motion.div>

        {filteredProjects.length > 0 ? (
          <motion.div className="cards-grid" variants={staggerGroup}>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div className="work-empty surface-panel" variants={cardReveal}>
            <h3>No projects match that filter combination yet.</h3>
            <p>Try clearing the search or switching filters.</p>
          </motion.div>
        )}
      </motion.section>

      <motion.section className="work-ops-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.article className="surface-panel ops-card" variants={cardReveal}>
          <div className="content-cluster">
            <p className="eyebrow">archive maintenance</p>
            <h2>Adding new work now follows a better ritual</h2>
            <p>Instead of one monolithic registry, the portfolio grows by adding new project files and structured case-study sections.</p>
          </div>
          <div className="ops-list">
            {projectIngestionSteps.map((step, index) => (
              <article key={step} className="ops-step surface-faint">
                <span className="ops-step__index">0{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
          <Link to="/studio" className="inline-link">
            Open studio notes
          </Link>
        </motion.article>

        <GitHubWidget />
      </motion.section>
    </div>
  );
};
