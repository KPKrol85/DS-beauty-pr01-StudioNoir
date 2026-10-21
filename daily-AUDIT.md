# Daily Front-End Audit — Studio Noir

**Audit date:** 2026-10-21
**Project type:** Static multi-page website (Vite MPA, vanilla HTML/CSS/ES modules, build-injected service worker) for a fictional demonstration hair studio
**Audit mode:** Static repository review

## Overall assessment

The source architecture is stable and deliberately constrained: one JS entry with guarded `init*` modules, layered CSS on shared tokens, build-time navigation rendering, and build guards that fail on broken precache, page-registration, CSS custom-property, and navigation-marker contracts. No runtime, build, or deployment blockers were found. The most important current risk category is accessibility of visually hidden or not-yet-revealed content on narrow and short viewports: one confirmed invisible keyboard focus stop and one credible reveal-threshold risk. Remaining items are small verification and documentation drifts that accompanied the latest additions. The project is ready for normal continued development.

## Verified strengths

- Build guards turn contract drift into build failures: missing service-worker placeholders, undeclared root pages, missing fallback documents in precache, and undefined `var(--…)` references (`vite.config.js:43-75`, `vite.config.js:132-153`), plus exact-once navigation insertion points (`build/primary-navigation.js:22-55`).
- Header and footer primary navigation on all four content pages are rendered from one entry list as plain links that work without browser JavaScript (`build/primary-navigation.js:4-12`), covered by `tests/nav.spec.js` and run in CI (`.github/workflows/ci.yml`).
- Service-worker cache version is a SHA-256 over worker code and asset names and contents; activation deletes only `studio-noir-` caches; on-demand editorial images are cached only on `response.ok`; only same-origin GET requests are intercepted (`vite.config.js:77-88`, `service-worker.js:21-64`).
- Modules fail safely: element guards in every `init*`, `localStorage` access wrapped in `try/catch` (`js/theme.js:6-21`), reveal leaves content visible when `IntersectionObserver` is absent or throws (`js/reveal.js:1-23`), and scroll fallbacks exist for the section spy, mini CTA, and back-to-top control.
- Overlay patterns are consistent and state-driven: the mobile menu derives `role`, `aria-modal`, `aria-hidden`, `inert`, and scroll lock from viewport and open state and resets across the 900 px breakpoint (`js/nav.js:41-105`); the lightbox uses native buttons, focus wrap, Escape, and focus return; the contact bar and back-to-top control use `visibility` so they leave the Tab order while hidden or while a modal is open (`css/components.css:578-581`, `css/components.css:786-804`).
- Booking demo state is honest and accessible: `aria-pressed` choices, a polite live summary, and a focusable `aria-disabled` action with a linked requirement hint; public copy repeatedly states nothing is sent or stored (`js/booking.js:60-90`, `index.html:514-558`).
- Public storage disclosures match the implementation: `cookies.html` lists the `studio-noir-theme` `localStorage` key, Cache Storage, and the service worker, which are the only storage mechanisms found in `js/` and `service-worker.js`.
- Source HTML integrity is clean: no duplicate IDs, all `aria-labelledby`, `aria-describedby`, and `aria-controls` targets resolve, all root-relative asset references exist, and each page has one `h1`.

## P0 — Critical risks

None detected.

## P1 — Important issues worth fixing next

### [P1-01] Hidden mobile header booking link remains a keyboard focus stop

- **Classification:** Defect
- **Evidence:** `css/components.css:539-550`, `index.html:49`, `js/header.js:93-100`
- **Current behavior:** Below 768 px, `.header__mini-cta` is hidden with `opacity: 0` and `pointer-events: none` only, until the hero leaves the viewport. The element is still a focusable `<a href>` and stays in the accessibility tree, and its `:focus-visible` outline inherits the zero opacity. The contact bar and back-to-top control use `visibility` for the same purpose.
- **Impact:** On every home-page visit at mobile widths, including desktop browsers zoomed to a sub-768 px CSS viewport, the third Tab stop (after the skip link and the logo) is an invisible link with an invisible focus indicator.
- **Recommended direction:** Remove the link from the focus order and accessibility tree while it is hidden, following the existing `visibility` pattern, and add a focused keyboard regression check.

