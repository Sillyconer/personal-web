import './ProjectEmbed.css';

interface ProjectEmbedProps {
  title: string;
  description: string;
  url?: string;
  height?: number;
  ctaLabel?: string;
}

export const ProjectEmbed = ({ title, description, url, height = 500, ctaLabel }: ProjectEmbedProps) => {
  return (
    <div className="pembed t-frame">
      <div className="t-header">
        <div className="t-header__dots">
          <span className="t-header__dot t-header__dot--r" />
          <span className="t-header__dot t-header__dot--y" />
          <span className="t-header__dot t-header__dot--g" />
        </div>
        <span>{title.toLowerCase()}</span>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="px-btn" style={{ marginLeft: 'auto' }}>
            {ctaLabel ?? '> open'}
          </a>
        ) : null}
      </div>

      <div className="pembed__body">
        <p className="muted">{description}</p>
        {url ? (
          <iframe
            className="pembed__frame"
            src={url}
            title={title}
            height={height}
            loading="lazy"
          />
        ) : (
          <div className="pembed__placeholder t-frame t-frame--sunken">
            <p className="muted">[no embed url configured]</p>
          </div>
        )}
      </div>
    </div>
  );
};
