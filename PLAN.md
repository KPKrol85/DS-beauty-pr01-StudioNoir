# Studio Noir — Development Plan

**Last reviewed:** 2026-10-21
**Project type:** Static multi-page website (Vite MPA, vanilla HTML/CSS/ES modules, build-injected service worker) for a fictional demonstration hair studio
**Plan status:** Active

## Planning principles

- The plan reflects the current verified project state; `AGENTS.md` remains the canonical guardrail contract for implementation.
- Changes are made in canonical sources (root HTML, `build/`, `css/`, `js/`, `assets/`, `public/`, `service-worker.js`); `dist/` is build output only.
- Public-facing content stays in Polish; accessibility, responsive behavior, and light/dark theme support are preserved by every item.
- Main items are checked only when all required subtasks and their verification are complete.
- Completed significant changes are recorded in `docs/CHANGELOG.md` under its entry policy.

## Current baseline

Completed improvement cycles (UI, quality, workflow, UX, technical, design) are recorded in `docs/archive/improvements/` and `docs/CHANGELOG.md`. They are not repeated here as plan items. The open work below is derived from `daily-AUDIT.md` (2026-10-21), with every finding re-verified against the current source.

## Current priorities

1. `PH1-01` — Remove the hidden mobile header booking link from keyboard and assistive-technology access.
2. `PH1-02` — Verify and correct section reveal on short viewports.
3. `PH2-01` — Apply the selected theme before first paint.
4. `PH3-01` — Run the mobile contact-bar regression spec through a project script and CI.

## Phase 1 — Accessibility of hidden and revealed content

**Goal:** Ensure that content hidden or not yet revealed is never reachable by keyboard while invisible, and that revealed content becomes visible on every viewport.

- [x] **PH1-01 — Remove the hidden mobile header booking link from the focus order**
  - **Priority:** High
  - [x] below 768 px, remove `.header__mini-cta` from pointer, Tab, and accessibility-tree access while it lacks `.is-visible`, following the `visibility` pattern used by `.mobile-cta` and `.back-to-top`
  - [x] keep the existing fade and slide transition when the link appears and disappears
  - [x] keep the `IntersectionObserver` and scroll-fallback toggling in `js/header.js` and the `display: none` behavior from 768 px unchanged
  - [x] add one focused keyboard regression check to a CI-run spec: at a mobile width with the hero in view, Tab moves from the logo past the hidden link; after the hero leaves the viewport, the link is reachable and its focus outline is visible
  - **Completion condition:** at widths below 768 px, the hidden header booking link is never a Tab stop or an exposed accessibility node, and the visible link remains reachable.
  - **Source:** `daily-AUDIT.md` — P1-01

- [x] **PH1-02 — Make section reveal independent of container height**
  - **Priority:** High
  - [x] reproduce in a browser on short viewports (landscape phone and the 320×256 CSS px reflow case) whether tall `[data-reveal]` containers, such as booking and testimonials, remain at `opacity: 0` after scrolling through them
  - **Reproduction (2026-10-22, Chrome 155):** reproduced at 320×256 for the gallery, booking, and testimonials containers, which are more than five viewport heights tall and stay at `opacity: 0` after scrolling through the page; not reproduced at 667×375. `tests/reveal.spec.js` failed at 320×256 before the correction.
  - [x] if reproduced, change the reveal trigger in `js/reveal.js` so a container is revealed once it enters the viewport, regardless of its height relative to the viewport
  - [x] preserve the reduced-motion, missing-observer, observer-failure, and print fallbacks
  - [x] add one focused browser check at a short viewport confirming that every `[data-reveal]` element is visible after it is scrolled into view
  - **Verification (2026-10-22, Chrome 155):** with the observer threshold lowered from 0.2 to 0, `tests/reveal.spec.js` passes at 667×375 and 320×256 for all 11 elements; focused checks confirmed the fade and slide transition and the four fallbacks, and `tests/nav.spec.js` and `npm run build` pass. The spec is not yet run by an npm script or CI.
  - **Completion condition:** no `[data-reveal]` element remains transparent after entering the viewport at any tested viewport height; when the risk is not reproducible, the browser result is recorded and the trigger stays unchanged.
  - **Source:** `daily-AUDIT.md` — P1-02

## Phase 2 — Theme and contact-action correctness

**Goal:** Align first-paint theme rendering with its declared behavior and remove the mismatched Instagram action from the mobile contact bar.

- [x] **PH2-01 — Apply the selected theme before first paint**
  - **Priority:** Medium
  - [x] resolve the stored `studio-noir-theme` value or the system preference before the first paint on `index.html`, `privacy.html`, `terms.html`, and `cookies.html`, instead of only when the deferred `/js/main.js` module runs
  - [x] keep the storage key, accepted values, and stored-then-system fallback order consistent with `js/theme.js`
  - [x] tie `color-scheme` to the active theme class instead of the fixed `light dark` declaration on `:root` in `css/tokens.css`
  - [x] preserve the current behavior when `localStorage` is unavailable, blocked, or holds an invalid value, and the toggle's accessible names
  - [x] verify in a browser that a stored light theme and a light system preference render without a dark-to-light repaint on the home and legal pages
  - **Verification (2026-10-23, Chrome 155):** with `/js/main.js` held until parsing finished, `tests/theme-first-paint.spec.js` confirms the theme class, `color-scheme`, body colors, and `theme-color` on all four pages for stored, system, invalid, and blocked-storage cases, with no opposite theme ever on `<html>`, followed by toggle, label, and persistence checks; it fails on a page without the bootstrap. A temporary check of the `vite preview` build confirmed the same early state; `tests/nav.spec.js` and `npm run build` pass. The spec is not yet run by an npm script or CI.
  - **Completion condition:** the stored or system theme is active on first paint on all four content pages, and native UI follows the selected theme.
  - **Source:** `daily-AUDIT.md` — P2-01

