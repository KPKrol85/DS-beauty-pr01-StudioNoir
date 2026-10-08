# Studio Noir — Technical Improvements

**Analysis date:** 2026-10-08  
**Project type:** Static Polish-language hair-studio demonstration website; Vite multi-page build, HTML, CSS custom properties, and vanilla JavaScript ES modules  
**Analysis mode:** Evidence-based technical improvement review  
**Focus:** Project-wide technical implementation

## Improvement overview

The canonical implementation comprises six root HTML documents, five imported CSS layers, a shared JavaScript entry point with feature initializers, and a service worker processed by the local Vite precache plugin. Browser code has no runtime dependencies. Booking is an in-memory demonstration; theme preference uses localStorage. Generated production files belong exclusively to `dist/`.

Four opportunities qualify: give repeated navigation declarations one source, consolidate the repeated Tab-boundary algorithm, align build-time and runtime ownership of offline document paths, and share the mobile contact-bar clearance. These address existing maintenance contracts without replacing the stack or changing public behavior.

No active technical report, plan, context document, audit, or review was found. The four completed UI, UX, Quality, and Workflow reports in `docs/archive/improvements/`, together with `docs/CHANGELOG.md`, were checked against current sources. Their completed navigation, booking, lightbox, theme, reveal, and build-guard objectives are excluded.

## Proposed improvements

### IMP-TECH-01 — Maintain the primary navigation links in one canonical source

**Status:** Completed — `build/primary-navigation.js` owns the seven entries and renders the four list insertion points through a local Vite HTML transform. Dev/build HTML, original labels/order/URLs, shared-label propagation, and insertion-point errors were verified; `npm run build`, `npm run test:nav` (18/18), and `git diff --check` passed. Desktop links work without JavaScript in dev/production preview; mobile focus/menu/section behavior is preserved. The existing mobile menu still requires JavaScript to open.

- **Affected area:** The seven-link primary navigation shared by the home page and three legal pages.
- **Evidence:** `index.html:57-65`, `privacy.html:53-61`, `terms.html:53-61`, `cookies.html:42-50`; consumers in `js/header.js:17-27` and `js/nav.js:73-77`; current HTML inputs in `vite.config.js:130-139`.
- **Current implementation:** Each page independently declares the same labels, section destinations, order, and `.nav__link` classes. Home links use fragments; legal-page links use `/index.html` plus those fragments. A shared navigation change therefore requires four markup edits. The completed contact-link addition in the archived UX report demonstrates this existing maintenance operation.
- **Proposed improvement:** Store the ordered labels and section identifiers in one small canonical navigation source and render only the `.nav__list` through a local Vite HTML transform in development and production. Derive the destination prefix from the current page. Emit ordinary links before browser JavaScript runs.
- **Expected engineering value:** One declaration owns the common navigation content while preserving the two existing URL forms. Future changes to a shared entry no longer require independently updating four lists.
- **Implementation scope:** The four list insertion points, one navigation source, and a narrowly scoped transform registered in `vite.config.js`. Keep the surrounding headers, home-only mini CTA, booking CTA, theme toggle, footer, legal copy, and feature modules unchanged. Use the existing Vite pipeline without a template framework, runtime injection, or new dependency. Edit canonical inputs only; `npm run build` produces the resulting HTML in `dist/`.
- **Acceptance criteria:** All four pages served by `npm run dev` and emitted by `npm run build` contain the same seven Polish labels in their present order; home destinations remain `#section`, and legal destinations remain `/index.html#section`. Links exist with JavaScript disabled. Changing one label in the canonical source updates all four rendered lists. The `.nav__link` hooks and current-section behavior remain intact, and `npm run test:nav` passes with its independently maintained expected labels. No transform placeholders remain in served or built HTML.
- **Impact:** Medium
- **Effort:** Medium

### IMP-TECH-02 — Share the Tab-boundary wrapping algorithm between overlays

- **Affected area:** Keyboard focus wrapping in the mobile navigation and gallery lightbox.
- **Evidence:** `js/nav.js:5-10`, `js/nav.js:79-100`; `js/lightbox.js:33-42`, `js/lightbox.js:94-128`.
- **Current implementation:** Both document keydown handlers obtain an ordered collection of controls, handle an empty collection, identify its first and last elements, prevent the default action at a Tab boundary, and focus the opposite boundary. Their control-discovery rules differ: the navigation uses a selector, while the lightbox additionally filters element type, disabled state, and `aria-hidden`.
- **Proposed improvement:** Extract only the shared Tab/Shift+Tab boundary operation into a small DOM utility consumed by both handlers. Each feature continues to supply its own current control collection and determine when its handler is active.
- **Expected engineering value:** The same keyboard-wrapping behavior has one implementation. A change to that algorithm can be made once without coupling the two overlays' state or silently replacing their different eligibility rules.
- **Implementation scope:** One helper under `js/` and the two existing wrapping blocks. Preserve local queries, initial focus, Escape handling, lightbox arrow navigation, focus return, scroll locking, inert state, and breakpoint cleanup. Do not introduce a general modal controller or broaden focus eligibility as part of this extraction.
- **Acceptance criteria:** Both features call one wrapping implementation, and their existing control-discovery rules remain unchanged. Tab from the last control focuses the first; Shift+Tab from the first focuses the last; other keys and non-boundary Tab presses retain their current behavior. Closed overlays do not intercept keys. `npm run test:nav` passes; a focused lightbox check confirms wrapping among its three controls, arrow navigation, all close paths, and focus return to the last viewed thumbnail.
- **Impact:** Medium
- **Effort:** Small

