# Studio Noir — Quality Improvements

**Analysis date:** 2026-10-04
**Completion date:** 2026-10-04
**Status:** Completed
**Project type:** Static multi-page website (Vite MPA build; vanilla HTML, CSS custom properties, and ES modules; service worker with a build-generated precache) — Polish-language demonstration site for a hair studio, KP_Code Digital Studio
**Analysis mode:** Evidence-based quality improvement review
**Focus:** Project-wide quality

## Improvement overview

This review identified five project-wide quality improvements focused on runtime resilience, regression protection for accessibility state, and build-time verification. At the time of the analysis, the only automated assertion was the service-worker placeholder check in the build; interaction state, accessibility state, and build contracts were verified manually.

All five selected improvements were implemented and verified:

- theme persistence is fail-safe when browser storage is unavailable, throws, or holds an invalid value;
- the shared navigation's mobile/desktop state contract is fixed and covered by a focused Playwright regression test, run through `npm run test:nav`;
- the production build fails when a root-level page is not a declared input or when the precache lacks the documents the offline fallback depends on;
- the production build fails on undefined CSS custom-property references used without a fallback;
- the reveal enhancement fails open when `IntersectionObserver` is unavailable or cannot be created, and reveal content stays visible in print.

The `Current implementation`, `Proposed improvement`, `Expected quality value`, `Implementation scope`, and `Acceptance criteria` fields below preserve the original pre-implementation analysis for archival traceability. Each item's `Status` records the completed implementation outcome.

## Completed improvements

### IMP-QUALITY-01 — Keep theme switching working when browser storage is unavailable

- **Status:** Completed — made theme persistence fail-safe when `localStorage` is unavailable, throws, or contains an invalid value. Theme switching now continues to work without storage, falls back to `prefers-color-scheme`, and no longer interrupts later application initialization. Verified across all content pages; `npm run build` and `git diff --check` passed.
- **Affected area:** Theme preference handling in `js/theme.js` and shared initialization on the home page and legal pages.
- **Evidence:** `js/theme.js`, `js/main.js`, `cookies.html`, `terms.html`
- **Current implementation:** Theme persistence previously depended directly on unguarded `localStorage` reads and writes. A storage failure could stop `initTheme()` and prevent later initializers from running.
- **Proposed improvement:** Treat browser storage as optional persistence, validate stored values, and keep theme switching functional when storage cannot be read or written.
- **Expected quality value:** Theme behavior remains reliable when site storage is blocked or unavailable, while unrelated application features continue initializing normally.
- **Implementation scope:** `js/theme.js` only. Preserve the existing storage key, supported values, theme classes, labels, and initializer order.
- **Acceptance criteria:** Storage failures produce no uncaught exception; the theme falls back to `prefers-color-scheme`; the toggle remains functional; invalid stored values are ignored; later initializers still run; normal stored-theme behavior remains unchanged.
- **Impact:** Medium
- **Effort:** Small

### IMP-QUALITY-02 — Add a browser regression check for the mobile-menu state contract

- **Status:** Completed — fixed the mobile/desktop navigation state contract and the mobile panel viewport issue. Added a focused Playwright regression test covering mobile interaction, the 900px breakpoint transition, and desktop accessibility exposure. `npm run test:nav`, `npm run build`, and `git diff --check` passed.
- **Affected area:** The shared header navigation (`js/nav.js`, `[data-nav-panel]`) on the home page and the three legal pages, and the accessibility contract the README documents for it.
- **Evidence:** `README.md:143`, `js/nav.js:18-36`, `js/nav.js:63-97`, `css/components.css:317-336`, `css/components.css:463-471`, `index.html:56`, `package.json:9-16`, `README.md:137`
- **Current implementation:** The menu writes its state imperatively to `aria-expanded`, `aria-hidden`, the `is-open` class, `body.style.overflow`, and `inert` on `<main>`, with separate handling for the mobile viewport and for resizes across 900px; from 900px the same panel is the inline desktop navigation. The README documents the contract: expanded state, synchronized `aria-hidden`, focus moved into the panel and back, a Tab and Shift+Tab trap, Escape to close, and `inert` on the main content in the mobile viewport. No automated check covers it, and the project has no test tooling. The Chromium probe found two transitions that break this contract; they are defects outside this report: after the menu was opened at 375px and the viewport widened to 1024px, `<main>` remained `inert`; and at desktop widths the visible panel, with eight focusable controls, keeps `aria-hidden="true"` and `role="dialog"`, which hides its links, call to action, and theme toggle from assistive technology.
- **Proposed improvement:** Add one focused browser-level regression test for the documented menu contract, including the transition across the 900px breakpoint and the desktop navigation's exposure to assistive technology.
- **Expected quality value:** The menu is the most widely shared interactive component, and its failure modes — focus, `inert`, and ARIA state — escape static review and visual checks. A regression test makes the fixes for both defects verifiable and keeps later header work from reintroducing them.
- **Implementation scope:** One test file for the home page's menu at a mobile and a desktop viewport, one npm script, and a browser-automation dev dependency (for example, Playwright), which needs explicit approval because the project has no test tooling. Run against the existing Vite dev server. Visual assertions, the lightbox, and CI integration (a Workflow decision) are out of scope. Implement with or after the fixes for the two navigation defects; until then, the breakpoint and desktop assertions fail by design.
- **Acceptance criteria:** At 375px, opening the menu sets `aria-expanded="true"`, removes `aria-hidden` from the panel, makes `<main>` inert, locks page scrolling, and moves focus into the panel; Tab and Shift+Tab cycle within the panel; Escape closes the menu and returns focus to the toggle; activating a navigation link closes the menu. After opening the menu at 375px and widening the viewport to at least 900px, the menu is closed, `<main>` is not inert, and scrolling is unlocked. At 900px and above, the navigation links are exposed by role within the "Główna" navigation landmark. The test runs from one npm script, passes on the fixed implementation, and fails when either fix is reverted.
- **Impact:** High
- **Effort:** Medium

