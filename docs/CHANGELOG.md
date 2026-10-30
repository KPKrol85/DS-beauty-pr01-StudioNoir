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

- Added tables of contents and end-of-section return links to all three legal pages using accessible fragment navigation.
- Added PWA installation screenshots and shortcuts for services, gallery, and the booking demo.
- Added the Studio Noir site with home, legal, offline, and 404 pages, modular assets, and PWA support.
- Added service and stylist links with booking-demo preselection and a no-JavaScript fallback.

### Changed

- Replaced the placeholder favicon with Studio Noir browser, Apple touch, and PWA icons.
- Adjusted fragment scrolling and keyboard focus clearance below the sticky header.
- Reused browser-selected gallery images in the lightbox with thumbnail fallback and offline caching.
- Improved lightbox usability on short viewports with responsive sizing and internal scrolling.
- Improved mobile navigation with a scrollable menu, accessible animated toggle, and focus management.
- Updated canonical, Open Graph, legal, and SEO URLs to the production Netlify domain.
- Replaced SVG image placeholders with responsive AVIF/WebP photography and hero preloading.
- Introduced the Noir Editorial layout across the hero, About, services, stylists, gallery, and footer.
- Prioritized booking and phone actions in the mobile contact bar, preserving overlay and scroll clearance.
- Refined responsive typography and heading layouts.
- Replaced incomplete font subsets with self-hosted variable Playfair Display and Inter fonts.
- Updated page surfaces, control states, and light-theme contrast.
- Unified keyboard focus wrapping in mobile navigation and the gallery lightbox.
- Extended the lightbox with looping navigation, keyboard controls, captions, and focus restoration.
- Corrected active-section navigation state with `aria-current="location"` and observer fallback.
- Clarified booking-demo states, disabled actions, and fallback contact options.
- Hardened theme persistence against unavailable or invalid browser storage.
- Improved reveal behavior for tall sections, unavailable observers, and printing.
- Added the "Kontakt" navigation link to home and legal pages.
- Ensured mobile booking links close navigation and release its scroll and focus restrictions.
- Standardized Studio Noir branding across the site and metadata.
- Rebuilt responsive footers with navigation, legal, contact, and social sections.
- Added the Studio Noir monogram to shared headers and footers.
- Added accessible back-to-top navigation with focus restoration.
- Replaced the theme text toggle with an accessible sun/moon control.
- Updated social links with theme-aware icons and accessible external-link labels.
- Replaced fictional contact details with approved KP_Code contacts and attribution.
- Updated gallery editorial content while retaining AI-image disclosure in the README.
- Kept the home-header booking CTA inactive until visible.
- Applied KP_Code portfolio disclosures across site content, metadata, and legal pages.

### Build and Tooling

- Migrated production builds to Vite with six HTML entry points and hashed assets.
- Moved the manifest, icons, SEO files, and Netlify redirects into `public/`.
- Centralized shared headers, footers, and primary navigation with build-time markup validation.
- Added `.gitattributes` and `.editorconfig` for repository formatting conventions.
- Generated service-worker cache versions and precache entries from build output; cached editorial images on demand.
- Added build guards for required HTML inputs, offline precache, and unresolved CSS variables.
- Configured Netlify hosting and service-worker headers; retained manual CLI deployments.
- Added Node.js 22 GitHub Actions CI with Chromium regression coverage.
- Added Playwright checks for navigation, interactions, mobile contact bar, reveal, theme first paint, and the PWA manifest.
- Introduced impact-based changelog policy and per-task `Changelog: yes` / `Changelog: no` decisions.
- Documented the completed-improvements archive workflow in the README.
- Consolidated coding-agent instructions in `AGENTS.md` and `CLAUDE.md`.
