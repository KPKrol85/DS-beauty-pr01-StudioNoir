# Studio Noir — Design Improvements (Design V2)

**Analysis date:** 2026-11-15
**Project type:** Static Polish-language portfolio demonstration website for a fictional hair studio — Vite multi-page application with vanilla HTML, CSS, and JavaScript
**Status:** Proposed — awaiting owner review; no implementation authorized
**Analysis mode:** Evidence-based creative design review (second design cycle)
**Focus:** Project-wide design, assessed after the completed first cycle (`IMP-DESIGN-01` – `IMP-DESIGN-08`)

## 1. Methodology and evidence

**Documentation reviewed:** `AGENTS.md`, `README.md` (EN section in full, PL headings), `docs/CHANGELOG.md`, `THIRD-PARTY-NOTICES.md`, the archived first design cycle `docs/archive/improvements/IMPROVEMENTS-DESIGN-2026-10-11.md` (read in full, treated as read-only historical reference), the archived UI and UX improvement records, both archived plans, and both archived audits. No active `PLAN.md`, `AUDIT.md`, `REVIEW.md`, or other active improvement report exists in the repository root.

**Source reviewed:** `index.html`, `privacy.html` (structure), `404.html`, `offline.html`, `css/tokens.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/sections.css`, `build/shared-header.js`, `build/shared-footer.js`, `build/primary-navigation.js`, `public/theme-bootstrap.js`, `js/reveal.js`, the opening of `vite.config.js`, and the contents of `assets/img/`, `assets/logo/`, and `assets/icons/`.

**Runtime and visual evidence:** The current sources were served with the repository's existing Vite 8.3.1 development server (no dependency installation). Rendering was inspected in headless Chromium (pre-installed Playwright 1.63.0 browser) and in the desktop app's built-in browser:

- viewports 390×844, 900×1100, and 1440×900;
- dark and light themes through `prefers-color-scheme` emulation with no stored theme;
- reduced motion enabled, so all reveal containers were visible;
- screenshots of every home-page section, the footer, the first viewport, full-page overviews at 1440px, `privacy.html`, `404.html`, and `offline.html`;
- computed styles and geometry: section heights, padding, title sizes, text-edge alignment, image positions, and active fonts (Playfair Display and Inter variable files loaded).

**Evidence labels:** `Source`, `Runtime`, `Visual`, `Historical`, and `Design judgment`, as defined by the review standard. Aesthetic conclusions are professional judgment, not measured user data.

**Limitations:** Interaction states (hover, focus, pressed), the open mobile menu and lightbox, booking states, 200% zoom, forced colors, short landscape viewports, `terms.html`, `cookies.html`, the production build, Firefox, WebKit, and physical devices were not inspected. Section 9 lists details.

### First-cycle baseline verified in current source

| Historical improvement | Current implementation evidence |
| --- | --- |
| IMP-DESIGN-01 — Paired editorial materials | Paired dark/light tokens, `--color-surface-editorial`, `--color-surface-interactive`, and `--color-line*` hairlines in `css/tokens.css`. |
| IMP-DESIGN-02 — Typography after font repair | Self-hosted variable Playfair Display and Inter in `css/base.css`; `--fs-3xl` hero display and `--measure-*` tokens in `css/tokens.css`. |
| IMP-DESIGN-03 — Coherent image set | Ten AI-generated demonstration images with AVIF/WebP variants in `assets/img/hero`, `stylists`, and `gallery`. |
| IMP-DESIGN-04 — Signature responsive hero | `.hero__inner` uses `2fr 3fr` from 1100px (`css/sections.css`). |
| IMP-DESIGN-05 — Studio and team compositions | `.about__layout` `3fr 2fr` with numbered notes from 900px; `.stylist-card` portrait profiles with preselection links. |
| IMP-DESIGN-06 — Services and signature packages | `.service-list` editorial rows, `.pricing` package rows, and `.pricing__contact` guidance. |
| IMP-DESIGN-07 — Mixed-scale gallery | 12-column gallery with a featured item, numbered captions, and focal-point variables. |
| IMP-DESIGN-08 — Booking and contact finish | Two `.booking__group` selections, `.booking__demo` summary, featured testimonial, `.location` rows, `.cta`, and the build-rendered shared footer. |

