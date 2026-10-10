# Studio Noir — Creative UI/UX Review

**Task:** ST-03

**Project:** `KPKrol85/DS-beauty-pr01-StudioNoir` — KP_Code Digital Studio

**Analysis date:** 2026-10-10 (Europe/Warsaw)

**Status:** Open — IMP-DESIGN-01A, IMP-DESIGN-01B, and IMP-DESIGN-02 completed; IMP-DESIGN-03 through IMP-DESIGN-08 remain pending. Original audit evidence below is retained.

**Scope:** Creative direction, home-page composition, visitor journeys, shared visual system, and proportionate legal-page consistency review.

## 1. Methodology and evidence

The current repository and `AGENTS.md` are authoritative. Git status was clean before analysis. Sources reviewed include `README.md`, `index.html`, all five CSS layers, header/navigation/booking/lightbox/theme modules, `js/reveal.js`, `js/mobile-cta.js`, `js/config.js`, `build/primary-navigation.js`, the ten SVG image assets, the font inventory, and relevant markup in `privacy.html`, `terms.html`, and `cookies.html`.

The completed reports reviewed were:

- `docs/archive/improvements/IMPROVEMENTS-UI-2026-10-04.md`;
- `docs/archive/improvements/IMPROVEMENTS-UX-2026-10-07.md`;
- `docs/archive/improvements/IMPROVEMENTS-QUALITY-2026-10-04.md`;
- `docs/archive/improvements/IMPROVEMENTS-TECH-2026-10-09.md`.

Evidence labels used throughout:

- **Source:** Current markup, selectors, assets, and implementation. Aesthetic conclusions drawn from these are design judgments, not screenshot observations.
- **Runtime:** DOM, computed styles, geometry, actual font usage, and selected interactions in installed headless Chromium against `npm run dev`, at `http://127.0.0.1:5173/`.
- **Historical:** Archived context only; completion records are not current test results.

No screenshots, mockups, or image assets were created. There was no direct raster visual inspection: the creative assessment combines source analysis with rendered-browser measurements. Photography treatment and overall visual balance require later visual review with approved assets. Coverage and limitations are recorded in section 8.

## 2. Executive design assessment

Studio Noir has a useful premium vocabulary: near-black and warm ivory surfaces, a champagne accent, serif display typography, restrained copy, and a clear sequence from services to stylist selection. Its existing interaction contracts provide a good starting point for a stronger presentation.

The largest creative limitation is that the site describes hair texture, craft, and editorial styling without showing them. Abstract SVGs occupy the hero, every portrait, and every gallery position. Rounded panels and repeated equal grids then carry much of the identity. The resulting source composition suggests a competent premium template rather than an identifiable atelier.

The recommended next phase is **Noir Editorial Atelier**: photography-led, asymmetric compositions supported by calm, accessible controls. Establish trustworthy demo language and reliable font/theme rendering first; then make one expressive hero, a curated work gallery, and a more deliberate reading rhythm. Preserve the familiar service-to-booking journey.

Priorities are professional design judgments. No analytics, user research, conversion uplift, WCAG compliance, or production readiness is claimed.

## 3. Current identity and experience

### Brand, imagery, and first impression

**Source:** `assets/img/hero-editorial.svg` contains a gradient, circles, a rounded outline, and embedded English labels. The three `stylist-*.svg` and six `gallery-*.svg` assets repeat a geometric portrait format with names or “Look” labels. None depicts hair or a person. The image alternatives in `index.html` describe photographic subjects that these placeholders do not depict.

The “couture” headline establishes an ambitious tone, but the image system cannot substantiate craft or individuality. This is an asset/storytelling gap, not an unresolved image-loading task: **Runtime** confirmed all ten home-page images loaded after scrolling through the sections.

### Typography and editorial hierarchy

**Source:** `css/tokens.css` pairs Playfair Display with Inter; `css/base.css` defines local weights 400–700 with `font-display: swap`. Hero and section headings already use fluid tokens and explicit leading. The completed heading-scale work must not be proposed again as missing.