- [x] **PH2-02 — Simplify the mobile contact bar to booking demo and telephone**
  - **Priority:** Medium
  - **Decision (2026-10-23):** the project owner replaced the original direction, repairing the Instagram app deep link to match its accessible name, with removing the Instagram action from the bar. The Instagram app-opening checks on iOS Safari and Android Chrome were therefore not performed.
  - [x] remove the Instagram link from `.mobile-cta` in `index.html`, keeping the "Szybki kontakt" landmark, the "Demo rezerwacji" link to `#booking`, the "Zadzwoń" `tel:` link, and their accessible names
  - [x] change the `.mobile-cta` grid in `css/components.css` to two columns, the flexible primary booking action and the label-width telephone action, keeping spacing, type, 48px targets, safe-area padding, `--mobile-contact-bar-clearance`, and the hidden state while the navigation panel or lightbox is open
  - [x] remove `js/mobile-cta.js`, `js/config.js`, and the `initMobileCta` initializer in `js/main.js`, leaving no `data-instagram-link`, `instagram://`, or `ig.me` reference in the source; the footer Instagram profile links stay unchanged
  - [x] update the mobile-bar description, the `data-instagram-link` notes, and the project structure in both README languages
  - [x] extend `tests/mobile-contact-bar.spec.js` with the two-action contract: link count, destinations, and accessible names; one-row layout without horizontal overflow and with 48px targets at 320, 375, and 767 px; hidden bar at 768 and 1280 px; Tab order and focus ring; unavailability while the navigation dialog or lightbox is open; and the footer Instagram links on all four content pages
  - **Verification (2026-10-23, Chrome 155):** `tests/mobile-contact-bar.spec.js` passes all 14 tests, including the existing focus-clearance checks at 375×812 and 320×400; a layout probe confirmed a single 65px row within the 72px clearance and no horizontal overflow at 320, 375, and 767 px in the dark and light themes; `tests/nav.spec.js` and `npm run build` pass. Run on the installed Google Chrome through a temporary channel override, because the Chromium build expected by Playwright 1.63 is not installed; the spec is not yet run by an npm script or CI.
  - **Completion condition:** below 768 px, the mobile bar contains exactly the booking demo and telephone actions with no Instagram deep-link logic; from 768 px it remains hidden.
  - **Source:** `daily-AUDIT.md` — P2-04; the mismatch between the Instagram action's accessible name and its destination is eliminated by removing the action.

## Phase 3 — Verification, styling, and documentation contracts

**Goal:** Keep automated checks, design tokens, and the README aligned with the current implementation.

- [ ] **PH3-01 — Run the mobile contact-bar regression spec through a project script and CI**
  - **Priority:** Medium
  - [ ] expose `tests/mobile-contact-bar.spec.js` through an npm script in `package.json`, keeping `test:nav` scoped to navigation
  - [ ] run the new script in `.github/workflows/ci.yml` after the existing navigation tests
  - [ ] confirm that the spec passes against the current `--mobile-contact-bar-clearance` scroll margins
  - **Completion condition:** CI fails when stylist or gallery focus clearance above the fixed contact bar regresses.
  - **Source:** `daily-AUDIT.md` — P2-02

- [ ] **PH3-02 — Remove unused breakpoint tokens and the unused grid utility**
  - **Priority:** Low
  - [ ] remove `--break-sm`, `--break-md`, and `--break-lg` from `css/tokens.css`
  - [ ] remove the `.card-grid` rules from `css/layout.css`
  - [ ] confirm that no CSS, JS, or HTML source references the removed names and that `npm run build` passes its CSS custom-property guard
  - **Completion condition:** the stylesheets no longer declare breakpoint tokens or utilities that no media query or markup uses; the 900 px sync comment between `js/nav.js` and `css/components.css` remains accurate.
  - **Source:** `daily-AUDIT.md` — P2-05

- [ ] **PH3-03 — Synchronize the README with the current modules and tests**
  - **Priority:** Medium
  - **Depends on:** `PH3-01`
  - [ ] add `js/back-to-top.js` and `tests/mobile-contact-bar.spec.js` to the project structure in both README languages
  - [ ] describe the back-to-top control, including its visibility trigger and the keyboard focus hand-off to the skip link, in the features and accessibility sections
  - [ ] document the new test script in the development, verification, and CI sections, and route contact-bar clearance and back-to-top changes in the verification table
  - [ ] include any regression checks added by `PH1-01` and `PH1-02` in the description of the test suites
  - **Completion condition:** the PL and EN README sections list every current `js/` module and test spec and state which command verifies each contract.
  - **Source:** `daily-AUDIT.md` — P2-03

## Optional future improvements

- [ ] **O-01 — Render the remaining shared footer content at build time**
  - **Value:** extending the `build/primary-navigation.js` transform pattern to the footer contact block, legal links, social links, and back-to-top button would remove four-way drift risk for public contact data in `index.html`, `privacy.html`, `terms.html`, and `cookies.html`.
  - **Scope boundary:** non-blocking; the four footers are currently identical apart from `aria-current`, and the README documents the current split.

- [ ] **O-02 — Add focused browser checks for non-navigation interactions**
  - **Value:** small Playwright checks for booking preselection and `aria-*` state, lightbox focus return, back-to-top focus hand-off, and theme persistence would protect contracts that are currently verified manually.
  - **Scope boundary:** non-blocking; proportionate only if these interactions continue to change.
