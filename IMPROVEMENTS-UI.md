# Studio Noir — UI Improvements

**Analysis date:** 2026-09-28
**Completion date:** 2026-10-03
**Status:** Completed
**Project type:** Static multi-page website (Vite MPA build; vanilla HTML, CSS custom properties, and ES modules) — Polish-language demonstration site for a hair studio, KP_Code Digital Studio
**Analysis mode:** Evidence-based UI improvement review
**Focus:** Project-wide UI

## Improvement overview

This review identified five project-wide UI improvements focused on shared typography, long-form content, interaction components, booking controls, and sticky-header stability.

All five selected improvements were implemented and verified. The completed work strengthened the existing design system without changing the project's core visual identity or architecture.

The `Current state`, `Proposed improvement`, `Expected value`, `Implementation scope`, and `Acceptance criteria` fields below preserve the original pre-implementation analysis for archival traceability. Each item's `Status` records the completed implementation outcome.

## Completed improvements

### IMP-UI-01 — Define a heading type scale with display line-height

- **Status:** Completed — implemented a token-driven heading scale with explicit display line-heights, responsive heading tokens, and project-level `h1`–`h6` defaults; verified across representative desktop and mobile views.
- **Affected area:** All headings — hero title, section titles, closing call to action, card, pricing, booking-step, and location headings, and legal document headings.
- **Evidence:** `css/base.css:75-83`, `css/base.css:106-115`, `css/tokens.css:19-25`, `css/layout.css:22-24`, `css/sections.css:13-15`, `index.html:425`
- **Current state:** The shared heading rule sets family, weight, margin, and tracking but no size or line-height, so every heading inherits the body `line-height: 1.6`. Measured in Chromium, the hero title renders at 64px on a 102.4px line box at 1440px, and its two lines occupy 143px at 375px; section titles render at 48px on a 76.8px line box. Display sizes are raw `clamp()` values in `layout.css` and `sections.css`, while `--fs-xl`, `--fs-2xl`, and `--fs-3xl` are defined but unused. Headings without a class fall back to user-agent sizes: every `h3` renders at 18.72px, and the closing call-to-action `h2` and the legal document `h2` elements render at 24px, against section titles of 32–48px.
- **Proposed improvement:** Extend the existing type tokens with heading sizes (including the fluid display sizes) and heading line-height values, set level defaults for `h1`–`h3` in `base.css`, and map `.hero__title` and `.section__title` to those tokens, so every heading resolves to a deliberate scale value with leading suited to its size.
- **Expected value:** Tighter display typography in keeping with the editorial direction, a consistent hierarchy between section, card, and document headings, and a type scale in which tokens own all sizing decisions.
- **Implementation scope:** `css/tokens.css`, `css/base.css`, `.section__title` in `css/layout.css`, and `.hero__title` in `css/sections.css`. Preserve the font families, the 600 weight, the negative tracking, the current fluid size ranges unless deliberately re-tuned, and the body text line-height. Spacing around headings inside legal documents belongs to IMP-UI-02.
- **Acceptance criteria:** No heading computes to a user-agent default size; heading sizes resolve from tokens, with no raw size values left in `layout.css` or `sections.css`; hero and section titles use a line-height no greater than 1.2, and the two-line hero title at 375px is shorter than 143px; body copy keeps `line-height: 1.6`; every type-size token in `tokens.css` is either used or removed.
- **Impact:** High
- **Effort:** Small

### IMP-UI-02 — Add a long-form content style for the legal documents