**Runtime:** Chromium's platform-font inspection on the hero title reported 26 glyphs in Times New Roman and two in the custom Playfair face. The subtitle reported 59 in Segoe UI and 13 in Inter. This confirms mixed fallback rendering in these sampled strings. The archived UI report attributes it to incomplete font subsets; the binary glyph inventory was not independently decoded in this audit. Typography cannot be art-directed confidently from these current measurements alone.

Beyond that prerequisite, the design opportunity is a distinct display/section/utility hierarchy, purposeful headline wrapping, and narrower introductory text. The About paragraph currently uses the full container, unlike the legal `.prose` measure. Do not solve this by making every heading larger or adding another font family.

### Composition, rhythm, and service discovery

**Source:** `.container` caps content at 1120px; `.section` applies the same 4.5rem vertical padding throughout. About values, services, stylists, and testimonials largely use repeated panels or equal grids. Services have five cards in a three-column desktop grid; testimonials combine an aggregate rating with four quotations in one two-column grid. The aggregate and individual voices receive similar visual treatment.

**Runtime:** At 1440px, the hero has equal 536px columns. At 375px, services and stylist cards stack in one column; the six-image gallery section measured approximately 2870px tall. These measurements support a pacing review, not a claim that long pages inherently fail.

**Source:** Services show base offerings (for example, Strzyżenie from 220 PLN), while Pricing lists packages (for example, Pakiet sygnaturowy from 320 PLN). This is not evidence of a price error. The relationship is insufficiently explained, and package rows have no path carrying that package into the widget. Do not silently turn packages into new booking options or change prices.

### Header, mobile composition, and interaction hierarchy

**Runtime:** Header height stayed constant between top and scrolled measurements at each sampled width: 69px at 360/375/768/1440px and 88px at 900px. The 900px result is a breakpoint composition pressure point to revisit after repairing fonts, not evidence that scroll-height stabilization is unfinished.

At 375×800, the hero section measured approximately 848px, with the visual beginning around viewport y=568px. At 768×900, it remained stacked and measured approximately 977px. Desktop splits into two columns from 900px. Mobile deserves its own image/copy relationship and whitespace decisions, rather than inheriting desktop padding and six large gallery panels.

**Source/Runtime:** The fixed contact bar appears below 768px and measured 64px tall at 360/375px. Existing safe-area clearance is already shared with booking. Its three actions, the later header mini CTA, and section CTAs give repeated access but also compete for attention. A future redesign should establish one dominant action without hiding contact alternatives or removing keyboard access.

### Components, materials, and themes

**Source:** Buttons already have normalized geometry and interaction states; `.choice` already distinguishes selectable options from `.pill` labels using a filled ring and `aria-pressed`. These are completed capabilities to retain.

The visual language still applies pill shapes, rounded panels, dark translucent fills, and shadows broadly. Editorial information and controls need different emphasis. Flat text rows and image captions can carry much of the content; elevation should signal overlays or persistent controls.

**Runtime:** Light-mode service text computed to `rgb(43, 43, 51)`, while the card retained `rgba(20, 20, 24, 0.7)` over its light section. The resting header and final `.cta` also retained dark hardcoded fills in both themes. This confirms incomplete material adaptation. Exact composited contrast was not measured; do not treat these observations as a complete contrast audit. Resolve the contrast concern separately before judging the final light palette.

### Gallery, motion, and feedback

**Source:** All gallery items use the same 4:5 ratio. The lightbox derives image, alternative text, caption, count, and focus-return target from ordered thumbnails. **Runtime:** Opening the first image at 375×800 produced a 337.5×720px dialog; Next updated the caption from item 1 to item 2, and Escape closed it. The completed gallery traversal and height correction should remain intact.

The stronger opportunity is curation: distinguish a featured look, a detail, and a portrait rather than showing six equal placeholder tiles. Maintain DOM reading order; avoid visually reordered masonry or a swipe-only carousel.

**Source:** `.reveal` uses a uniform 24px rise and 0.6s fade. Buttons have a small lift; theme/header transitions are restrained. **Runtime:** With reduced motion, all 11 reveal elements computed visible and the transition duration was effectively zero. Refine motion only when it clarifies a specific element; no need for a new animation library, scroll hijacking, or continuous parallax.

### Booking, trust, and the closing journey

