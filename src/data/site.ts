import type {
  ContactChannel,
  EcosystemModule,
  ExperienceHighlight,
  HeroLink,
  HighlightStat,
  ProcessStep,
  ServiceDefinition,
} from '../types/site';

export const siteProfile = {
  name: 'Dark',
  title: 'Frontend product systems for map-heavy tools, media-rich interfaces, and portfolio ecosystems.',
  intro:
    'PersonalWeb v2 shifts the site from a prototype shell into a client-facing portfolio: clearer case studies, better structure, and a cleaner path into the wider product ecosystem.',
  mission:
    'The goal is to win work without flattening the personality of the projects. Public pages stay focused and persuasive, while deeper tooling lives in a private studio.',
  location: 'UK / remote-friendly',
  email: 'profile@example.com',
  availability: 'Open to freelance, contract, and full-time opportunities focused on product UI, frontend systems, and creative tooling.',
  currentlyExploring: 'Portfolio ecosystems, deployable embeds, and product shells that stay elegant as they scale.',
  githubUrl: 'https://github.com/octocat',
};

export const homeHeroLinks: HeroLink[] = [
  { label: 'View work', href: '/work', emphasis: 'primary' },
  { label: 'Start a conversation', href: '/contact', emphasis: 'secondary' },
  { label: 'Read about the approach', href: '/about', emphasis: 'secondary' },
  { label: 'Open GitHub', href: siteProfile.githubUrl, external: true, emphasis: 'secondary' },
];

export const highlightStats: HighlightStat[] = [
  {
    label: 'Best fit',
    value: 'Client-facing product surfaces',
    detail: 'Interfaces that need both visual polish and a system strong enough to keep growing.',
  },
  {
    label: 'Core strength',
    value: 'Turning messy ideas into structured UI',
    detail: 'Useful when a project needs hierarchy, storytelling, and a design language that actually feels authored.',
  },
  {
    label: 'Built for',
    value: 'Work + ecosystem visibility',
    detail: 'The portfolio now sells capability while still acting as the launchpad for connected apps and experiments.',
  },
];

export const services: ServiceDefinition[] = [
  {
    title: 'Product-facing frontend builds',
    summary: 'Design and implementation for web products that need credibility, usability, and strong visual pacing.',
    outcomes: ['Sharper IA and hierarchy', 'Reusable component systems', 'Delivery-ready React implementations'],
  },
  {
    title: 'Portfolio and ecosystem strategy',
    summary: 'Sites that present the work well while staying extensible enough to host tools, demos, and future features.',
    outcomes: ['Clearer public routes', 'Case-study friendly content models', 'Better paths into live products'],
  },
  {
    title: 'Complex tool UX',
    summary: 'A strong fit for map, media, admin, and data-rich interfaces where the UI cannot feel generic.',
    outcomes: ['Intentional design language', 'Task-driven layouts', 'Scalable interaction patterns'],
  },
];

export const processSteps: ProcessStep[] = [
  {
    label: '01',
    title: 'Frame the product properly',
    description: 'Define audience, priorities, and what the interface must make clear in the first few seconds.',
  },
  {
    label: '02',
    title: 'Design a system, not just screens',
    description: 'Build the visual language, layout rules, and reusable patterns that keep the product coherent.',
  },
  {
    label: '03',
    title: 'Ship a polished frontend',
    description: 'Implement the experience in React with a structure that remains maintainable as content and features expand.',
  },
  {
    label: '04',
    title: 'Keep growth cheap',
    description: 'Make projects, case studies, and future modules easy to add without reworking the whole shell.',
  },
];

export const ecosystemModules: EcosystemModule[] = [
  {
    title: 'Flagship products',
    description: 'Dedicated work pages combine product narrative, outcomes, and optional live surfaces in one place.',
    href: '/work',
    internal: true,
  },
  {
    title: 'Source and experiments',
    description: 'GitHub previews show the code-side of the ecosystem without taking over the public story.',
    href: siteProfile.githubUrl,
  },
  {
    title: 'Private studio',
    description: 'Owner-only space for future content operations, protected embeds, and project management workflows.',
    href: '/studio',
    internal: true,
  },
];

export const aboutPillars = [
  'Product thinking first: make the interface explain the product, not just decorate it.',
  'A preference for atmospheric, deliberate design over template-shaped dashboards.',
  'Strong fit for projects where frontend structure and storytelling matter equally.',
];

export const experienceHighlights: ExperienceHighlight[] = [
  {
    label: 'Direction',
    title: 'Building a connected portfolio ecosystem',
    description: 'The website, flagship apps, and future private tooling are all being shaped to feel like one coherent system.',
  },
  {
    label: 'Focus',
    title: 'React frontends with product intent',
    description: 'Especially useful for apps that need both modular architecture and a distinct visual identity.',
  },
  {
    label: 'Next',
    title: 'Deeper case studies and streamlined content ops',
    description: 'v2 is about making the work easier to understand, easier to add, and easier to trust.',
  },
];

export const clientFitPoints = [
  'Product teams that need a sharper frontend without rebuilding everything from scratch.',
  'Founders who want their app, portfolio, or demo surface to look more deliberate and credible.',
  'Creative or technical tools where information density has to stay elegant.',
];

export const contactChannels: ContactChannel[] = [
  {
    label: 'Email',
    value: siteProfile.email,
    href: `mailto:${siteProfile.email}`,
    note: 'Best for project briefs, role outreach, and collaboration enquiries.',
  },
  {
    label: 'Location',
    value: siteProfile.location,
    href: '/about',
    note: 'Remote-friendly and comfortable working across product, design, and engineering conversations.',
  },
  {
    label: 'GitHub',
    value: 'Code previews and repositories',
    href: siteProfile.githubUrl,
    note: 'Useful for seeing how the ecosystem is structured behind the UI.',
    external: true,
  },
];

export const engagementModes = [
  'Designing and building a polished new product surface.',
  'Refining an existing app so the UI feels more intentional and scalable.',
  'Turning a portfolio or demo environment into a stronger client-facing experience.',
];

export const projectIngestionSteps = [
  'Duplicate `src/content/projects/projectTemplate.ts` and rename it to the new slug.',
  'Fill in the project metadata, metrics, links, and case-study sections.',
  'Import the file in `src/data/projects.ts` to add it to the work index automatically.',
  'Update any live or private embed URLs once the external app is deployed.',
];

export const studioChecklist = [
  'Move placeholder auth to a real provider before exposing private content publicly.',
  'Replace demo contact details, GitHub config, and localhost embed URLs with production values.',
  'Add screenshots or visual assets to project gallery sections as the case studies mature.',
  'Introduce a CMS or MDX layer if project volume grows beyond hand-authored content files.',
];
