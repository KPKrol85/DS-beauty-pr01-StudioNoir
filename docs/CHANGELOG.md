# Changelog

All significant changes to this project are documented in this file.

## [Unreleased]

### Added

- Added the initial Studio Noir single-page website implementation: home, privacy, terms, cookies, offline, and 404 pages with modular CSS/JS, a PWA manifest and service worker, and supporting fonts, icons, and image assets.

### Changed

- Migrated the production build pipeline from PostCSS, esbuild, and a plain static file server to Vite, adding six HTML entry points and generating minified CSS/JS with content-hashed filenames exclusively in `dist/`, while keeping the root HTML/CSS/JS as canonical development sources.
- Reorganized static assets requiring stable public paths (web app manifest, favicon, `robots.txt`, `sitemap.xml`, Netlify `_redirects`) into `public/`, which Vite copies verbatim into `dist/` without processing.
- Automated service worker cache-version and precache asset list generation from the actual production build output via a Vite plugin, replacing the previous hand-maintained cache identifier and file list.
- Hardened theme preference handling so unavailable, blocked, or invalid browser storage no longer breaks theme switching or subsequent application initialization.

### Build and Tooling

- Expanded `.gitignore` to exclude generated build output, dependency directories, test and coverage artifacts, and local editor, agent, and environment files, while keeping canonical sources and project configuration under version control.
- Added Netlify deployment configuration (`netlify.toml`) specifying the build command, the `dist` publish directory, and a no-cache header rule for the service worker.
- Extended the Vite precache build guard to fail when a root-level HTML page is missing from the declared build inputs or when required offline fallback documents are absent from the precache.