**Source:** `README.md` describes an in-memory demo without API/backend/persistence. `terms.html` explicitly calls Studio Noir fictional and says the form transmits nothing. However, `index.html` promises “Oddzwaniamy do 15 min”, SMS/DM confirmation, and subsequent contact; it asks users to confirm a date without collecting one or any contact information.

**Runtime:** Confirmation displayed “Rezerwacja wstępnie zapisana” and “Wysłano”. Changing the service afterwards re-enabled the button while its label remained “Wysłano”. These are current trust/state defects, independent of creative direction. A redesign must not imply working reservations.

**Source:** Testimonials state 4.9/5 from 128 reviews and named Google/Booksy/Facebook counts; there are no supporting review links or integrations in the inspected component. The legal demo explanation does not establish that these are verified reviews. Present them as example content unless the owner supplies verifiable sources; do not fabricate evidence or new ratings.

Location, final CTA, and footer can become a quieter closing composition: clearly separated hours/contact information, one principal next action, and readable utility links. Current map/Facebook destinations are generic, and “Napisz DM” contains a literal placeholder. External delivery and account ownership were not tested. These require separate content/destination decisions, not cosmetic concealment.

### Legal-page consistency

**Source:** All three legal pages use the shared header/footer and `.prose`, with measured text, list markers, underlined links, and wide table wrappers. **Runtime:** At 375/1440px in both themes, none had document-level horizontal overflow; narrow privacy/cookies table wrappers retained 768px scroll content inside approximately 338px regions. The seven generated navigation links had the expected `/index.html#section` destinations.

Keep these pages restrained. Carry approved typography, surface, header, and footer choices into them, while retaining legal copy, heading hierarchy, and table scrolling. A bespoke legal redesign or another prose-normalization task has low value for this phase.

### Separately scoped remediation prerequisites

These findings are outside the eight creative proposals. They require individual approval and focused correction; this audit changes nothing:

| Finding | Current evidence | Follow-up boundary |
| --- | --- | --- |
| Mixed font fallback | Runtime platform fonts; `assets/fonts/`, `css/base.css` | Validate glyph coverage and licensing, repair font assets, then remeasure type and the 900px header. |
| Light-theme surface mismatch | Runtime computed service/header/CTA colors; `css/sections.css`, `css/components.css` | Measure composited contrast and repair affected surfaces; retain existing theme/storage behavior. |
| Misleading booking outcome and stale label | Runtime confirmation/change; `js/booking.js`, `index.html`, `README.md` | Honest demo labels before/during/after selection; coherent reset after changes; no backend implementation. |
| Menu booking CTA leaves modal open | At 375px, `.nav__cta a` changed the fragment to `#booking` while the panel stayed open and `main` inert; `js/nav.js` only closes `.nav__link` clicks | Correct the existing CTA close/focus behavior separately. This is distinct from the completed breakpoint-state fix. |
| Fixed bar above menu | Runtime computed bar/header z-indices 180/100; `.mobile-cta` outside `main` | Source indicates modal isolation risk; directly verify hit testing/focus before choosing a fix. No claim of a tested tap-through. |
| Unresolved destination/sample-content issues | Literal DM placeholder, generic map/Facebook links, unsupported review provenance in current markup | Owner selects truthful demo treatment or verified destinations/content; do not send messages or assume a real salon. |

The font/theme/trust concerns were noted historically outside completed work and have current supporting evidence here. The former lightbox-height issue is resolved and is not carried forward.

## 4. Creative design directions