### [P1-02] Reveal threshold can leave tall section containers permanently transparent

- **Classification:** Source-visible risk
- **Evidence:** `js/reveal.js:16`, `js/reveal.js:38-41`, `css/sections.css:1186-1189`, `index.html:510`, `index.html:586`
- **Current behavior:** Each of the eleven `[data-reveal]` elements, nine of them whole section containers, is set to `opacity: 0` once observed and revealed only on crossing a 0.2 intersection ratio. A container that starts outside the viewport and is taller than five viewport heights cannot reach that ratio while scrolling, so it is never revealed.
- **Impact:** On short viewports, such as landscape phones or the 320×256 CSS px reflow case at 400% zoom, long containers such as booking and testimonials may remain invisible while their buttons and links stay focusable. Not verified in a browser.
- **Recommended direction:** Verify at short viewports. Make the reveal trigger independent of container height relative to the viewport, keeping the existing reduced-motion and no-observer fallbacks.

## P2 — Minor refinements

### [P2-01] Selected theme is applied only after module execution

- **Classification:** Source-visible risk
- **Evidence:** `index.html:39`, `index.html:837`, `js/theme.js:41`, `css/tokens.css:2`
- **Current behavior:** Every page is served with `theme--dark` on `body`. The stored or system theme is applied only when the deferred `/js/main.js` module runs `initTheme()`. `:root` declares `color-scheme: light dark` regardless of the selected theme class.
- **Impact:** Users with a light system preference or a stored light choice can see a dark-to-light repaint on each page load, including navigation between the home and legal pages. Native UI such as scrollbars follows the OS preference instead of the chosen theme.
- **Recommended direction:** Resolve the theme before first paint and tie `color-scheme` to the active theme class, preserving the current storage-failure behavior.

### [P2-02] Mobile contact-bar regression spec is not run by any script or CI

- **Classification:** Maintenance risk
- **Evidence:** `package.json:22`, `.github/workflows/ci.yml:44`, `tests/mobile-contact-bar.spec.js:17`
- **Current behavior:** `test:nav` runs only `tests/nav.spec.js`, and CI runs only `test:nav`. The spec guarding the stylist and gallery focus clearance above the fixed contact bar, recorded in `docs/CHANGELOG.md:57`, runs only on a manual, unscripted Playwright invocation.
- **Impact:** Regressions in `--mobile-contact-bar-clearance` scroll margins can merge undetected, and the spec can go stale without any signal.
- **Recommended direction:** Expose the spec through a project script and CI, or remove it if the contract is no longer wanted.

### [P2-03] README omits the back-to-top module and the second test spec

- **Classification:** Contract mismatch
- **Evidence:** `README.md:86-97`, `README.md:108-109`, `README.md:166-172` (EN mirror `README.md:368-379`, `README.md:390-391`, `README.md:448-454`), `js/back-to-top.js`, `js/main.js:8`
- **Current behavior:** The README project structure, feature, accessibility, and verification sections do not mention `js/back-to-top.js` or its keyboard behavior, which moves focus to the skip link. They list `tests/nav.spec.js` as the only test file.
- **Impact:** The README is the declared maintenance and verification contract. Changes to the back-to-top control or the contact-bar clearance have no documented check path.
- **Recommended direction:** Update the PL and EN README sections to reflect the current modules, tests, and verification routing.

### [P2-04] Instagram contact-bar action opens a profile while its name promises a message

