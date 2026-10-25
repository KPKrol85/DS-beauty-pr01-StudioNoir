# Studio Noir — Development Plan

**Last reviewed:** 2026-10-25

**Project type:** Static Polish-language portfolio demonstration; Vite multi-page site with vanilla HTML, CSS, and JavaScript

**Plan status:** Active

## Project scope and source ownership

The site has six HTML entry pages: `index.html`, `privacy.html`, `terms.html`, `cookies.html`, `404.html`, and `offline.html`. Booking is an in-browser demonstration: it creates no appointment, submits nothing, and persists no selection. Contact details identify the project author. No backend, accounts, payments, or production booking integration are required by the current scope.

Canonical sources are the root HTML documents, `build/`, `css/`, `js/`, `assets/`, `public/`, and `service-worker.js`. Shared markup is generated in the order `build/shared-header.js` → `build/shared-footer.js` → `build/primary-navigation.js`. `vite.config.js` owns build inputs, validation, social-image URL processing, and generated worker cache lists/version. `dist/` is generated output and must not be hand-edited.

## Planning and verification rules

- This file is the current record of planned and verified completed work. Inspect relevant items before implementation; update them when the authorized task permits documentation changes.
- Check a main item only after its outcome, required subtasks, documentation, and focused verification are complete. Preserve unfinished work and established Polish content, ARIA, `data-*`, navigation, storage, responsive, and theme contracts.
- Record significant completed changes in `docs/CHANGELOG.md` when authorized. Planning-only maintenance does not require a changelog entry.
- Phases 1–3 and completed additional improvements retain the identifiers and titles from `docs/archive/plans/PLAN-2026-10-24.md`. Their implementations were cross-checked against current sources, tests, and configuration; prior execution evidence is recorded in `docs/archive/audits/daily-AUDIT-2026-10-24.md` and `AUDIT.md`, rather than claimed as new test runs.
- The initial planning review used static repository inspection. PH4-01 implementation checks are recorded below and in `AUDIT.md`. Existing tests use Chromium against Vite development; the PH4-01 production-preview checks cover navigation, not a new PWA audit. Repository hosting configuration does not establish deployment status.

## Current priorities

1. `PH4-02` — Restore a usable lightbox image area at constrained heights (`AUDIT.md` P2-01).

## Phase 1 — Accessibility of hidden and revealed content

**Goal:** Preserve the completed keyboard-access and section-reveal corrections.

- [x] **PH1-01 — Remove the hidden mobile header booking link from the focus order**
  - **Completed outcome:** The mini CTA starts inert and hidden, becomes keyboard-accessible with its visible state, and retains booking navigation.
  - **Evidence:** `build/shared-header.js`, `js/header.js`, `css/components.css`, and the mobile-header cases in `tests/nav.spec.js`; prior browser verification is recorded in the archived audit and `AUDIT.md`.

- [x] **PH1-02 — Make section reveal independent of container height**
  - **Completed outcome:** Reveal uses intersection threshold `0`; reduced-motion and unavailable/failed-observer paths keep content available.
  - **Evidence:** `js/reveal.js`, `css/sections.css`, and `tests/reveal.spec.js`; prior checks of all eleven reveal elements at 667×375 and 320×256 are recorded in both audits.

## Phase 2 — Theme and contact-action correctness

**Goal:** Preserve the completed initial-theme and two-action contact-bar behavior.

- [x] **PH2-01 — Apply the selected theme before first paint**
  - **Completed outcome:** All four content pages load a synchronous theme bootstrap before application initialization; stored/system resolution, `color-scheme`, switching, and storage failure handling remain implemented.
  - **Evidence:** `public/theme-bootstrap.js`, `js/theme.js`, `css/tokens.css`, the four content-page heads, and `tests/theme-first-paint.spec.js`; prior execution is recorded in both audits.

- [x] **PH2-02 — Simplify the mobile contact bar to booking demo and telephone**
  - **Completed outcome:** The bar contains native booking-demo and author-telephone links, hides during either modal, and preserves focus clearance. The owner-approved replacement of the former Instagram action remains in effect.
  - **Evidence:** `index.html`, `css/components.css`, `css/sections.css`, and `tests/mobile-contact-bar.spec.js`; the archived audit records the scope decision and passing focused checks.

## Phase 3 — Verification, styling, and documentation contracts

