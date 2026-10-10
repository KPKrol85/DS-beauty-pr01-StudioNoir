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
- **Result:** Added "Kontakt" as the seventh primary navigation entry, linking to `#location` on the home page and `/index.html#location` on legal pages. Preserved the existing "Rezerwacja" entry, mobile-menu interaction, keyboard accessibility, and 900px navigation breakpoint. Refined desktop spacing to accommodate the additional link. Navigation content was subsequently centralized in `build/primary-navigation.js` under a separate technical improvement.
- **Verification:** Desktop navigation checks at 900, 1024, and 1280px and mobile-menu checks at 375×667 passed. The header retained its established height without horizontal overflow. `npm run test:nav` and `npm run build` passed.
- **Impact:** High
- **Effort:** Small

### IMP-UX-02 — Start a booking from the service and stylist cards with the choice preselected

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added "Zarezerwuj" links to all five service cards and three stylist cards. Expanded booking options to include all five listed services. Card actions use the existing selection logic to preselect and focus the corresponding option while preserving the other selection, synchronized `aria-pressed`, summary updates, and confirmation requirements. Scroll correction reveals the selected option when necessary. Without JavaScript, actions remain ordinary links to `#booking`.
- **Verification:** `npm run build` passed. Focused Chromium and Firefox checks covered all eight card links, pointer and keyboard activation, combined preselection, selection replacement, focus recovery, Tab order, and navigation without JavaScript. Tested viewports ranged from 360×640 and 667×375 to 1366×768. WebKit was not tested.
- **Impact:** High
- **Effort:** Medium

### IMP-UX-03 — Tell users which booking choice is still missing

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added context-specific guidance identifying the missing service, stylist, or both. The same booking state updates the confirmation hint and live summary. The unavailable confirmation button remains keyboard-focusable through `aria-disabled` and exposes the hint through `aria-describedby`. Confirmation remains blocked until both selections exist. The original demonstration-only booking behavior was preserved.
- **Verification:** Chromium and Firefox checks passed for all four selection states, keyboard and pointer activation guards, enabled confirmation, card preselection, and focus behavior. At 375×667 in both themes, the hint and button remained visible together without horizontal overflow. `npm run build` and `git diff --check` passed. Post-confirmation behavior was outside scope.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-04 — Keep the current-section indicator accurate across the whole page

- **Status:** COMPLETED — implemented and verified.
- **Result:** Updated the section-tracking logic in `js/header.js` to resolve the current reading position across all sections, including those without navigation entries. Matching links receive `aria-current="location"`; the hero and unlinked sections clear the active state. IntersectionObserver and scroll/resize fallback paths share the same section resolver. Preserved header-offset handling, navigation links, and mini CTA behavior.
- **Verification:** `npm run test:nav` passed 13/13 Chromium tests during this implementation, covering desktop/mobile layouts, direct hash navigation, linked and unlinked sections, section boundaries, and instant return to the top with and without IntersectionObserver. Manual scrolling and screenshots were also checked. `npm run build` and `git diff --check` passed. Firefox, WebKit, and live deployment were not verified for this improvement.
- **Impact:** Medium
- **Effort:** Small

### IMP-UX-05 — Browse the gallery inside the lightbox

- **Status:** COMPLETED — implemented and verified.
- **Result:** Added circular gallery navigation through Previous/Next buttons and Left/Right arrow keys. A single current-image index controls the preview source, alternative text, visible description, position indicator, and focus-return target. Introduced a polite, atomic caption live region. Corrected the dialog layout using a viewport-constrained grid with `90dvh` and a `90vh` fallback, allowing its image row to shrink. Preserved focus wrapping, Escape and overlay closing, scroll restoration, and return focus to the last displayed thumbnail.
- **Verification:** Focused Chromium and Firefox checks passed at 375×667 and 1440×900 in both themes, covering eight browser/viewport/theme combinations. All six thumbnails, complete forward/backward traversal, wrap boundaries, synchronized descriptions, keyboard focus, closing paths, and scroll locking were checked. `npm run build` and `git diff --check` passed. The live-region mechanism was verified in the DOM, but screen-reader speech was not tested. Real devices, WebKit, and deployment were not verified. `npm run test:nav` was not rerun for this lightbox-only change.
- **Impact:** Medium
- **Effort:** Medium

## Excluded observations

The original UX review identified additional issues and opportunities outside the five approved improvements.

- **Booking confirmation and messaging:** The widget is an in-memory demonstration without backend submission or persistence, but its interface suggests that a booking was saved or sent. Changing a selection after confirmation can also leave the "Wysłano" label inconsistent with the updated state. These behaviors were excluded from IMP-UX-03 and remain separate concerns in the current source.
- **Mobile navigation CTA:** The "Umów wizytę" action inside the mobile navigation is not handled by the `.nav__link` closing logic. Activating it can navigate to the booking section while the modal menu remains open. This is separate from the completed navigation-link and section-indicator improvements.
- **Mobile contact-bar stacking:** The fixed contact bar has a higher stacking level than the header containing the mobile navigation. Its booking action may therefore remain accessible while the menu is open. The overlay interaction requires a separate decision and verification.
- **External destinations:** The footer DM link contains a placeholder username, while the map and Facebook links use generic destinations. Replacing these requires verified destination information or an owner-approved demonstration treatment.
- **Instagram handoff:** The original analysis identified potentially unexpected application-opening and fallback navigation behavior. Changes to Instagram destinations and interaction policy were not selected for this UX cycle.
- **Legal-document navigation:** In-page tables of contents for the long legal documents were considered but not selected because the five primary visitor journeys had higher priority.

The original lightbox viewport-height defect was resolved within IMP-UX-05 and is not carried forward as an open issue.

These observations are historical review findings, with several behaviors still visible in current source files. They do not establish comprehensive runtime defect status or authorize changes outside a separately approved task.

## Verification limitations

The original analysis used source inspection and a limited headless Chromium probe against a plain static server. The Vite development server, production build, and automated tests were not executed during initial discovery.

Verification results under individual improvements reflect checks performed during their implementations. The navigation and booking checks were not rerun as part of the final lightbox task.

The recorded browser checks covered selected Chromium and Firefox scenarios, not comprehensive cross-browser compatibility. Real mobile devices, touch input, WebKit/Safari, screen-reader speech, production PWA behavior, and live deployment were not comprehensively verified.

No additional runtime tests were performed solely for this documentation standardization. Current source inspection confirms the presence of the completed implementations, not fresh end-to-end regression results.

This archived report documents historical decisions and verified implementation outcomes. Current repository files remain the technical source of truth.
