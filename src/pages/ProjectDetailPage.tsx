import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Sparkles } from 'lucide-react';

import { ProjectEmbed } from '../components/projects/ProjectEmbed';
import { useAuthStore } from '../store/useAuthStore';
import { getProjectBySlug } from '../utils/projects';
import './ProjectDetailPage.css';

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const project = getProjectBySlug(slug);
  const visibleTabs = useMemo(
    () => project?.tabs.filter((tab) => !tab.ownerOnly || isAuthenticated) ?? [],
    [isAuthenticated, project],
  );
  const [activeTabId, setActiveTabId] = useState(visibleTabs[0]?.id ?? '');

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const activeTab = visibleTabs.find((tab) => tab.id === activeTabId) ?? visibleTabs[0];
  const lockedTabs = project.tabs.filter((tab) => tab.ownerOnly && !isAuthenticated);
  const mapperEmbedNote =
    project.slug === 'mapper'
      ? 'Mapper currently points at a local development URL. Add an embed-safe deploy or dedicated embed route next.'
      : null;

  return (
    <div className="project-detail-page">
      <section className="surface-panel project-hero">
        <div className="project-hero__top">
          <Link to="/projects" className="inline-link">
            <ArrowLeft size={16} />
            Back to projects
          </Link>
          <span className="project-pill status-chip">{project.status}</span>
        </div>

        <div className="project-hero__content">
          <div className="content-cluster">
            <p className="eyebrow">{project.year}</p>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <div className="detail-list surface-faint">
              <div>
                <span className="eyebrow">Theme hint</span>
                <p>{project.themeHint}</p>
              </div>
              <div>
                <span className="eyebrow">Tags</span>
                <p>{project.tags.join(' · ')}</p>
              </div>
            </div>
          </div>
          <div className="surface-subpanel">
            <Sparkles size={18} />
            <h3>{project.tagline}</h3>
            <p>{project.summary}</p>
            <div className="stack-list">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="project-tabs-row">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-chip ${activeTab?.id === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.label}
          </button>
        ))}

        {lockedTabs.map((tab) => (
          <div key={tab.id} className="tab-chip tab-chip--locked">
            <LockKeyhole size={14} />
            {tab.label}
          </div>
        ))}
      </section>

      {activeTab?.type === 'content' ? (
        <section className="surface-panel tab-panel">
          <h3>{activeTab.title}</h3>
          <p>{activeTab.description}</p>
          <div className="bullet-column">
            {activeTab.content?.map((item) => (
              <article key={item} className="bullet-card">
                {item}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab?.type === 'embed' ? (
        <>
          {mapperEmbedNote ? <div className="surface-panel mapper-note">{mapperEmbedNote}</div> : null}
          <ProjectEmbed
            title={activeTab.title}
            description={activeTab.description}
            url={activeTab.embedUrl}
            height={activeTab.embedHeight}
            locked={!!activeTab.ownerOnly && !isAuthenticated}
            ctaLabel={activeTab.ctaLabel}
          />
        </>
      ) : null}
    </div>
  );
};