**Goal:** Preserve the completed validation routing and accurate maintenance baseline.

- [x] **PH3-01 — Run the mobile contact-bar regression spec through a project script and CI**
  - **Completed outcome:** `test:mobile-contact-bar` runs the existing specification and is invoked by CI; both README language sections document this route.
  - **Evidence:** `package.json`, `.github/workflows/ci.yml`, `README.md`, and `tests/mobile-contact-bar.spec.js`. Workflow wiring is verified statically; remote CI execution is not claimed.

- [x] **PH3-02 — Remove unused breakpoint tokens and the unused grid utility**
  - **Completed outcome:** The obsolete breakpoint tokens and `.card-grid` utility are absent; the actual 900px navigation boundary remains documented in CSS and JavaScript.
  - **Evidence:** `css/tokens.css`, `css/layout.css`, `css/components.css`, and `js/nav.js`; the archived audit records the completed cleanup.

- [x] **PH3-03 — Synchronize the README with the current modules and tests**
  - **Completed outcome:** Both README language sections describe current module ownership, back-to-top behavior, all five specifications, npm/CI/manual routing, and production-preview limitations.
  - **Evidence:** `README.md`, `js/main.js`, `js/back-to-top.js`, `package.json`, `playwright.config.js`, and `.github/workflows/ci.yml`, cross-checked with current test files.

## Completed additional improvements

**Goal:** Retain verified shared-markup and interaction-test work from the archived plan without reopening it.

- [x] **O-01 — Render the remaining shared footer content at build time**
  - **Completed outcome:** One footer renderer supplies all four content pages, including legal-link current state and the back-to-top control, before primary-navigation rendering.
  - **Evidence:** `build/shared-footer.js`, `vite.config.js`, and the four HTML insertion markers; both audits record shared-markup verification.

- [x] **O-02 — Add focused browser checks for non-navigation interactions**
  - **Completed outcome:** The interaction specification covers booking state/preselection, lightbox navigation/focus return, back-to-top behavior, and theme persistence, with npm and CI routing.
  - **Evidence:** `tests/interactions.spec.js`, `package.json`, and `.github/workflows/ci.yml`; both audits record passing interaction checks. Short-height lightbox geometry remains separate work under `PH4-02`.

- [x] **O-03 — Render the shared header at build time**
  - **Completed outcome:** One header renderer supplies the four content pages with page-specific destinations and a home-only inert mini CTA; insertion guards prevent duplicate or misplaced markup.
  - **Evidence:** `build/shared-header.js`, `build/primary-navigation.js`, `vite.config.js`, and the four HTML insertion markers; `AUDIT.md` records transformed-page and navigation verification.

## Phase 4 — Reachable overlays on short viewports

**Goal:** Resolve the two current responsive defects while retaining existing modal interactions and themes.

These fixes are independent; address the primary-navigation defect first. Each item includes its own regression coverage and documentation updates, with no separate implementation prerequisite.

- [x] **PH4-01 — Keep the complete mobile menu reachable on short viewports**
  - **Source:** `AUDIT.md` — resolved P1-01: the fixed panel previously centered overflowing content without internal scrolling while the body was locked.
  - [x] Adapt the canonical panel styles to available height, allowing internal scrolling without placing the first item beyond the scrollable start; keep the close control visible and usable.
  - [x] Preserve initial focus, Tab/Shift+Tab wrapping, dialog ARIA, main-content `inert`, body scroll locking, theme switching, native link destinations, and cleanup at the 900px desktop boundary. Change shared markup or JavaScript only if the layout correction requires it.
  - [x] Extend `tests/nav.spec.js` for the four content pages at 667×375, 812×375, and 320×256: verify visible initial focus, pointer scrolling, keyboard reachability of every link/action, close-control access, Escape/link closing, and breakpoint cleanup. Include portrait and light/dark checks, and retain contact-bar modal hiding.
  - [x] Run `npm run build`, `npm run test:nav`, and `npm run test:mobile-contact-bar`; inspect the corrected layout in `npm run preview`. Run `npm run test:interactions` if the shared focus helper changes.
  - [x] After successful verification, resolve P1-01 in `AUDIT.md`, update affected README behavior/check descriptions and `docs/CHANGELOG.md`, and complete this item.
  - **Completed outcome:** Mobile-only overflow, non-shrinking groups, and auto margins preserve centered portrait navigation and expose every action by scrolling. JavaScript and shared markup remain unchanged.
  - **Verification:** Build passed; 45 navigation and 14 contact-bar tests passed. Production-preview browser and screenshot checks passed on all four content pages at 667×375, 812×375, 320×256, and 375×812 in light/dark themes; the shared focus helper was unchanged, so interaction tests were not rerun. Verification was Windows Chromium only.
  - **Completion condition:** Every menu action and its focus indication can be brought into view and activated at the affected dimensions on all four content pages; closing or switching to desktop restores the normal page state.
  - **Changelog:** yes — responsive navigation and accessibility behavior.

