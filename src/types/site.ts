export type ThemeId =
  | 'dark-matter'
  | 'positron'
  | 'voyager'
  | 'oceanic'
  | 'atlas-sand'
  | 'pine-trail';

export type ProjectStatus = 'live' | 'building' | 'concept';

export type ProjectType = 'platform' | 'portfolio' | 'tool' | 'experiment';

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
  emphasis?: 'primary' | 'secondary';
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

export interface ProjectMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
  ownerOnly?: boolean;
  kind: 'live' | 'repo' | 'demo' | 'contact';
}

export interface ProjectGalleryItem {
  eyebrow?: string;
  title: string;
  description: string;
}

interface BaseProjectSection {
  id: string;
  title: string;
  description: string;
  ownerOnly?: boolean;
}

export interface NarrativeProjectSection extends BaseProjectSection {
  type: 'narrative';
  paragraphs: string[];
}

export interface BulletProjectSection extends BaseProjectSection {
  type: 'bullets';
  items: string[];
}

export interface MetricsProjectSection extends BaseProjectSection {
  type: 'metrics';
  metrics: ProjectMetric[];
}

export interface GalleryProjectSection extends BaseProjectSection {
  type: 'gallery';
  items: ProjectGalleryItem[];
}

export interface EmbedProjectSection extends BaseProjectSection {
  type: 'embed';
  embedUrl?: string;
  embedHeight?: number;
  ctaLabel?: string;
}

export type ProjectSection =
  | NarrativeProjectSection
  | BulletProjectSection
  | MetricsProjectSection
  | GalleryProjectSection
  | EmbedProjectSection;

export interface ProjectDefinition {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  year: string;
  type: ProjectType;
  roles: string[];
  services: string[];
  idealFor: string[];
  stack: string[];
  tags: string[];
  links: ProjectLink[];
  themeHint: ThemeId;
  outcome: string;
  metrics: ProjectMetric[];
  featured?: boolean;
  sections: ProjectSection[];
}

export interface NavItem {
  label: string;
  to: string;
}

export interface ServiceDefinition {
  title: string;
  summary: string;
  outcomes: string[];
}

export interface ProcessStep {
  label: string;
  title: string;
  description: string;
}

export interface ExperienceHighlight {
  label: string;
  title: string;
  description: string;
}

export interface EcosystemModule {
  title: string;
  description: string;
  href: string;
  internal?: boolean;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  note: string;
  external?: boolean;
}

export interface EcosystemGraphNode {
  id: string;
  label: string;
  type: 'project' | 'collab' | 'discipline' | 'signal';
  x: number;
  y: number;
  description: string;
  accent: 'blue' | 'teal' | 'red' | 'yellow';
  href?: string;
}

export interface EcosystemGraphEdge {
  from: string;
  to: string;
  label: string;
}

export interface EcosystemGraphDefinition {
  nodes: EcosystemGraphNode[];
  edges: EcosystemGraphEdge[];
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
