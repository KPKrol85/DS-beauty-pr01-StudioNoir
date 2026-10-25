# Studio Noir — Final Technical Front-End Audit

**Audit date:** 2026-10-25

**Project type:** Static Polish-language portfolio demonstration; Vite multi-page site with vanilla HTML, CSS and JavaScript

**Audit mode:** Final repository and implementation review

**Current readiness:** Needs important fixes

## 1. Executive assessment

Studio Noir has a coherent architecture for its documented demonstration scope: six HTML pages, shared build-time navigation/header/footer generation, modular browser interactions, and production-only service-worker registration. The production build passed in memory, and all 83 existing browser tests passed in the verified environment. Booking accurately presents a browser-only demonstration, with no appointment creation or submission.

One important responsive accessibility defect remains in the mobile menu, and a smaller height-constrained layout defect affects the lightbox. These were reproduced separately from the existing regression suite. Correct the menu before final release or portfolio sign-off; no P0 issue was detected.

## 2. Audit scope and verification

### Areas inspected

- All six root HTML documents; the three shared HTML generators; all browser modules, the theme bootstrap, and all six CSS files.
- Vite inputs, custom validation and metadata plugins, generated asset naming, precache generation, service-worker strategies, manifest, SEO files, and Netlify routing/header configuration.
- Package scripts and lockfile, all five Playwright specifications and their configuration, GitHub Actions workflow, repository safeguards, README, changelog, licensing/notices, and archived audit/plan context. No root `AUDIT.md` existed before this audit.
- Public content, demo disclosures, author contact attribution, booking/state/storage boundaries, local links/assets, image/font loading strategy, keyboard interaction contracts, themes, and responsive overlay layouts.

### Verification performed