### IMP-TECH-03 — Share offline document paths between the worker and build guard

- **Affected area:** Source ownership of the PWA home-document and offline-fallback paths.
- **Evidence:** `vite.config.js:7-8`, `vite.config.js:58-67`; `service-worker.js:4-15`; worker bundling and stable output name in `vite.config.js:138-142`.
- **Current implementation:** The precache plugin checks its own `FALLBACK_DOCUMENTS` array containing `/index.html` and `/offline.html`. The worker independently declares `/offline.html` and embeds `/index.html` in navigation normalization. The values agree today, but the build guard and the runtime consumer maintain separate copies of one document-path contract.
- **Proposed improvement:** Define the two paths in one small static ES module imported by both the Vite configuration and worker source. Derive the guard's required-document list from those exported paths.
- **Expected engineering value:** The guard validates the same path declarations the worker actually uses. Maintaining this contract no longer requires coordinating independent literals in build and runtime code.
- **Implementation scope:** The shared constants and their consumers in `vite.config.js` and `service-worker.js`. Keep explicit HTML inputs, navigation normalization, network-first documents, pathname-based asset matching, same-origin GET filtering, cache prefix, lifecycle, and content-derived versioning unchanged. The module must have no DOM dependencies or browser side effects. The existing precache plugin remains responsible for generating `dist/service-worker.js`; never edit that output manually.
- **Acceptance criteria:** The two fallback paths have one canonical definition, consumed by both modules. A build still includes `/index.html` and `/offline.html` in precache and emits the worker at `/service-worker.js` with resolved precache/version markers. Removing either required document from build inputs still fails the existing guard. Production-preview checks retain offline home, legal-page, and unknown-path fallback behavior, including query handling. Cache versions continue to derive automatically from output content; there is no manually maintained version or asset list.
- **Impact:** Medium
- **Effort:** Small

### IMP-TECH-04 — Share the mobile contact-bar clearance between layout and booking

- **Affected area:** Mobile page padding and booking-option scroll clearance.
- **Evidence:** `css/components.css:385-388`, `css/sections.css:167-174`; the consumer of computed scroll margin in `js/booking.js:22-34`; fixed-bar positioning in `css/components.css:422-437`.
- **Current implementation:** Below 768px, body padding and booking-option `scroll-margin-bottom` independently repeat `calc(5.25rem + env(safe-area-inset-bottom, 0px))`. The booking stylesheet explicitly identifies that margin as the space reserved for the contact bar, and the booking focus correction reads the resulting computed margin.
- **Proposed improvement:** Give this shared clearance one CSS custom property and use it in both declarations, retaining the current value and safe-area calculation.
- **Expected engineering value:** The page reservation and the booking visibility correction use one maintained value for the same physical constraint. Adjusting that reservation later does not require synchronizing two stylesheets.
- **Implementation scope:** One declaration in `css/tokens.css` and the two consumers in `css/components.css` and `css/sections.css`. Preserve the existing media conditions, affected selectors, fixed-bar geometry, JavaScript, and current body padding on every page. Do not introduce measured bar-height logic or redesign the mobile bar.
- **Acceptance criteria:** The clearance expression is declared once, and both consumers reference it. Below 768px their resolved clearance remains equal to the current expression, including the safe-area inset; at and above 768px neither gains an additional reservation. Card preselection still reveals a booking choice above the contact bar when necessary. Dark/light themes and reduced-motion behavior retain their current geometry. `npm run build` accepts the new property reference.
- **Impact:** Low
- **Effort:** Small

## Selection summary

- The set addresses four distinct existing contracts: repeated navigation content, repeated keyboard wrapping, duplicated PWA paths, and duplicated mobile clearance. Benefits are source ownership and local maintainability, not measured performance or reliability gains.
- All four can be implemented independently. IMP-TECH-01 and IMP-TECH-03 both touch `vite.config.js`, so sequential edits avoid overlap; neither depends on the other. IMP-TECH-02 requires preserving and directly checking both overlays' existing keyboard behavior.
- One Medium and three Small proposals form a bounded candidate backlog for focused development. Effort and impact are relative judgments; completion within one working day is not guaranteed.
- Four were selected because no fifth distinct opportunity had comparable evidence and a proportionate scope. Existing feature modules already have local responsibilities, and service/stylist styling and booking selection already share implementations. Further extraction solely for file organization, broader HTML templating, and a new state layer would not be justified by the current project.
- These are proposals awaiting selection, not approved plan work. Testing expansion, initialization resilience, documentation corrections, and previously recorded interaction/content defects remain in their appropriate Quality, Workflow, or defect scopes.

## Analysis limitations

- This review inspected canonical HTML/CSS/JavaScript, module consumers, Vite and deployment configuration, package scripts, the navigation spec, README, changelog, and archived reports. Dependencies are present, but no build, test suite, browser session, or production preview was run. Acceptance criteria describe future verification, not results achieved during discovery.
- No `dist/` output was present. Generated-output behavior was traced from executable configuration and worker source; it was not observed in a fresh build. Netlify delivery, real devices, screen-reader speech, and production PWA behavior were not checked.
- Historical verification records establish prior work only. Historical defect entries were used to exclude overlapping objectives; they are not a fresh runtime audit. No proposal assumes a new backend, persistent booking, or expanded product scope.