These decisions are treated as the established baseline. None of the proposals below repeats them. Where a proposal touches an area that the first cycle changed, it states the new evidence that justifies further work.

## 2. Executive design assessment

The first cycle gave Studio Noir a coherent **Noir Editorial** identity. It established charcoal and ivory materials, a restrained gold accent, Playfair Display headings over Inter text, hairline-ruled editorial rows, a photography-led hero, and distinct compositions *inside* each section. These are real strengths and should be preserved.

The principal remaining limitation is **page-level pacing and ownership of the identity**, not section quality:

- every section after the hero opens with the same header block at the same 40px scale, with the same 72px spacing, while the background bands alternate mechanically;
- all ten photographs share one shot type, so the campaign, team, and work roles blur together, and imagery is concentrated in the middle of the page;
- the light theme inverts the surfaces but inherits photography art-directed for the dark theme;
- the identity relies on palette and mood that are common in premium-salon design; the monogram, the only ownable mark, appears only at logo size;
- small Polish typesetting details (hanging single-letter words, mixed numeral styles) undercut the editorial ambition at display sizes.

The opportunity for this cycle is to make the page read as a **composed editorial issue**, with chapters, image roles, and a deliberate light edition, while keeping the established materials, fonts, palette, and interaction contracts. The recommended direction is **Chaptered Noir** (Section 6).

## 3. Current design identity

### Brand and first impression

- **Source / Visual:** At 1440×900, the hero pairs a 72px Playfair title (weight 600) with a 653×490 portrait. The brand name appears three times in the first viewport: the header lockup, the hero eyebrow ("Studio Noir — Hair & Style"), and a large serif "Noir" wordmark baked into the hero raster behind the model, cropped as "N…oir" at both 1440px and 390px.
- **Design judgment:** The first impression is confident and premium. Without the logo, the site would still be recognizable as *a* luxury salon, but less clearly as *Studio Noir*: the recognizable elements (gold on charcoal, a serif display face, portraits on black) are widely shared by the genre.

### Typography and editorial hierarchy

- **Runtime:** There are only two display tiers: the 72px hero `h1` and a 40px `.section__title` used by all nine following sections. Card and row titles (`h3`) are 18px.
- **Source / Visual:** Numerals use three treatments for one indexing role. `.about__number` is Playfair with default old-style figures, so "01" renders with an x-height zero that reads close to "o1". `.booking__index` uses tracked 12px Inter. `.gallery__number` uses tabular 12px Inter. The rating "4.9 / 5.0" and the featured quote's "3" also use Playfair old-style figures, while prices use Inter lining figures.
- **Visual:** Polish single-letter words hang at line ends in display and caption text: "Fryzjerstwo w" (hero `h1`, 390px), "Kontakt z" (location `h2`, 390px), "stylistów z" (About note 01, 1440px and 390px), "Krótkie cięcie z" (gallery caption 03, 390px), "tonów, a" (featured quote, 390px), and "informacje o" (footer note, 390px).

### Composition and rhythm

- **Source / Runtime:** All ten home sections use `.section` with 72px block padding (`--space-3xl`). The nine sections after the hero open with `.section__header` (eyebrow and 40px title, left-aligned). `.section--muted` strictly alternates (services, stylists, booking, location), and the final CTA uses `--color-surface-editorial`.
- **Runtime:** Page height is 9,006px at 1440×900 and 12,753px at 390×844.
- **Design judgment:** The first cycle successfully varied section interiors (60/40 About, editorial lists, portrait columns, mixed-scale gallery, 3:2 booking, 12-column testimonials). The page-level sequence, however, is metronomic: equal openings, equal spacing, and alternating bands give Usługi, Galeria, and Rezerwacja the same weight as Lokalizacja.

