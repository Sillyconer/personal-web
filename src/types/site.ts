export type ThemeId =
  | 'dark-matter'
  | 'positron'
  | 'voyager'
  | 'oceanic'
  | 'atlas-sand'
  | 'pine-trail';

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  vibe: string;
  colors: [string, string, string];
}

export interface HeroLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface HighlightStat {
  label: string;
  value: string;
  detail?: string;
}

export interface GitHubConfig {
  username: string;
  featuredRepos: string[];
}

export interface ProjectTab {
  id: string;
  label: string;
  type: 'content' | 'embed' | 'gallery';
  title: string;
  description: string;
  content?: string[];
  embedUrl?: string;
  embedHeight?: number;
  ownerOnly?: boolean;
  ctaLabel?: string;
}

export interface ProjectDefinition {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  status: 'live' | 'building' | 'concept';
  year: string;
  stack: string[];
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  embedModeQuery?: string;
  themeHint: ThemeId;
  featured?: boolean;
  tabs: ProjectTab[];
}

export interface NavItem {
  label: string;
  to: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface OwnerProfile {
  username: string;
  displayName: string;
  role: string;
}
