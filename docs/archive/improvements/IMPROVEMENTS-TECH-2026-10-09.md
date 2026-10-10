# Studio Noir — Technical Improvements

**Analysis date:** 2026-10-08
**Completed and archived:** 2026-10-09
**Status:** COMPLETED — all four selected improvements closed.
**Scope:** Project-wide technical implementation and maintenance contracts.

## Overview

Four technical improvements were completed, consolidating primary navigation content, keyboard focus wrapping, PWA fallback document paths, and mobile contact-bar clearance.

The changes established single sources of truth for existing behavior, reducing duplicated implementation without altering the project's Vite MPA architecture or established interaction contracts.

No new runtime dependencies, frameworks, backend functionality, or deployment infrastructure were introduced.

## Completed improvements

### IMP-TECH-01 — Maintain the primary navigation links in one canonical source

- **Status:** COMPLETED — implemented and verified.
- **Result:** Introduced `build/primary-navigation.js` as the canonical source for seven navigation entries. A local Vite HTML transform renders the four `.nav__list` insertion points in development and production. Preserved home-page `#section` links, legal-page `/index.html#section` destinations, navigation order, CSS/JavaScript hooks, and existing interactions. Desktop navigation links remain available without browser JavaScript; opening the mobile menu still requires JavaScript.
- **Verification:** Development and production HTML checks confirmed labels, order, URLs, shared-label propagation, and explicit errors for invalid insertion points. Browser checks covered desktop links without JavaScript, mobile menu behavior, keyboard focus, and navigation state. `npm run build`, `npm run test:nav` (18/18), and `git diff --check` passed. The original root HTML files retain build-time insertion markers rather than fully rendered navigation lists.
- **Impact:** Medium
- **Effort:** Medium

### IMP-TECH-02 — Share the Tab-boundary wrapping algorithm between overlays

- **Status:** COMPLETED — implemented and verified.
- **Result:** Extracted the shared Tab/Shift+Tab boundary-wrapping algorithm into `js/wrap-tab-focus.js`. Both `js/nav.js` and `js/lightbox.js` use the helper while independently retaining their focusable-element discovery, active-state checks, keyboard handling, and overlay lifecycles. Preserved Escape handling, lightbox arrow navigation, focus return, scroll locking, and mobile breakpoint behavior.
- **Verification:** `npm run test:nav` passed all 18 tests. Focused Chromium lightbox checks confirmed Tab/Shift+Tab wrapping, arrow navigation, closing behavior, and focus return to the last viewed thumbnail. No general-purpose modal controller or additional dependency was introduced.
- **Impact:** Medium
- **Effort:** Small

### IMP-TECH-03 — Share offline document paths between the worker and build guard

- **Status:** COMPLETED — implemented and verified.
- **Result:** Centralized `HOME_DOCUMENT` and `OFFLINE_DOCUMENT` in `js/pwa-paths.js`, shared by `vite.config.js` and `service-worker.js`. The precache guard validates the same fallback paths used by the service worker. Preserved network-first document handling, navigation normalization, pathname-based cache matching, service-worker lifecycle, stable output naming, and automatic content-derived cache versioning.
- **Verification:** `npm run build` passed with resolved precache and cache-version placeholders and self-contained worker output. Two in-memory missing-input guard checks passed. Chromium installation and activation checks, followed by ten offline navigation scenarios with the preview server stopped, passed for home, legal and clean URLs, query strings, and unknown-path fallback. `git diff --check` passed. Live production PWA behavior was not verified.
- **Impact:** Medium
- **Effort:** Small

### IMP-TECH-04 — Share the mobile contact-bar clearance between layout and booking

- **Status:** COMPLETED — implemented and verified.
- **Result:** Introduced `--mobile-contact-bar-clearance` in `css/tokens.css` as the shared value for mobile body padding and booking-choice scroll clearance. Preserved `calc(5.25rem + env(safe-area-inset-bottom, 0px))`, the existing breakpoint below 768px, fixed-bar geometry, and JavaScript focus/visibility correction.
- **Verification:** `npm run build`, compiled-CSS inspection, and `git diff --check` passed. Focused Chromium checks covered 390, 767, 768, and 1440px layouts, body padding across all six pages, dark/light themes, reduced motion, and service/stylist preselection with focus and booking visibility correction. Non-zero physical device safe-area insets were not tested.
- **Impact:** Low
- **Effort:** Small

## Excluded observations

The original technical review deliberately excluded broader changes without sufficient evidence or an approved dependency on the four selected improvements:

- **Navigation architecture:** A larger HTML templating system or runtime-generated navigation was unnecessary for consolidating the seven shared links.
- **Overlay architecture:** A general modal controller was not introduced because navigation and lightbox retain different focus eligibility and lifecycle requirements.
- **Application state:** Existing feature modules and booking selection logic did not justify an additional shared state layer.
- **CSS architecture:** Service/stylist styling and booking behavior already shared relevant implementations; extraction solely for file organization was not justified.
- **Testing and documentation:** Broader automated test coverage, CI integration, documentation restructuring, and previously identified interaction or content defects remained outside this technical improvement cycle.

These were historical scope decisions, not findings that the current architecture must remain permanently unchanged.

## Verification limitations

The original technical analysis on 2026-10-08 relied on source inspection. No build, test suite, browser session, or production preview was executed during discovery.

Verification results under individual improvements reflect focused checks performed during their respective implementations. No full regression suite or deployment verification was claimed for the entire improvement cycle.

Documentation finalization on 2026-10-09 reviewed the four implementation contracts, historical completion records, archive location, and document consistency. `git diff --check` passed. No additional build, browser test, production preview, or deployment was performed solely for archiving.

The Chromium checks did not establish comprehensive cross-browser compatibility, real-device behavior, screen-reader speech, non-zero safe-area inset behavior, or live Netlify/PWA reliability.

This archived report records historical engineering decisions and verified outcomes. Current repository files remain the technical source of truth.
