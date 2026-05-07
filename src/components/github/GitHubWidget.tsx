import { useEffect, useMemo, useState } from 'react';
import { GitFork, Star } from 'lucide-react';

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
        setError('GitHub data could not be loaded right now. Update the username or try again later.');
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
        setReadme(response.ok ? text.slice(0, 1600) : 'readme unavailable.');
      } catch {
        setReadme('readme unavailable.');
      } finally {
        setReadmeLoading(false);
      }
    };

    void loadReadme();
  }, [selectedRepo]);

  const statusText = useMemo(() => {
    if (loading) return 'loading...';
    return `${repos.length} repos loaded for ${githubConfig.username}`;
  }, [loading, repos.length]);

  return (
    <section className="ghw t-frame t-frame--sunken">
      <div className="t-header">
        <div className="t-header__dots">
          <span className="t-header__dot t-header__dot--r" />
          <span className="t-header__dot t-header__dot--y" />
          <span className="t-header__dot t-header__dot--g" />
        </div>
          <span>github treasure chest</span>
          <span className="ghw__status">{isDemoFeed ? '[demo feed]' : statusText}</span>
      </div>

      {error ? <p className="ghw__error text-red">{error}</p> : null}

      <div className="ghw__grid">
        {/* Repo listing */}
        <div className="ghw__list">
          {repos.map((repo) => (
            <button
              key={repo.id}
              type="button"
              className={`ghw__repo ${selectedRepo?.id === repo.id ? 'ghw__repo--active' : ''}`}
              onClick={() => setSelectedRepo(repo)}
            >
              <div className="ghw__repo-head">
                <span className="text-teal">{repo.name}</span>
                <span className="ghw__repo-meta">
                  <Star size={10} /> {repo.stargazers_count}
                  <GitFork size={10} /> {repo.forks_count}
                  {repo.language ? ` // ${repo.language}` : ''}
                </span>
              </div>
              <p className="muted">{repo.description ?? 'no description.'}</p>
            </button>
          ))}
          {!loading && repos.length === 0 ? <p className="muted">no repos found.</p> : null}
        </div>

        {/* README preview */}
        <div className="ghw__readme">
          <div className="ghw__readme-head">
            <span className="eyebrow">readme // {selectedRepo?.name ?? '...'}</span>
            {selectedRepo ? (
              <a href={selectedRepo.html_url} target="_blank" rel="noreferrer" className="px-btn">
                open repo
              </a>
            ) : null}
          </div>
          <div className="ghw__readme-prompt">
            codex fragment // readme excerpt
          </div>
          <pre className="ghw__readme-body">
            {readmeLoading ? 'loading...' : readme || 'select a repo to preview readme.'}
          </pre>
        </div>
      </div>
    </section>
  );
};
