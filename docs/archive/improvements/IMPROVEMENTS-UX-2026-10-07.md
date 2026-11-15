# Studio Noir — UX Improvements

**Analysis date:** 2026-10-05

**Completed and archived:** 2026-10-07

**Status:** COMPLETED — all five selected improvements closed.

**Scope:** Project-wide user experience, navigation, booking, section orientation, and gallery interaction.

## Overview

Five UX improvements were completed, strengthening the main visitor journeys: finding contact information, starting a booking from service and stylist cards, understanding incomplete booking selections, identifying the current section, and browsing the gallery.

The work improved existing interactions without introducing backend functionality, persistent bookings, or additional product scope.

The gallery improvement also resolved the lightbox height defect, ensuring that its image, caption, and controls fit within the tested viewports.

## Completed improvements

### IMP-UX-01 — Add the location and contact section to the main navigation

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added "Kontakt" as the seventh primary navigation entry, linking to `#location` on the home page and `/index.html#location` on legal pages, with refined desktop spacing. Preserved the existing "Rezerwacja" entry, mobile-menu interaction, keyboard accessibility, and 900px navigation breakpoint; navigation content was later centralized under IMP-TECH-01.
- **Verification:** Desktop navigation checks at 900, 1024, and 1280px and mobile-menu checks at 375×667 passed. The header retained its established height without horizontal overflow. `npm run test:nav` and `npm run build` passed.
- **Impact:** High
- **Effort:** Small

### IMP-UX-02 — Start a booking from the service and stylist cards with the choice preselected

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added "Zarezerwuj" links to all five service cards and three stylist cards and expanded booking options to all five listed services. Card actions reuse the existing selection logic to preselect, focus, and scroll to the matching option while preserving the other selection, synchronized `aria-pressed`, summary updates, and confirmation requirements. Without JavaScript, actions remain ordinary links to `#booking`.
- **Verification:** `npm run build` passed. Focused Chromium and Firefox checks at 360×640, 667×375, and up to 1366×768 covered all eight card links, pointer and keyboard activation, combined preselection, selection replacement, focus recovery, Tab order, and navigation without JavaScript. WebKit was not tested.
- **Impact:** High
- **Effort:** Medium

### IMP-UX-03 — Tell users which booking choice is still missing

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added context-specific guidance identifying the missing service, stylist, or both, driven by the same booking state as the live summary. The unavailable confirmation button stays keyboard-focusable through `aria-disabled`, exposes the hint through `aria-describedby`, and remains blocked until both selections exist. The demonstration-only booking behavior was preserved.
- **Verification:** Chromium and Firefox checks passed for all four selection states, activation guards, enabled confirmation, card preselection, and focus behavior; at 375×667 in both themes, the hint and button remained visible together without horizontal overflow. `npm run build` and `git diff --check` passed. Post-confirmation behavior was outside scope.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-04 — Keep the current-section indicator accurate across the whole page

- **Status:** COMPLETED — implemented and verified.
- **Result:** Updated section tracking in `js/header.js` to resolve the current reading position across all sections through one resolver shared by the IntersectionObserver and scroll/resize fallback paths. Matching links receive `aria-current="location"`, while the hero and unlinked sections clear the active state. Preserved header-offset handling, navigation links, and mini CTA behavior.
- **Verification:** `npm run test:nav` passed 13/13 Chromium tests covering desktop/mobile layouts, direct hash navigation, linked and unlinked sections, section boundaries, and instant return to the top with and without IntersectionObserver; manual scrolling and screenshots were also checked. `npm run build` and `git diff --check` passed. Firefox, WebKit, and live deployment were not verified.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-05 — Browse the gallery inside the lightbox

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added circular gallery navigation through Previous/Next buttons and Left/Right arrow keys, with one current-image index controlling the source, alternative text, description, position indicator, focus-return target, and a polite, atomic caption live region. Corrected the dialog layout with a viewport-constrained `90dvh` grid (`90vh` fallback) that lets the image row shrink. Preserved focus wrapping, Escape and overlay closing, scroll restoration, and focus return to the last displayed thumbnail.
- **Verification:** Focused Chromium and Firefox checks passed in eight browser/viewport/theme combinations (375×667 and 1440×900, both themes), covering all six thumbnails, full traversal and wrap boundaries, synchronized descriptions, keyboard focus, closing paths, and scroll locking. `npm run build` and `git diff --check` passed; the live region was verified in the DOM only. Screen-reader speech, real devices, WebKit, and deployment were not verified, and `npm run test:nav` was not rerun for this lightbox-only change.
- **Impact:** Medium
- **Effort:** Medium

## Excluded observations

The original UX review identified additional issues and opportunities outside the five approved improvements.

- **Booking confirmation and messaging:** The widget is an in-memory demonstration without backend submission or persistence, but its interface suggests that a booking was saved or sent. Changing a selection after confirmation can also leave the "Wysłano" label inconsistent with the updated state. These behaviors were excluded from IMP-UX-03 and remained separate concerns in the source reviewed during record standardization on 2026-10-10.
- **Mobile navigation CTA:** The "Umów wizytę" action inside the mobile navigation is not handled by the `.nav__link` closing logic. Activating it can navigate to the booking section while the modal menu remains open. This is separate from the completed navigation-link and section-indicator improvements.
- **Mobile contact-bar stacking:** The fixed contact bar has a higher stacking level than the header containing the mobile navigation. Its booking action may therefore remain accessible while the menu is open. The overlay interaction requires a separate decision and verification.
- **External destinations:** The footer DM link contains a placeholder username, while the map and Facebook links use generic destinations. Replacing these requires verified destination information or an owner-approved demonstration treatment.
- **Instagram handoff:** The original analysis identified potentially unexpected application-opening and fallback navigation behavior. Changes to Instagram destinations and interaction policy were not selected for this UX cycle.
- **Legal-document navigation:** In-page tables of contents for the long legal documents were considered but not selected because the five primary visitor journeys had higher priority.

The original lightbox viewport-height defect was resolved within IMP-UX-05 and is not carried forward as an open issue.

These observations are historical review findings; several behaviors were still visible in source files on 2026-10-10. They do not establish current defect status or authorize changes outside a separately approved task.

## Verification limitations

The original analysis used source inspection and a limited headless Chromium probe against a plain static server. The Vite development server, production build, and automated tests were not executed during initial discovery.

Verification results under individual improvements reflect checks performed during their implementations. The navigation and booking checks were not rerun as part of the final lightbox task.

The recorded browser checks covered selected Chromium and Firefox scenarios, not comprehensive cross-browser compatibility. Real mobile devices, touch input, WebKit/Safari, screen-reader speech, production PWA behavior, and live deployment were not comprehensively verified.

No additional runtime tests were performed solely for documentation standardization. Source inspection during standardization (2026-10-10) confirmed the presence of the completed implementations, not fresh end-to-end regression results.

This archived report documents historical decisions and verified implementation outcomes. Current repository files remain the technical source of truth.
