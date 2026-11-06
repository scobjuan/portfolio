# Juan Escobar Portfolio

Personal portfolio of Juan Escobar, web developer (JavaScript, Vue 3). Design concept "Reactive State": an interface that responds to every visitor gesture, with large-format variable typography, per-section color, a custom cursor and page transitions. The site content is in Spanish; the repository is in English.

## Requirements

- Node 24 or newer (see `.nvmrc`)
- pnpm 12

## Quick start

```sh
pnpm install
pnpm dev
```

## Scripts

| Script            | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `pnpm dev`        | Development server                                               |
| `pnpm build`      | Type-checks and generates the prerendered static site in `dist/` |
| `pnpm preview`    | Serves `dist/` locally                                           |
| `pnpm lint`       | oxlint and ESLint with automatic fixes                           |
| `pnpm format`     | Formats with Prettier                                            |
| `pnpm type-check` | Type checking with `vue-tsc`                                     |
| `pnpm test:unit`  | Unit tests with Vitest                                           |
| `pnpm test:e2e`   | End-to-end tests with Playwright                                 |
| `pnpm release`    | Computes the version, updates `CHANGELOG.md` and creates the tag |

## Structure

```
src/
  assets/styles/   tokens, reset and base styles
  components/      layout, ui and sections
  composables/     cursor, scroll, reveals, per-section theme
  content/         typed data (projects, experience, skills)
  router/          route definitions
  views/           page views
docs/design/       reference mockups and animation notes
```

## Conventions

- Commits follow Conventional Commits and versions follow Semantic Versioning. Details in `AGENTS.md`.
- The roadmap and work status live in `AGENTS.md`.

## License

All rights reserved.