| Dimension | A — Noir Editorial Atelier | B — Quiet Material Studio | C — Precision Lookbook |
| --- | --- | --- | --- |
| Philosophy | A fashion-editorial atelier: memorable image, deliberate asymmetry, calm service access. | A tactile, hospitable studio: craft, warmth, and reassuring simplicity. | A contemporary hair portfolio: work, cut, and texture lead the experience. |
| Typography | Expressive serif display with a restrained sans for navigation, prices, and controls; intentional short headline measures. | Moderate serif titles, generous body leading, minimal uppercase labels. | Strong sans utility hierarchy with occasional serif statements; larger project titles and compact captions. |
| Color/material | Charcoal and ivory equivalents; champagne used sparingly for actions/hairlines; mostly flat surfaces. | Warm paper and taupe in light mode; warm charcoal in dark mode; soft borders and very limited shadows. | High-contrast neutral fields and one muted accent; sharper edges, fewer enclosing panels. |
| Composition | Unequal hero columns, introductory side notes, image-led stylist profiles, changing section densities. | Consistent generous margins, paired text/image blocks, compact service rows, more regular rhythm. | Large featured work followed by a structured mixed-ratio gallery; service information becomes a clear secondary layer. |
| Imagery | Coherent editorial portraits plus close-ups of hair texture; side light, natural color, restrained retouching. | Daylight, material details, approachable portraits; avoid implying photographs show an actual fictional salon. | Finished-look portraits and macro details, consistent backgrounds and crop rules; describe representative images honestly. |
| Motion | Short image/link feedback and selective reveals; static compositions with reduced motion. | Almost still; subtle state changes and no staggered narrative dependence. | Controlled gallery opening and caption transitions; no autoplay or drag-only interaction. |
| Mobile | A planned cover sequence: short title, dominant crop, visible primary action; compact gallery pairs where readable. | Comfortable stacked blocks, generous controls, simpler contact emphasis. | Featured image plus compact paired work; accessible buttons instead of a swipe-only filmstrip. |
| Advantages | Strongest continuity with “couture”; substantial portfolio distinction with familiar navigation. | Clear, approachable, and easiest to implement incrementally. | Makes visual work immediately legible and reduces the generic-card impression. |
| Trade-offs | Needs coherent assets and careful responsive art direction; excessive asymmetry could distract from service choice. | Lower expressive ceiling; can resemble a generic wellness site without excellent imagery. | Most dependent on a convincing image collection; risks burying prices and the studio story. |
| Technical implications | Scoped HTML restructuring and CSS Grid roles; responsive images; existing vanilla modules remain. | Mostly tokens, spacing, and component styling; fewer structural changes. | More gallery/hero restructuring and asset metadata; existing lightbox state can stay; CSS Grid is sufficient. |

All three directions require complete Polish/Latin font coverage, accessible contrasts, visible focus, keyboard navigation, touch targets, and equivalent light/dark treatment. None needs a framework migration or new runtime dependency. Asset sourcing is a later owner decision; no photographs were sourced or generated in this audit.

## 5. Recommended direction

Choose **A — Noir Editorial Atelier**, borrowing B's calm reading comfort and C's gallery curation without combining their entire styles.

It connects the existing couture/texture language to tangible imagery, provides a distinctive portfolio opening, and allows services, prices, and controls to remain familiar. The effort is concentrated in assets and a few deliberate compositions rather than replacing the application architecture. It also supports a credible ivory light edition instead of treating light mode as a color inversion of dark translucent cards.

The guiding hierarchy is: **image establishes character → concise copy explains craft → offerings clarify choice → demonstration/contact actions state what happens**. Each section should have one principal job and a deliberate density. Keep the current section IDs and primary navigation order unless a later approved product decision changes them.

## 6. Prioritized design improvements

Priority means implementation value/dependency, not a severity score: **P1** establishes the direction or addresses a main journey; **P2** completes the editorial experience. Each item is separately reviewable. Acceptance criteria below describe future verification, not results of this audit.

### IMP-DESIGN-01 — Establish paired editorial materials

- **Status:** COMPLETED — implemented and verified (2026-10-10).
- **Result:** Completed theme contrast corrections (01A) and established a consistent charcoal/ivory editorial material system (01B). Improved surface readability, control visibility, and visual hierarchy while reducing decorative framing and shadows. Preserved responsive layouts, theme behavior, accessibility, and existing interaction contracts.
- **Verification:** Focused Chromium checks passed across four pages, two themes, and five viewport widths (40 combinations per stage), with no measured layout regressions. Representative contrast measurements met the applicable targets. `npm run build`, `npm run test:nav` (18/18), and `git diff --check` passed. Cross-browser testing, real devices, full WCAG compliance, and deployment were not verified.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-02 — Art-direct typography after font repair

