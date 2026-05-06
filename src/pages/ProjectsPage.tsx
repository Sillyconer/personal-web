import { projects } from '../data/projects';
import { ProjectCard } from '../components/projects/ProjectCard';
import './ProjectsPage.css';

export const ProjectsPage = () => {
  return (
    <div className="projects-page">
      <section className="surface-panel page-header-block">
        <div className="page-header-copy">
          <p className="eyebrow">Projects</p>
          <h2>Launch points for the products shaping this portfolio</h2>
          <p>
            Each project gets space for context, live surfaces, implementation notes, and owner-only views. The aim is to make the
            portfolio feel less like a gallery and more like a working system.
          </p>
        </div>

        <div className="project-page-meta surface-faint">
          <p className="eyebrow">How to read this</p>
          <p>Open a project for narrative context, stack choices, embedded previews, and the pieces that will keep evolving next.</p>
        </div>
      </section>

      <section className="cards-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </section>
    </div>
  );
};
