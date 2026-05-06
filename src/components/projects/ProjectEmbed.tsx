import { ExternalLink, Lock } from 'lucide-react';

import './ProjectEmbed.css';

interface ProjectEmbedProps {
  title: string;
  description: string;
  url?: string;
  height?: number;
  locked?: boolean;
  ctaLabel?: string;
}

export const ProjectEmbed = ({
  title,
  description,
  url,
  height = 680,
  locked = false,
  ctaLabel = 'Open full app',
}: ProjectEmbedProps) => {
  if (locked) {
    return (
      <div className="project-embed project-embed--locked surface-panel">
        <Lock size={18} />
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
          <p className="embed-note">Owner login unlocks this private view.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="project-embed surface-panel">
      <div className="project-embed__head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="project-embed__launch">
            <ExternalLink size={16} />
            {ctaLabel}
          </a>
        ) : null}
      </div>

      {url ? (
        <iframe
          title={title}
          src={url}
          className="project-embed__frame"
          style={{ height }}
          loading="lazy"
        />
      ) : (
        <div className="project-embed__placeholder">Embed URL not configured yet.</div>
      )}
    </section>
  );
};