### IMP-QUALITY-03 — Extend the build-time guard to the page and offline-fallback contract

- **Status:** Completed — the build guard now fails when a root-level `.html` page is not a declared input or when the precache lacks `/index.html` or `/offline.html`. Both failure cases were verified, and the valid production output, including the precache list and cache version, remained unchanged.
- **Affected area:** The `studio-noir-precache` plugin in `vite.config.js` and the service worker's navigation fallback.
- **Evidence:** `vite.config.js:28-42`, `vite.config.js:66-74`, `service-worker.js:4-17`, `README.md:184`, `netlify.toml:2`
- **Current implementation:** The plugin fails the build when the worker's two placeholders are missing, then builds the precache list from the bundle and `public/`. The six pages are registered by hand in `build.rolldownOptions.input`, and the README notes that a new page needs a manual entry there. The worker resolves offline navigations to cached `.html` documents, otherwise to `/offline.html` (`OFFLINE_PAGE`), and returns `Response.error()` when neither is cached. Neither contract is checked: a root-level page missing from the inputs is still served by the dev server, but under this configuration it is neither emitted to `dist/` nor precached, and the build succeeds; if `offline.html` dropped out of the inputs, the worker would have no offline page to serve.
- **Proposed improvement:** Extend the existing plugin so the build fails when a root-level `.html` page is not a declared input, or when the generated precache list lacks a document the worker's navigation fallback depends on (`/offline.html` and `/index.html`).
- **Expected quality value:** Two documented manual invariants become build failures, so a page missing from production or a broken offline fallback cannot reach the Netlify deployment, which runs this build.
- **Implementation scope:** The `studio-noir-precache` plugin in `vite.config.js` only. Preserve the input list, the precache list contents, the cache-version hash, the output file names, and `service-worker.js`. No new dependencies. Deriving inputs automatically is a separate architectural choice and is not required.
- **Acceptance criteria:** The current sources build with an unchanged precache list and cache version. A temporary unregistered root-level `.html` file fails the build with a message naming the file. Temporarily removing the `offline` input fails the build with a message naming `/offline.html`. Both failures use the plugin's existing `this.error` reporting.
- **Impact:** Medium
- **Effort:** Small

### IMP-QUALITY-04 — Verify that CSS custom-property references resolve

- **Status:** Completed — removed the unresolved `--color-text-muted` reference and added a build-time guard for undefined CSS custom properties used without a fallback. Misspelled-reference and fallback probes passed; `npm run build` and `git diff --check` passed.
- **Affected area:** Token-driven CSS: definitions in `css/tokens.css` (including the `.theme--light` overrides), component-scoped properties, and every `var()` consumer in `css/`.
- **Evidence:** `css/sections.css:169-172`, `css/tokens.css:1-84`, `css/components.css:100-109`, `package.json:9-13`, `docs/archive/improvements/IMPROVEMENTS-UI-2026-10-04.md:119`
- **Current implementation:** Shared design decisions are custom properties, and the light theme works by overriding them. Nothing checks that referenced properties exist. A search of the stylesheets, HTML, and scripts found one unresolved reference: `.booking__next-step` uses `var(--color-text-muted)` without a fallback, and nothing defines that property (a defect outside this report). Under CSS custom-property rules the declaration is invalid at computed-value time, so the text takes the inherited color instead of a muted one, and no tool reports it.
- **Proposed improvement:** Add a dependency-free check, run during `npm run build` like the existing precache guard, that fails when a `var()` reference without a fallback names a custom property no project stylesheet defines.
- **Expected quality value:** Token typos and references left behind by renamed or removed tokens fail the build instead of silently degrading styles. The check becomes more valuable once the open light-theme defect recorded in the archived UI report — component surfaces with hardcoded dark `rgba()` values — is fixed by moving those colors to theme tokens, which adds many new references.
- **Implementation scope:** One small check over `css/*.css`. Definitions count wherever they are declared, including `.theme--light` and component scopes such as `--choice-wash`; references with an explicit fallback are allowed. Unused tokens are out of scope. This proposal does not edit stylesheets: the existing unresolved reference is fixed separately, before or together with the check, because the build fails until it is resolved.
- **Acceptance criteria:** On the current sources, the check reports exactly one unresolved reference, `--color-text-muted` at `css/sections.css:171`, with file and line. A deliberately misspelled reference fails the check. `--choice-wash` and references with a fallback are not reported. Once the existing reference is resolved, `npm run build` succeeds and the check itself does not alter the build output.
- **Impact:** Medium
- **Effort:** Small