### Color and material language

- **Source:** The dark page is `#0b0b0e`, muted bands are `#141418`, and the editorial surface is `#18181e`. The light theme remaps to `#f5f1ec` / `#ffffff` / `#faf8f5`. Gold appears in eyebrows, prices, indices, outlines, and the primary fill. Hairlines (`--color-line`) are the dominant structural device, used in About, services, pricing, booking, testimonials, location, gallery captions, and the footer.
- **Runtime / Visual:** The closing sequence places location (`#141418`), final CTA (`#18181e`), and footer (`#141418`) in three adjacent charcoal panels of near-identical tone.
- **Design judgment:** The material system is disciplined and should be kept. Hairline rows are now so pervasive that they no longer distinguish one content role from another.

### Imagery and visual storytelling

- **Source:** There are ten raster images (one hero, three stylists, six gallery images). `README.md` declares them AI-generated demonstration images for a fictional salon.
- **Visual:** All ten share one shot grammar: a studio portrait on a near-black backdrop, a black garment, and a warm key light. The hero subject and stylist portrait 1 (Maja) share an archetype (long wavy brunette hair, off-shoulder black garment, three-quarter pose), and gallery image 1 repeats long wavy brunette hair. The gallery is titled "Tekstura, światło, ruch." but contains no texture close-up or motion frame. The About section, which describes craft, has no image.
- **Runtime:** At 1440×900, imagery occupies roughly y = 141–631 (hero) and y = 3,060–5,402 (stylists and gallery). That leaves 2,429px without images between the hero and the stylists, and 3,604px from the last image to the end of the page. At 390×844, the same gaps are 3,465px and 6,188px.

### Components and interface expression

- **Visual / Runtime:** The same booking action has two treatments. Services use five 48px outlined "Zarezerwuj" buttons, while stylist cards use a quiet gold text link. At 390px, the services section is 1,365px tall for five rows.
- **Runtime:** From 600px, pricing rows are inset by `.pricing__item` padding, so package titles start 24px right of the section title and service titles (x = 184 vs 160 at 1440px; 69 vs 45 at 900px).
- **Observed, outside design scope:** At 900×1100, the desktop navigation wraps onto two rows. The archived UI record already identifies this header composition at the 900px breakpoint as a separate UI concern, so it is not proposed here.

### Motion

- **Source:** One reveal (24px rise and opacity, 0.6s) applies to eleven containers. Primary buttons lift 2px on hover and focus. Reduced motion disables reveal, smooth scrolling, and transitions.
- **Design judgment:** The restraint suits the direction. No motion proposal is made.

### Light and dark editions

- **Visual:** In the dark theme, the near-black photo backdrops dissolve into the page and give soft, atmospheric edges. In the light theme, the same images become hard-edged black blocks on ivory: the hero, three portraits, and a six-image gallery mass about 1,400px tall at 1440px (y = 4,001–5,402).
- **Design judgment:** The dark edition is designed around the photography; the light edition inherits it. Function and hierarchy are equivalent, but the light theme reads as a token inversion rather than a deliberate edition.

### Responsive art direction

- **Visual:** Mobile ordering is sound: hero copy, CTAs, then image; a two-up gallery with full-width featured and closing images; and the booking summary after the choices.
- **Design judgment:** The main mobile cost is length and repetition. With 12,753px of page and long imageless stretches, the uniform section openings are felt more strongly on a phone than on desktop.

### Closing composition

- **Visual:** After testimonials, the page closes with location rows, a centered 40px CTA with one primary button, and a four-column footer. The closing is honest and calm (IMP-DESIGN-08) but has no visual anchor or final brand moment.

### Supporting-page consistency

- **Visual / Source:** The legal pages carry the shared header and footer, the eyebrow and title pattern, the prose measure, and the editorial table-of-contents inset in both themes. This is consistent and should be preserved.
- **Source / Visual:** `404.html` and `offline.html` contain only an eyebrow, heading, sentence, and button. They have no brand symbol, no header, and no `theme-bootstrap.js`. At 1440px, the content sits in a small block at the top-left of an empty dark viewport, and both pages stay dark under a light color-scheme preference.

