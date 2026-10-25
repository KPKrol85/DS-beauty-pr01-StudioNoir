# Studio Noir — Final Technical Front-End Audit

**Audit date:** 2026-10-25

**Project type:** Static Polish-language portfolio demonstration; Vite multi-page site with vanilla HTML, CSS and JavaScript

**Audit mode:** Final repository and implementation review

**Current readiness:** Ready with minor refinements

## 1. Executive assessment

Studio Noir has a coherent architecture for its documented demonstration scope: six HTML pages, shared build-time navigation/header/footer generation, modular browser interactions, and production-only service-worker registration. The initial audit passed an in-memory production build and all 83 then-existing browser tests. The PH4-01 follow-up passed the disk-writing build, 45 navigation tests, and 14 contact-bar tests. Booking accurately presents a browser-only demonstration, with no appointment creation or submission.

The mobile-menu defect P1-01 is resolved and verified under PH4-01. One height-constrained lightbox defect remains (P2-01); no P0 or open P1 issue is recorded. The two optional improvements remain open. This scoped follow-up does not establish complete release readiness.

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

### PH4-01 follow-up verification — 2026-10-25

- `npm run build` — passed, including disk output and existing build guards; generated output was not hand-edited.
- `npm run test:nav` — **45 passed**, including 16 new four-page/viewport cases; `npm run test:mobile-contact-bar` — **14 passed**. The final navigation run used `--fully-parallel --workers=2`; both commands used `PLAYWRIGHT_BROWSERS_PATH` to locate preinstalled Chromium. No dependencies or project configuration changed.
- `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` — production browser checks and start/end screenshots passed for `/`, `/privacy.html`, `/terms.html`, and `/cookies.html` at 320×256, 667×375, 812×375, and 375×812 (**16 scenarios**). Wheel scrolling and hit testing reached all nine panel actions; keyboard traversal kept focused controls and outlines visible. Initial focus, reopening, close access, theme switching, Escape, body locking, and the 900px transition remained usable, with no horizontal overflow or uncaught page error observed.
- Short panels scrolled from 0 to 342px at 320×256 and 0 to 223px at both 375px heights. At 375×812, the stack remained vertically centered without scrolling. Additional home/privacy checks after scrolling the page 500px passed with normal motion: full-viewport geometry, disabled header backdrop filtering while open, wheel access to both boundaries, close hit testing, and Escape cleanup.
- Source review and passing regressions preserve dialog ARIA, `inert`, Tab/Shift+Tab wrapping, native link/booking navigation, theme behavior, contact-bar modal hiding, and desktop navigation. `js/nav.js`, shared markup, and the shared focus helper were unchanged; `test:interactions` was not rerun. P2-01 and optional improvements were not implemented or re-audited.
- `git diff --check` and the complete task diff review passed. The following limits still apply.

### Verification limitations

- No live URL was supplied or tested. Canonical/manifest/README origins were treated as configuration, without assuming an active deployment. Real Netlify redirects, response headers, clean-URL behavior, and production infrastructure were not verified.
- The initial audit used an in-memory build/serving harness. PH4-01 subsequently exercised `npm run build` and `npm run preview` for navigation; production PWA/offline behavior was not re-audited by that follow-up, and hosting-platform behavior remains unverified.
- Browser verification was Windows Chromium only, using preinstalled browsers. GitHub Actions execution, Firefox, WebKit, physical devices, assistive technologies, and service-worker upgrade transitions were not verified.
- The responsive checks were bounded viewport scenarios, not a complete visual/state audit. Contrast assessment covered the four opaque pairings above, not all translucent surfaces, backdrop composition, hover/focus/active states, or forced colors. No accessibility certification or performance benchmark/Lighthouse result is claimed.
- Security review covered current repository-visible code/configuration; no penetration test or dependency vulnerability scan was performed. External profile/contact destinations and real correspondence/telephone delivery were not tested.
- `THIRD-PARTY-NOTICES.md:35-57` explicitly leaves provenance/licensing of several redistributed SVG icons unverified. This audit does not resolve those rights or assess the legal adequacy of the public policy pages.

## 3. Verified strengths

- **Canonical shared markup:** `build/shared-header.js`, `build/shared-footer.js`, and `build/primary-navigation.js` generate ordinary HTML in both Vite modes, validate insertion points, and prevent duplicate shared markup. Existing no-JavaScript desktop tests passed for home/legal navigation and matching footer destinations.
- **Useful build contracts:** `vite.config.js` validates page inputs, required offline documents, worker placeholders, and unresolved CSS custom-property names. The successful in-memory build emitted hashed browser assets and a content-derived worker cache version; `dist/` is explicitly generated and ignored.
- **Explicit demonstration boundaries:** `index.html` booking/contact/testimonial disclosures and `build/shared-footer.js` distinguish fictional salon content from the author's contact information. `js/booking.js` renders selections/status through `textContent`; the regression suite verified that completing the demo neither submits nor persists the selection.
- **Tested interaction mechanics:** the initial suite verified menu state/focus wrapping and breakpoint cleanup, lightbox cycling/focus return, booking preselection, contact-bar focus clearance, back-to-top focus handoff, and theme persistence. PH4-01 adds verified short-height menu reachability coverage; P2-01 remains outside that follow-up.
- **Resilient theme and content baseline:** `public/theme-bootstrap.js` resolves stored/system preferences before application initialization; `js/theme.js` handles invalid/blocked storage. The first-paint tests passed across all four content pages, including storage failure and static no-JavaScript defaults. `js/reveal.js` uses a zero intersection threshold and leaves content visible when its observer cannot be created; both existing short-viewport reveal tests passed.
- **Bounded production caching:** `service-worker.js` restricts interception to same-origin GET requests, deletes only older caches with the project's prefix, and caches on-demand images only after successful responses. Local production tests verified document precaching and offline fallback. Image variants remain intentionally available only after fetching under the current cache version (`README.md:612-620`).

## 4. P0 — Critical risks

None detected.

## 5. P1 — Important issues worth fixing next

None detected.

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

**Status:** Ready with minor refinements

The production build and required navigation/contact-bar regressions pass. Open findings are **0 P0, 0 P1, and 1 P2**, plus **2 optional improvements**. P1-01 is verified resolved; P2-01 remains a smaller gallery refinement. Neither the lack of a booking backend nor the documented partial offline image model is a release defect for this project. Deployment, cross-browser, assistive-technology, and legal verification remain outside the completed checks; complete release readiness is not claimed.

## 9. Senior rating

**Rating:** 8/10

Clear canonical ownership, defensive storage handling, explicit demo disclosures, useful build guards, and passing focused browser regressions support a strong assessment within the static-site scope. PH4-01 removes the verified navigation defect. The rating remains unchanged after this scoped follow-up: P2-01 and the stated verification limits remain, and complete release readiness has not been established.