- **Status:** COMPLETED — implemented and verified.
- **Result:** Refined the existing Playfair Display/Inter hierarchy with a fluid 44–72px hero and 15ch measure, quieter 32–40px section/page titles at weight 500, a 60ch About introduction at 18px/1.7, shared utility tracking, and a smaller lightbox caption. Preserved font assets/preloads, Polish copy, natural wrapping, layouts, semantic headings, focus/interaction contracts, and legal prose/table styling.
- **Verification:** `npm run build`, `npm run test:nav` (18/18), and `git diff --check` passed. Chromium checks covered all six pages at 360/375/768/900/1440px in light/dark themes, with before/after visual review of representative layouts; no document horizontal overflow or JavaScript errors. Actual 200% browser zoom covered home and all three legal pages at 768/900/1440px window widths in both themes, without heading overflow. Verified long Polish heading wrapping, stable header height on scroll, booking selection/confirmation and keyboard focus, lightbox navigation/caption, and keyboard table scrolling. Platform-font inspection confirmed custom Playfair Display and Inter for Latin/Polish letters, digits, and punctuation. Chromium only; no full accessibility audit. At 200% zoom in a short viewport, the fixed contact bar covers the menu theme toggle; comparison with the original CSS confirmed the same pre-existing behavior, left outside this typography task.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-03 — Replace placeholder storytelling with a coherent image set

- **Status:** Proposed
- **Priority:** P1
- **Affected area:** Hero, three stylist portraits, six gallery images, and associated descriptions.
- **Evidence:** Source: `assets/img/hero-editorial.svg`, `assets/img/stylist-1.svg`, `assets/img/gallery-1.svg`, and their sibling assets; image alternatives in `index.html`. Runtime: all ten load successfully but remain placeholder sources.
- **Current state:** Geometric panels stand in for hair, people, and work; descriptive alternatives imply subjects absent from those panels.
- **Proposed improvement:** Commission or select licensed, visually coherent representative photography: one signature hero, three compatible portraits, and six curated look/detail images. Maintain natural hair color, directional light, and crop consistency; label representative/demo imagery honestly rather than presenting it as verified salon work.
- **Expected value:** The site can communicate texture, precision, and personality through images.
- **Implementation scope:** Approved canonical assets and corresponding image markup/metadata only. Provide useful responsive sizes/crops, intrinsic dimensions, hero priority, and lazy loading elsewhere using existing browser capabilities. No sourcing, generation, or asset replacement is authorized now.
- **Acceptance criteria:** Owner approves rights, demo attribution, subject suitability, and crop/focal points. No embedded “Look”/placeholder text remains in chosen photography. Alternative text describes the actual image. At all audited widths key hair details survive crops, image space is reserved before loading, and mobile does not fetch an unnecessary full-resolution master. Record actual dimensions/file sizes and network results; do not claim an unmeasured performance improvement.
- **Impact:** High
- **Effort:** Large

### IMP-DESIGN-04 — Compose a signature responsive hero

- **Status:** Proposed
- **Priority:** P1
- **Affected area:** `.hero`, `.hero__inner`, `.hero__copy`, `.hero__visual`, `.hero__actions`, `.hero__overlay`.
- **Evidence:** Source: `index.html`, `css/sections.css`; equal columns from 900px and fixed 8rem/6rem padding. Runtime: 536/536px columns at 1440px; approximately 848px hero at 375×800 and 977px at 768×900.
- **Current state:** Conventional copy/image split on desktop, large inherited spacing and image-after-actions on narrow screens.
- **Proposed improvement:** Make the image the dominant editorial anchor with an unequal desktop split and a narrower headline column. Design a compact mobile cover sequence with a deliberate crop and primary action close to its explanatory copy; handle tablet proportions explicitly. Avoid text over busy hair detail and opaque gradients that obscure it.
- **Expected value:** A memorable first impression connected to the atelier concept, with a clear next step.
- **Implementation scope:** Hero markup/CSS and approved image variants; preserve `#top`, `#booking`, `#services`, reveal hooks, and header mini-CTA observation. Depends on 02/03; do not expand into a header refactor.
- **Acceptance criteria:** At 1440px the hero has a clear image/copy hierarchy rather than equal visual weight; at 360/375×800 headline, meaningful imagery, and principal CTA can be understood without traversing a long blank lead-in. At 768/900px neither column becomes a cramped residual layout. Both themes, reduced motion, keyboard focus, and 200% zoom preserve content and action access. No autoplay/video or scroll-driven dependency.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-05 — Give the studio and team distinct editorial compositions