- **Status:** Completed — added a shared `.prose` block with readable text measure, heading rhythm, list markers, underlined links, and token-based separators; verified at 1440px and 375px in both themes, preserving wide tables and the home-page UI.
- **Affected area:** Document bodies of `privacy.html`, `terms.html`, and `cookies.html`.
- **Evidence:** `privacy.html:79`, `terms.html:79`, `cookies.html:66` (`.section__content` has no CSS rule), `css/layout.css:1-4`, `css/base.css:90-93`, `css/base.css:100-104`, `css/base.css:106-119`, `cookies.html:102`, `cookies.html:239`, `privacy.html:138`, `privacy.html:341`
- **Current state:** Document text runs across the full 1120px `.container`; measured in the privacy policy at 1440px, the first lines of long paragraphs contain 145–166 characters, and the other two documents share the same container. Global resets written for interface elements apply inside the documents: `ul` lists render without markers, indentation, or bottom margin (11 lists in the cookies policy alone), while the single `ol` in `cookies.html` keeps user-agent decimal markers, a 40px indent, and 16px margins. Document `h2` and `h3` headings have no top margin, so section breaks rely on the preceding paragraph's 16px margin. Inline links such as "Polityka cookies" sit inside `<strong>` and render with the same color, weight, and decoration as bold text that is not a link. The closing `hr` uses the user-agent gray inset border.
- **Proposed improvement:** Introduce a BEM block for long-form content on the three legal `section__content` containers that limits the text measure, gives `ul` and `ol` consistent markers, indentation, and spacing, spaces headings more above than below, styles inline links with a cue that does not rely on color alone (for example, an offset underline with hover and focus-visible states), and draws `hr` from existing tokens.
- **Expected value:** More comfortable reading and clearer structure in three documents with substantial content, recognizable enumerations, identifiable cross-document links, and legal pages that match the rest of the visual system.
- **Implementation scope:** One new block in the existing CSS layers and a class hook on the three `section__content` elements. Keep the global resets for interface lists and links (navigation, footer, opening hours, booking microcopy). Apply the measure to text elements rather than the whole block, so tables keep the full container width and their existing `.table-scroll` behavior. No content changes.
- **Acceptance criteria:** At 1440px, paragraph lines in the legal documents contain no more than 80 characters; every `ul` and `ol` in the documents shows markers with the same indentation and spacing; `h2` headings have more space above than below; inline links are distinguishable from bold text without relying on color; tables keep their `min-width` and remain horizontally scrollable at 375px; lists on the home page render unchanged.
- **Impact:** High
- **Effort:** Medium

### IMP-UI-03 — Normalize the button component's box and interaction states

- **Status:** Completed — normalized the native `button` typography reset and gave `.button` a token-driven box (control line-height and 48px minimum height) so anchor and button hosts render at identical height; added enabled-only hover, pressed, and focus-visible states for both variants with theme-aware state tokens; verified in dark and light themes at 1440px and 375px, including booking confirmation and disabled behavior.
- **Affected area:** The `.button` component on all pages (29 instances), including the header's call-to-action pair, hero actions, booking actions, and the legal pages' return links.
- **Evidence:** `css/base.css:95-98`, `css/components.css:9-45`, `index.html:65-70`, `index.html:306`
- **Current state:** `.button` sets font size, tracking, and padding but no line-height, so its height depends on the host element. Measured in Chromium, `<a class="button">` renders 48.4px tall (inherited 22.4px line-height) and `<button class="button">` 45px (user-agent `line-height: normal`); the `<button>` hosts — the theme toggle on all four content pages and the booking confirmation button — sit 3.4px shorter than the anchor buttons beside them. Only `.button--primary` defines hover and focus-visible feedback; `.button--ghost` sets only a border color, leaving its 13 instances without hover feedback, and neither variant defines a pressed state.
- **Proposed improvement:** Make the component's box independent of its host element — explicit line-height and a token-based minimum height, with the base `button` reset inheriting typography — and give both variants a complete, token-based set of hover, active, focus-visible, and disabled states, keeping the primary variant's existing lift.
- **Expected value:** Buttons of the same size align exactly side by side, secondary actions provide the same interaction feedback as primary ones, and the component behaves predictably wherever it is reused.
- **Implementation scope:** The form-control reset in `css/base.css` and the `.button` block in `css/components.css`. Preserve variant names, the pill shape, uppercase tracking, the global focus outline, and the confirmation button's disabled logic in `js/booking.js`. Mini call-to-action sizing in the header is covered by IMP-UI-05. Define state colors through tokens instead of new hardcoded values.
- **Acceptance criteria:** Default-size `.button` elements render at the same height on `<a>` and `<button>` hosts, and the header call to action and theme toggle share height and vertical center; ghost buttons show a visible hover state, and both variants show a pressed state distinct from rest; disabled buttons show no hover or pressed change; the button block introduces no new hardcoded color values.
- **Impact:** Medium
- **Effort:** Small