### IMP-QUALITY-05 — Make the reveal enhancement fail open

- **Status:** Completed — reveal now fails open when `IntersectionObserver` is unavailable or cannot be created, and reveal content is always visible in print. Screen, reduced-motion, observer-failure, print, build, and diff checks passed.
- **Affected area:** Section reveal animations (`js/reveal.js` and the `.reveal` rules), which wrap the hero and every section container on the home page.
- **Evidence:** `js/reveal.js:3-24`, `css/sections.css:260-269`, `js/header.js:55-60`, `js/header.js:101-110`, `index.html:79-417`
- **Current implementation:** `initReveal()` adds `.reveal` (`opacity: 0` with a 24px offset) to all 11 `[data-reveal]` elements before it creates its `IntersectionObserver`, and an element becomes visible only when the observer reports it. Nothing resets that state for print, and `css/` has no print rules. Unlike `js/header.js`, which already handles a missing `IntersectionObserver`, `js/reveal.js` has no such path, so a failure there would leave all hooked content hidden and stop the initializers that follow it in `init()`. In the Chromium probe, with print media on a freshly loaded, unscrolled page at 1280×800, only the two hero elements were visible; all nine section containers from About to the closing call to action computed `opacity: 0`.
- **Proposed improvement:** Ensure content hidden by the reveal enhancement is always visible in print output and is never hidden when the observer cannot be created.
- **Expected quality value:** Printing or saving the home page as PDF keeps services, pricing, booking, and location content regardless of scroll position, and the enhancement degrades to visible content, as the header's observer handling already does.
- **Implementation scope:** The `.reveal` rules in `css/sections.css` and the setup order in `js/reveal.js`. Preserve the `data-reveal` hooks, the threshold, the transition timing, unobserving after reveal, and the reduced-motion path. A broader print stylesheet is out of scope.
- **Acceptance criteria:** In print preview of a freshly loaded, unscrolled home page, every `[data-reveal]` element computes `opacity: 1` with no transform, and every section's content appears. With `IntersectionObserver` unavailable, all `[data-reveal]` content is visible and the remaining initializers run. On screen, sections still animate in on scroll, and reduced-motion behavior is unchanged.
- **Impact:** Low
- **Effort:** Small

## Completion summary

All five selected improvements were completed.

- **Quality areas strengthened:** Runtime resilience and graceful degradation (01, 05), regression protection for accessibility state (02), and build-time verification of page, offline, and stylesheet contracts (03, 04).
- **New automated safeguards:** A Playwright regression test for the shared navigation (`tests/nav.spec.js`, run through `npm run test:nav` against the Vite dev server), and three build-time guards in `vite.config.js` alongside the existing placeholder check: undeclared root-level pages, missing offline-fallback documents in the precache, and undefined CSS custom-property references without a fallback.
- **Runtime resilience:** Theme switching and later initializers no longer depend on browser storage, and reveal-hooked content is no longer hidden when the observer is unavailable or when the page is printed.
- **Defects resolved along the way:** The three defects the analysis referenced but kept outside its proposals were fixed as part of the related improvements — `<main>` remaining `inert` after widening past 900px and the desktop navigation panel's `aria-hidden="true"` and `role="dialog"` (IMP-QUALITY-02), and the undefined `--color-text-muted` reference (IMP-QUALITY-04).
- **Outside this cycle:** Explicit `width` and `height` on the hero image (revisit when photography replaces the placeholder SVG); aligning font preloads with the weights actually used, which belongs with the font-subset defect recorded in the archived UI report; and security response headers, whose relevance current evidence does not demonstrate. CI integration of the regression test was also out of scope.

## Verification notes and remaining limitations

- The original analysis ran without installed dependencies or a production build, using a single Chromium probe against a plain static server. Those constraints apply to the analysis only; each item's `Status` records the verification performed during implementation, including `npm run build`, `npm run test:nav`, deliberate failure probes for the build guards, and `git diff --check`.
- Automated browser coverage runs in a single Chromium project (`playwright.config.js`) and covers only the shared navigation. Safari and Firefox were not comprehensively exercised.
- The repository has no CI; the regression test and the build guards run locally and, for the build guards, in the Netlify build.
- Other defects found during the original analysis were reported to the project owner separately and are not part of this cycle; they belong to later audit work.