- **Status:** Proposed
- **Priority:** P2
- **Affected area:** `#about` and `#stylists`.
- **Evidence:** Source: `.values`, `.value-card`, `.card-grid`, `.stylist-card` in `index.html`, `css/layout.css`, `css/sections.css`. Runtime: three equal stylist columns on desktop and three full portrait cards stacked on mobile.
- **Current state:** The studio philosophy and people both rely on repeated framed blocks despite serving different storytelling roles.
- **Proposed improvement:** Present About as a measured introduction with a slim values column or numbered editorial notes. Present the team as portraits with open captions, specialty, and a discrete booking link instead of nested image/card framing. Keep all three stylists equally discoverable; do not invent experience claims or biographies.
- **Expected value:** More distinct section rhythm and stronger connection between visual identity and people.
- **Implementation scope:** These two sections only, current CSS, and 03 portraits; preserve order, names, data preselection values, and `#about`/`#stylists`. This is a new composition goal, not a repeat of completed About gap normalization.
- **Acceptance criteria:** About copy has an intentional readable measure; values are visibly separated without three identical card shells. Every stylist retains portrait, name, specialty, and accessible booking action at all five widths. DOM reading order matches visual order; keyboard/card preselection continues to select and focus the corresponding option. Deliver About and team as separate reviewable slices if needed.
- **Impact:** Medium
- **Effort:** Medium

### IMP-DESIGN-06 — Clarify base services and signature packages

- **Status:** Proposed
- **Priority:** P1
- **Affected area:** `#services`, `#pricing`, `.service-card`, `.pricing__item`.
- **Evidence:** Source: five base service cards with price pills/preselection versus three differently named package rows in `index.html`; three-column `.card-grid` in `css/layout.css`. Existing mobile pricing named areas and nowrap prices are already implemented.
- **Current state:** Adjacent offerings repeat price information in different forms without explaining the base-service/package distinction.
- **Proposed improvement:** Present base services as a concise editorial list with readable descriptions, right-aligned starting prices, and one clearly associated action per row. Introduce Pricing explicitly as signature packages with inclusions and a clear instruction for the demo/contact next step. Preserve existing prices and avoid implying package preselection where none exists.
- **Expected value:** Easier comparison and a more intentional service-to-action journey.
- **Implementation scope:** These two sections and styles; preserve all five service hooks and booking options. Package labels/inclusion clarification require owner review; new package selection would be a separate product change.
- **Acceptance criteria:** A reader can distinguish a base service from a package using visible Polish labels, without inferring it from different prices. Every base service retains working preselection and a no-JS `#booking` link. Prices stay unbroken and descriptions readable on mobile. Package actions, if approved, accurately explain the next step and do not claim to select unsupported values. No prices or package contents are invented.
- **Impact:** High
- **Effort:** Medium

### IMP-DESIGN-07 — Curate a mixed-scale work gallery

- **Status:** Proposed
- **Priority:** P2
- **Affected area:** `#gallery`, `.gallery`, `.gallery__item`, and image/caption presentation.
- **Evidence:** Source: six equal 4:5 buttons in `index.html` and `css/sections.css`; ordered thumbnail source in `js/lightbox.js`. Runtime: one column at 375px, two at 768px, three at 900/1440px; approximately 2870px section height at 375px.
- **Current state:** Equal scale and repetitive placeholder panels obscure any editorial sequence or featured work.
- **Proposed improvement:** Use one featured image and a deliberate sequence of portrait/detail crops on desktop. On mobile, show a featured image followed by compact pairs where details remain legible, with short descriptive captions and a visible preview affordance. Keep all six items accessible without carousel paging.
- **Expected value:** A stronger work narrative with more balanced mobile pacing.
- **Implementation scope:** Gallery markup/CSS and 03 asset crops; captions derived from approved image descriptions. Retain native buttons, ordered `data-lightbox` triggers, thumbnail source mapping, and existing dialog behavior. No new gallery library.
- **Acceptance criteria:** Featured work is distinguishable; crops have documented focal points. All six images remain reachable by pointer and keyboard in DOM order, and captions do not imply unverified client results. Mobile gallery height is compared with the current baseline and reduced through composition without hiding items or making detail unreadable. Opening/traversal/count/close/focus-return behavior stays correct in both themes, including reduced motion.
- **Impact:** Medium
- **Effort:** Medium

