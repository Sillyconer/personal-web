import { useMemo, useState } from 'react';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { EcosystemGraph } from '../components/graph/EcosystemGraph';
import { GitHubWidget } from '../components/github/GitHubWidget';
import { ProjectCard } from '../components/projects/ProjectCard';
import { projects } from '../data/projects';
import type { ProjectStatus, ProjectType } from '../types/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './WorkPage.css';

const statusFilters: Array<'all' | ProjectStatus> = ['all', 'live', 'building', 'concept'];

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
    <div className="page-stack work work--terminal">
      <motion.section className="work__hero" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="work__hero-copy" variants={pixelReveal}>
          <p className="eyebrow">work / portfolio evidence</p>
          <h1>Project work, live surfaces, code, and systems.</h1>
          <p className="muted">
            A calmer portfolio route for case studies and technical proof. The heavier homage worlds now live in Playground.
          </p>
          <div className="flex-row work__hero-tags">
            <span className="px-tag px-tag--yellow">embeds</span>
            <span className="px-tag px-tag--teal">keys</span>
            <span className="px-tag px-tag--blue">graphs</span>
          </div>
        </motion.div>

        <motion.div className="work__proof-panel t-frame t-frame--sunken" variants={cardReveal}>
          <p className="eyebrow">portfolio priorities</p>
          <div className="work__proof-grid">
            <span>live embed surfaces</span>
            <span>case-study outcomes</span>
            <span>code/system excerpts</span>
            <span>graphs + visualisations</span>
          </div>
        </motion.div>
      </motion.section>

      {/* ── Filters ── */}
      <motion.section
        className="work__filters"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={pixelReveal}
      >
        <div className="t-header">
          <div className="t-header__dots">
            <span className="t-header__dot t-header__dot--r" />
            <span className="t-header__dot t-header__dot--y" />
            <span className="t-header__dot t-header__dot--g" />
          </div>
            <span>dungeon map table</span>
        </div>

        <div className="work__filter-body">
          <div className="work__search">
            <Search size={14} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="search chambers, relics, roles, or tags"
              aria-label="Search projects"
            />
          </div>

          <div className="work__filter-rows">
            <div className="flex-row">
              <span className="muted">status:</span>
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`px-btn ${statusFilter === filter ? 'px-btn--active' : ''}`}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex-row">
              <span className="muted">type:</span>
              {typeFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`px-btn ${typeFilter === filter ? 'px-btn--active' : ''}`}
                  onClick={() => setTypeFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Results ── */}
      <motion.section initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">{filteredProjects.length} relic chambers revealed</p>
        </motion.div>

        {filteredProjects.length > 0 ? (
          <div className="grid-auto" style={{ marginTop: 'var(--gap)' }}>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="t-frame" style={{ marginTop: 'var(--gap)' }}>
            <p className="muted">no matching projects. try adjusting filters.</p>
          </div>
        )}
      </motion.section>

      <EcosystemGraph />

      {/* ── GitHub ── */}
      <GitHubWidget />
    </div>
  );
};
