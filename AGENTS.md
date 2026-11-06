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
- All content lives in `src/content/` as typed data. It is fictional placeholder data (made-up companies, `example.com` addresses) until real content replaces it; never hardcode copy in components that belongs to the content files.
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
- The remote is `origin`, the private GitHub repository `scobjuan/portfolio`, over HTTPS using the GitHub CLI as a repository-local credential helper (no SSH key is registered for it). Do not push unless explicitly asked.

## Documentation

- `README.md`, `AGENTS.md`, `CHANGELOG.md` and every `.md` under `docs/` are written in plain Markdown, in English, without emojis.

## Phase roadmap

- [x] Phase 0 - Setup: scaffold, dependencies, tokens, hooks, documentation (v0.1.0).
- [x] Phase 1 - Foundation (v0.2.0): fonts, layout, `AppHeader`, `MobileMenu`, `AppCursor`, `AppLoader`, Lenis, grain, `useSectionTheme`, `useSectionRoute`.
- [x] Phase 2 - Home sections (static + GSAP) (v0.3.0): hero, projects, about, skills (static version), experience, contact.
- [x] Phase 3 - Project routes (v0.4.0): `/archivo`, `/proyectos/:slug` and the "Recompile" transition.
- [x] Phase 4 - Polish (v0.5.0): mobile, accessibility, performance, prerender, meta/OG, sitemap, E2E and axe passing.
- [ ] Phase 5 - Heavy effects: matter.js physics in Skills and OGL WebGL distortion on the project preview, lazy loaded and disabled on touch or with reduced motion.
- [ ] Phase 6 - Deployment, CI/CD and real content:
  - Cloudflare (Workers static assets or Pages), domain, real data.
  - GitHub Actions: `ci.yml` (lint, types, unit, build, E2E and commitlint on PRs) and `deploy.yml` (preview per PR and production on `main` or a `vX.Y.Z` tag, using `wrangler-action`; secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`). `main` protected, requiring green CI.
  - GitHub Release with CHANGELOG notes when a tag is published.
  - VPS portability: serve `dist/` with Nginx or Caddy; alternative rsync-over-SSH deploy job, disabled until a server exists.

## Current status

- Phase in progress: Phase 4 is closed (v0.5.0). The next one is Phase 5 (heavy effects).
- Done in Phase 4: mobile pass (project cards with thumbnails, horizontally scrolling filters, menu and contact fit), header that hides while scrolling down and returns on scroll up, per-page metadata through `useSeo` (title, description, canonical, Open Graph, Twitter, `noindex` on 404), prerendered `404.html`, `sitemap.xml` and `robots.txt` written at build time, SVG favicon, Apple touch icon and OG image generated by `pnpm assets`, preloaded Latin fonts, keyboard and SEO E2E tests, axe audit on home, archive and a project page.
- Next step: Phase 5 - matter.js physics for the Skills pile (drag and throw, cursor label "Arrastra") and OGL WebGL distortion on the project preview, both loaded with dynamic `import()` when their section is reached and disabled on touch devices or with reduced motion.
- Known gaps, by design: the Contact curtain-from-below entrance is not built (the body theme crossfade stands in for it); the About section has no CV link; project and portrait images are placeholders (`ProjectVisual`, striped blocks), so image optimisation (AVIF, `loading="lazy"`, `srcset`) is pending until real images exist; the site URL defaults to `https://juanescobar.example.com` until `VITE_SITE_URL` is set.
- Things to know:
  - Keep `@unhead/vue` on the same major as the one `vite-ssg` depends on (currently 2.x). A different major creates a second head instance: `useHead` then silently does nothing, in the browser and in the prerendered HTML.
  - Set page metadata with `useSeo({ title, description })` (`src/composables/useSeo.ts`), never with a bare `useHead`, so title, Open Graph and Twitter text stay in sync.
  - When editing an SFC with a script, always run `pnpm build`: a dropped `</style>` or a CSS block placed after it passes lint and type-check but breaks the build or silently skips the styles.
  - Vite prints a notice that the config uses features unsupported by `configLoader: 'native'` (extensionless imports inside `src/content/`). It is cosmetic; set `VITE_CONFIG_NATIVE_IGNORE_WARNING=true` to silence it.
  - Components must stay SSR-safe (`vite-ssg` prerenders): touch `window`/`document` only in `onMounted` or inside `useMotion` setups.
  - Use `useMotion(scopeRef, setup)` for every GSAP animation. It scopes selectors, reverts on unmount and exposes `motion` (reduced-motion off) and `fine` (mouse pointer). Return early when `motion` is false so the static layout is untouched.
  - Page entrance animations must wait for `onPageReady(callback)` (`usePageTransition.ts`): it fires once the loader is gone and the transition curtain is lifting. Create ScrollTriggers inside it with `ctx.add(...)` so they are still reverted on unmount.
  - Page transition: `getViewKey(route)` (`src/router/meta.ts`) decides when it runs; all home sections share the key `home`, so moving between them only scrolls. New non-section routes need `meta.theme` (and `meta.parentSection` to highlight the header link) and must call `usePageTheme(...)`.
  - Reveal content with `opacity`, never `autoAlpha`/`visibility: hidden`: hidden content leaves the accessibility tree and keyboard focus until scrolled. `autoAlpha` is fine only for decorative, `aria-hidden` elements (orb, preview, curtain).
  - Lenis caches the page size: call `lenis.resize()` before scrolling to something after a view change (`scrollToElement` already does).
  - `SplitText`: pass `aria: 'none'` and label the heading yourself (axe rejects `aria-label` on spans and paragraphs). Avoid `autoSplit` when the animation must not restart on resize.
  - In scoped styles, a global selector with a descendant must be wrapped whole: `:global(html.js .hero__title)`. Writing `:global(html.js) .hero__title` compiles to `html.js` alone and hides the page.
  - `lockScroll()`/`unlockScroll()` are counted; always pair them (loader, menu and page transition use them).
  - Section ids in the DOM equal the ids in `SECTIONS`; do not rename one without the other.
  - E2E: run `pnpm exec playwright install chromium` once. Tests set `portfolio:loader-seen` to skip the loader. The axe test runs with reduced motion because the About text is intentionally dimmed until scrolled, and the Vue DevTools overlay is excluded because it only exists in dev.
  - Check visual work with screenshots (`page.screenshot`) at 1200x675 and 390x844 against `docs/design/`; unit and E2E tests alone miss layout bugs.
- Open questions: real content (projects, experience, photos, email) and the domain.