### IMP-DESIGN-08 — Create a calm, honest booking and contact finish

- **Status:** Proposed
- **Priority:** P1
- **Affected area:** `#booking`, `#testimonials`, `#location`, `#final-cta`, shared footer, and mobile contact emphasis.
- **Evidence:** Source: `.booking__steps`, `.booking__summary`, `.booking__fallback`, `.testimonials`, `.location`, `.cta`, `.footer`, `.mobile-cta`; static rating/source claims and generic destinations in `index.html`. Runtime: confirmation and stale-label defects; repeated mobile actions and 64px bar.
- **Current state:** The journey ends in several competing panels/actions; simulated booking and example credibility content lack prominent demo context.
- **Proposed improvement:** After separate trust/state corrections, compose booking as two visible choices plus a clearly labelled demo summary/action, with contact channels grouped as alternatives. Give one example testimonial more editorial emphasis, with honest provenance/demo labels; keep remaining quotes available. Follow with compact hours/contact details and one restrained final action. Make the mobile bar's main action visually dominant while secondary channels remain accessible.
- **Expected value:** A legible finish aligned with actual functionality and the premium direction.
- **Implementation scope:** Split into booking presentation, closing sections, and mobile/footer presentation tasks using existing sources. Shared footer styling carries to legal pages without changing legal text. No backend, date picker, delivery promise, changed storage, removed selection state, or assumed external account.
- **Acceptance criteria:** Demo status is visible before action and in the result; no interface implies a saved appointment, transmission, callback, or verified reviews without supporting functionality/evidence. Choice indicators, missing-choice hint, summary live region, preselection/focus, and no-JS contact explanation remain. At 360/375×800 selected options, confirmation, and footer can be reached without fixed-bar obstruction. Persistent/contact/section actions have a clear hierarchy; theme/menu/lightbox modal behavior is preserved. External destinations require a separate owner decision and focused verification.
- **Impact:** High
- **Effort:** Medium

## 7. Suggested implementation sequence and dependencies

Nothing below authorizes coding, asset replacement, delivery, or changes to the backlog status.

1. **Approve the concept and boundaries.** Confirm direction A, photography rights/demo treatment, typeface choice, and the distinction between simulated selection and contact. Keep the architecture and section/navigation contracts as the starting point.
2. **Approve separate corrective prerequisites.** Repair font rendering, measure/fix light-theme contrast, correct misleading booking/reset language, and address the menu CTA path. Verify the fixed-bar modal risk before correction. Resolve placeholder destinations and review provenance through explicit content decisions. These tasks should not wait for an entire visual redesign.
3. **Establish shared art direction:** 01 materials and 02 editorial typography, in separate changes. First verify the corrected fonts and 900px navigation fit; carry shared choices into the three legal pages. Typography and material work can proceed independently after their respective prerequisites.
4. **Prepare assets:** 03 can proceed independently of CSS work once rights and demo representation are approved. Agree focal points and image dimensions before final hero/gallery geometry. If assets are unavailable, do not approve final visual balance using the existing placeholders.
5. **Deliver the opening:** 04 after 01/02/03. Review mobile, tablet, and desktop compositions together, including the header mini CTA. A single approved hero establishes the visual standard for later sections.
6. **Deliver the central journey:** 06 service/package distinction can be implemented independently of new photography after 01/02 and copy approval. 05 studio/team follows assets for its portrait slice; the About slice is independently deliverable. 07 gallery follows 03 and can proceed separately from 05/06 once the shared direction is stable.
7. **Deliver the closing journey:** 08 follows the trust/menu prerequisites and shared materials/type. Review its booking, closing-content, and mobile/footer slices individually; do not combine them into one large redesign change.

