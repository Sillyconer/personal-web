import type { HeroLink, HighlightStat } from '../types/site';

export const heroLinks: HeroLink[] = [
  { label: 'View projects', href: '/projects' },
  { label: 'Read CV', href: '/cv' },
  { label: 'Open GitHub', href: 'https://github.com/octocat', external: true },
  { label: 'Owner area', href: '/admin' },
];

export const highlightStats: HighlightStat[] = [
  {
    label: 'Focus',
    value: 'Interface systems with product intent',
    detail: 'Designing flexible shells that still feel tailored, expressive, and easy to extend.',
  },
  {
    label: 'Current build',
    value: 'Portfolio + Mapper ecosystem',
    detail: 'A public-facing profile that can also host embeds, project narratives, and private owner flows.',
  },
  {
    label: 'Working style',
    value: 'Modular frontends with strong visual identity',
    detail: 'Reusable patterns, config-driven content, and deliberate interactions over generic dashboards.',
  },
];

export const profileCopy = {
  name: 'Dark',
  title: 'Building polished product surfaces for maps, media, and personal systems',
  intro:
    'This site acts as a living CV and a basecamp for the projects around it. The goal is a portfolio that feels authored, not templated, while still being practical to grow over time.',
  mission:
    'I like making interfaces that are structured enough to scale, but distinctive enough to feel memorable. The sweet spot is where product thinking, data-rich UI, and strong atmosphere overlap.',
  location: 'UK / remote-friendly',
  email: 'profile@example.com',
  availability: 'Open to product-focused frontend, platform, and creative tooling work.',
  currentlyExploring: 'Map-inspired design systems, embed-friendly app shells, and owner/private content patterns.',
};

export const capabilityPoints = [
  'Build modular React interfaces that can expand without needing a redesign.',
  'Translate product ideas into structure, hierarchy, and a consistent interaction language.',
  'Design portfolio surfaces that can host both public storytelling and private utility.',
];

export const timelineMoments = [
  {
    label: 'Now',
    title: 'Refining a project ecosystem',
    description: 'Linking portfolio, embeds, and admin-ready surfaces into one coherent shell.',
  },
  {
    label: 'Approach',
    title: 'Themeable, registry-driven architecture',
    description: 'Core sections stay reusable while content, mood, and project modules remain easy to swap.',
  },
  {
    label: 'Next',
    title: 'Deeper project storytelling',
    description: 'Richer case studies, cleaner live embeds, and more credible profile content in one place.',
  },
];