### Strengths to preserve

- Charcoal and ivory material pairs, gold accent discipline, and the hairline vocabulary as the base material.
- Playfair Display and Inter typefaces and the 72px hero display.
- The 40/60 photography-led hero composition and its CTA pair.
- Section-internal compositions from the first cycle, including the featured testimonial and the honest demo labelling.
- All interaction, accessibility, navigation, theme, PWA, and build contracts documented in `README.md`.

## 4. Design prerequisites

No defect-level prerequisite blocks this design cycle. One asset dependency affects part of the work:

| Prerequisite | Evidence | Follow-up boundary |
| --- | --- | --- |
| Approved additional imagery for new image roles | `README.md` declares all images AI-generated demonstration content. `assets/img/` contains only portrait-type images; no studio, process, or texture-detail assets exist. | Owner decides whether new demonstration images are produced, how many, and how they are disclosed. Final visual acceptance of IMP-DESIGN-V2-02, and any placement that uses new images, waits for approved assets. |

## 5. Creative design directions

Because Noir Editorial is established and working, all three directions below are **evolutions within it**, not replacements. They differ in what carries the identity forward.

| Dimension | A — Chaptered Noir | B — Darkroom | C — Atelier Ledger |
| --- | --- | --- | --- |
| Philosophy | The one-page site as an editorial issue: chapters with distinct openings, quieter interludes, and a composed close. | Photography as the narrative: image plates lead and text supports. | A salon menu and craft ledger: typesetting, numerals, and the monogram carry the identity. |
| Typography | Adds a chapter display tier between 40px and 72px; strict Polish typesetting. | Type recedes; captions and overlays gain weight. | Typography becomes the hero: menu-style price setting, lining numerals, refined indices. |
| Color / material | Existing tokens; bands grouped by narrative block instead of alternated. | Permanent dark "darkroom" bands in both themes; more full-bleed surfaces. | Existing tokens; more ivory and editorial surfaces, fewer image fields. |
| Composition | Varied section tiers and spacing; one plate per chapter where available. | Full-bleed image plates between chapters; large image-led sections. | Dense, justified lists and ledgers; asymmetric typographic layouts. |
| Imagery | Role-based art direction (campaign, team, work, studio), a few new assets. | Substantial new photography set required. | Fewer images; the existing set is kept but used less. |
| Motion | Unchanged restraint. | Pressure toward image-led reveals. | Unchanged restraint. |
| Mobile | Shorter openings for utility sections; chapters stay distinct. | Heavy image weight and long scroll on mobile. | Compact and fast; lowest visual warmth. |
| Advantages | Fixes the main limitation (pacing) with the current stack and assets, and stays coherent with the first cycle. | Most dramatic and atmospheric. | Highest ownability and lowest asset dependency. |
| Trade-offs | Moderate change across many sections; needs disciplined tiering. | Depends almost entirely on new assets; risks heavy mobile pages; weakens offer clarity. | Underuses the first-cycle photography; risks a dry, text-heavy page for a beauty brand. |
| Technical implications | CSS tokens and modifiers, header markup variants, a few new images; no JS changes. | Many new assets, a larger image budget, band-scoped theme tokens, crop work. | CSS and typesetting; minimal markup and asset changes. |

## 6. Recommended direction

**Recommendation: A — Chaptered Noir**, with two bounded elements adopted from B and one from C:

- from B, the role-based photography brief (IMP-DESIGN-V2-02) and a single darkroom band for the gallery in the light theme (IMP-DESIGN-V2-03);
- from C, the Polish typesetting and numeral rules (IMP-DESIGN-V2-05).

These additions serve A's chapter logic; they do not introduce a competing art direction.

