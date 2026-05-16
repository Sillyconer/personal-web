import type { ProjectDefinition } from '../../types/site';

export const personalwebProject: ProjectDefinition = {
  slug: 'personalweb',
  name: 'PersonalWeb',
  tagline: 'A portfolio shell rebuilt to win work, surface ecosystem products, and stay easy to extend.',
  summary:
    'PersonalWeb v2 reframes the site as a sharper client-facing portfolio with stronger case studies, cleaner IA, and a clearer split between public content and private studio tooling.',
  description:
    'The project is the ecosystem hub. It needs to explain the work well enough to win opportunities, while still acting as the container for products, source previews, and future owner workflows.',
  status: 'building',
  year: '2026',
  type: 'portfolio',
  roles: ['Product strategy', 'Content architecture', 'Frontend implementation'],
  services: ['Portfolio redesign', 'Case-study system', 'Private studio planning'],
  idealFor: ['Personal ecosystems', 'Product showcases', 'Portfolio-to-app bridges'],
  stack: ['React', 'TypeScript', 'Vite', 'React Router', 'Zustand'],
  tags: ['portfolio', 'case-study', 'studio', 'content-system'],
  links: [{ label: 'Source repository', href: 'https://github.com/', external: true, kind: 'repo' }],
  themeHint: 'atlas-sand',
  outcome: 'A cleaner public narrative, a better home for flagship work, and a far cheaper path for adding new projects.',
  metrics: [
    { label: 'Audience shift', value: 'Client-first', detail: 'The public surface now leads with value, not prototype scaffolding.' },
    { label: 'Content flow', value: 'Project-per-file', detail: 'New case studies are easier to add and maintain.' },
    { label: 'Private path', value: 'Studio ready', detail: 'Owner tools are separated from the main visitor experience.' },
  ],
  featured: true,
  sections: [
    {
      id: 'problem',
      type: 'narrative',
      title: 'What v2 needed to solve',
      description: 'The first version had a strong atmosphere but mixed too many jobs together.',
      paragraphs: [
        'v1 looked promising, but it still felt like a prototype shell: public portfolio content, owner tooling, live embeds, and generic placeholder data all shared the same stage. That made the site harder to trust and harder to scan.',
        'v2 fixes the positioning. The public experience now focuses on winning work and explaining the ecosystem clearly, while the private studio becomes a separate surface for future operational features.',
      ],
    },
    {
      id: 'upgrade-list',
      type: 'bullets',
      title: 'Upgrade themes implemented in v2',
      description: 'The redesign is not just visual; it changes how the site grows.',
      items: [
        'Reworked routing around Home, CV, Work, Playground, Contact, and Studio.',
        'Replaced the flat project tabs model with richer case-study sections.',
        'Split project content into per-project files to streamline new additions.',
        'Separated professional proof from the louder homage worlds.',
      ],
    },
    {
      id: 'route-split',
      type: 'code',
      title: 'Route split example',
      description: 'The public IA now separates professional pages from Playground routes.',
      filename: 'src/App.tsx',
      language: 'tsx',
      code: [
        '<Route path="cv" element={<CVPage />} />',
        '<Route path="work" element={<WorkPage />} />',
        '<Route path="playground" element={<PlaygroundPage />} />',
        '<Route path="playground/pokemon" element={<PokemonPlaygroundPage />} />',
        '<Route path="playground/zelda" element={<ZeldaPlaygroundPage />} />',
        '<Route path="playground/chrono" element={<ChronoPlaygroundPage />} />',
        '<Route path="playground/minecraft" element={<ArcadePage />} />',
      ].join('\n'),
      notes: [
        'CV and Work stay readable and professional.',
        'Homage worlds keep their own route family.',
        'The transition wrapper stays unchanged.',
      ],
    },
    {
      id: 'structure',
      type: 'gallery',
      title: 'Content architecture',
      description: 'The project now has a clearer shape for future features and case studies.',
      items: [
        {
          eyebrow: 'Public IA',
          title: 'Visitor-first routes',
          description: 'Work, About, and Contact are now primary, while studio tooling lives off the main public path.',
        },
        {
          eyebrow: 'Project ingestion',
          title: 'One project per file',
          description: 'Each project definition owns its own metadata and sections, which makes scaling the portfolio cheaper.',
        },
        {
          eyebrow: 'Private growth',
          title: 'Studio groundwork',
          description: 'The authenticated area can expand into real content operations without cluttering the portfolio.',
        },
      ],
    },
    {
      id: 'ecosystem-graph',
      type: 'graph',
      graphId: 'ecosystem',
      title: 'Ecosystem graph',
      description: 'A reusable visualisation block showing how the portfolio, products, collaborators, and signals connect.',
    },
    {
      id: 'roadmap-signals',
      type: 'metrics',
      title: 'What the next iteration should add',
      description: 'The current v2 establishes the right shape. The next step is hardening it.',
      metrics: [
        { label: 'Auth', value: 'Replace placeholder', detail: 'Move studio access to a real provider before deployment.' },
        { label: 'Content', value: 'MDX or CMS-ready', detail: 'Useful once project volume and media depth grow.' },
        { label: 'Embeds', value: 'Deploy-safe routes', detail: 'Mapper should stop depending on localhost URLs.' },
      ],
    },
  ],
};
