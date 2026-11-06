# AGENTS.md

Guide for any agent or contributor working in this repository. Keep it up to date, especially the "Current status" section.

## Project

Personal portfolio of Juan Escobar, web developer (JavaScript, Vue 3). Design concept: "Reactive State", a site that reacts to every visitor gesture (cursor, scroll, click) with giant typography, per-module color and transitions.

Visual reference: `docs/design/` (static HTML mockups of every section, the mobile views and the transition) and `docs/design/animation-notes.md` (animation and interaction per section).

## Language policy

- The whole repository is in English: code (identifiers, file names, route names), comments, commit messages, tags, `CHANGELOG.md`, `README.md`, this file, notes in `docs/` and test descriptions.
- What the visitor sees stays in Spanish: UI copy, `<title>` and meta tags, `lang="es"` and the public URLs (`/proyectos`, `/sobre-mi`, `/habilidades`, `/experiencia`, `/contacto`, `/archivo`).
- Code identifiers are English and map to the Spanish slugs, for example `{ id: 'about', path: '/sobre-mi' }`. Data in `src/content/` uses English keys and Spanish values.
- The mockups in `docs/design/` keep their Spanish copy because it is the real site text.

## Stack

- Vue 3 (`<script setup>`), strict TypeScript, Vite, Vue Router.
- Styling: native CSS with tokens (`src/assets/styles/tokens.css`) and `<style scoped>`. No utility frameworks.
- Animation: GSAP (ScrollTrigger, SplitText) and Lenis.
- Prerendering: `vite-ssg` and `@unhead/vue` for titles and meta.
- Quality: oxlint, ESLint, Prettier, `vue-tsc`, Vitest, Playwright with axe.
- Package manager: pnpm. Node 24 (`.nvmrc`).

## Commands

| Command                             | Purpose                                                        |
| ----------------------------------- | -------------------------------------------------------------- |
| `pnpm install`                      | Installs dependencies and activates the git hooks              |
| `pnpm dev`                          | Development server                                             |
| `pnpm build`                        | Type-checks and generates the prerendered `dist/`              |
| `pnpm preview`                      | Serves `dist/`                                                 |
| `pnpm lint` / `pnpm lint:check`     | Lint with fixes / check only                                   |
| `pnpm format` / `pnpm format:check` | Prettier                                                       |
| `pnpm type-check`                   | `vue-tsc --build`                                              |
| `pnpm test:unit`                    | Vitest                                                         |
| `pnpm test:e2e`                     | Playwright                                                     |
| `pnpm release`                      | Bumps the version, generates the CHANGELOG and creates the tag |

## Code conventions

- Components in `PascalCase`, composables named `useXxx` in `src/composables/`, typed content in `src/content/`.
- Placeholder data is written in square brackets (for example `[Company]`) until real content exists.
- CSS uses only variables from `tokens.css`; no loose colors or easing curves.
- Every animation respects `prefers-reduced-motion` and is cleaned up on unmount (`gsap.context().revert()`).
- Animate only `transform` and `opacity`.
- No custom cursor or proximity effects under `(hover: none)`.
- Accessibility: native elements (`button`, `a`), visible 2 px lime focus ring, AA contrast, mobile menu with focus trap and Esc to close.

## Navigation architecture

- The home page is a single scroll with six sections: home, projects, about, skills, experience, contact.
- Each section has its own URL (`/`, `/proyectos`, `/sobre-mi`, ...). Opening a URL scrolls to its section, and scrolling updates the URL with `router.replace`, without a transition.
- Real routes: `/archivo` (full listing) and `/proyectos/:slug` (case study). Only switching between views uses the "Recompile" transition.
- Each section declares `data-theme`; crossing 50% of the viewport updates `--bg`, `--fg` and `--accent` on `body`.

## Git, commits and versioning

