import './CvPage.css';

export const CvPage = () => {
  return (
    <div className="cv-page">
      <section className="surface-panel cv-hero">
        <p className="eyebrow">CV</p>
        <h2>Profile snapshot</h2>
        <p>
          Product-minded developer focused on expressive interfaces, modular frontend systems,
          and projects that blend maps, media, and thoughtful UX.
        </p>
      </section>

      <section className="cv-grid">
        <article className="surface-panel cv-card">
          <h3>Strengths</h3>
          <p>Frontend architecture, themed UI systems, product polish, reusable component patterns.</p>
        </article>
        <article className="surface-panel cv-card">
          <h3>Stack</h3>
          <p>React, TypeScript, Vite, Zustand, routing systems, API integration, map-heavy interfaces.</p>
        </article>
        <article className="surface-panel cv-card">
          <h3>Current direction</h3>
          <p>Building a personal ecosystem where portfolio, project apps, embeds, and admin tooling live together.</p>
        </article>
      </section>
    </div>
  );
};
