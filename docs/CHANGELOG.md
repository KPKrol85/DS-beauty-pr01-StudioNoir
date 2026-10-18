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

- Added the initial Studio Noir website: home, privacy, terms, cookies, offline, and 404 pages with modular CSS/JS, a PWA manifest and service worker, and self-hosted fonts, icons, and images.
- Added a "Zarezerwuj" link to every service and stylist entry that opens the booking section with the matching choice preselected and focused, keeps any choice already made for the other step, and remains a plain `#booking` link without JavaScript. The booking widget offers all five services listed in the Services section.

### Changed

- Migrated the production URL to `https://ds-beauty-pr01-studionoir.netlify.app/` across canonical and Open Graph metadata, the terms page, SEO files, and the README, preserving existing URL paths.
- Replaced the ten SVG placeholders in the hero, stylist, and gallery sections with editorial photography delivered as responsive AVIF/WebP variants, with a matching hero preload and build-time absolute `og:image` URLs.
- Recomposed the home page in the Noir Editorial direction: an asymmetric photography-led hero, a 60/40 About layout, open stylist portrait profiles, a priced service list separated from signature packages, a mixed-scale gallery with Polish captions, a featured fictional testimonial, and shared brand/social/legal footers on the home and legal pages. Booking preselection, lightbox, navigation, and theme contracts were preserved.
- The mobile contact bar now gives the booking demo primary emphasis with 48px targets and is hidden while the navigation panel or gallery lightbox is open, removing its links from pointer, Tab, and accessibility-tree access.
- Art-directed the Playfair Display/Inter typography with an expressive fluid hero, quieter section titles, readable text measures, and consistent utility weights and tracking.
- Replaced incomplete font subsets that pushed Polish characters, numbers, and punctuation into system fallbacks with full self-hosted variable Playfair Display and Inter fonts (weights 400–700, `font-display: swap`, SIL OFL 1.1 notices in production output), reducing font preloads from five to two. The desktop header now wraps whole navigation links near 900px while keeping a stable height.
- Established paired charcoal/ivory editorial surfaces with flatter framing, restrained separators, distinct informational labels and selectable controls, and stronger elevation reserved for the header, mobile contact bar, and lightbox.
- Corrected light-theme contrast on cards, booking panels, pills, the header, and the final CTA, and strengthened accent, control, and focus colors so text and unavailable button labels remain readable.
- Centralized mobile contact-bar clearance in `--mobile-contact-bar-clearance`, shared by mobile body padding and booking-choice scroll margin.
- Centralized Tab/Shift+Tab focus wrapping in a shared DOM utility used by the mobile navigation and gallery lightbox, while each keeps its own focusable-control discovery and open-state checks.
- The gallery lightbox now loops through images with Previous/Next buttons and arrow keys, announces the image description and position in a polite live region, keeps focus within the dialog, returns focus to the last viewed thumbnail on close, and fits the viewport height.
- Corrected the current-section navigation indicator: linked sections set `aria-current="location"`, while the hero, testimonials, and final CTA clear it, including after a return to the top and without `IntersectionObserver`.
- Reframed booking as an explicit demonstration: the summary and hint name the missing service, stylist, or both, and the action stays focusable with `aria-disabled` and an `aria-describedby` hint until both are selected. Completing the demo states that nothing was booked, sent, or saved, and any later selection change resets that state.
- Migrated the production build from PostCSS, esbuild, and a static file server to Vite with six HTML entry points, generating minified, content-hashed CSS/JS only in `dist/` while the root HTML/CSS/JS remain the canonical sources.
- Moved assets that need stable public paths (web app manifest, favicon, `robots.txt`, `sitemap.xml`, Netlify `_redirects`) into `public/`, which Vite copies verbatim into `dist/`.
- Hardened theme preference handling so unavailable, blocked, or invalid browser storage no longer breaks theme switching or application initialization.
- Hardened section reveal so content stays visible when `IntersectionObserver` is unavailable or fails and is never hidden in print.
- Defined the impact-based changelog inclusion policy with an explicit per-task changelog decision.
- Documented the improvement-report lifecycle in the README: active reports stay in the repository root until every item is resolved, then move to `docs/archive/improvements/` under a completion-date filename.
- Documented manual Netlify CLI deployment of the locally built `dist/` as the canonical release path, preceded by a clean working tree, `npm ci`, `npm run build`, and production preview checks.
- Consolidated agent instructions into `AGENTS.md` as the single canonical contract for all coding agents, later reduced to concise scope, source-ownership, verification, and delivery guardrails; `CLAUDE.md` only imports it.
- Added a "Kontakt" entry to the main navigation on the home and legal pages, leading to the studio location section alongside the existing "Rezerwacja" link.
- The "Umów wizytę" CTA in the open mobile navigation now closes the menu like the section links, releasing the scroll lock and `inert` page content and returning focus to the menu toggle before its native `#booking` or `/index.html#booking` navigation; the theme toggle still leaves the menu open.
- Standardized the brand name as "Studio Noir — Hair & Style" across page metadata, header and footer branding, the PWA manifest, and the README, and aligned related home-page and footer copy with studio-focused Polish wording.
- Stylist booking links and gallery thumbnails reached with Tab below 768px now scroll clear of the fixed mobile contact bar through `--mobile-contact-bar-clearance`, so a focused stylist link is no longer hidden behind the bar.
- Redesigned the home and legal page footers as a four-column layout (brand, "Nawigacja" section links, "Informacje" legal links with `aria-current="page"`, and "Kontakt" with the address, a map-link panel, and `tel:`/`mailto:` links), followed by a social row and a "© 2026 KP_Code Digital Studio" copyright line. The columns collapse to two below 1100px and to one below 600px. Instagram and Facebook appear as labelled, non-interactive icons until profile destinations are approved, replacing the footer's placeholder `[username]`, Instagram, and Facebook links.
- The footer "Nawigacja" links on the home and legal pages are now rendered at build time from the same seven entries as the header navigation through a separate `<!-- studio-noir:footer-navigation -->` insertion point, replacing four hand-maintained copies; the rendered markup is unchanged, and a missing, duplicated, or misplaced footer marker fails the build.
- The header and footer on the home and legal pages now show the Studio Noir monogram symbol beside the existing HTML wordmark and above the footer brand name. The decorative, `aria-hidden` symbol is drawn from `assets/logo/studio-noir-mark-gold.svg` as a CSS mask in the theme's gold token, so it follows the light/dark theme; link names, header height, and footer layout are unchanged.
- Replaced the text theme toggle on the home and legal pages with a 48px icon-only button that cross-fades the supplied sun and moon icons (CSS masks in the theme's gold token, instant under reduced motion) and exposes its action as `Włącz tryb jasny` / `Włącz tryb ciemny`; the header "Umów wizytę" CTA and the home mini CTA now use a refined outlined gold style with an 8px radius. Theme classes, the `studio-noir-theme` storage key, and booking destinations are unchanged.
- Replaced the footer inline Instagram and Facebook SVGs with masked Instagram, Facebook, GitHub, and X icon assets drawn in the theme ink color, keeping them non-interactive labelled images on the home and legal pages.

### Build and Tooling

- Added `.gitattributes` and `.editorconfig` defining LF line endings for text files, binary handling for fonts and raster images, and UTF-8/two-space editor defaults.
- Generated the service-worker cache version and precache list from the actual production build output via a Vite plugin, replacing the hand-maintained cache identifier and file list.
- Excluded editorial hero, stylist, and gallery image variants from service-worker precaching; they are cached on demand when first fetched, keeping installation lean while essential offline assets remain precached.
- Centralized the PWA home-document and offline-fallback paths in a static ES module shared by Vite's precache guard and the bundled service worker.
- Extended the Vite precache guard to fail when a root-level HTML page is missing from the build inputs or a required offline fallback document is absent from the precache.
- Centralized the seven primary navigation entries in one build-time source rendered into the four `.nav__list` insertion points by a local Vite HTML transform, preserving home fragments and legal-page `/index.html#section` URLs; missing, duplicated, or malformed insertion points fail the build.
- Added a build-time CSS custom-property guard that fails on undefined `var()` references without fallbacks.
- Expanded `.gitignore` to exclude build output, dependencies, test and coverage artifacts, and local editor, agent, and environment files.
- Added Netlify configuration (`netlify.toml`) with the build command, the `dist` publish directory, and a no-cache header for the service worker.