- `git status --short` and `git diff --stat` — clean starting tree. No implementation changes were made during inspection.
- Node.js `v22.23.3`; installed Vite `8.3.1` and Playwright `1.63.0` matched the lockfile. No dependencies were installed or updated.
- Vite JavaScript API `build({ configLoader: "native", build: { write: false } })` — passed the current configuration and project guards; generated 60 output entries, including all six HTML documents and the worker, in memory. Worker placeholders were resolved. `dist/` was not created.
- All five unchanged repository specifications — **83 passed in 3.8 minutes** against Vite development. Execution used Playwright's installed programmatic runner, Chromium revision 1248 (`156.0.8078.4`), two workers, a dedicated local port, explicit development environment, and an OS-temporary output directory. Browser path, base URL, server management, and output location were overridden in memory; repository test/configuration files were unchanged.
- Production output was served from memory, with public files read directly from `public/`. Browser inspection covered all six pages at widths 320, 375, 767, 768, 899, 900, 1100, and 1280 CSS pixels, at 800px height. Four content pages were checked with light/dark preferences; utility pages retained their static dark presentation. No horizontal document overflow or uncaught page error was observed in these checks.
- The rendered pages each had `lang="pl"`, one H1, no duplicate IDs, and no unresolved `aria-labelledby`, `aria-describedby`, or `aria-controls` references. Fonts reached the loaded state. A separate static check of transformed HTML and CSS verified **212 local file/fragment references**, with no missing target detected.
- Additional menu checks at 375×812, 667×375, 812×375, and 320×256 reproduced P1-01. Wheel/programmatic scrolling did not reveal the clipped menu content. Lightbox geometry at 320×256, 667×375, and 375×812 reproduced P2-01.
- Production service-worker installation and control succeeded locally. All 26 precache entries were present. With the browser offline, home and all three legal pages loaded from cache; an unknown route displayed the offline fallback. A previously displayed AVIF thumbnail remained available, but its uncached WebP lightbox alternative did not load; this is addressed as an optional improvement under the documented partial-image offline model.
- Deterministic opaque token contrast calculations: body text/page background **15.89:1 dark**, **12.48:1 light**; primary-button label/fill **8.46:1 dark**, **5.35:1 light** (`css/tokens.css`, `css/base.css`, `css/components.css`). These values do not establish contrast compliance for every component or state.
- CI action major versions were checked against the official [checkout releases](https://github.com/actions/checkout/releases) and [setup-node releases](https://github.com/actions/setup-node/releases); the referenced v7 releases exist. This does not verify execution of this repository's workflow.
- Final `git diff --check` and a Node document check for trailing whitespace, required sections, and source-reference bounds — passed. Git status showed only the new `AUDIT.md`; no other repository file was changed.

### Verification limitations

- No live URL was supplied or tested. Canonical/manifest/README origins were treated as configuration, without assuming an active deployment. Real Netlify redirects, response headers, clean-URL behavior, and production infrastructure were not verified.
- The normal disk-writing `npm run build` and `npm run preview` commands were intentionally not executed. Build generation and local production behavior were checked through the in-memory harness; filesystem output/copying and hosting-platform behavior were not exercised.
- Browser verification was Windows Chromium only, using an explicit installed executable. Unmodified npm test commands, GitHub Actions execution, Firefox, WebKit, physical devices, assistive technologies, and service-worker upgrade transitions were not verified.
- The responsive checks were bounded viewport scenarios, not a complete visual/state audit. Contrast assessment covered the four opaque pairings above, not all translucent surfaces, backdrop composition, hover/focus/active states, or forced colors. No accessibility certification or performance benchmark/Lighthouse result is claimed.
- Security review covered current repository-visible code/configuration; no penetration test or dependency vulnerability scan was performed. External profile/contact destinations and real correspondence/telephone delivery were not tested.
- `THIRD-PARTY-NOTICES.md:35-57` explicitly leaves provenance/licensing of several redistributed SVG icons unverified. This audit does not resolve those rights or assess the legal adequacy of the public policy pages.

## 3. Verified strengths

- **Canonical shared markup:** `build/shared-header.js`, `build/shared-footer.js`, and `build/primary-navigation.js` generate ordinary HTML in both Vite modes, validate insertion points, and prevent duplicate shared markup. Existing no-JavaScript desktop tests passed for home/legal navigation and matching footer destinations.
- **Useful build contracts:** `vite.config.js` validates page inputs, required offline documents, worker placeholders, and unresolved CSS custom-property names. The successful in-memory build emitted hashed browser assets and a content-derived worker cache version; `dist/` is explicitly generated and ignored.
- **Explicit demonstration boundaries:** `index.html` booking/contact/testimonial disclosures and `build/shared-footer.js` distinguish fictional salon content from the author's contact information. `js/booking.js` renders selections/status through `textContent`; the regression suite verified that completing the demo neither submits nor persists the selection.
- **Tested interaction mechanics:** the existing suite verified menu state/focus wrapping and breakpoint cleanup, lightbox cycling/focus return, booking preselection, contact-bar focus clearance, back-to-top focus handoff, and theme persistence. These checks do not cover the short-height defects below.
- **Resilient theme and content baseline:** `public/theme-bootstrap.js` resolves stored/system preferences before application initialization; `js/theme.js` handles invalid/blocked storage. The first-paint tests passed across all four content pages, including storage failure and static no-JavaScript defaults. `js/reveal.js` uses a zero intersection threshold and leaves content visible when its observer cannot be created; both existing short-viewport reveal tests passed.
- **Bounded production caching:** `service-worker.js` restricts interception to same-origin GET requests, deletes only older caches with the project's prefix, and caches on-demand images only after successful responses. Local production tests verified document precaching and offline fallback. Image variants remain intentionally available only after fetching under the current cache version (`README.md:612-620`).

## 4. P0 — Critical risks

None detected.

## 5. P1 — Important issues worth fixing next

### [P1-01] Mobile menu content becomes unreachable on short viewports

- **Classification:** Defect
- **Affected area:** Shared mobile navigation, responsive layout, keyboard accessibility on home and legal pages.
- **Evidence:** `css/components.css:406-419`; `js/nav.js:35-39`, `js/nav.js:57-62`; reproduced in Chromium against production output and development sources.
- **Current behavior:** The fixed, viewport-sized panel vertically centers its complete link/control stack with `overflow-y: visible`, while the body is scroll-locked. At 667×375 and 812×375, the first link lies approximately 28px above the viewport and the theme control extends to about y=406. At 320×256, the first two links are wholly above the viewport and lower controls extend below it. Opening the menu focuses the invisible first link; wheel input and setting panel `scrollTop` do not expose it.
- **Impact:** Landscape-phone and constrained-height users cannot see or pointer-activate all primary menu items, and keyboard focus can begin outside the visible area. Closing the menu restores the page, but does not make the menu usable in the affected layout.
- **Recommended direction:** Make the mobile panel height-aware and internally scrollable when its content exceeds available space; keep its first item and close control reachable while preserving modal state, focus wrapping, and body scroll locking.
- **Verification criteria:** On all four content pages at 667×375, 812×375, and 320×256, opening, scrolling, and keyboard traversal expose every menu link/action and a usable close control. Escape, link navigation, and the 900px desktop transition still release modal locks correctly.

## 6. P2 — Minor refinements

### [P2-01] Lightbox image collapses to an almost invisible strip at reflow dimensions

- **Classification:** Defect
- **Affected area:** Gallery lightbox, constrained-height responsive layout.
- **Evidence:** `css/components.css:765-777`, `css/components.css:790-794`; first gallery image reproduced at 320×256 in Chromium.
- **Current behavior:** The dialog is fixed to 90dvh, with automatic rows for close/caption/navigation and a `minmax(0, 1fr)` image row. At 320×256, the dialog is approximately 230px tall and the image receives only 8px height after padding, gaps, and controls. The same image has approximately 137px available at 667×375 and 509px at 375×812.
- **Impact:** The gallery remains operable and can be closed, but its enlargement function becomes practically unusable at the narrow, short reflow size already used elsewhere in the project's tests.
- **Recommended direction:** Adapt lightbox spacing/row allocation to short heights or allow appropriate internal scrolling so a useful image area remains available without losing access to controls.
- **Verification criteria:** At 320×256, every gallery image can be meaningfully viewed in the open lightbox and close/previous/next controls remain reachable; ordinary portrait and landscape layouts retain their current behavior.

## 7. Extra quality improvements

### Reuse an available gallery image when its lightbox alternative is uncached

- **Relevant area:** Lightbox image selection and partial offline support.
- **Current evidence:** `js/lightbox.js:20-24` assigns the thumbnail's fallback `src`, rather than the browser-selected `currentSrc`. Locally, the displayed 480px AVIF was cached, but opening the lightbox offline requested an uncached 800px WebP and produced `naturalWidth: 0`. `README.md:620` already discloses that different/unfetched variants can be unavailable offline.
- **Potential value:** An available thumbnail variant could provide a usable offline preview and avoid an unnecessary alternative-format request where appropriate.
- **Scope boundary:** Optional improvement to the explicitly limited image-caching model; it does not require precaching the entire gallery or promise complete offline media availability.

### Include the existing reveal and first-paint specifications in CI

- **Relevant area:** Automated regression verification.
- **Current evidence:** `.github/workflows/ci.yml:43-50` runs only navigation, contact-bar, and interaction scripts. `tests/reveal.spec.js` and `tests/theme-first-paint.spec.js` remain manual as documented in `README.md:519`; both were included in this audit's passing 83-test run.
- **Potential value:** Automatically protect the short-viewport reveal and pre-initialization theme behaviors already covered by authored regression tests.
- **Scope boundary:** Optional extension of existing Chromium coverage, using current dependencies and tests; the documented manual workflow is not itself a defect.

## 8. Current readiness conclusion

**Status:** Needs important fixes

The site builds and its existing regression suite passes within the verified demonstration scope. P1-01 should be resolved before final release or portfolio sign-off because a primary interaction loses visible, reachable content on ordinary landscape-phone heights. P2-01 is a smaller gallery refinement. Neither the lack of a booking backend nor the documented partial offline image model is a release defect for this project. Deployment, cross-browser, assistive-technology, and legal verification remain outside the completed checks.

## 9. Senior rating

**Rating:** 8/10

Clear canonical ownership, defensive storage handling, explicit demo disclosures, useful build guards, and passing focused browser regressions support a strong assessment within the static-site scope. The independently reproduced overlay height defects prevent a higher rating and final readiness approval; the existing tests' passing result does not cover those scenarios.
