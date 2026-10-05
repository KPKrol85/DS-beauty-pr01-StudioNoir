# Changelog

All significant changes to this project are documented in this file.

## Entry policy

A change is significant when a future maintainer or the project owner would reasonably need to know that one of the following changed:

- user-visible behavior, including meaningful UI, UX, or public content changes;
- accessibility behavior or accessibility contracts;
- build behavior, build guards, or npm scripts;
- test infrastructure or verification tooling;
- the dependency set;
- deployment or hosting workflow;
- PWA, service-worker, cache, or offline behavior;
- architecture, sources of truth, or important project maintenance contracts.

Judge by impact, not by file count: a visually small change is recorded when it changes user-visible or accessibility behavior, and editing a file is not by itself a reason for an entry.

Not recorded: improvement-report status updates and archiving, commit-only or tracking-document bookkeeping, temporary verification probes, minor wording corrections in internal documentation, and isolated cosmetic or implementation details, such as a single spacing or border correction, that do not change behavior, accessibility, or a shared component contract.

When an implementation task is defined, apply this policy and state `Changelog: yes` or `Changelog: no`. Add an entry only within an approved task marked `Changelog: yes`; this policy does not authorize changelog edits outside that scope.

## [Unreleased]

### Added

- Added the initial Studio Noir single-page website implementation: home, privacy, terms, cookies, offline, and 404 pages with modular CSS/JS, a PWA manifest and service worker, and supporting fonts, icons, and image assets.

### Changed

- Migrated the production build pipeline from PostCSS, esbuild, and a plain static file server to Vite, adding six HTML entry points and generating minified CSS/JS with content-hashed filenames exclusively in `dist/`, while keeping the root HTML/CSS/JS as canonical development sources.
- Reorganized static assets requiring stable public paths (web app manifest, favicon, `robots.txt`, `sitemap.xml`, Netlify `_redirects`) into `public/`, which Vite copies verbatim into `dist/` without processing.
- Automated service worker cache-version and precache asset list generation from the actual production build output via a Vite plugin, replacing the previous hand-maintained cache identifier and file list.
- Hardened theme preference handling so unavailable, blocked, or invalid browser storage no longer breaks theme switching or subsequent application initialization.
- Hardened section reveal behavior so content remains visible when `IntersectionObserver` is unavailable or fails to initialize, and reveal state no longer hides content in print.
- Defined a changelog inclusion policy based on substantive project impact and explicit per-task changelog decisions.
- Documented the improvement-report lifecycle in the README: active reports in the repository root, per-item status updates that preserve the original analysis, finalization only after every item is resolved, and archiving to `docs/archive/improvements/` under a completion-date filename.

### Build and Tooling

- Expanded `.gitignore` to exclude generated build output, dependency directories, test and coverage artifacts, and local editor, agent, and environment files, while keeping canonical sources and project configuration under version control.
- Added Netlify deployment configuration (`netlify.toml`) specifying the build command, the `dist` publish directory, and a no-cache header rule for the service worker.
- Extended the Vite precache build guard to fail when a root-level HTML page is missing from the declared build inputs or when required offline fallback documents are absent from the precache.
- Added a build-time CSS custom-property guard that fails on undefined `var()` references without fallbacks, and removed the existing unresolved `--color-text-muted` reference.
