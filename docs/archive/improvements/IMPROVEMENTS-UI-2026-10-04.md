# Studio Noir — UI Improvements

**Analysis date:** 2026-09-28
**Completion date:** 2026-10-04
**Status:** COMPLETED — all seven improvements closed.
**Scope:** Project-wide UI consistency, typography, controls, and responsive layout.

## Overview

Seven UI improvements were completed, including five originally selected tasks and two follow-up corrections.

The work established a consistent heading scale, improved legal-document readability, normalized button interactions, distinguished selectable booking options from informational labels, stabilized the sticky header, refined mobile pricing rows, and corrected About section spacing.

The changes strengthened the existing UI system while preserving the project's architecture, responsive behavior, accessibility contracts, and core visual identity.

Later editorial material refinements were implemented separately under the DESIGN improvement cycle.

## Completed improvements

### IMP-UI-01 — Define a heading type scale with display line-height

- **Status:** COMPLETED — implemented and verified.
- **Result:** Introduced token-driven heading sizes and explicit heading/display line-heights in `css/tokens.css` and `css/base.css`. Established project-level `h1`–`h6` defaults and connected hero and section titles to fluid typography tokens. Preserved the existing font families, heading weight, tracking, and body-text line-height.
- **Verification:** Focused Chromium checks covered representative mobile and desktop widths, heading hierarchy, responsive display sizing, and line-height behavior. The original font-subset limitation affected rendered typography measurements.
- **Impact:** High
- **Effort:** Small

### IMP-UI-02 — Add a long-form content style for the legal documents

- **Status:** COMPLETED — implemented and verified.
- **Result:** Introduced a shared `.prose` component for `privacy.html`, `terms.html`, and `cookies.html`. Added readable text measures, consistent heading spacing, list markers, underlined inline links, and token-based separators. Preserved legal content, global interface resets, and full-width horizontally scrollable tables.
- **Verification:** Chromium checks at 375px and 1440px in both themes confirmed document readability, list presentation, link distinction, heading rhythm, and table behavior. Home-page interface lists remained unaffected.
- **Impact:** High
- **Effort:** Medium

### IMP-UI-03 — Normalize the button component's box and interaction states

- **Status:** COMPLETED — implemented and verified.
- **Result:** Normalized native button typography and introduced a consistent `.button` box with explicit line-height and a token-based 48px minimum control height. Aligned anchor and button hosts and implemented theme-aware hover, pressed, focus-visible, and unavailable states for primary and ghost variants. Preserved variant names, keyboard access, and booking confirmation behavior.
- **Verification:** Chromium checks at 375px and 1440px in dark and light themes confirmed control alignment, interactive feedback, and disabled-state behavior. Later DESIGN work refined visual materials without replacing the component's interaction contracts.
- **Impact:** Medium
- **Effort:** Small

### IMP-UI-04 — Distinguish selectable booking options from static tags

- **Status:** COMPLETED — implemented and verified.
- **Result:** Introduced a dedicated `.choice` component for booking selections while retaining `.pill` for non-interactive information. Added distinct control styling, interaction states, and a leading selection ring that fills when selected. Preserved synchronized `aria-pressed`, booking data hooks, selection logic, summary updates, and confirmation behavior.
- **Verification:** Chromium checks at 375px and 1440px covered dark, light, and grayscale rendering, option selection and changes, control states, and the booking flow. The selected state remained distinguishable without relying on color alone.
- **Impact:** Medium
- **Effort:** Small

### IMP-UI-05 — Keep the sticky header at a stable single-row height

- **Status:** COMPLETED — implemented and verified.
- **Result:** Introduced a token-driven minimum header size and restricted the scrolled-state treatment to non-layout properties, preventing scroll-triggered header resizing. Refined the narrow-screen brand lockup and mini CTA, keeping the CTA label on one line and hiding the secondary logo line below 414px. Preserved sticky positioning, navigation breakpoint, focus management, and section tracking.
- **Verification:** Chromium checks across 360–1440px in both themes confirmed stable rest/scrolled heights, scroll-threshold behavior, section tracking, and mini CTA visibility. The later design audit recorded a taller but stable header at the 900px breakpoint; that separate composition issue was not part of this completed fix.
- **Impact:** Medium
- **Effort:** Medium

### IMP-UI-06 — Improve mobile pricing-row layout

- **Status:** COMPLETED — implemented and verified.
- **Result:** Rebuilt pricing rows using a CSS Grid layout with named areas and BEM element classes. Below 600px, names and prices share the first line while descriptions occupy the full row width. Preserved the inset desktop layout from 600px, prevented price wrapping, and improved description wrapping with `text-wrap: pretty`.
- **Verification:** Chromium checks covered 320, 360, 375, 390, 414, 600, 768, and 1440px, including dark and light themes. Prices remained on one line, no horizontal overflow was observed, and tablet/desktop geometry remained unchanged.
- **Impact:** Not recorded in the original report.
- **Effort:** Not recorded in the original report.

### IMP-UI-07 — Normalize About section header-to-content spacing

- **Status:** COMPLETED — implemented and verified.
- **Result:** Removed the single-use `.section__inner` grid wrapper responsible for accumulating header and grid spacing. The About section now follows the shared `.container` structure, with `.section__header` controlling the heading-to-content gap. Reduced the previously measured 108px gap to the shared 48px spacing without altering the introductory content or value-card geometry.
- **Verification:** Chromium checks at 360, 375, 768, and 1440px in both themes confirmed a 60px reduction in About section height, preserved surrounding section geometry, and no horizontal overflow.
- **Impact:** Not recorded in the original report.
- **Effort:** Not recorded in the original report.

## Excluded observations

The original UI analysis identified additional concerns outside the completed improvement scope:

- **Font asset coverage:** The original Chromium inspection found incomplete glyph coverage in the bundled WOFF2 files, causing extensive system-font fallback. The later DESIGN audit also confirmed mixed fallback rendering. Font repair requires a separately approved task.
- **Light-theme material contrast:** The original UI review identified dark translucent surfaces that remained incompatible with the light theme. These were subsequently addressed under IMP-DESIGN-01A and IMP-DESIGN-01B.
- **Broader editorial composition:** Photography, section layouts, gallery presentation, and creative art direction were not included in the original UI improvement cycle.

These observations reflect historical review boundaries. Current implementation and active improvement reports take precedence over the original findings.

## Verification limitations

The original analysis used source inspection and limited Chromium rendering against a temporary local server.

The verification results recorded under individual improvements reflect their respective implementation checks. No additional build, browser suite, or deployment verification was performed solely for this documentation standardization.

The historical checks covered selected viewport widths and interaction states, not comprehensive cross-browser compatibility, real-device testing, assistive-technology speech, or project-wide WCAG compliance.

Later changes to the shared visual system may affect the exact historical appearance of components without invalidating the completed functional UI contracts.

This archived document records historical implementation outcomes. Current repository files remain the technical source of truth.
