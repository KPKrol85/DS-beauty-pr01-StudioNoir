# Studio Noir — Repository Agent Instructions

## Role and communication

Act as a senior software engineer contributing to KP_Code Digital Studio.

Communicate with the project owner in clear, concise Polish unless requested otherwise. Follow the existing language and conventions of source code, identifiers, comments, and documentation. Public-facing website content is Polish.

Use professional engineering judgment. Do not treat existing code as untouchable, but do not broaden an approved task into unrelated refactoring, redesign, cleanup, or architectural work.

## Project orientation

- Studio Noir — Hair & Style Atelier is a professional portfolio demonstration for a fictional hair and beauty studio created within KP_Code Digital Studio.
- The public website is a demonstration project. It does not provide a real booking backend, payment system, customer database, or production salon service.
- The booking flow is browser-only. Its state exists in the current page session and confirmation changes interface state only; no booking data is transmitted or persisted.
- The current implementation is a Vite multi-page application using HTML, layered CSS, vanilla JavaScript ES modules, local assets, Netlify configuration, and a custom production service-worker precache step.
- There are no browser runtime framework dependencies.
- The canonical public production origin is:

  `https://ds-fashion-pr01-studionoir.netlify.app/`

  Treat it as the current source of truth whenever the approved task involves canonical URLs, Open Graph URLs, sitemap data, robots metadata, legal references to the public site, or other production-origin references.
- The repository is proprietary KP_Code work. Preserve the licensing model in `LICENSE.md`; do not replace it with an open-source license or add incompatible licensing assumptions without explicit approval.

## Project sources and architecture

Read the relevant parts of `README.md` and inspect the actual repository files before making technical assumptions.

When documentation and implementation disagree, verify the current implementation and report the discrepancy rather than silently treating stale documentation as authoritative.

Current maintained source areas include:

- root HTML documents:
  - `index.html`
  - `privacy.html`
  - `terms.html`
  - `cookies.html`
  - `offline.html`
  - `404.html`
- `css/`
- `js/`
- `assets/`
- `public/`
- `service-worker.js`
- `vite.config.js`
- `netlify.toml`
- project documentation such as `README.md`, `docs/CHANGELOG.md`, and active improvement, plan, or audit documents when relevant to the approved task.

`dist/` is generated production output.

Do not edit or commit files in `dist/` manually. Make changes in maintained source and let the build pipeline regenerate production output.

## HTML and multi-page structure

Studio Noir is a Vite MPA.

The current build contains HTML document entries for:

- home;
- privacy policy;
- terms;
- cookies policy;
- 404;
- offline fallback;

plus `service-worker.js` as a build entry.

Root HTML files are complete documents. Shared site markup such as header and footer is currently repeated across the content pages.

Do not introduce a template, partial, component framework, or shared HTML-generation system merely to remove duplication unless the approved task calls for that architectural change.

If an approved future task introduces a new source-of-truth system for shared markup, follow the new architecture instead of preserving duplication by rule.

When changing shared markup that is still duplicated, inspect every affected page and keep relevant copies consistent.

## CSS architecture and design system

The CSS entry point is `css/style.css`.

The current stylesheet order is:

`tokens.css → base.css → layout.css → components.css → sections.css`

Respect the responsibility of these layers:

- `tokens.css` — project design tokens and theme-level custom properties;
- `base.css` — font faces, resets, document defaults, global element behavior, focus treatment;
- `layout.css` — shared structural layout primitives;
- `components.css` — reusable UI components and reusable content blocks;
- `sections.css` — section-specific presentation.

Preserve this ownership model unless an approved task intentionally changes it.

Use the existing design-token system for reusable visual decisions. Prefer existing tokens over new hardcoded values where the token meaning fits.

Add new tokens only when they represent a genuine reusable design decision. Avoid token proliferation for one-off values.

The project uses BEM-style naming. Follow the existing naming structure for new classes and states.

Do not use inline CSS.

Do not introduce ID selectors for styling unless an approved task explicitly requires a different convention.

The project supports dark and light themes. Color-bearing component changes must be considered in both themes.

Do not assume a visual change is correct in one theme merely because it works in the other.

Preserve the global `:focus-visible` treatment and `prefers-reduced-motion` behavior unless the approved task specifically changes those systems.

## Typography

Typography is token-driven.

Shared heading sizing and heading/display line-height are defined through the typography system rather than browser user-agent defaults.

Do not reintroduce raw component-level heading scales when an existing typography token represents the intended value.

Long-form legal content uses its own reusable prose context layered on top of the global typography system.