### IMP-UI-04 — Distinguish selectable booking options from static tags

- **Status:** Completed — introduced a dedicated `.choice` control for booking service and stylist selection, returning `.pill` to a single static-label role; options now differ from tags in box, surface, radius, typography, and a leading state ring that fills when selected, with token-based hover, focus-visible, pressed, and selected states and synchronized `aria-pressed`; verified in dark, light, and grayscale rendering at 1440px and 375px, including the full booking flow.
- **Affected area:** The booking widget on the home page and the shared `.pill` component.
- **Evidence:** `css/components.css:47-67`, `index.html:289-300`, `index.html:309-313`, `index.html:140`, `index.html:363-365`, `js/booking.js:28-37`
- **Current state:** `.pill` serves both as a static label — service price tags, the step 3 microcopy list, and review-source counts — and as the base of the selectable `.pill--option` buttons. Measured in Chromium, an option and a static microcopy tag share the same border, background, text color, font size, tracking, padding, and radius; only `cursor` and `line-height` differ, and the static tags sit directly below the options in the same widget. Options have no hover state. The selected state (`is-selected`, toggled by `js/booking.js`) changes the border from 40%-opacity gold to solid gold and adds a faint tint while text color and weight stay unchanged, so the selected option is distinguished by color alone.
- **Proposed improvement:** Give selectable options their own interactive treatment — rest, hover, focus-visible, and a selected state carried by a non-color cue such as a filled surface with changed text color and weight or a CSS-drawn indicator — and present the microcopy and other informational tags in a clearly non-interactive style.
- **Expected value:** The booking widget shows at a glance which elements are controls, the current choice is easier to confirm before submitting, and `.pill` returns to a single role as a label.
- **Implementation scope:** The `.pill` and `.pill--option` rules in `css/components.css`, the booking rules in `css/sections.css`, and class adjustments in the booking markup of `index.html`, within the existing BEM structure. Preserve the `data-booking-*` hooks, the `is-selected` class used by `js/booking.js` (or an equivalent state hook if one is introduced), the summary live region, and the confirmation button's disabled logic. Define colors through tokens.
- **Acceptance criteria:** At rest, options differ from static tags in at least two visual properties besides the cursor; options show hover and focus-visible states; the selected option stays distinguishable from unselected options in a grayscale rendering; static tags show no pointer cursor or hover change; selecting, changing, and confirming a booking behave as before.
- **Impact:** Medium
- **Effort:** Small

### IMP-UI-05 — Keep the sticky header at a stable single-row height