- **Rationale:** The first cycle solved section-level quality. The evidence now points to page-level pacing, image roles, and theme editions, which is exactly what a chapter system addresses. It can be delivered within the existing Vite/CSS architecture, with a small, owner-controlled asset addition.
- **Strengths preserved:** Materials, palette, fonts, hero composition, section interiors, demo honesty, and every interaction and accessibility contract.
- **Primary design objective:** Make the page read as a composed sequence with clear major moments, distinct image roles, and a deliberate close, in both themes.
- **Distinctiveness:** It comes from structure (chapters, registers, a darkroom band, the monogram threshold) rather than from new decoration, fonts, or effects.
- **Intentional boundaries:**
  - no palette change, no new fonts, and no hero recomposition;
  - no new JavaScript behavior, libraries, or framework;
  - no change to navigation entries, section IDs, booking, lightbox, theme, or PWA contracts;
  - no invented content.
- **Guiding hierarchy:**

```text
brand plate → studio manifesto → offer chapter → people and work → booking demo → proof → composed close
```

## 7. Prioritized design improvements

- Priorities describe design value and dependency order. They are not defect severities.
- The proposals are not implementation authorization; each needs separate owner approval.
- Acceptance criteria describe the verification expected after future implementation, not the current state.
- Identifiers use the second-cycle prefix `IMP-DESIGN-V2-` to avoid collisions with the archived `IMP-DESIGN-01` – `IMP-DESIGN-08`.

### IMP-DESIGN-V2-01 — Establish a chapter rhythm across the one-page sequence

- **Status:** COMPLETED — implemented and verified.
- **Result:** Services, gallery, and booking open as chapters with an accent rule, `--space-chapter` opening space, and a `--fs-chapter` title set beside the introduction from 900px; location is a compact utility section, and the other sections keep the standard tier. Services and pricing share one offer band, and location and the final CTA share one closing editorial band; legal-page titles are unchanged.
- **Verification:** `git diff --check`, `npm run build`, `npm run test:nav` (65), `npm run test:reveal` (2), `npm run test:mobile-contact-bar` (14), `npm run test:interactions` (18), and `npm run test:manifest` (9) passed. Headless Chromium review at 390, 900, and 1440px in both themes confirmed the tiers, bands, heading order, and fragment targets, with no horizontal overflow at 320px, 320×256, or 640×400 (200% zoom equivalent); Firefox, WebKit, and forced colors were not checked.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-V2-02 — Art-direct photography by role and widen the shot vocabulary

- **Status:** COMPLETED — implemented and verified.
- **Result:** Eleven approved AI-generated photographs in four roles (Campaign, Team, Work, Studio) replace the hero, stylist, and gallery images in their existing AVIF/WebP slots, and the Studio photograph sits beneath the About values without displacing the manifesto heading. Every image carries Polish alt text and explicit dimensions, gallery captions 01, 04, and 06 match the new work, `assets/img/about/` variants are cached on demand, and the three PWA screenshots that showed the previous photography were recaptured.
- **Verification:** `npm run build`, `npm run test:interactions` (18/18), `npm run test:manifest` (9/9), and `git diff --check` passed; the build listed all 44 variants for on-demand caching outside the installation precache, and a production preview confirmed on-demand caching and offline loading of the Studio variant and the new `og:image` on four pages. Headless Chromium crop review at 390–1440px in both themes kept every image's essential content within its planned crop safe zone, and the owner approved the final visual balance; Firefox, WebKit, physical devices, and screen readers were not checked.
- **Impact:** High
- **Effort:** Large

### IMP-DESIGN-V2-03 — Make the light theme a deliberate photographic edition

- **Status:** COMPLETED — implemented and verified.
- **Result:** Introduced a dark editorial gallery band in the light theme, with scoped text, accent, and focus colors. Added subtle ivory framing to the hero and stylist photographs without changing image dimensions, crops, or dark-theme appearance.
- **Verification:** `git diff --check`, `npm run build`, and `npm run test:theme-first-paint` (28/28) passed. Chromium checks at 390, 900, and 1440px confirmed responsive layout, theme switching, and gallery contrast (7.91–16.88:1). Physical devices, Firefox, and WebKit were not tested.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-V2-04 — Compose the offer chapter in two registers