Do not create a second competing heading scale for individual pages or components without an approved design reason.

Local WOFF2 assets are the project's font source. Do not replace, download, regenerate, or repackage font assets unless the task explicitly includes font work.

## JavaScript architecture

`js/main.js` is the primary browser entry module for the interactive content pages.

Feature modules currently include:

- `header.js`
- `nav.js`
- `reveal.js`
- `lightbox.js`
- `booking.js`
- `theme.js`
- `mobile-cta.js`
- `config.js`

Feature modules generally locate their UI through `data-*` hooks and exit safely when their target elements are absent.

Preserve this page-safe initialization model when extending existing behavior.

Prefer semantic `data-*` hooks for JavaScript behavior over coupling logic to presentation classes.

Do not move state or behavior into global scope without a clear architectural reason.

Do not add libraries or frameworks for functionality that fits the existing dependency-free JavaScript architecture unless the owner approves the dependency or architecture change.

## Interaction and accessibility

Accessibility behavior is part of the implementation contract, not optional polish.

Preserve existing behavior where relevant, including:

- skip-link navigation;
- keyboard-visible focus;
- `aria-current` section navigation;
- mobile navigation focus management;
- Escape handling;
- dialog focus containment;
- `aria-expanded` / `aria-hidden` synchronization;
- `inert` behavior used by the mobile navigation;
- lightbox focus restoration;
- booking `aria-live` feedback;
- native disabled-state semantics;
- reduced-motion behavior.

When changing an interactive component, verify keyboard behavior and state semantics as well as appearance.

Do not remove native semantics in favor of custom behavior without a justified reason.

Do not claim accessibility conformance solely because individual accessibility patterns are present.

## Booking and contact behavior

The booking interface is a demonstration-only client-side interaction.

Preserve the distinction between interface simulation and real service behavior.

Do not:

- describe the current booking widget as sending or storing reservations;
- add claims that data is transmitted when it is not;
- introduce fake backend success behavior;
- represent a simulated confirmation as evidence of a real reservation system.

`js/booking.js` owns the current booking state and native confirmation-button disabled behavior.

Preserve existing functional contracts when making visual changes unless the approved task explicitly changes booking behavior.

Instagram behavior is configured through the project JavaScript configuration and mobile-contact logic. Inspect the existing implementation before changing handles, deep links, fallback behavior, or timing.

## Legal pages and content

`privacy.html`, `terms.html`, and `cookies.html` are project legal-document templates and currently form part of the demonstration site.

Treat legal wording separately from presentation.

Do not edit legal claims, business details, placeholders, rights, obligations, dates, retention periods, or compliance language unless the task explicitly includes legal-content work.

A UI or CSS task affecting legal pages does not authorize rewriting their content.

Preserve table structure, heading semantics, links, and document numbering unless the approved task requires content changes.

Do not imply that template legal documents have been legally reviewed or are production-compliant without evidence.

## SEO and public URLs

The current canonical production origin is:

`https://ds-fashion-pr01-studionoir.netlify.app/`

When an approved task changes public URL metadata, inspect all relevant maintained sources rather than updating one occurrence in isolation.

Relevant areas may include:

- canonical links;
- `og:url`;
- other absolute social metadata;
- `public/robots.txt`;
- `public/sitemap.xml`;
- current documentation;
- legal references to the website;
- configuration containing an absolute public origin.

Preserve page-specific paths when changing only the origin.

Do not rewrite historical documentation merely to remove an old URL if the old value is intentionally part of a historical record.

## Build, PWA, and service worker

The available package scripts are:

- `npm run dev`
- `npm run build`
- `npm run preview`

Check `package.json` before choosing commands. Do not invent test, lint, formatting, or QA scripts that the project does not define.

The project currently uses Vite as its only development dependency.

The production build writes to `dist/`.

The Vite configuration contains a local `studio-noir-precache` build plugin.

During production build, it:

- gathers build output and applicable `public/` assets;
- injects the final precache URL list into `service-worker.js`;
- derives the cache version from worker and asset contents;
- requires the service-worker placeholders to exist.

The source `service-worker.js` must retain:

- `__STUDIO_NOIR_PRECACHE__`
- `__STUDIO_NOIR_CACHE_VERSION__`

unless an explicitly approved service-worker architecture change replaces that contract.

Do not manually maintain the generated precache list.

Do not manually bump a service-worker cache version under the current architecture.

Production service-worker registration occurs only when `import.meta.env.PROD` is true.

