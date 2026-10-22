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

- [ ] **PH1-01 — Remove the hidden mobile header booking link from the focus order**
  - **Priority:** High
  - [ ] below 768 px, remove `.header__mini-cta` from pointer, Tab, and accessibility-tree access while it lacks `.is-visible`, following the `visibility` pattern used by `.mobile-cta` and `.back-to-top`
  - [ ] keep the existing fade and slide transition when the link appears and disappears
  - [ ] keep the `IntersectionObserver` and scroll-fallback toggling in `js/header.js` and the `display: none` behavior from 768 px unchanged
  - [ ] add one focused keyboard regression check to a CI-run spec: at a mobile width with the hero in view, Tab moves from the logo past the hidden link; after the hero leaves the viewport, the link is reachable and its focus outline is visible
  - **Completion condition:** at widths below 768 px, the hidden header booking link is never a Tab stop or an exposed accessibility node, and the visible link remains reachable.
  - **Source:** `daily-AUDIT.md` — P1-01

- [ ] **PH1-02 — Make section reveal independent of container height**
  - **Priority:** High
  - [ ] reproduce in a browser on short viewports (landscape phone and the 320×256 CSS px reflow case) whether tall `[data-reveal]` containers, such as booking and testimonials, remain at `opacity: 0` after scrolling through them
  - [ ] if reproduced, change the reveal trigger in `js/reveal.js` so a container is revealed once it enters the viewport, regardless of its height relative to the viewport
  - [ ] preserve the reduced-motion, missing-observer, observer-failure, and print fallbacks
  - [ ] add one focused browser check at a short viewport confirming that every `[data-reveal]` element is visible after it is scrolled into view
  - **Completion condition:** no `[data-reveal]` element remains transparent after entering the viewport at any tested viewport height; when the risk is not reproducible, the browser result is recorded and the trigger stays unchanged.
  - **Source:** `daily-AUDIT.md` — P1-02

## Phase 2 — Theme and contact-action correctness

**Goal:** Align first-paint theme rendering and the Instagram contact action with their declared behavior.

- [ ] **PH2-01 — Apply the selected theme before first paint**
  - **Priority:** Medium
  - [ ] resolve the stored `studio-noir-theme` value or the system preference before the first paint on `index.html`, `privacy.html`, `terms.html`, and `cookies.html`, instead of only when the deferred `/js/main.js` module runs
  - [ ] keep the storage key, accepted values, and stored-then-system fallback order consistent with `js/theme.js`
  - [ ] tie `color-scheme` to the active theme class instead of the fixed `light dark` declaration on `:root` in `css/tokens.css`
  - [ ] preserve the current behavior when `localStorage` is unavailable, blocked, or holds an invalid value, and the toggle's accessible names
  - [ ] verify in a browser that a stored light theme and a light system preference render without a dark-to-light repaint on the home and legal pages
  - **Completion condition:** the stored or system theme is active on first paint on all four content pages, and native UI follows the selected theme.
  - **Source:** `daily-AUDIT.md` — P2-01

- [ ] **PH2-02 — Align the Instagram contact-bar action with its accessible name**
  - **Priority:** Medium
  - [ ] confirm the intended destination: direct message, as stated by the accessible name "Instagram – napisz do KP_Code" and the `ig.me` fallback, or profile, as targeted by the static `href` and the `instagram://user` app link
  - [ ] make the app attempt, the fallback, the `href` set by `js/mobile-cta.js`, and the accessible name in `index.html` describe the same destination, keeping the handle in `js/config.js`
  - [ ] keep modified clicks and non-primary clicks as plain links
  - [ ] update the `data-instagram-link` description in both README languages
  - [ ] verify on iOS Safari and Android Chrome, with and without the Instagram app installed; record the limitation if devices are unavailable
  - **Completion condition:** activating the contact-bar Instagram action leads to the destination its accessible name announces, without an invalid-address error before the fallback.
  - **Source:** `daily-AUDIT.md` — P2-04

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
