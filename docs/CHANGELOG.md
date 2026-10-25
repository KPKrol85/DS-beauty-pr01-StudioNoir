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

- Added the initial Studio Noir site with home, legal, offline, and 404 pages, modular CSS/JS, PWA support, and self-hosted assets.
- Added service and stylist booking links with preselection and a standard `#booking` fallback without JavaScript.

### Changed

- Kept the mobile menu centered when space allows and internally scrollable on short viewports, preserving close-control access and focus outlines; added four-page pointer/keyboard regression coverage.
- Replaced the mobile menu toggle with an animated three-line-to-X control, accessible labels, modal focus handling, and reduced-motion support.
- Migrated production URLs to `https://ds-beauty-pr01-studionoir.netlify.app/` across canonical/OG metadata, legal pages, SEO files, and the README.
- Replaced ten SVG placeholders with responsive AVIF/WebP photography, hero preload, and absolute `og:image` URLs.
- Adopted the Noir Editorial layout with an asymmetric hero, 60/40 About section, stylist profiles, priced services, mixed gallery, testimonial, and shared footers.
- Prioritized demo booking in the mobile contact bar with 48px targets; the bar hides behind open navigation and lightbox overlays.
- Refined Playfair Display/Inter typography, fluid hero text, section headings, reading widths, and letter spacing.
- Replaced incomplete font subsets with full self-hosted variable Playfair Display/Inter fonts (400–700, SIL OFL notices), two preloads, and stable header wrapping near 900px.
- Introduced charcoal/ivory surfaces, subtle separators, distinct labels and selection controls, and elevated overlay surfaces.
- Improved light-theme contrast across cards, booking, labels, header, final CTA, and focus states.
- Centralized mobile contact-bar spacing in `--mobile-contact-bar-clearance` for body padding and scroll clearance.
- Extracted shared Tab/Shift+Tab focus wrapping for mobile navigation and the gallery lightbox.
- Added looping lightbox controls, arrow-key navigation, live image captions, focus trapping, and focus return to the last viewed thumbnail.
- Fixed section tracking with `aria-current="location"` and correct clearing outside linked sections, including without `IntersectionObserver`.
- Clarified demo booking states with accessible selection hints, focusable `aria-disabled` actions, and confirmation that no booking is created.
- Migrated production builds to Vite with six HTML entry points and hashed, minified assets in `dist/`.
- Moved the manifest, favicon, SEO files, and Netlify redirects into `public/` for stable build paths.
- Hardened theme switching against unavailable, blocked, or invalid browser storage.
- Kept revealed content visible when `IntersectionObserver` is unavailable or fails and when printing.
- Introduced impact-based changelog rules and explicit per-task `Changelog: yes` / `Changelog: no` decisions.
- Defined the completed-improvements archive workflow in the README.
- Established manual Netlify CLI publishing of verified local `dist/` output as the release workflow.
- Consolidated coding-agent instructions in `AGENTS.md`, imported by `CLAUDE.md`.
- Added the "Kontakt" navigation item linking to the location section on home and legal pages.
- Made the mobile "Umów wizytę" link close the menu and release its scroll lock and inert state before navigation.
- Standardized "Studio Noir — Hair & Style" across branding, metadata, the manifest, and the README.
- Kept focused stylist links and gallery thumbnails clear of the mobile contact bar below 768px.
- Rebuilt shared footers with responsive brand, navigation, legal, contact, and social sections, initially replacing placeholder social links with labelled icons.
- Generated footer navigation from the shared seven-link source, with build validation of the insertion marker.
- Added a theme-aware Studio Noir monogram to shared headers and footers using a CSS mask.
- Added a footer-triggered "Wróć na górę" control with accessible focus handoff, reduced-motion support, and mobile contact-bar clearance.
- Replaced the text theme switch with an accessible 48px sun/moon control; aligned header booking buttons to the outlined 8px style.
- Replaced inline social SVGs with theme-aware Instagram, Facebook, GitHub, and X icon masks.
- Enabled four 48px external social links with accessible new-tab labels and hover/focus feedback.
- Replaced fictional Warsaw contact data with approved KP_Code author contacts across the site and legal pages, including attribution and Google Maps links.
- Limited booking fallback contact to phone and e-mail; aligned actions to 8px corners and softened disabled/completed demo states.
- Added a gold magnifier-plus icon to gallery previews with hover/focus scaling and reduced-motion support.
- Replaced the gallery introduction with editorial Polish copy while retaining AI-image disclosure in the README.
- Kept the home header mini booking CTA inert and hidden above the hero until it becomes visible.
- Changed reveal activation to `IntersectionObserver` threshold `0` to support tall sections and narrow-view reflow.
- Initialized the stored/system theme before first paint through `public/theme-bootstrap.js`, synchronizing native `color-scheme` and theme color.
- Reduced the mobile contact bar to booking and phone actions, removing Instagram deep-link handling and unused configuration.
- Applied the KP_Code portfolio disclosure standard across footer, contact CTAs, metadata, manifest, and terms; attributed real contact details to the author.
- Standardized `.button` corners to the 8px `--radius-sm` token across site controls.

### Build and Tooling

- Centralized shared page headers in `build/shared-header.js`, validating build-time insertion markers and duplicate markup.
- Added `.gitattributes` and `.editorconfig` for LF, UTF-8, indentation, and binary files.
- Generated service-worker cache versions and precache entries from production build output.
- Excluded editorial image variants from precache; images are cached on demand.
- Shared PWA home and offline paths between the Vite precache guard and service worker.
- Added build failures for missing HTML inputs or missing offline fallback in precache.
- Centralized seven primary navigation links in a Vite HTML transform with validated insertion markers.
- Added a build-time guard for unresolved CSS custom-property references.
- Expanded `.gitignore` for builds, dependencies, tests, editor files, and local agent artifacts.
- Configured Netlify builds, `dist` publishing, and no-cache service-worker headers in `netlify.toml`.
- Added Node.js 22 GitHub Actions CI for install, build, and Chromium navigation tests; deployments remain manual.
- Added `test:mobile-contact-bar` to the CI regression suite.
- Added `test:interactions` for booking, lightbox, back-to-top, and theme-persistence regressions.
- Centralized shared footers and back-to-top markup in `build/shared-footer.js`, validating insertion markers and legal-page `aria-current`.