- **Status:** COMPLETED — implemented and verified.
- **Result:** Reorganized base services into a compact editorial menu with aligned names and prices, secondary descriptions, and inline booking links shared with stylist cards. Distinguished signature packages through stronger typography, prominent prices, and responsive composition while preserving all content and booking contracts.
- **Verification:** `git diff --check`, `npm run build`, `npm run test:interactions` (18/18), and `npm run test:mobile-contact-bar` (14/14) passed. Chromium checks in both themes at 390, 900, and 1440px confirmed content alignment, accessible booking links with 48px targets, correct preselection for all five services, no horizontal overflow at 320px, and a 43.3% reduction in services section height (1320px to 748.34px at 390×844). Verification was limited to Chromium with emulated viewports.
- **Impact:** Medium
- **Effort:** Medium

### IMP-DESIGN-V2-05 — Typeset Polish editorial details: numerals and line breaks

- **Status:** Proposed
- **Priority:** P2
- **Affected area:** Numeral and index styles (`.about__number`, `.booking__index`, `.gallery__number`, `.testimonials__score`, price classes); short copy in `index.html`, the legal-page headings, and `build/shared-footer.js`.
- **Evidence:**
  - Source / Runtime: `.about__number` computes `font-family: "Playfair Display"` with `font-variant-numeric: normal`. `.booking__index` uses tracked 12px Inter; `.gallery__number` uses tabular 12px Inter.
  - Visual: old-style Playfair figures make "01" read close to "o1" and set "4.9 / 5.0" with mixed heights, while prices use Inter lining figures. Single-letter words hang at line ends: "Fryzjerstwo w", "Kontakt z", "stylistów z", "Krótkie cięcie z", "tonów, a", "informacje o" (viewports in Section 3).
- **Current state:** Three numeral treatments serve one indexing role, and display text breaks without Polish typesetting conventions.
- **Design judgment:** Hanging single-letter words are a recognized flaw in Polish editorial typesetting and are most visible at display sizes. A single index style would make numbering a coherent motif rather than three accidents.
- **Proposed improvement:**
  - Define one figure policy: lining figures for indices, prices, and ratings; old-style figures only in running Playfair text, if at all.
  - Define one index style shared by About, booking, gallery, and any chapter marker.
  - Bind single-letter Polish words (a, i, o, u, w, z and their capitals) to the following word in headings, display text, captions, short copy, and the shared footer. Applying this to legal prose is an owner decision.
- **Expected value:** Editorial polish at the scale where readers notice it most, and a consistent numbering motif that supports the chapter system.
- **Implementation scope:**
  - No wording changes and no new font files.
  - Verify that the bundled Playfair Display file supports lining figures (`lnum`) before relying on them; otherwise set indices in Inter.
  - Apply binding in canonical sources only (root HTML and `build/shared-*.js`), never in `dist/`.
- **Dependencies:** None. Coordinate with IMP-DESIGN-V2-01 and V2-04.
- **Acceptance criteria:**
  - At 320, 390, 900, and 1440px, no heading, display line, caption, or short copy ends with a single-letter word.
  - Indices in About, booking, and gallery share one style.
  - Prices, ratings, and indices use the defined figure style.
  - Accessible names are unchanged.
  - No overflow at 320px or at 200% zoom.
  - `npm run build` and `npm run test:nav` (footer navigation) pass.
- **Impact:** Medium
- **Effort:** Small

### IMP-DESIGN-V2-06 — Develop the monogram into a restrained threshold device

- **Status:** Proposed
- **Priority:** P2
- **Affected area:** `#final-cta`, the closing band with `#location`, the footer brand block, and the `.brand-symbol` usage in `css/components.css` and `css/sections.css`.
- **Evidence:**
  - Source: `.brand-symbol` masks `assets/logo/studio-noir-mark-gold.svg` and appears only as `.logo__symbol` (2.5rem) and `.footer__symbol` (3.5rem).
  - Runtime / Visual: location (`#141418`), final CTA (`#18181e`), and footer (`#141418`) form three adjacent charcoal panels. The final CTA is a centered 40px title, text, and button with no visual anchor, 3,604px (1440px) or 6,188px (390px) after the last image.
