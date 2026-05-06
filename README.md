# PersonalWeb v2

Client-facing portfolio and product ecosystem built with React, TypeScript, and Vite.

## What changed in v2

- Reframed the app around `Home`, `Work`, `About`, `Contact`, and a private `Studio`.
- Rebuilt project detail pages as richer case studies instead of tab-only summaries.
- Moved project content into per-project files so new work is easier to add.
- Kept the theme system and ecosystem direction while simplifying the public experience.

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Framer Motion

## Project structure

```text
src/
  components/
  config/
  content/
    projects/
      mapper.ts
      personalweb.ts
      projectTemplate.ts
  data/
    projects.ts
    site.ts
  pages/
  store/
  types/
  utils/
```

## Adding a new project

1. Duplicate `src/content/projects/projectTemplate.ts`.
2. Rename it to the new slug, for example `src/content/projects/new-app.ts`.
3. Fill in the metadata, metrics, links, and `sections`.
4. Import the new project into `src/data/projects.ts`.
5. If the project has a live or private embed, replace placeholder URLs with deployed ones.

## Available commands

- `npm run dev` - start the local dev server
- `npm run build` - type-check and build for production
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript without emitting files
- `npm run preview` - preview the production build locally

## Important follow-up before deployment

- Replace placeholder auth in `src/data/auth.ts` and `src/store/useAuthStore.ts`.
- Replace demo GitHub data in `src/data/github.ts`.
- Replace placeholder contact details in `src/data/site.ts`.
- Replace localhost embed URLs in `src/content/projects/mapper.ts`.