- **Classification:** Source-visible risk
- **Evidence:** `index.html:718-723`, `js/config.js:5`, `js/mobile-cta.js:8-14`
- **Current behavior:** A primary click navigates the current tab to `instagram://user?username=…`, which targets the profile. If the page is still visible after 900 ms, it navigates to the `ig.me` direct-message URL. The accessible name is "Instagram – napisz do KP_Code".
- **Impact:** With the app installed, users land on a profile rather than a message. Without it, some mobile browsers may show an invalid-address error before the fallback runs. The behavior has no automated or recorded device verification.
- **Recommended direction:** Align the app target and the accessible name, and verify the fallback on iOS Safari and Android Chrome with and without the app.

### [P2-05] Unused breakpoint tokens and layout utility imply a non-existent contract

- **Classification:** Maintenance risk
- **Evidence:** `css/tokens.css:79-81`, `css/layout.css:31-46`, `js/nav.js:3-5`
- **Current behavior:** `--break-sm`, `--break-md`, and `--break-lg` are never referenced; custom properties cannot be used in media queries. `--break-lg: 1200px` matches no media query in the stylesheets. `.card-grid` has no markup. The real 900 px boundary is kept in sync by a comment between `js/nav.js` and `css/components.css`.
- **Impact:** The tokens suggest a breakpoint source of truth that does not exist, which can mislead future responsive changes.
- **Recommended direction:** Remove the dead tokens and utility, or record the actual breakpoints in one place that the comment can reference.

## Extra quality improvements

### Build-time rendering for the remaining shared footer

- **Evidence:** The footer contact block, legal links, social links, and back-to-top button are hand-maintained in `index.html`, `privacy.html`, `terms.html`, and `cookies.html`. They are currently identical apart from `aria-current`, and the contact details changed recently.
- **Potential value:** Extending the existing `build/primary-navigation.js` transform pattern would remove four-way drift risk for public contact data.
- **Scope boundary:** Optional. No drift exists today, and the README documents the current split.

### Focused tests for non-navigation interactions

- **Evidence:** The README states that booking, lightbox, and theme have no automated tests (`README.md:171`). These modules carry explicit ARIA, focus-return, and persistence contracts.
- **Potential value:** Small Playwright checks for booking preselection and `aria-*` state, lightbox focus return, back-to-top focus hand-off, and theme persistence would protect contracts that are currently verified manually.
- **Scope boundary:** Optional, and proportionate only if these interactions keep changing.

## Verification performed

- Inspected `README.md`, `AGENTS.md`, `package.json`, lockfile dependency versions, `vite.config.js`, `build/primary-navigation.js`, `service-worker.js`, all `js/` modules, all six HTML pages (home page in full; legal pages' shell, metadata, and storage disclosures), CSS tokens, base, layout, and the relevant component and section rules, `netlify.toml`, `public/_redirects`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, the CI workflow, the Playwright config, both specs, the `docs/CHANGELOG.md` head, and Git status and log.
- `git status` and `git diff --check` reported a clean tree. `node --check` passed on all JS sources, configs, and specs.
- A read-only scan of the six HTML sources found no duplicate IDs and no unresolved ARIA ID references, in-page fragments, or root-relative asset paths. A footer diff across the four content pages showed only the expected `aria-current` differences.
- Attempted `tests/mobile-contact-bar.spec.js` using the main checkout's installed `@playwright/test` 1.63.0 and Vite 8.3.1 (matching `package-lock.json`). It did not execute: the required Chromium headless-shell build is not installed, and installing browsers was outside scope. This is an environment limitation, not a test result.
- Not run: `npm run build` (regenerates `dist/`), `npm run test:nav`, `npm run preview`, browser or assistive-technology checks, Lighthouse, and any deployment check. P1-02, P2-01, and P2-04 require runtime verification; build-plugin behavior was assessed from source only.

## Senior rating

**Rating:** 8/10

The codebase is coherent, defensive, and unusually well guarded for a static site: build-time contract checks, single-source navigation, a content-versioned service worker, CI-run navigation tests, and carefully stated demo and storage disclosures. The rating is held back by one confirmed keyboard-visibility defect, a credible reveal risk on short viewports, and verification and documentation that have not kept pace with the latest additions.