- [ ] **PH4-02 — Preserve a usable lightbox image area at constrained heights**
  - **Source:** `AUDIT.md` — P2-01, confirmed against `.lightbox__content` and `.lightbox__image` in `css/components.css`. The 90dvh grid gives its image only the space left after fixed controls, caption, padding, and gaps.
  - [ ] Adjust short-height spacing, row allocation, or internal scrolling in the canonical lightbox styles so the image does not collapse into a strip; retain access to the caption and close/previous/next controls.
  - [ ] Extend `tests/interactions.spec.js` with short-height image-geometry and control-reachability checks; retain looping arrow-key navigation, live captions, focus wrapping/return, Escape/overlay closing, and body scroll restoration.
  - [ ] Run `npm run build`, `npm run test:interactions`, and `npm run test:mobile-contact-bar`. In `npm run preview`, visually inspect all six images at 320×256, 667×375, and 375×812 in light and dark themes, including keyboard access to controls.
  - [ ] After successful verification, resolve P2-01 in `AUDIT.md`, update affected README behavior/check descriptions and `docs/CHANGELOG.md`, and complete this item.
  - **Completion condition:** At 320×256 every image is visibly inspectable rather than reduced to the reported approximately 8px strip, and all controls remain reachable; ordinary portrait and landscape presentation and modal behavior remain usable.
  - **Changelog:** yes — responsive gallery behavior.

## Optional future improvements

These items are non-blocking enhancements to the documented demonstration scope. They are independent of Phase 4 and do not expand product capabilities.

- [ ] **O-04 — Reuse an available gallery variant for offline lightbox viewing**
  - **Source:** `AUDIT.md` — optional offline-gallery finding; `js/lightbox.js` uses the thumbnail's fallback `src`, while `index.html` supplies responsive AVIF/WebP alternatives cached on demand by `service-worker.js`.
  - [ ] Use the browser-selected available variant, or a bounded fallback to it, when the alternative lightbox source is unavailable; preserve descriptions, navigation, focus behavior, and useful online image quality.
  - [ ] Update the source-selection expectation in `tests/interactions.spec.js` to match the chosen behavior. Verify the offline case against a production build in `npm run preview`: view a thumbnail under worker control, go offline with its alternative uncached, and confirm a loaded lightbox image and working navigation/close controls.
  - [ ] Update the precise partial-offline behavior in `README.md` and record the completed change in `docs/CHANGELOG.md` after verification.
  - **Completion condition:** A previously displayed cached gallery variant can be viewed in the lightbox when its alternative is uncached; normal online viewing remains functional.
  - **Scope boundary:** Preserve on-demand image caching; no full-gallery precache or complete offline-media guarantee.
  - **Changelog:** yes — offline gallery behavior.

- [ ] **O-05 — Include the existing reveal and first-paint specifications in CI**
  - **Source:** `AUDIT.md` — optional CI finding; `.github/workflows/ci.yml` currently runs only the three npm-routed specifications, while `tests/reveal.spec.js` and `tests/theme-first-paint.spec.js` remain manual.
  - [ ] Add project-script and CI routing for those two existing specifications with the current Chromium/Vite configuration and dependencies; retain the current build and three regression steps.
  - [ ] Execute both specifications through the new scripts, verify workflow routing, and synchronize both README language sections and `docs/CHANGELOG.md`. Distinguish local test success from any observed remote CI result.
  - **Completion condition:** CI invokes all five existing specifications, and documentation accurately describes the automated route and its development-server scope.
  - **Scope boundary:** No browser-matrix expansion, new test framework, or deployment automation is required.
  - **Changelog:** yes — regression verification workflow.