- **Status:** Completed — gave the header bar a token-driven minimum block size and moved the scrolled state to surface, accent hairline, and elevation only, so rest and scrolled states share one in-flow height; below 414px the brand lockup reduces to the mark and the mini call to action renders on one line at `--fs-xs`; verified at 360–1440px in both themes, including threshold stability, section tracking, and mini call-to-action visibility.
- **Affected area:** The shared header on all content pages, including the mobile mini call to action on the home page.
- **Evidence:** `css/components.css:99-140`, `css/components.css:224-242`, `js/header.js:37`, `js/header.js:87`, `js/header.js:126-135`, `index.html:39-45`
- **Current state:** The header is `position: sticky`, so it occupies layout space. Its scrolled state, added when `scrollY` exceeds 20px, halves the vertical padding of `.header__inner`; measured at 1440px, the header shrinks from 85px to 69px. The `padding` transition is declared on `.header`, whose own padding never changes, so the resize is instant. In Chromium, scroll anchoring compensated for the height change by moving the scroll position from 21px back to 5px, below the threshold, which makes the state liable to flip back near the threshold; this oscillation could not be observed in the test environment. `js/header.js` reads the header height once for the section-spy margin, and the two states' backgrounds differ only slightly (`rgba(11, 11, 14, 0.7)` against `rgba(20, 20, 24, 0.65)`). At 360, 375, and 390px the header renders 104px tall because the letter-spaced `.logo__sub` line and the 9.28px mini call-to-action label each wrap to two lines; from 414px it renders 85px tall.
- **Proposed improvement:** Keep the header's in-flow height constant across rest and scrolled states by expressing the scrolled state through non-layout properties — a token-based surface, border, or shadow change, or a transform-based condense — and adjust the narrow-viewport brand lockup and mini call-to-action sizing (for example, the sub-line's tracking or visibility below 414px) so that both stay on one line from 360px, with the mini call-to-action label on the type scale.
- **Expected value:** Crossing the scroll threshold no longer changes layout or scroll position, header-height-dependent logic in `js/header.js` works from a constant value, common phone widths regain 19px of vertical space, and the scrolled state becomes perceptible.
- **Implementation scope:** Header, logo, and mini call-to-action rules in `css/components.css`; `js/header.js` only if the threshold logic still needs adjustment once the height is stable. Preserve sticky positioning, the 900px navigation breakpoint, the mobile menu panel and its focus management, the mini call-to-action visibility logic, and the full brand lockup at 414px and above. The fixed quick-contact bar is outside this scope.
- **Acceptance criteria:** The header's `offsetHeight` is identical at `scrollY` 0 and after crossing the threshold at 360, 768, and 1440px; crossing the threshold causes no scroll position adjustment; at 360, 375, and 390px the header height equals its height at 414px; the mini call-to-action label renders on one line at a size no smaller than `--fs-xs`; the scrolled state is visually distinguishable from the rest state.
- **Impact:** Medium
- **Effort:** Medium

## Completion summary

All five selected improvements were completed.

Together they strengthened shared systems with broad project impact: heading typography, long-form content, button interactions, booking-selection controls, and sticky-header behavior.

The implementation sequence preserved the original dependencies between the improvements: the legal-document work built on the heading system, the booking-control work followed the button normalization, and the final header pass consolidated the mini call-to-action sizing and sticky-header geometry.

Two additional UI opportunities identified during the original review were intentionally not included in this completed round:

- at 375px, pricing rows can split prices across two lines and inset their content 24px from the section edge;
- the About section can have a larger header-to-content gap than surrounding sections because header margin and grid gap accumulate.

These remain candidates for a future UI review rather than unfinished work in this document.

## Original analysis limitations and follow-up context

The following limitations and defects were identified during the original analysis. They were not part of the five completed improvements unless explicitly addressed by an individual implementation.

- The bundled WOFF2 files in `assets/fonts/` contain only a Latin Extended subset: in Chromium, nearly all basic Latin letters, digits, Latin-1 characters such as "ó", and typographic punctuation fall back to system fonts, and only characters such as "ą", "ł", and "ś" render in Playfair Display and Inter. Measurements from the original analysis therefore reflected fallback-font rendering. This remains a separate asset-quality issue and should be re-evaluated when font work is undertaken.
- The original review identified light-theme contrast problems caused by component surfaces using hardcoded dark `rgba()` values. This was treated as a separate defect rather than part of this UI-improvement round. Where individual completed improvements introduced or changed color-bearing states, their completion status records the later dark/light verification performed for that task.
- The initial analysis used Chromium against a temporary local server and had limited runtime rendering during inspection. Those constraints apply to the original analysis only. The `Status` entries above record the later focused verification performed during implementation of each completed improvement.