- Commits are authored by the repository owner (local git config). Never add `Co-Authored-By` trailers or mentions of tools or assistants in commits, tags, changelog, documentation, code or metadata.
- Conventional Commits 1.0: `type(scope): description`, in English, imperative mood.
  - Types: `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `docs`, `build`, `ci`, `chore`, `revert`.
  - Suggested scopes: `hero`, `projects`, `about`, `skills`, `experience`, `contact`, `cursor`, `loader`, `transition`, `router`, `tokens`, `content`, `deps`, `config`.
  - Breaking changes: `!` after the scope or `BREAKING CHANGE:` in the footer.
  - The `commit-msg` hook validates with commitlint (body lines up to 100 characters); the `pre-commit` hook runs lint-staged.
- Semantic Versioning 2.0 applied to the site:
  - MAJOR: public URLs change or the site is fully redesigned.
  - MINOR: new sections, routes or effects (`feat`).
  - PATCH: fixes, performance and visual tweaks (`fix`, `perf`, `style`).
  - During development use `0.y.z`: every closed phase bumps the minor. `1.0.0` is the first public deployment with real content.
- One commit per logical unit of work; one release (`pnpm release`) when a phase closes.
- Do not create a remote or push unless explicitly asked.

## Documentation

- `README.md`, `AGENTS.md`, `CHANGELOG.md` and every `.md` under `docs/` are written in plain Markdown, in English, without emojis.

## Phase roadmap

- [x] Phase 0 - Setup: scaffold, dependencies, tokens, hooks, documentation (v0.1.0).
- [x] Phase 1 - Foundation (v0.2.0): fonts, layout, `AppHeader`, `MobileMenu`, `AppCursor`, `AppLoader`, Lenis, grain, `useSectionTheme`, `useSectionRoute`.
- [ ] Phase 2 - Home sections (static + GSAP): hero, projects, about, skills (static version), experience, contact.
- [ ] Phase 3 - Project routes: `/archivo`, `/proyectos/:slug` and the "Recompile" transition.
- [ ] Phase 4 - Polish: mobile, accessibility, performance, prerender, meta/OG, sitemap, E2E and axe passing.
- [ ] Phase 5 - Heavy effects: matter.js physics in Skills and OGL WebGL distortion on the project preview, lazy loaded and disabled on touch or with reduced motion.
- [ ] Phase 6 - Deployment, CI/CD and real content:
  - Cloudflare (Workers static assets or Pages), domain, real data.
  - GitHub Actions: `ci.yml` (lint, types, unit, build, E2E and commitlint on PRs) and `deploy.yml` (preview per PR and production on `main` or a `vX.Y.Z` tag, using `wrangler-action`; secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`). `main` protected, requiring green CI.
  - GitHub Release with CHANGELOG notes when a tag is published.
  - VPS portability: serve `dist/` with Nginx or Caddy; alternative rsync-over-SSH deploy job, disabled until a server exists.

## Current status

- Phase in progress: Phase 1 is closed (v0.2.0). The next one is Phase 2.
- Done in Phase 1: custom cursor (`AppCursor`, variants via `data-cursor` and `data-cursor-label`), intro loader (first visit per session, skipped by an inline script in `index.html`), header, mobile menu with focus trap, grain overlay, Lenis smooth scroll synced with GSAP, per-section page atmosphere (`useSectionTheme`) and URL/scroll sync (`useSectionRoute`). `HomeView` still renders placeholder blocks.
- Next step: Phase 2 - replace each placeholder in `HomeView` with a real section component under `src/components/sections/` (start with the hero), using typed data in `src/content/`.
- Things to know:
  - Components must stay SSR-safe (`vite-ssg` prerenders): touch `window`/`document` only in `onMounted` or helpers guarded for the client.
  - `lockScroll()`/`unlockScroll()` are counted; always pair them (loader and menu use them).
  - Section ids in the DOM equal the ids in `SECTIONS`; do not rename one without the other.
  - E2E: `pnpm exec playwright install chromium` once; tests set `portfolio:loader-seen` to skip the loader. The Vue DevTools overlay is excluded from axe because it only exists in dev.
- Open questions: real content (projects, experience, photos, email) and the domain.
