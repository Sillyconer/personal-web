import type { ProjectDefinition } from '../../types/site';

export const projectTemplate: ProjectDefinition = {
  slug: 'new-project',
  name: 'New Project',
  tagline: 'One-line description of the product or experience.',
  summary: 'Short card summary for the work index.',
  description: 'Longer project description for the case-study hero.',
  status: 'concept',
  year: '2026',
  type: 'tool',
  roles: ['Role one', 'Role two'],
  services: ['Service one', 'Service two'],
  idealFor: ['Audience one', 'Audience two'],
  stack: ['React', 'TypeScript'],
  tags: ['ui', 'product'],
  links: [{ label: 'Live preview', href: 'https://example.com', external: true, kind: 'live' }],
  themeHint: 'positron',
  outcome: 'What the project helps prove or achieve.',
  metrics: [
    { label: 'Metric', value: 'Value', detail: 'Optional context.' },
    { label: 'Metric', value: 'Value', detail: 'Optional context.' },
    { label: 'Metric', value: 'Value', detail: 'Optional context.' },
  ],
  sections: [
    {
      id: 'context',
      type: 'narrative',
      title: 'Context',
      description: 'Why the project exists.',
      paragraphs: ['Paragraph one.', 'Paragraph two.'],
    },
    {
      id: 'decisions',
      type: 'bullets',
      title: 'Key decisions',
      description: 'The most important design or implementation choices.',
      items: ['Decision one', 'Decision two', 'Decision three'],
    },
    {
      id: 'showcase',
      type: 'gallery',
      title: 'Showcase slices',
      description: 'Use this for screenshots, flows, or notable surfaces.',
      items: [{ eyebrow: 'Slice', title: 'Feature or screen', description: 'What this part demonstrates.' }],
    },
  ],
};