For each later approved slice, use focused checks of affected viewports/themes, actual fonts/assets, visible focus, keyboard/touch access, and reduced motion. Preserve semantic HTML and meaningful DOM order. Aim for at least 4.5:1 normal text contrast, 3:1 large text and relevant control boundaries, and comfortably sized touch controls; these are acceptance targets, not compliance findings. Check zoom and short/landscape viewports when persistent controls or overlays are affected.

Use current project tooling: `git diff --check` for every slice, `npm run build` when source/assets change, and `npm run test:nav` for navigation/header contract changes. Use focused booking/lightbox checks when their presentation changes. No dependency or framework replacement is justified by the proposed direction. Production PWA/offline verification belongs only to changes that actually affect those contracts.

## 8. Verification performed and limitations

### Actual coverage

| Page / scenario | Viewports and themes | What was checked |
| --- | --- | --- |
| Complete home page | 360×800, 375×800, 768×900, 900×900, 1440×900; dark and light (10 combinations) | Loaded via Vite; computed theme/colors/grid columns; hero/header/section/bar geometry; scroll through all ten sections; all ten content images loaded; no document horizontal overflow in sampled states. |
| Legal pages | Each of privacy, terms, cookies at 375×900 and 1440×900; dark and light (12 combinations) | Shared navigation destinations, `.prose` measure, table wrapper geometry, and document overflow. No document horizontal overflow observed; privacy/cookies narrow table regions remained scrollable by geometry. Actual table keyboard scrolling was not exercised. |
| Menu CTA | 375×800, light | Open menu → its booking CTA: `#booking` set while menu stayed open and `main` remained inert; Escape used to close. Computed bar/header stacking values recorded. |
| Lightbox smoke check | 375×800, light | First thumbnail, caption/count, dialog bounds, close-control focus, Next, and Escape. Not a full lightbox regression run. |
| Booking smoke check | 375×800, light | Select first service/stylist, confirm, then change service; misleading saved/sent result and stale enabled label observed. No external submission. |
| Font usage | Home hero title/subtitle at 1440×900, light | Chromium platform-font glyph counts demonstrated mixed custom/system rendering. This is not a complete glyph-map or font-license audit. |
| Reduced motion | Home at 1440×900, light | Reload with reduced motion: all 11 reveal elements computed visible; effectively zero CSS transition duration. Other motion/interaction states were not exhaustively tested. |

No `pageerror` events were captured during the successful browser probe. This does not certify network, console, accessibility, or production behavior. Both themes were set explicitly for the coverage matrix; system-preference/storage logic was inspected in source, not subjected to a dedicated behavioral regression.

### Environment and verification boundaries

- The in-app browser initially timed out on localhost. The first local Playwright launch searched an unavailable sandbox cache; using the existing user browser cache exposed a localhost network restriction. Vite and installed Chromium were then run outside that network isolation with tool approval. No browser, dependency, or tooling was installed.
- No screenshots or other visual artifacts were produced. Runtime evidence refers to measured rendering and interaction, not direct visual inspection. Final crop quality, tonal relationships, aesthetic balance, hover/focus appearance, and photographic credibility still require visual review.
- No real devices, touch gestures, assistive-technology speech, Firefox, WebKit, or live site were tested. Zoom, short/landscape viewports, complete keyboard journeys, external maps/social/contact hand-offs, and image performance under constrained networks remain future focused checks.
- No full Playwright suite, production build, Lighthouse, comprehensive accessibility suite, production PWA/offline scenario, or deployment was run. They were unnecessary for this documentation-only task.
- File/component references and current archived completion statuses were checked. All eight proposals have scope, impact/effort, dependencies, and observable future acceptance criteria. None reopens completed heading/prose/button/choice/header-stability/preselection/section-spy/lightbox/shared-helper work as unfinished.
- Full document review completed. A focused document check confirmed eight unique proposals, all required fields, six P1/two P2 priorities, and 26 existing file/directory references. `git diff --check` produced no diagnostics; an additional no-index whitespace check covered the untracked report and also produced no whitespace diagnostics.
- Final Git status contains only `?? IMPROVEMENTS-DESIGN.md`. The report remains unstaged and uncommitted. Existing source, tests, assets, configuration, README, CHANGELOG, archived reports, and generated `dist/` are unchanged.