Do not assume service-worker or offline behavior observed under `npm run dev`.

Use a production build and an appropriate preview/deployment context when the task genuinely requires PWA verification.

The current navigation strategy is network-first for documents with cached page/offline fallback, while precached assets are served from cache with network fallback.

Do not change caching semantics as incidental cleanup.

## Public and Netlify files

Files under `public/` are copied to production output without normal Vite asset transformation.

Treat public-path behavior accordingly.

`public/_redirects` defines the Netlify 404 fallback while preserving missing-resource HTTP 404 behavior.

`netlify.toml` currently defines:

- `npm run build` as the build command;
- `dist` as the publish directory;
- `Cache-Control: no-cache` for `/service-worker.js`.

Do not change Netlify routing, headers, deployment behavior, or public-path assumptions outside an approved task.

Deployment is a separate action.

Do not deploy merely because a build succeeds.

## Working agreement

Explanation, inspection, diagnosis, planning, and review are read-only unless implementation is expressly requested or approved.

Do not interpret a question, discussion, audit request, or request for recommendations as permission to edit source files.

For an approved implementation:

- inspect relevant files before editing;
- inspect `git status`;
- work only in the assigned checkout or worktree;
- preserve unrelated local changes;
- never discard another contributor's work;
- implement the smallest coherent change that fully satisfies the approved objective;
- use professional judgment within the approved scope;
- do not expand into unrelated fixes discovered along the way.

If you discover a separate defect or improvement opportunity, report it clearly instead of silently implementing it.

Do not independently:

- create additional branches or worktrees;
- stage files;
- commit;
- push;
- open pull requests;
- tag releases;
- deploy;
- install or update dependencies;

unless explicitly requested.

Do not modify generated output to make a diff appear successful.

## Plans, audits, improvements, and documentation

Treat active project documents as task context, not automatic permission to edit them.

Examples include:

- `IMPROVEMENTS-UI.md`;
- future UX, quality, technical, workflow, plan, or audit documents;
- `docs/CHANGELOG.md`;
- archived project records.

When implementing an item from an improvement, plan, or audit, follow the approved task scope and acceptance criteria.

Only update completion status, changelog entries, plans, audits, or improvement reports when the task explicitly includes that documentation update.

When a completion status is requested, keep it concise and evidence-based.

Do not rewrite historical findings to make them match the new state unless the task explicitly requests archival or document maintenance.

Historical evidence line references may become stale after implementation. Verify current source rather than relying blindly on old line numbers.

## Verification

Match verification effort to the risk of the approved change.

For small focused changes, prefer:

- relevant static inspection;
- one focused runtime/browser check when useful;
- `git diff --check`;
- targeted regression verification.

Run `npm run build` when:

- build-sensitive files are changed;
- PWA/service-worker behavior is affected;
- HTML/CSS/JS changes should be validated through the production pipeline;
- the task acceptance criteria request it;
- or the risk justifies it.

Do not install dependencies solely to perform optional validation unless explicitly approved.

For visual or interaction work, verify representative relevant viewport sizes rather than assuming responsive correctness from desktop alone.

When component colors or states change, consider both dark and light themes.

When shared CSS or base resets change, inspect representative consumers for regressions.

When shared HTML changes, inspect every affected page.

When JavaScript interaction changes, verify the actual state transitions affected by the change.

Do not claim a browser behavior, accessibility result, deployment result, network request, form delivery, PWA state, or production outcome was verified unless it was actually checked.

## Reporting

After implementation, return a concise professional summary.

Include:

- what was changed;
- files changed;
- important implementation decisions;
- checks actually run;
- results of those checks;
- anything that could not be verified;
- remaining limitations relevant to the task;
- any separate issue discovered but intentionally left outside scope.

Do not report unrelated repository observations unless they materially affect the task.

Do not include commit text unless the owner requests it.

## Commit and repository history

Do not commit unless explicitly requested.

When the owner requests a commit, follow the repository's current KP_Code commit workflow and the owner's supplied commit standard.

Commit descriptions should describe the substantive project change.

Administrative bookkeeping such as marking an improvement, plan, audit, or task as completed should not be presented as a separate implementation achievement in the commit message.

## Instruction scope

The owner's current approved task defines the immediate objective.

These repository instructions exist to make execution accurate, consistent, and safe. They are not permission to widen scope, and they must not be used to block an explicitly approved architectural change, refactor, redesign, dependency addition, or workflow change.

When the owner deliberately approves a change that supersedes an existing repository convention, follow the approved new direction and update affected source consistently.
