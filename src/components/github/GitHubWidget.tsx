import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, Clock3, GitFork, Star } from 'lucide-react';

import { githubConfig } from '../../data/github';
import './GitHubWidget.css';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  default_branch: string;
  owner: {
    login: string;
  };
}

export const GitHubWidget = () => {
  const isDemoFeed = githubConfig.username === 'octocat';
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [readme, setReadme] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRepos = async () => {
      setError('');
      try {
        const response = await fetch(
          `https://api.github.com/users/${githubConfig.username}/repos?sort=updated&per_page=12`,
        );

        if (!response.ok) {
          throw new Error('GitHub API request failed');
        }

        const data = (await response.json()) as GitHubRepo[];
        const safeRepos = Array.isArray(data) ? data : [];
        const featured = githubConfig.featuredRepos
          .map((name) => safeRepos.find((repo) => repo.name.toLowerCase() === name.toLowerCase()))
          .filter(Boolean) as GitHubRepo[];
        const remainder = safeRepos.filter(
          (repo) => !featured.some((featuredRepo) => featuredRepo.id === repo.id),
        );
        const nextRepos = [...featured, ...remainder].slice(0, 6);

        setRepos(nextRepos);

        if (nextRepos.length > 0) {
          setSelectedRepo(nextRepos[0]);
        }
      } catch {
        setRepos([]);
        setError('GitHub data could not be loaded. Update the configured username or try again later.');
      } finally {
        setLoading(false);
      }
    };

    void loadRepos();
  }, []);

  useEffect(() => {
    const loadReadme = async () => {
      if (!selectedRepo) {
        setReadme('');
        return;
      }

      setReadmeLoading(true);
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${selectedRepo.owner.login}/${selectedRepo.name}/${selectedRepo.default_branch}/README.md`,
        );

        const text = await response.text();
        setReadme(response.ok ? text.slice(0, 1600) : 'README preview unavailable for this repo.');
      } catch {
        setReadme('README preview unavailable for this repo.');
      } finally {
        setReadmeLoading(false);
      }
    };

    void loadReadme();
  }, [selectedRepo]);

  const repoCountLabel = useMemo(() => {
    if (loading) return 'Loading repos';
    return `${repos.length} repositories loaded for ${githubConfig.username}`;
  }, [loading, repos.length]);

  const formattedUpdatedAt = selectedRepo
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(selectedRepo.updated_at))
    : null;

  return (
    <section className="github-widget surface-panel">
      <div className="github-widget__chrome" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="panel-head">
        <span className="eyebrow">source previews</span>
        <h2>Recent repositories and README context</h2>
        <p>{isDemoFeed ? 'Connect your GitHub username in src/data/github.ts to replace the demo feed.' : repoCountLabel}</p>
      </div>

      {isDemoFeed ? <p className="github-note surface-faint">Showing the configured demo account until a real GitHub username is connected.</p> : null}
      {error ? <p className="github-error">{error}</p> : null}

      <div className="github-grid">
        <div className="github-list">
          {repos.map((repo) => (
            <button
              key={repo.id}
              type="button"
              className={`repo-item ${selectedRepo?.id === repo.id ? 'is-active' : ''}`}
              onClick={() => setSelectedRepo(repo)}
            >
              <div>
                <strong>{repo.name}</strong>
                <p>{repo.description ?? 'No description yet.'}</p>
              </div>
              <div className="repo-meta">
                <span><Star size={14} /> {repo.stargazers_count}</span>
                <span><GitFork size={14} /> {repo.forks_count}</span>
                <span>{repo.language ?? 'Unknown'}</span>
              </div>
            </button>
          ))}
          {!loading && repos.length === 0 ? <p className="repo-empty">No repos available.</p> : null}
        </div>

        <div className="readme-card">
          <div className="readme-card__head">
            <div>
              <span className="eyebrow">README preview</span>
              <h3>{selectedRepo?.name ?? 'Select a repo'}</h3>
            </div>
            {selectedRepo ? (
              <a href={selectedRepo.html_url} target="_blank" rel="noreferrer">
                <BookOpenText size={16} />
                Open on GitHub
              </a>
            ) : null}
          </div>
          {selectedRepo ? (
            <div className="readme-meta">
              <span>{selectedRepo.language ?? 'No language set'}</span>
              {formattedUpdatedAt ? (
                <span>
                  <Clock3 size={14} />
                  Updated {formattedUpdatedAt}
                </span>
              ) : null}
            </div>
          ) : null}
          <pre>{readmeLoading ? 'Loading README...' : readme || 'Pick a repo to preview its README.'}</pre>
        </div>
      </div>
    </section>
  );
};