- **Current state:** The only ownable brand mark is used at logo size; the page closes on three similar panels without a final brand moment.
- **Design judgment:** A single, consistently used device carries more identity than added decoration. The closing is the natural place to use it.
- **Proposed improvement:** Define a monogram grammar with at most three appearances:
  - **opening:** the header logo, unchanged;
  - **closing:** a large, low-contrast or hairline-ring monogram that frames the final CTA, so location and CTA resolve into one composed end;
  - **thresholds:** the 404 and offline pages (IMP-DESIGN-V2-07).

  The monogram must never be used as a repeated pattern or wallpaper.
- **Expected value:** An ownable recognition cue, a composed final impression, and continuity from the first screen to the last.
- **Implementation scope:**
  - Use the existing mark through the existing CSS-mask pattern in the theme gold, decorative and `aria-hidden`, with `forced-colors` handling matching `.brand-symbol`.
  - No new SVG, JavaScript, or motion.
  - Unchanged: the final CTA link, its text, and mobile contact-bar clearance.
- **Dependencies:** IMP-DESIGN-V2-01 (closing band).
- **Acceptance criteria:**
  - The monogram appears only at the logo, the closing, and the threshold pages.
  - At 390, 900, and 1440px in both themes, the closing reads as one composition, and the CTA remains its most prominent interactive element.
  - The device is absent from the accessibility tree and renders correctly or is suppressed in forced colors.
  - No overflow.
  - `npm run build` and `npm run test:mobile-contact-bar` pass.
- **Impact:** Medium
- **Effort:** Small

### IMP-DESIGN-V2-07 — Bring the 404 and offline pages into the Noir system

- **Status:** Proposed
- **Priority:** P2
- **Affected area:** `404.html`, `offline.html`, and a small shared edge-state style in the existing CSS layers.
- **Evidence:**
  - Source: both pages contain one `<main class="section">` with an eyebrow, `h1`, sentence, and primary button. There is no brand symbol, header, or `theme-bootstrap.js`; the body is fixed to `theme--dark`, and `README.md` notes that they load CSS only.
  - Visual: at 1440×900, the content sits in the top-left corner of an empty viewport, and both pages remain dark under a light color-scheme preference, unlike the four content pages.
- **Current state:** The two threshold pages are the least composed screens and do not follow the visitor's theme.
- **Design judgment:** Error and offline states are rare but memorable. A proportionate branded composition is enough; they should not become showpieces.
- **Proposed improvement:** Compose a shared edge-state layout with the monogram device (IMP-DESIGN-V2-06), the Studio Noir wordmark, the existing message, and the existing action, centered or deliberately anchored. Both pages follow the resolved theme through the existing bootstrap script.
- **Expected value:** Brand continuity in failure states and equal treatment of both themes across all six pages.
- **Implementation scope:**
  - No navigation, header, images, or JavaScript modules.
  - Polish copy is unchanged.
  - Unchanged: the offline precache guard (`/offline.html`), the 404 redirect rule, and the favicon declarations.
  - Confirm during implementation that `theme-bootstrap.js` is available offline from the precache.
- **Dependencies:** IMP-DESIGN-V2-06.
- **Acceptance criteria:**
  - Both pages render in the resolved theme without a flash of the opposite theme, at 390 and 1440px under both color-scheme preferences.
  - The brand device and wordmark are present.
  - The action is visible without scrolling at 320×568 and 667×375.
  - `offline.html` renders from cache with the service worker active in `npm run preview`.
  - `npm run build` passes.
- **Impact:** Low
- **Effort:** Small

## 8. Suggested implementation sequence and dependencies

1. **Owner decisions (Section 10):** direction, chapter assignment, light-edition treatment, and the asset question.
2. **Independent foundation:**
   - IMP-DESIGN-V2-05 (Polish typesetting and numerals) can start immediately.
   - IMP-DESIGN-V2-01 (chapter rhythm) establishes the tiers and bands.
3. **Dependent compositions after V2-01:**
   - IMP-DESIGN-V2-03 (light edition and darkroom band);
   - IMP-DESIGN-V2-04 (offer registers, also after V2-05);
   - IMP-DESIGN-V2-06 (monogram closing), followed by IMP-DESIGN-V2-07 (threshold pages).
4. **Parallel asset stream:** IMP-DESIGN-V2-02 runs in slices: brief → approval → production → placement (after V2-01) → review. If images change, re-review V2-03.
5. **Final integration review:** a cross-page pass on all six pages in both themes before the cycle is closed.

Each proposal should remain a separate reviewable change. IMP-DESIGN-V2-02 should not land as a single change.

**Verification plan by area**, using project commands documented in `README.md`:

| Area | Recommended checks |
| --- | --- |
| Section tiers, bands, offer composition, closing | `npm run build`, `npm run test:nav`, `npm run test:reveal`, `npm run test:interactions`, `npm run test:mobile-contact-bar`, `git diff --check`; manual review at 320, 390, 768, 900, 1100, and 1440px in both themes, 200% zoom, and reduced motion. |
| Theme-specific image treatment | `npm run build`, `npm run test:theme-first-paint`, `npm run test:interactions`; measured contrast in the darkroom band; live theme switching. |
| New imagery | `npm run build` (on-demand cache list), `npm run test:interactions` (lightbox sources); crop review at each `sizes` breakpoint; alt-text review. |
| Typesetting | Manual line-break review at 320–1440px; `npm run build`. |
| 404 and offline pages | `npm run build`; `npm run preview` with the service worker for offline rendering; both color-scheme preferences. |

## 9. Verification performed and limitations

**Performed:**

- Source inspection of the files listed in Section 1, and a full read of the archived first-cycle report and related archives.
- The existing Vite 8.3.1 development server from the repository's installed dependencies; nothing was installed or updated.
- Headless Chromium captures through a temporary script outside the repository: 390×844, 900×1100, and 1440×900 in dark and light (`prefers-color-scheme` emulation, reduced motion), with section-level screenshots, full-page overviews at 1440px, and computed geometry and typography.
- The built-in browser at 1440×900 in the dark theme.
- Pages rendered: `index.html`, `privacy.html`, `404.html`, and `offline.html` (served directly by the dev server).

**Not performed:**

- No build, test suite, formatter, or production preview was run; no tracked file other than this report was created or modified.
- Hover, focus, and pressed states, the open mobile menu and lightbox, booking states, 200% zoom, forced colors, and short landscape viewports were not inspected.
- `terms.html` and `cookies.html` were not rendered (they share the legal-page structure verified on `privacy.html`).
- Firefox, WebKit, physical devices, screen readers, and contrast ratios were not checked.

**Notes:**

- Element screenshots included the sticky header and the fixed mobile contact bar overlapping content; these capture artifacts were not treated as findings.
- The Vite server created an ignored `node_modules/.vite` cache in the worktree during inspection; it was removed afterwards.
- All judgments about balance, identity, and pacing are professional design judgments, supported by the measurements cited.

## 10. Owner decisions required

1. **Creative direction:** approve Chaptered Noir with the bounded additions described in Section 6, or select another direction.
2. **Chapter assignment (V2-01):** which sections are chapters (recommended: offer, work, booking) and how bands are grouped.
3. **New demonstration imagery (V2-02):** whether additional AI-generated images are produced, their roles and count, and the README disclosure update.
4. **Hero lettering (V2-02):** keep the "Noir" wordmark baked into the hero image as a campaign signature, or replace the image so typography alone carries the brand.
5. **Light edition (V2-03):** confirm the darkroom band for the gallery and the plate treatment for the hero and team images, or choose an alternative.
6. **Typesetting scope (V2-05):** whether single-letter binding also applies to long legal prose.
