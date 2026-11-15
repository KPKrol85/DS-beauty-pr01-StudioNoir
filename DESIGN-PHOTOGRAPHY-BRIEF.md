# Studio Noir — Design V2 Photography Brief and Image Production Plan

**Related improvement:** IMP-DESIGN-V2-02 — Art-direct photography by role and widen the shot vocabulary (`IMPROVEMENTS-DESIGN.md`)
**Date:** 2026-11-15
**Status:** Draft for owner review — production specification only; no image generation or implementation is authorized by this document
**Scope:** 11 new AI-generated demonstration photographs for the fictional Studio Noir: 1 Campaign, 3 Team, 6 Work, 1 Studio

**Evidence labels:** `Source` (verified in repository files), `Visual` (inspection of the current images), `Calculated` (derived from current CSS at reference viewports; not runtime-measured in this task), `Historical` (from `IMPROVEMENTS-DESIGN.md`). Everything else is a recommendation (design judgment) and remains subject to owner approval.

## 1. Project baseline and objectives

### 1.1 Sources reviewed

- Guidance: `AGENTS.md`, `CLAUDE.md`, `IMPROVEMENTS-DESIGN.md` (IMP-DESIGN-V2-02, V2-03, Sections 3, 4, 8, and 10), the archived record of IMP-DESIGN-03, and the image, PWA, performance, and disclosure sections of `README.md`.
- Markup: `index.html` (hero preload, hero, About, stylists, gallery, lightbox) and the `og:image` declarations in `index.html`, `privacy.html`, `terms.html`, and `cookies.html`.
- Styles: `css/tokens.css`, `css/layout.css`, `css/sections.css` (hero, About, stylists, gallery), `css/components.css` (lightbox), `css/base.css` (`img`).
- Behavior and build: `js/lightbox.js`, `service-worker.js`, `vite.config.js`, `public/manifest.webmanifest`, `tests/interactions.spec.js`.
- Assets: every file in `assets/img/hero`, `assets/img/stylists`, and `assets/img/gallery` (dimensions and sizes read from file headers); all ten photographs and the PWA screenshot `desktop-gallery-1440x900.jpg` inspected visually.

### 1.2 Current photographic baseline

| Slot | Files in `assets/img/` | Master | Variants (AVIF + WebP) | Displayed ratio (CSS) | Current content (Visual) |
| --- | --- | --- | --- | --- | --- |
| Hero `#top` | `hero/hero-editorial` | PNG 1448×1086 | 720×540, 1200×900 | 4:3 → 3:2 → 4:3 | Woman, long wavy brunette hair, off-shoulder black drape; baked "Noir" wordmark cropped as "N…oir" |
| Stylist 1 — Maja | `stylists/stylist-1` | PNG 1122×1402 | 480×600, 800×1000 | 4:5 | Long wavy brunette hair with highlights, off-shoulder garment, direct gaze |
| Stylist 2 — Leon | `stylists/stylist-2` | PNG 1122×1402 | 480×600, 800×1000 | 4:5 | Short textured brown cut, full beard, black blazer and turtleneck, direct gaze |
| Stylist 3 — Sofia | `stylists/stylist-3` | PNG 1122×1402 | 480×600, 800×1000 | 4:5 | Straight dark-brown bob, black blazer, near-direct gaze |
| Gallery 01 `--featured` | `gallery/gallery-1` | PNG 1122×1402 | 480×600, 800×1000 | 4:5 → ≈0.85–0.90 → ≈0.75–0.77 | Rear three-quarter, long balayage waves, lowered profile |
| Gallery 02 `--updo` | `gallery/gallery-2` | PNG 1122×1402 | 480×600, 800×1000 | 4:5 → 1:1 → 6:5 | Loose low bun, off-shoulder drape, face toward camera |
| Gallery 03 `--texture` | `gallery/gallery-3` | PNG 1122×1402 | 480×600, 800×1000 | 4:5 → 1:1 → 6:5 | Men's textured crop with taper, profile |
| Gallery 04 `--copper` | `gallery/gallery-4` | PNG 1122×1402 | 480×600, 800×1000 | 4:5 | Long copper waves, face toward camera |
| Gallery 05 `--sleek` | `gallery/gallery-5` | PNG 1122×1402 | 480×600, 800×1000 | 4:5 → 4:5 → 3:4 | Long straight dark hair, profile, eyes closed |
| Gallery 06 `--curls` | `gallery/gallery-6` | PNG 1122×1402 | 480×600, 800×1000 | 1:1 | Voluminous curls with copper reflects, face toward camera |

Ratios read `<600 px → 600–899 px → ≥900 px` for the gallery and `<600 → 600–1099 → ≥1100 px` for the hero. All variants have exact ratios; the 4:5 masters are 1122×1402 (0.8003).

### 1.3 Verified image contracts (Source)

- `<picture>` with an AVIF `<source>` and a WebP `<img>` fallback; explicit `width`/`height` (hero 1200×900, stylists and gallery 800×1000); `srcset` widths 720/1200 (hero) and 480/800 (stylists, gallery); layout-matched `sizes` (`index.html:63-76`, `238-321`, `333-496`).
- Hero: `<link rel="preload" as="image">` for the AVIF variants with `imagesrcset`, `imagesizes`, and `fetchpriority="high"` (`index.html:32-39`), plus `fetchpriority="high"` on the `<img>`. Stylist and gallery images use `loading="lazy"`.
- Hero crop: `object-fit: cover; object-position: 50% 20%`; `aspect-ratio` 4:3, 3:2 from 600 px, 4:3 from 1100 px in the `2fr 3fr` hero grid (`css/sections.css:31-77`).
- Stylists: `aspect-ratio: 4 / 5; object-fit: cover`, centered (`css/sections.css:179-185`); a `min(36%, 12rem)` image column below 900 px and three equal cards from 900 px.
- Gallery: six `button.gallery__item[data-lightbox]` with the modifiers `--featured`, `--updo`, `--texture`, `--copper`, `--sleek`, and `--curls`; slot ratios and `--gallery-focal-point` values in `css/sections.css:288-346`, `1216-1253`, and `1294-1326`. Each button is named by `aria-labelledby="gallery-preview-N gallery-caption-N"` ("Powiększ" plus the visible caption).
- Lightbox: shows the thumbnail's loaded `currentSrc` (fallback `src`) with `object-fit: contain`, and builds its visible caption from the thumbnail `alt` plus the position (`js/lightbox.js:21-27`, `css/components.css:933-963`). The full master ratio is visible there, and gallery `alt` text is read on screen as a caption.
- PWA: variants whose source path matches `^assets\/img\/(hero|stylists|gallery)\/` are excluded from the install precache and cached on demand (`vite.config.js:63`, `service-worker.js:28`). PNG masters are not referenced by pages and are not emitted.
- `og:image` is `/assets/img/hero/hero-editorial-1200.webp` on `index.html`, `privacy.html`, `terms.html`, and `cookies.html`; the build rewrites it to an absolute, hashed URL.
- Tests: `tests/interactions.spec.js` expects six gallery images and AVIF `currentSrc` selection, and references `gallery-1-800.webp` by name.
- Disclosure: `README.md` (PL line 14, EN line 364) declares the images in `assets/img/` (hero, stylists, gallery) AI-generated demonstration images for the fictional studio.
- The PWA manifest screenshots in `public/assets/screenshots/pwa/` show the current photography (verified visually for the desktop gallery screenshot).

### 1.4 Visual and historical observations

- All ten images share one shot grammar: studio portrait, near-black uniform backdrop, black garment, warm key light (Historical, confirmed Visual).
- The hero subject and Maja share an archetype (long wavy brunette hair, off-shoulder black drape); off-shoulder drapery recurs in gallery 02 (Visual).
- A similar facial type (brow and eye shape, makeup) recurs across the hero, stylists 1 and 3, and gallery 02 and 04 (Visual).
- All six gallery images include a face, and 02, 04, and 06 look toward the camera. The gallery titled "Tekstura, światło, ruch." has no texture close-up and no motion frame (Visual, Historical).
- The About section, which describes craft, has no image (Source).
- Before IMP-DESIGN-V2-01, imageless stretches of 2,429 px (hero to stylists) and 3,604 px (last image to page end) were measured at 1440×900 (Historical).

### 1.5 Objectives

1. Replace all ten photographs and add one Studio image: 11 primary masters in four distinct roles.
2. Make Campaign, Team, Work, and Studio distinguishable without captions while keeping one coherent Noir Editorial look.
3. Remove embedded lettering from the hero so that typography alone carries the brand.
4. Widen the work vocabulary: four scales, six hair archetypes, and no direct gaze.
5. Give the manifesto a craft photograph in About without reducing its prominence.
6. Keep every existing image, accessibility, performance, lightbox, SEO, and PWA contract usable without structural rework.

### 1.6 Owner-approved parameters

- A complete new collection, not a selective replacement.
- A fixed primary count of 11 images: 1 Campaign, 3 Team, 6 Work, 1 Studio.
- A new hero without embedded lettering (resolves decision 4 in `IMPROVEMENTS-DESIGN.md` Section 10).
- The Chaptered Noir direction; IMP-DESIGN-V2-01 is completed.

## 2. Global photographic art direction

### 2.1 Identity

The collection is photographed as the plates of one editorial issue: a cover (Campaign), its contributors (Team), portfolio plates (Work), and an atelier detail (Studio). The common language is controlled warm light on graphite, real hair texture, and quiet couture restraint. Roles differ in gaze, scale, and light character, never in palette or grade.

### 2.2 House constants

| Area | Specification |
| --- | --- |
| Light | One dominant warm key with visible direction and gentle falloff; low fill (ratios per role in Section 3.1); an optional warm rim or hair light separates dark hair from dark backdrops. No flat frontal beauty light, ring-light catchlights, or competing hard shadows. The key reads as tungsten to warm daylight (≈3200–4000 K appearance); shadows stay neutral graphite. |
| Backdrop | Charcoal-to-graphite painted canvas or seamless with a soft warm-umber glow behind the subject; never pure black. Review targets measured on the master: darkest backdrop tone ≥ about `#141416`, glow ≤ about `#4a4540`. Team backdrops are the lightest (mid-graphite, about `#2a2a2c`–`#3a3836`); Work backdrops are the darkest. |
| Wardrobe | Black, charcoal, graphite, or deep espresso; matte or finely textured fabrics; no logos, prints, visible labels, or gold props. Minimal or no jewelry. No off-shoulder drapery anywhere in the collection. |
| Grade | Warm-neutral, restrained saturation, natural skin, slightly lifted matte blacks, no clipped skin highlights, no teal-orange split, no HDR or clarity halos. Fine, even grain is acceptable and reduces banding in dark gradients. |
| Realism | Skin texture appropriate to age, small natural asymmetries, believable hairlines, partings, root direction, flyaways, and ends; correct hands, ears, and garment construction. Polished, not flawless. |
| Optics | Portrait look ≈85–105 mm equivalent; macro look for detail frames; aperture look ≈f/2.8–f/5.6 so the hair stays sharp where it matters. |
| Text | No text, letters, numbers, logos, monograms, watermarks, signatures, borders, or interface elements anywhere in the frame. |

### 2.3 Theme compatibility

- **Dark theme (Source):** the hero, About, stylist, and gallery sections sit on the `#0b0b0e` page. Graphite backdrops sit slightly above the page tone, so each image reads as a deliberate tonal plate rather than a hole.
- **Light theme (Source):** the same images sit on `#f5f1ec`. IMP-DESIGN-V2-03 proposes a darkroom band for the gallery and a printed-plate treatment for the hero and team images. Every frame must therefore be a complete, intentionally composed rectangle with tonal edges, not a composition that depends on dissolving into a black page.
- Work images may use the darkest backdrops because they are intended for a dark band in both themes; Team images use the lightest graphite because they meet the ivory page directly.

### 2.4 Avoid

- Generic stock aesthetics: smiling salon clichés, bright showrooms, product shelves, mirrors full of reflections, generic salon interiors.
- Excessive AI perfection: poreless skin, doll-like symmetry, one face repeated across subjects, glassy eyes, CGI-gloss hair, impossibly uniform curls.
- The current set's archetype: long brunette waves with an off-shoulder drape on a black void.

### 2.5 Content honesty

All people, places, and results are fictional and AI-generated. Do not use photographs of real or identifiable people (clients, models, celebrities) as references, and do not request any real person's likeness. All subjects are adults. Captions and alt text describe what is visible and never claim real clients, employees, premises, or completed services.

### 2.6 Shared generation blocks

Append both blocks to every generation description in Section 4, and append each card's specific exclusions to the universal exclusions. The wording is provider-independent; adapt only the syntax required by the chosen tool (for example, a separate negative-prompt field).

**House style block**

> Premium fashion-editorial hair photography for a fictional hair studio, photorealistic, as if shot on a full-frame camera. One warm, controlled key light with gentle falloff; deep shadows that keep detail; charcoal-to-graphite painted backdrop with a soft warm-umber glow, never pure black. Warm-neutral color grade, restrained saturation, slightly lifted matte blacks, fine even grain. Natural skin with visible pores and fine texture. Hair rendered strand by strand with believable roots, partings, flyaways, and ends. Quiet, couture, confident mood. All people are fictional adults and do not resemble any real person.

**Universal exclusions block**

> No text, letters, numbers, logos, monograms, watermarks, signatures, borders, or frames. No brand marks on clothing or tools. No extra, missing, or fused fingers; no distorted ears, eyes, or teeth. No plastic, airbrushed, or waxy skin; no doll-like or duplicated faces. No melted, smeared, cloned, or tiled hair; no strands merging into skin, clothing, or background; no floating, disconnected hair. No CGI gloss, HDR halos, teal-orange grading, lens flares, crushed pure-black shadows, or clipped highlights. No off-shoulder drapery.

## 3. Role-based visual strategy

### 3.1 Role matrix

| | Campaign | Team | Work | Studio |
| --- | --- | --- | --- | --- |
| Purpose | Brand cover for "Fryzjerstwo w wersji couture." | The fictional people behind the studio | What the studio produces | How the studio works |
| Gaze | Editorial, away from the camera | Direct, calm eye contact (the only role with it) | No direct gaze; faces cropped, turned, or lowered | No faces |
| Scale | Head and shoulders, landscape | One identical head-and-shoulders bust | Macro, close, medium-close, and medium | Close process detail |
| Light and mood | Dramatic raking key, ≈8:1; composed, inward | Soft, even series light, ≈3:1; calm, approachable | Texture-specific (raking, back, overhead), ≈4:1–8:1; tactile | Narrow practical-like key, ≈8:1; concentrated |
| Backdrop | Charcoal gradient with glow | Mid-graphite seamless, identical in all three | Deep charcoal with warm falloff | Dark working space, out of focus |
| Sharpness | Profile and hair edge | Eyes and hairline | The hair subject | The cutting point |

### 3.2 Cast and differentiation

| ID | Subject | Age | Skin | Hair: cut / color | View / gaze | Wardrobe |
| --- | --- | --- | --- | --- | --- | --- |
| IMG-CAMPAIGN-01 | Woman | 25–32 | Light olive | Chin-length blunt bob / deep espresso, chestnut reflect | Near profile to frame-left, eyes lowered | Black structured high neck |
| IMG-TEAM-01 Maja | Woman | 35–42 | Fair, light freckles | Collarbone-length lob / warm honey-beige blonde, deeper root | Front, direct | Black fine-gauge knit, crew neck |
| IMG-TEAM-02 Leon | Man | 42–48 | Medium-light, warm undertone | Short classic taper, side part / dark brown, silver temples; short salt-and-pepper beard | Front, direct | Deep charcoal Oxford shirt |
| IMG-TEAM-03 Sofia | Woman | 28–33 | Warm medium-tan | Shoulder-grazing shag, curtain bangs / deep chocolate | Front, direct | Black tailored blazer |
| IMG-WORK-01 | Woman | 25–35 | Light (little visible) | Long layered waves in motion / chestnut to caramel and honey | Rear three-quarter, face away | Black long-sleeved high neck |
| IMG-WORK-02 | Woman | 25–40 | Fair | Sculpted low figure-eight chignon / cool dark ash blonde | Lost profile from behind | Black crepe, high back neckline |
| IMG-WORK-03 | Man | 22–32 | Medium-tan | Textured crop with skin taper / deep brown-black | Rear three-quarter, face away | Black crew-neck T-shirt |
| IMG-WORK-04 | — | — | None visible | Single long lock / auburn to copper to copper-gold | Macro | Black matte fabric |
| IMG-WORK-05 | Woman | 22–35 | Light (shoulders only) | Very long one-length blunt cut / near-black, cool espresso gloss | Straight rear, symmetrical | Black sleeveless high neck |
| IMG-WORK-06 | Woman | 25–35 | Deep brown | Natural spiral curls / dark brown, cinnamon ends | Three-quarter, eyes lowered | Black matte wide neckline |
| IMG-STUDIO-01 | Hands | — | — | Client's dark brown section | Process detail | Black cuffs |

Rules: no two subjects share a hair archetype; no Work subject resembles a team member; the Campaign subject cannot be read as a stylist; every face has a clearly different structure.

### 3.3 Team series constants

The three portraits are produced as one session:

- **Framing:** 4:5; crown 7–10% from the top, eyes 33–37%, chin 45–50% (head ≈38–42% of the frame height, readable at the 126×158 px mobile display); shoulders fill the lower third; head centered (x 46–54%); no hands.
- **Camera:** ≈85 mm look at eye level; body turned ≈25° to camera-left, face to the camera.
- **Light:** large soft warm key from camera-left at 45°, slightly above eye level; soft fill from the right (≈3:1); subtle warm hair light from behind-right; one soft rectangular catchlight in the same position in both eyes.
- **Backdrop:** plain mid-graphite seamless with a soft warm glow behind the head.

**Team series block** (append to each Team description before the shared blocks):

> Framed from just above the crown to mid-chest, head centered, eyes about one third from the top, no hands in frame. Body turned about 25 degrees to camera-left, face to camera, eye-level 85 mm portrait perspective. Large soft warm key light from camera-left at 45 degrees slightly above eye level, gentle fill from the right, subtle warm hair light from behind-right, matching soft rectangular catchlights in both eyes. Plain mid-graphite seamless backdrop with a soft warm glow behind the head.

### 3.4 Work set rules and slot mapping

- Hair is the subject; faces are cropped, turned away, or lowered.
- Scales: medium (01, 05), medium-close (02, 06), close (03), macro (04). Services shown: color (01, 04), styling (02), men's cutting (03), precision cutting (05), natural texture and care (06).
- Every frame works twice: as its slot crop in the grid and as the full 4:5 frame in the lightbox.
- Concepts are mapped so the existing modifier names stay accurate, and the gallery intro ("od subtelnych fal i naturalnych refleksów po wyraziste cięcia i nowoczesne stylizacje") remains true.

| Slot | Modifier | Current caption | New concept | Caption status | Alt status |
| --- | --- | --- | --- | --- | --- |
| 01 | `--featured` | Falowane włosy z jasnymi pasmami | IMG-WORK-01 Color in motion | Change | Change |
| 02 | `--updo` | Niskie upięcie | IMG-WORK-02 Sculptural chignon | Accurate; optional refinement | Change |
| 03 | `--texture` | Krótkie cięcie z teksturą | IMG-WORK-03 Short cut detail | Accurate | Change |
| 04 | `--copper` | Miedziane fale | IMG-WORK-04 Copper color macro | Change | Change |
| 05 | `--sleek` | Gładkie, ciemne włosy | IMG-WORK-05 One-length precision line | Accurate; optional refinement | Change |
| 06 | `--curls` | Loki z miedzianymi refleksami | IMG-WORK-06 Natural curls | Change | Change |

### 3.5 Studio rules

- Process and craft, not interior: hands, one professional tool, and one hair section; the environment is implied by darkness and one or two distant warm highlights.
- No faces, mirrors, products, or labels; nothing that suggests a real, identifiable salon.

## 4. Complete 11-image shot list

Each card specifies placement, purpose, subject, camera and composition, background, lighting, styling and props, color, master format, crop and focal points (calculations in Section 5), card-specific exclusions, a generation description (to be followed by the blocks in Sections 3.3 and 2.6 as indicated), acceptance criteria, and draft Polish text for the later integration task. Draft text is not applied by this brief.

### IMG-CAMPAIGN-01 — Campaign / Hero

- **Placement:** `#top` `.hero__visual`; replaces `assets/img/hero/hero-editorial.*`; also the `og:image` of four pages.
- **Purpose:** The brand cover for "Fryzjerstwo w wersji couture.": precision, light, and texture in one graphic hair form. It must read as a campaign, not as a staff portrait or a client result.
- **Subject:** Fictional woman, 25–32, light olive skin, a distinctive profile (defined nose bridge and jaw). Glossy chin-length blunt bob in deep espresso with a subtle chestnut reflect, deep side part, one clean continuous perimeter.
- **Camera and composition:** 4:3 landscape, head and shoulders, eye level, ≈100 mm look. Near profile facing frame-left, head slightly lowered, eyes downcast. Crown 14–18% from the top; eye line 36–40%; chin and bob perimeter 58–64%; nose tip at x 42–46%; back of the bob at x 70–74%. The left ≈40% is quiet negative space that faces the hero copy from 1100 px.
- **Background:** Charcoal painted backdrop; warm-umber glow behind the back of the head; gentle darkening toward the left edge, never pure black.
- **Lighting:** Single warm key from high front-left raking across the profile and drawing a gloss band over the crown; faint warm rim from rear-right along the back of the bob and the nape; minimal fill (≈8:1). Dramatic, composed, inward.
- **Styling and props:** Polished hair with a sharp perimeter and healthy ends; skin-first makeup, defined brows, neutral-warm lips. Black structured high-neck top with an architectural shoulder line. No jewelry or props.
- **Color:** Espresso hair with chestnut only in the highlights; natural warm skin; graphite-umber background; highlights harmonize with the site gold (`#c7a47e`) without turning yellow.
- **Master:** 4:3 landscape (Section 6.1).
- **Crop and focal points:** Full frame at 4:3; the 3:2 crop at 600–1099 px keeps y 2.2–91.1% with the current `object-position: 50% 20%`. Keep the face and full bob silhouette within x 30–80%, y 12–70%, and brow-to-chin within the central y 15–85% band for social-card crops.
- **Card-specific exclusions:** No wordmark or lettering in the background; no direct eye contact; no hands; no wind-blown or messy strands; no long hair; no salon interior.
- **Generation description** (append the shared blocks):

> Landscape 4:3 editorial hair campaign photograph. A fictional adult woman in her late twenties with light olive skin, seen in near profile facing frame-left, head slightly lowered, eyes softly downcast, mouth closed. She has a glossy, precision-cut chin-length blunt bob in deep espresso brown with a subtle warm chestnut reflect, a deep side part, and one clean, continuous perimeter line along the jaw. Her head sits right of center: the face near the middle of the frame, the back of the bob at about three quarters of the width, the crown well below the top edge; the left part of the frame is calm, dark negative space. She wears a black, structured high-neck top with an architectural shoulder line. A single warm key light from high front-left rakes across the profile and draws a bright gloss band over the crown; a faint warm rim light from behind traces the back of the bob and the nape; very little fill, deep shadows with detail. Charcoal painted backdrop with a soft warm-umber glow behind the head, darkening gently toward the left edge. Eye-level medium-telephoto perspective; profile and hair edge in crisp focus.

- **Acceptance criteria:**
  - No letters, pseudo-letters, or marks anywhere at 100% zoom.
  - The bob perimeter is one continuous, plausible line; ends are blunt, not melted.
  - Cannot be mistaken for any Team portrait in gaze, crop, light, or hair archetype.
  - Face and silhouette are legible at 351×263 px; the crown is not cut in the 3:2 crop.
  - Gaze and lead room point toward frame-left.
  - No clipped skin highlights and no banding in the 720 px AVIF.
- **Draft Polish alt:** „Kobieta z lśniącym, precyzyjnie ściętym bobem, sfotografowana z profilu na grafitowym tle”.

### IMG-TEAM-01 — Team / Maja Lewandowska

- **Placement:** `#stylists`, first card; replaces `assets/img/stylists/stylist-1.*`. Profile: „Ekspertka koloryzacji”, badge „Kolor sygnaturowy”.
- **Purpose:** The colorist, whose own hair demonstrates dimensional color; warm and assured. Anchor of the team series.
- **Subject:** Fictional woman, 35–42, fair skin with a few soft freckles. Collarbone-length lob with soft, lived-in bends in warm honey and beige blonde, a slightly deeper blonde root melting into lighter ends, tucked behind the ear on the lit side. Faint closed-mouth smile.
- **Camera and composition:** Team series (Section 3.3): 4:5 bust, eye level, ≈85 mm look, body turned ≈25° left, direct gaze; the tucked side keeps the face open.
- **Background:** Team series mid-graphite seamless with a warm glow behind the head.
- **Lighting:** Team series soft key from camera-left, ≈3:1; calm and approachable.
- **Styling and props:** Natural makeup; black fine-gauge knit top with a clean crew neckline. No jewelry or props.
- **Color:** The blonde stays warm-beige, not yellow or brassy; natural skin.
- **Master:** 4:5 portrait.
- **Crop and focal points:** Displayed 4:5 at all widths without cropping (Section 5.2); the face must read at 126×158 px.
- **Card-specific exclusions:** No long waves; no brunette hair; no off-shoulder neckline; no hands.
- **Generation description** (append the Team series block and the shared blocks):

> Vertical 4:5 head-and-shoulders studio portrait of a fictional adult woman in her late thirties, a hair colorist, looking directly into the camera with a calm, warm expression and a faint closed-mouth smile. Fair skin with natural texture and a few soft freckles. Collarbone-length lob with soft, lived-in bends in multi-tonal warm honey and beige blonde, a slightly deeper blonde root melting into lighter ends, tucked behind the ear on the lit side. Natural makeup. She wears a black fine-gauge knit top with a clean crew neckline.

- **Acceptance criteria:**
  - Clearly different from the Campaign subject in hair color, length, gaze, and light.
  - The root-to-end color transition is plausible and consistent on both sides of the head.
  - Establishes the framing, eye height, light, catchlights, and backdrop that TEAM-02 and TEAM-03 must match.
  - Legible as a person at 126×158 px.
- **Draft Polish alt:** „Portret fikcyjnej stylistki Mai z ciepłym, wielotonowym blondem do obojczyków”.

### IMG-TEAM-02 — Team / Leon Zawadzki

- **Placement:** `#stylists`, second card; replaces `assets/img/stylists/stylist-2.*`. Profile: „Fryzjer męski i pielęgnacja”, badge „Precyzyjne strzyżenie”.
- **Purpose:** The barber and grooming specialist; precision and calm.
- **Subject:** Fictional man, 42–48, medium-light skin with a warm undertone and fine lines. Short classic taper with a clean side part and natural texture on top, dark brown with silver at the temples; short, precisely groomed salt-and-pepper beard with clean cheek and neck lines. Mouth closed, attentive expression.
- **Camera and composition:** Team series (Section 3.3), matched to TEAM-01.
- **Background:** Team series backdrop, matched to TEAM-01.
- **Lighting:** Team series light, matched to TEAM-01; calm and approachable.
- **Styling and props:** Deep charcoal Oxford-weave shirt, top button open, no tie. No blazer, turtleneck, apron, tools, or jewelry.
- **Color:** Silver stays neutral without a yellow cast; beard and hair tones agree.
- **Master:** 4:5 portrait.
- **Crop and focal points:** As IMG-TEAM-01.
- **Card-specific exclusions:** No tattoos; no visible logo; no hands; no barber tools.
- **Generation description** (append the Team series block and the shared blocks):

> Vertical 4:5 head-and-shoulders studio portrait of a fictional adult man in his mid-forties, a barber and grooming specialist, looking directly into the camera with a calm, attentive expression, mouth closed. Medium-light skin with a warm undertone, natural texture, and fine lines. Short, classic tapered haircut with a clean side part and natural texture on top, dark brown with silver at the temples; a short, precisely groomed salt-and-pepper beard with clean cheek and neck lines. He wears a deep charcoal Oxford-weave shirt with the top button open and no tie.

- **Acceptance criteria:**
  - Matches TEAM-01 in framing, eye height, light direction, catchlights, and backdrop.
  - Taper and beard lines are crisp and plausible; the beard grows naturally from the skin.
  - Does not resemble the IMG-WORK-03 subject.
- **Draft Polish alt:** „Portret fikcyjnego stylisty Leona z krótkimi, szpakowatymi włosami i przystrzyżoną brodą”.

### IMG-TEAM-03 — Team / Sofia Verne

- **Placement:** `#stylists`, third card; replaces `assets/img/stylists/stylist-3.*`. Profile: „Stylizacja redakcyjna”, badge „Pokazowe wykończenie”.
- **Purpose:** The editorial stylist; poise and finish.
- **Subject:** Fictional woman, 28–33, warm medium-tan skin. Shoulder-grazing textured shag in deep chocolate brown with soft, parted curtain bangs and piece-y, separated ends. Poised, self-assured expression, mouth closed.
- **Camera and composition:** Team series (Section 3.3), matched to TEAM-01; the bangs must not hide the eyes.
- **Background:** Team series backdrop, matched to TEAM-01.
- **Lighting:** Team series light, matched to TEAM-01; calm and approachable.
- **Styling and props:** Defined but natural editorial makeup; sharply tailored black blazer with narrow lapels over a black fitted top. No jewelry or props.
- **Color:** The chocolate brown stays rich and neutral-warm, not red.
- **Master:** 4:5 portrait.
- **Crop and focal points:** As IMG-TEAM-01.
- **Card-specific exclusions:** No bob; no sleek straight hair; no hands.
- **Generation description** (append the Team series block and the shared blocks):

> Vertical 4:5 head-and-shoulders studio portrait of a fictional adult woman around thirty, an editorial hair stylist, looking directly into the camera with a poised, self-assured expression, mouth closed. Warm medium-tan skin with natural texture. A shoulder-grazing textured shag haircut in deep chocolate brown with soft, parted curtain bangs and piece-y, separated ends, finished like an editorial styling. Defined but natural makeup. She wears a sharply tailored black blazer with narrow lapels over a black fitted top.

- **Acceptance criteria:**
  - The three team portraits read as one session side by side.
  - Shag layers and bangs are plausible on both sides; no mirrored clone pieces.
  - Distinct from the Campaign bob and from every Work subject.
- **Draft Polish alt:** „Portret fikcyjnej stylistki Sofii z cieniowanymi, czekoladowymi włosami do ramion i rozdzieloną grzywką”.

### IMG-WORK-01 — Work / Color in motion

- **Placement:** `#gallery` item 01, `.gallery__item--featured`; replaces `assets/img/gallery/gallery-1.*`. The largest work display.
- **Purpose:** Opens the gallery with "ruch" and color work; the strongest work plate.
- **Subject:** Fictional woman, 25–35. Long, thick, layered hair with dimensional color: deep chestnut root melting into warm caramel and soft honey lengths. Face turned away; only the cheek and jaw contour visible.
- **Camera and composition:** 4:5, medium (just above the crown to mid-back), camera slightly above shoulder height, rear three-quarter view from behind the left shoulder. The hair swings in one coherent arc toward frame-right, leading into the rest of the gallery, and fills x 15–85%, y 10–90%; crown 10–14% from the top.
- **Background:** Deep charcoal with a warm-umber glow behind the hair arc.
- **Lighting:** Warm backlight from behind-left makes the hair edges glow and reveals the color transitions; soft frontal fill keeps the color readable (≈4:1). Energetic but controlled.
- **Styling and props:** Hair in defined, separated ribbons; crown and roots sharp; slight motion blur only at the tips. Black long-sleeved fitted top with a high neck. No props.
- **Color:** Three distinct but blended tones; no stripes or zebra highlights; no orange cast.
- **Master:** 4:5 portrait.
- **Crop and focal points:** Center-anchored slot whose width-to-height ratio varies between ≈0.75 and ≈0.90 (Section 5.3). Keep essentials within x 4–96%, y 6–94%.
- **Card-specific exclusions:** No face toward the camera; no bare back; no wind-machine chaos; no blurred hair mass.
- **Generation description** (append the shared blocks):

> Vertical 4:5 editorial hair photograph about color and movement. A fictional adult woman seen from behind over her left shoulder, mid-turn, her face turned away so only the contour of her cheek and jaw is visible. Long, thick, layered hair with dimensional color — deep chestnut at the root melting into warm caramel and soft honey lengths — swings outward in one coherent arc toward frame-right, forming defined, separated ribbons of hair. The crown and roots are sharp; only the very tips show a slight motion blur. She wears a black long-sleeved fitted top with a high neck. Framed from just above the crown to mid-back, the hair arc filling most of the frame. Warm backlight from behind-left makes the hair edges glow and reveals the color transitions, with a soft frontal fill keeping the color readable. Deep charcoal backdrop with a warm-umber glow.

- **Acceptance criteria:**
  - Reads as movement at 351×439 px and as the dominant image of the gallery.
  - Every strand group connects to the scalp; no floating or duplicated locks.
  - The color melt is believable from root to end.
  - Clearly different from IMG-WORK-05 (motion versus stillness, color versus one tone).
- **Draft Polish caption / alt:** „Kolor w ruchu” / „Długie, falowane włosy w odcieniach kasztanu i karmelu, uchwycone w ruchu”.

### IMG-WORK-02 — Work / Sculptural chignon

- **Placement:** `#gallery` item 02, `.gallery__item--updo` (top-anchored focal point); replaces `assets/img/gallery/gallery-2.*`.
- **Purpose:** Sculptural styling: architecture made of hair.
- **Subject:** Fictional woman, 25–40, fair skin. Smooth, cool-neutral dark ash-blonde hair brushed back into a precise figure-eight chignon at the nape, with polished surfaces and one deliberate fold catching the light.
- **Camera and composition:** 4:5, medium-close, camera at head height, lost profile from behind the right shoulder (cheek contour visible, eye not). Crown 8–12% from the top; knot centered at y 35–50%, x 45–55%; shoulders and garment in the lower third.
- **Background:** Deep charcoal with a subtle warm glow behind the knot.
- **Lighting:** Directional warm key from high left sculpting one continuous highlight along the twist; low fill (≈6:1). Still and sculptural.
- **Styling and props:** No visible pins, clips, accessories, or flowers. Black crepe garment with a clean high back neckline.
- **Color:** The cool-neutral blonde holds its ash tone against the warm light; neither grey nor yellow.
- **Master:** 4:5 portrait.
- **Crop and focal points:** Top-anchored: 4:5 below 600 px, 1:1 at 600–899 px (window y 0–80%), 6:5 from 900 px (window y 0–66.7%). All essential content within y 4–62%.
- **Card-specific exclusions:** No loose or messy bun; no face toward the camera; no hair accessories.
- **Generation description** (append the shared blocks):

> Vertical 4:5 editorial hair photograph of a sculptural low chignon. A fictional adult woman with fair skin seen in lost profile from behind her right shoulder: the back of the head, the nape, and the contour of her cheek are visible, the eye is not. Smooth, cool-neutral dark ash-blonde hair is brushed back and twisted into a precise, architectural figure-eight knot at the nape, with polished surfaces and one deliberate fold catching the light. The knot sits in the upper half of the frame and the crown just below the top edge; her shoulders and a black crepe garment with a clean high back neckline fill the lower third. A directional warm key light from high left sculpts the twist with one continuous highlight; low fill; deep charcoal backdrop with a subtle warm glow. Camera at head height.

- **Acceptance criteria:**
  - The knot construction can be followed: one consistent twist direction and no impossible loops.
  - The complete knot and crown are inside the 6:5 crop.
  - Not confusable with the Campaign profile.
- **Draft Polish caption / alt:** „Rzeźbione upięcie” (the current „Niskie upięcie” also remains accurate) / „Gładkie, ciemnoblond włosy upięte w rzeźbiony, niski kok, widziane od tyłu”.

### IMG-WORK-03 — Work / Short cut detail

- **Placement:** `#gallery` item 03, `.gallery__item--texture` (top-anchored focal point); replaces `assets/img/gallery/gallery-3.*`.
- **Purpose:** The precision of men's cutting: taper and texture.
- **Subject:** Fictional man, 22–32, medium-tan skin. Deep brown-black textured crop: separated matte texture on top, a seamless taper from skin at the nape to longer hair above the ear, and a clean natural neckline. Face turned away; only the jaw edge visible.
- **Camera and composition:** 4:5, close (crown to collar), rear three-quarter view over the right shoulder, slightly above head height. Crown 6–10% from the top; textured top y 10–35%; taper y 35–58%; collar y 60–75%.
- **Background:** Deep charcoal.
- **Lighting:** Raking warm side light from the right reveals the scissor texture and the fade gradient; faint rim on the top texture (≈6:1). Precise and tactile.
- **Styling and props:** Black crew-neck T-shirt. No tools.
- **Color:** Neutral dark brown hair; natural skin at the taper without patchiness.
- **Master:** 4:5 portrait.
- **Crop and focal points:** As IMG-WORK-02: essential content within y 4–62%.
- **Card-specific exclusions:** No shaved designs or razor part lines; no tattoos; no earrings; no clippers; no blotchy fade; no deformed ear.
- **Generation description** (append the shared blocks):

> Vertical 4:5 close-up hair photograph of a short men's haircut. A fictional adult man with medium-tan skin seen from behind at a three-quarter angle over his right shoulder, face turned away so only the edge of the jaw is visible. Deep brown, almost black hair cut into a textured crop: separated, matte texture on top and a seamless, gradual taper from skin at the nape to longer hair above the ear, with a clean, natural neckline. Framed tightly from the crown to the collar of a black crew-neck T-shirt; the textured top and the taper fill the upper two thirds of the frame. Raking warm side light from the right reveals the cut texture and the fade gradient; a faint rim light separates the hair from the deep charcoal backdrop. Crisp focus across the taper.

- **Acceptance criteria:**
  - The taper is a smooth gradient with plausible hair density, readable at 168×209 px.
  - Ear anatomy, hairline, and neckline are correct.
  - The subject does not resemble Leon.
- **Draft Polish caption / alt:** „Krótkie cięcie z teksturą” (unchanged) / „Krótkie męskie cięcie z płynnym cieniowaniem na karku i teksturą na górze”.

### IMG-WORK-04 — Work / Copper color macro

- **Placement:** `#gallery` item 04, `.gallery__item--copper`; replaces `assets/img/gallery/gallery-4.*`.
- **Purpose:** Color work as texture and light; the closest scale in the set.
- **Subject:** One long, glossy lock resting over the shoulder of a black matte garment in a soft S-curve, with a natural melt from deep auburn through bright copper to light copper-gold ends. No face, hands, or skin.
- **Camera and composition:** 4:5 macro; S-curve from upper left to lower right; the lock fills ≈70% of the frame; the brightest gloss band at y 40–55%.
- **Background:** The garment and surroundings in deep charcoal with preserved fabric detail.
- **Lighting:** Soft but directional warm key from upper right creating one continuous highlight; minimal fill. Rich and tactile.
- **Styling and props:** Individual strands, fine flyaways, and real fiber texture; no product residue or glitter.
- **Color:** The most saturated image of the set, still realistic; no neon orange.
- **Master:** 4:5 portrait.
- **Crop and focal points:** Displayed 4:5 at all widths; the S-curve must read at 168×209 px.
- **Card-specific exclusions:** No face, hands, or skin; no plastic shine; no tiled or repeated strand pattern.
- **Generation description** (append the shared blocks):

> Vertical 4:5 macro hair-color photograph. A single long, glossy lock of hair rests over the shoulder of a black matte garment and curves through the frame in a soft S-shape from upper left to lower right. The lock shows a natural color melt from deep auburn through bright copper to light copper-gold at the ends; individual strands, fine flyaways, and real fiber texture are visible. No face and no skin in the frame. A soft but directional warm key light from upper right creates one bright, continuous gloss band across the middle of the lock; the garment and background fall into deep charcoal that keeps fabric detail. Macro perspective with enough depth of field to keep the gloss band sharp.

- **Acceptance criteria:**
  - Strands vary in thickness and direction; no cloned pattern at 100% zoom.
  - Reads as color and texture at thumbnail size; the highlight is not clipped.
  - The variants show no banding or blocking in the dark fabric, including the 480 px variant shown in the lightbox.
- **Draft Polish caption / alt:** „Miedziany refleks” / „Zbliżenie pasma włosów w odcieniach miedzi i złota, ułożonego na ramieniu”.

### IMG-WORK-05 — Work / One-length precision line

- **Placement:** `#gallery` item 05, `.gallery__item--sleek` (focal point `55% 50%`); replaces `assets/img/gallery/gallery-5.*`.
- **Purpose:** Light and precision: one blunt line and glass-like shine.
- **Subject:** Fictional woman, 22–35. Very long, straight, near-black hair with a cool espresso gloss; a centered crown; one smooth sheet ending in a perfectly straight blunt line across the mid-back. No face.
- **Camera and composition:** 4:5, medium, straight-on from behind at shoulder height; symmetrical. Crown 6–10% from the top; cut line at y 80–86%; hair sheet centered (x 25–75%).
- **Background:** Deep charcoal with a warm glow behind the head for separation.
- **Lighting:** Warm overhead key creating a smooth gloss band across the crown and a long vertical highlight down the sheet; low fill. Still and luminous.
- **Styling and props:** Black sleeveless top with a high neckline; shoulders visible at the edges. No accessories.
- **Color:** Near-black with a cool espresso gloss; neither blue nor flat black.
- **Master:** 4:5 portrait.
- **Crop and focal points:** 4:5 below 900 px; 3:4 from 900 px keeps x 3.4–97.2%. Keep the sheet and the cut line within x 6–94%, y 4–92%.
- **Card-specific exclusions:** No face or profile; no waves; no jagged or uneven ends; no bare back; no accessories.
- **Generation description** (append the shared blocks):

> Vertical 4:5 editorial hair photograph of a one-length precision cut seen from directly behind. A fictional adult woman stands with her back to the camera, head upright, shoulders level. Very long, straight, near-black hair with a cool espresso gloss falls from a centered crown in one smooth, glass-like sheet and ends in a perfectly straight, blunt horizontal line across the mid-back. She wears a black sleeveless top with a high neckline; her shoulders show at the edges. Symmetrical composition, framed from just above the crown to just below the cut line. A warm overhead key light places a smooth gloss band across the crown and a long vertical highlight down the hair; a soft warm glow behind the head separates the dark hair from the charcoal backdrop. Straight-on camera at shoulder height.

- **Acceptance criteria:**
  - The cut line is straight and continuous; the sheet keeps a believable strand structure rather than a solid surface.
  - The dark hair separates clearly from the backdrop at 168×209 px.
  - Clearly different from IMG-WORK-01 in stillness, tone, and symmetry.
- **Draft Polish caption / alt:** „Gładkie, ciemne włosy” (accurate; optional refinement „Precyzyjna linia cięcia”) / „Długie, proste, niemal czarne włosy z równą linią cięcia, widziane od tyłu”.

### IMG-WORK-06 — Work / Natural curls

- **Placement:** `#gallery` item 06, `.gallery__item--curls` (1:1, focal point `50% 15%`); replaces `assets/img/gallery/gallery-6.*`.
- **Purpose:** Texture and care: defined, hydrated natural curls.
- **Subject:** Fictional woman, 25–35, deep brown skin. Voluminous natural spiral curls (≈3B–3C) in dark brown with a soft cinnamon tone toward the ends, hydrated and glossy, forming a full rounded silhouette. Three-quarter view, head slightly tilted, eyes lowered past the camera, mouth closed.
- **Camera and composition:** 4:5, medium-close (just above the curls to the upper chest), eye level. Top of the curls 6–10% from the top; face at y 25–55%, slightly off center; curl silhouette within x 10–90%, y 5–75%.
- **Background:** Deep charcoal.
- **Lighting:** Soft warm key from front-left; warm rim from behind-right defining the curl edges; gentle fill (≈4:1). Soft and confident.
- **Styling and props:** Black matte top with a simple wide neckline. No jewelry.
- **Color:** Natural dark brown with subtle warm ends; no dyed copper.
- **Master:** 4:5 portrait.
- **Crop and focal points:** 1:1 at all widths keeps y 3–83%; essential content within y 5–80%. The largest mobile work display after item 01 (351×351 px).
- **Card-specific exclusions:** No direct gaze; no undefined frizz cloud; no cloned curl pattern; no dyed copper.
- **Generation description** (append the shared blocks):

> Vertical 4:5 editorial hair photograph of natural curls. A fictional adult woman with deep brown skin seen in three-quarter view, head slightly tilted, eyes lowered and looking past the camera, mouth closed. Voluminous, well-defined natural spiral curls in dark brown with a soft warm cinnamon tone toward the ends, hydrated and glossy, form a full, rounded silhouette around her head and shoulders. She wears a black matte top with a simple wide neckline. Framed from just above the curls to the upper chest; the curl silhouette fills most of the upper three quarters of the frame, the face slightly off center in the upper half. A soft warm key light from front-left and a warm rim light from behind-right define the curl edges against the deep charcoal backdrop; gentle fill. Eye-level medium-telephoto perspective.

- **Acceptance criteria:**
  - Curl size and pattern vary naturally; curls connect to the scalp; no repeated tiles.
  - Skin tone is accurate and evenly lit, neither muddy nor over-glossy.
  - The curl silhouette and face sit inside the 1:1 crop.
- **Draft Polish caption / alt:** „Naturalne loki” / „Naturalne, zdefiniowane loki o dużej objętości, ujęcie w trzech czwartych”.

### IMG-STUDIO-01 — Studio / Precision cutting

- **Placement:** `#about`, new image; proposed path `assets/img/studio/studio-1.*`. The exact position is decided at integration (Section 5.4).
- **Purpose:** Gives the manifesto („Łączymy rzemiosło z technologią”, „Piękno jako detal”) a visual proof of craft.
- **Subject:** A stylist's hands. The left hand holds a narrow vertical section of the client's dark brown hair between the index and middle fingers; the right holds professional shears in a correct grip (thumb in the thumb ring, ring finger in the finger ring, index finger on the shank) with the blades closing just below the fingers. Short natural nails; black long-sleeved cuffs. The client's head is partly visible and out of focus; no face.
- **Camera and composition:** 3:2 landscape, close process detail, ≈90–100 mm look, slightly above hand height. Hands, shears, and section within x 25–75%, y 20–80%; the cutting point at x 45–55%, y 40–55%; blades and fingers form one diagonal.
- **Background:** Dark charcoal-umber working space with one or two soft, warm out-of-focus highlights from a distant lamp; no identifiable interior.
- **Lighting:** Narrow warm key from upper left on the hands, blades, and hair; deep surroundings (≈8:1). Quiet concentration.
- **Styling and props:** One pair of shears only; no rings, watches, nail art, combs, or products.
- **Color:** Warm-neutral skin; steel blades neutral with a warm highlight; no chrome glare.
- **Master:** 3:2 landscape.
- **Crop and focal points:** Crop-safe core x 6–94%, y 13–87%, so 3:2, 4:3, and 2:1 displays are possible without regeneration.
- **Card-specific exclusions:** No faces or reflections of people; no mirrors; no salon interior; no bottles, labels, or logos; no jewelry; no scissors with incorrect blade, pivot, or ring geometry; no injury.
- **Fallback** (owner approval required; only if the primary concept repeatedly fails hand or tool QA): a 3:2 still life on a dark honed-stone workstation — shears slightly open, a dark carbon cutting comb, two matte black sectioning clips, and a small cut lock of dark brown hair along one diagonal; narrow warm raking light from upper left; no labels or text.
- **Generation description** (append the shared blocks):

> Landscape 3:2 close, process-oriented photograph of hair-cutting craft in a fictional studio. A stylist's hands in the center of the frame: the left hand holds a narrow vertical section of a client's dark brown hair between the index and middle fingers; the right hand holds professional hair-cutting shears in a correct grip — thumb in the thumb ring, ring finger in the finger ring, index finger resting on the shank — with the two blades closing just below the fingers to cut a clean, straight line. Short, natural, unpolished nails; the black cuff of a long-sleeved top at each wrist. The client's head is partly visible at the edge of the frame, softly out of focus, with no face. A narrow warm key light from upper left falls on the hands, the blades, and the hair section; the surroundings fall into a dark charcoal-umber working space with one or two soft, warm out-of-focus highlights from a distant lamp. Shallow depth of field with the cutting point in crisp focus; the hands, shears, and hair section stay within the central area of the frame.

- **Acceptance criteria:**
  - Exactly five fingers per hand with correct joints and nails; a professionally plausible grip.
  - The shears have two blades, one pivot screw, and two rings; the blades meet the hair section, not the fingers.
  - Reads as craft at 351×234 px, without a generic interior or stock look.
  - Remains subordinate to the manifesto heading in the chosen placement (verified at integration).
- **Draft Polish alt:** „Dłonie podczas precyzyjnego cięcia pasma włosów nożyczkami fryzjerskimi”.

## 5. Responsive crop and focal-point strategy

### 5.1 Method

Display sizes are calculated from the current CSS at reference viewports, using `.container { width: min(1120px, 90%) }`, the grid gaps in `css/sections.css`, and single-line gallery captions (≈46 px caption rows). They were not runtime-measured in this task; the 1440 px hero result matches the runtime measurement in `IMPROVEMENTS-DESIGN.md` (653×490). Crop windows are fractions of the master (x from the left, y from the top). Viewports are given in parentheses.

### 5.2 Hero and Team

| Slot and width range | CSS ratio | Calculated display | Crop window on master |
| --- | --- | --- | --- |
| Hero, <600 px | 4:3 | 351×263 (390) | Full frame |
| Hero, 600–1099 px | 3:2 | 691×461 (768); 810×540 (900) | y 2.2–91.1% (`object-position: 50% 20%`) |
| Hero, ≥1100 px | 4:3 | 575×431 (1100); 653×490 (1440) | Full frame |
| Hero, `og:image` | 4:3 file | 1200×900 | Social previews may crop toward ≈1.91:1 around the center (≈ y 15–85%); platform behavior not verified |
| Team, <900 px | 4:5 | 126×158 (390); 192×240 (768) | Full frame |
| Team, ≥900 px | 4:5 | 254×318 (900); 357×447 (1440) | Full frame |

### 5.3 Gallery

| Slot | <600 px | 600–899 px | ≥900 px | Focal point (CSS) | Essential-content zone |
| --- | --- | --- | --- | --- | --- |
| 01 `--featured` | 4:5, full width; 351×439 | Stretched ≈0.85–0.90; ≈456×518 (768); window ≈ y 5–95% | Stretched ≈0.75–0.77; ≈466×625 (900), ≈647×840 (1440); window ≈ x 3–97% | `50% 50%` (default) | x 4–96%, y 6–94% |
| 02 `--updo`, 03 `--texture` | 4:5; 168×209 | 1:1; 220×220 (768); window y 0–80% | 6:5; 328×274 (900), 457×381 (1440); window y 0–66.7% | `50% 0%` | y 4–62% |
| 04 `--copper` | 4:5; 168×209 | 4:5; 220×275 (768) | 4:5; 259×324 (900), 363×453 (1440) | `50% 50%` | Full frame |
| 05 `--sleek` | 4:5; 168×209 | 4:5; 220×275 (768) | 3:4; 259×346 (900), 363×484 (1440); window x 3.4–97.2% | `55% 50%` | x 6–94% |
| 06 `--curls` | 1:1, full width; 351×351; window y 3–83% | 1:1; 220×220 (768) | 1:1; 259×259 (900), 363×363 (1440) | `50% 15%` | y 5–80% |

- The featured slot stretches to the combined height of items 02 and 03, so its ratio depends on caption wrapping; re-check it with the final captions.
- Lightbox (Source, Calculated): the full master is shown with `object-fit: contain` in a `min(720px, 90vw)` × `90dvh` dialog, about 487×609 px at 1440×900. The full 4:5 frame, including the areas cropped in the grid, must be complete and balanced.
- The lightbox reuses the loaded thumbnail candidate. At a device pixel ratio of 1, items 04–06 at 1440 px (363 px) select the 480 px variant, which the lightbox shows at about 487 px; fine detail, especially in IMG-WORK-04, must survive the 480 px variant.

### 5.4 Studio (proposed; no markup exists)

`.about__layout` is one column below 900 px and `3fr 2fr` with a 48 px gap from 900 px (`css/sections.css:79-83`, `1279-1282`). It currently has two children, `.about__manifesto` and `ol.about__values`; every option below adds an element and requires markup and CSS evaluation in the integration task.

| Option | Position | Calculated display | Assessment |
| --- | --- | --- | --- |
| C (recommended) | After the numbered values: below them in the 2fr column from 900 px; at the end of the section below 900 px | 3:2: 351×234 (390), 691×461 (768), 305×203 (900), 429×286 (1440) | Keeps the manifesto heading and intro dominant, places an image between the hero and the stylists, smallest desktop footprint |
| A | In the manifesto column after the intro | 3:2: 457×305 (900), 643×429 (1440); full width below 900 px | Ties the image to the text but sets a large image directly under the heading |
| B | Full-width plate after both columns | 2:1 from 900 px: 810×405 (900), 1120×560 (1440) | Strong interlude before the offer chapter; most likely to compete with the manifesto and the hero |

The 3:2 master and its crop-safe core (x 6–94%, y 13–87%) support all three options. Whichever is chosen, verify at 900, 1100, and 1440 px that the manifesto heading remains the dominant element; if the image competes, reduce its displayed size rather than regenerate it.

### 5.5 CSS review at integration (not part of this brief)

- Hero `object-position: 50% 20%`: keep if the crown sits at 14–18%; re-check at 600–1099 px.
- Gallery `--gallery-focal-point` values (`50% 0%` for 02–03, `55% 50%` for 05, `50% 15%` for 06): keep if the safe zones are honored; change only with crop evidence.
- Featured slot ratio with the final captions.

## 6. Technical asset delivery requirements

### 6.1 Image tiers

| Tier | Purpose | Location | Hero | Team and Work | Studio |
| --- | --- | --- | --- | --- | --- |
| Production original | Highest-quality approved output | Owner archive outside the repository | 4:3; ≥2400×1800 preferred, ≥1600×1200 minimum | 4:5; ≥1600×2000 preferred, ≥1200×1500 minimum | 3:2; ≥2400×1600 preferred, ≥1800×1200 minimum |
| Repository master | Current convention: a PNG original beside its variants, not referenced by pages | `assets/img/<role>/` | PNG 1600×1200 | PNG 1200×1500 | PNG 1800×1200 |
| Delivery variants | Served through `<picture>` | Same directory | 720×540 and 1200×900, AVIF + WebP | 480×600 and 800×1000, AVIF + WebP | 720×480 and 1200×800, AVIF + WebP (proposed, following the hero widths) |

- Exact ratios at every tier; sRGB; 8-bit; no alpha channel; no embedded text or watermark.
- Generate at the highest native resolution available in the target ratio. Upscaling is acceptable only if it invents no hair or skin detail; repeat the hair and anatomy checks at 100% after any upscale.
- Repository masters follow the current convention of masters modestly larger than the largest variant (1448×1086 and 1122×1402 today). Committing larger masters is an owner decision (Section 10.2).
- Variants: strip metadata and check dark gradients for banding and blocking at 1×. The encoder used for the current variants is not recorded in the repository; the integration task selects one without adding project dependencies unless approved.

### 6.2 File names and locations

- Keep the existing names for replaced slots: `hero/hero-editorial[-720|-1200]`, `stylists/stylist-{1–3}[-480|-800]`, and `gallery/gallery-{1–6}[-480|-800]`, with `.png`, `.avif`, and `.webp`. This keeps the `srcset` and preload paths, the `og:image` path on four pages, and the `gallery-1-800.webp` test reference valid; Vite content hashes and the service-worker cache version change automatically.
- Slot mapping: `stylist-1` = IMG-TEAM-01 (Maja), `stylist-2` = IMG-TEAM-02 (Leon), `stylist-3` = IMG-TEAM-03 (Sofia); `gallery-N` = IMG-WORK-0N; `hero-editorial` = IMG-CAMPAIGN-01.
- Studio (proposal): `assets/img/studio/studio-1.png`, `studio-1-720.{avif,webp}`, and `studio-1-1200.{avif,webp}`; the number leaves room for a separately approved second studio image.
- Candidate generations, rejected outputs, and the generation log stay outside the repository.

### 6.3 Contracts to preserve at integration

- `<picture>` with an AVIF `<source>` and a WebP `<img>`; explicit `width`/`height` (hero 1200×900, team and gallery 800×1000, studio 1200×800 as proposed).
- `srcset` and `sizes`: the existing values stay valid for the replaced images because ratios and layouts are unchanged; the studio image needs `sizes` derived from its chosen placement.
- Loading: the hero preload with `imagesrcset`, `imagesizes`, and `fetchpriority="high"` is unchanged; team, gallery, and studio images use `loading="lazy"` (the studio image is below the first viewport).
- Alt text: Polish, describes the visible content, about 100 characters at most; gallery alt text must also work as the visible lightbox caption. Team alt text keeps the „fikcyjnej stylistki / fikcyjnego stylisty” pattern.
- Gallery: six buttons with `data-lightbox`, the `aria-labelledby` naming, and numbered captions; captions stay short noun phrases.
- Lightbox `currentSrc` reuse: no change required if the variants keep their exact dimensions.
- PWA caching: replaced variants stay on the on-demand list automatically. A new `assets/img/studio/` directory does **not** match the current classification (`vite.config.js:63`), so its variants would be precached at service-worker installation unless the integration task extends the classification and the matching `README.md` statements; that change needs its own build verification.
- `og:image`: the new 1200 px WebP hero is used automatically on all four pages.
- Disclosure: the `README.md` AI-image statement (PL and EN) must name the studio directory if one is added.

### 6.4 Weight baseline

Current variant sizes (Source): hero 720 px AVIF 9.8 KB / WebP 14.8 KB and 1200 px AVIF 18.0 KB / WebP 30.7 KB; team 480 px AVIF 5.1–12.1 KB / WebP 8.9–18.7 KB and 800 px AVIF 9.9–22.9 KB / WebP 18.9–38.7 KB; gallery 480 px AVIF 7.7–14.0 KB / WebP 12.5–22.9 KB and 800 px AVIF 14.5–33.3 KB / WebP 26.6–56.7 KB.

Proposed review thresholds (design judgment, not a current contract):

| Variant | AVIF | WebP |
| --- | --- | --- |
| Hero 720 px / 1200 px (LCP candidate) | ≤ 20 KB / ≤ 40 KB | ≤ 30 KB / ≤ 60 KB |
| Team and gallery 480 px / 800 px | ≤ 25 KB / ≤ 50 KB | ≤ 35 KB / ≤ 80 KB |
| Studio 720 px / 1200 px | ≤ 25 KB / ≤ 60 KB | ≤ 40 KB / ≤ 90 KB |

Texture-rich frames (IMG-WORK-04, IMG-WORK-06) may approach the limits; heavy grain inflates file size and should be reduced before quality settings are raised.

## 7. Image generation sequence

### 7.1 Order and anchors

| Step | Images | Role in the sequence | Gate |
| --- | --- | --- | --- |
| 0 | — | Owner approves this brief and the decisions in Section 10.2 | G0 |
| 1 | IMG-CAMPAIGN-01 | **House-look reference:** fixes backdrop tonality, key warmth, grade, grain, and the realism bar for the whole collection | G1 |
| 2 | IMG-TEAM-01 | Team anchor: framing, eye height, light, catchlights, and backdrop | G2a |
| 3 | IMG-TEAM-02, IMG-TEAM-03 | Matched to TEAM-01; reviewed as a set of three | G2b |
| 4 | IMG-WORK-01 | Work anchor: backdrop depth and hair-detail standard | G3a |
| 5 | IMG-WORK-02 – IMG-WORK-06 | Produced against WORK-01; reviewed in slot crops and as a gallery | G3b |
| 6 | IMG-STUDIO-01 | Produced against the complete look; fallback only after documented failure | G4 |
| 7 | All 11 | Collection review and repository masters | G5 |

The Campaign image is the reference because it is the most visible photograph (first viewport, LCP candidate, `og:image`) and carries the owner's key decision; its stronger contrast is a role difference, not a separate grade. Team and Work each receive an anchor because their registers differ from the campaign.

### 7.2 Working method

- Per card, generate a small batch of candidates (for example 4–8), shortlist two, and refine one. Approve each image individually, then re-check it against the approved images of its role.
- After G1, the approved campaign may serve as a lighting and grade reference where the tool supports it. Never use a face from one image as a reference for another subject, never use the current ten images, and never use photographs of real people.
- Retouching is limited to exposure and grade matching, cropping to the exact ratio, and removing small defects. Do not composite faces, transplant hair, or add text.
- Keep a generation log outside the repository for every approved image: tool and model version, full prompt, settings or seed where available, references used, date, and retouching. It supports reproducibility and the AI disclosure.
- If a card repeatedly fails the same criterion, record the failure and propose a variation (or the approved fallback for IMG-STUDIO-01) to the owner instead of relaxing the criterion.

## 8. Quality assurance and acceptance checklist

### 8.1 Per image

**Technical**

- [ ] Exact ratio (4:3, 4:5, or 3:2) and at least the minimum production-original size.
- [ ] sRGB and no alpha; no text, logo, watermark, signature, or border at 100% zoom.
- [ ] No clipped skin highlights; backdrop never crushed to pure black; no banding in dark gradients.

**Anatomy and realism**

- [ ] Hands, where present: five fingers, correct joints and nails, plausible grip.
- [ ] Faces, where present: matching eyes and catchlights, natural ears, closed mouth, visible skin texture, no doll-like symmetry.
- [ ] Neck, shoulders, and garments plausible; seams, lapels, and necklines consistent.
- [ ] Tools (IMG-STUDIO-01): two blades, one pivot, two rings.

**Hair**

- [ ] Hairline, parting, and root direction plausible; all hair connects to the scalp.
- [ ] Ends match the concept (blunt, tapered, or curled); no melted or smeared tips.
- [ ] No cloned, tiled, or mirrored strands or curls; natural flyaways.
- [ ] Color transitions plausible from root to end.

**Light and grade**

- [ ] One dominant key direction as specified on the card; shadows agree with it.
- [ ] Grade matches the house look in white balance, black level, saturation, and grain.

**Crop and size**

- [ ] Section 5 crop windows overlaid on the master; essential content inside the safe zone in every range.
- [ ] Legible at the smallest calculated display: hero 351×263, team 126×158, gallery 168×209, studio 351×234.
- [ ] Full frame balanced for the lightbox (gallery) or the chosen display (studio).

### 8.2 Collection level

- [ ] On a contact sheet of all 11 at equal size, a reviewer sorts the images into Campaign, Team, Work, and Studio without captions.
- [ ] Same-face check across the Campaign, Team, IMG-WORK-02, and IMG-WORK-06 subjects: no shared facial structure.
- [ ] The Campaign subject cannot be mistaken for a stylist; no Work subject resembles a stylist.
- [ ] The three team portraits match in framing, eye height, light, and backdrop.
- [ ] Work set: four scales, six hair archetypes, and no direct gaze.
- [ ] Consistent warmth, black level, and grain across all roles.
- [ ] No off-shoulder drapery and no repeated wardrobe silhouette within a role.

### 8.3 Theme review

- [ ] Each image viewed at its calculated display sizes on `#0b0b0e` and `#141418` (dark) and on `#f5f1ec` and `#ffffff` (light).
- [ ] Dark theme: frames read as deliberate tonal plates, neither holes nor glowing boxes.
- [ ] Light theme: hero and team frames read as complete prints with intentional edges; results recorded for IMP-DESIGN-V2-03.
- [ ] Gallery set viewed on a dark band (the expected V2-03 darkroom) and on ivory.

### 8.4 Approval gates

| Gate | Reviewed | Outcome |
| --- | --- | --- |
| G0 | This brief and the Section 10.2 decisions | Production may start |
| G1 | IMG-CAMPAIGN-01 | House look locked |
| G2a / G2b | IMG-TEAM-01, then the team set | Team series locked |
| G3a / G3b | IMG-WORK-01, then the gallery in slot crops and lightbox frames | Work set locked |
| G4 | IMG-STUDIO-01 with placement crops | Studio image locked |
| G5 | Full collection, theme review, repository masters | Owner authorizes the integration task |

All gates are owner approvals. No asset enters the repository before G5.

## 9. Future integration dependencies

This brief is the deliverable of the first slice of IMP-DESIGN-V2-02; the improvement remains `Proposed`. The remaining slices are production and approval, placement with Polish alt text, and visual review.

### 9.1 Integration task

- Replace masters and variants in place; update the alt text of the hero, the three stylists, and the six gallery items; update the gallery captions marked for change in Section 3.4.
- Review the hero `object-position`, the gallery focal points, and the featured slot ratio against the final images (Section 5.5).
- Add the studio `<picture>` to About in the chosen position, with `width`/`height`, `sizes`, `loading="lazy"`, and Polish alt text; decide whether `assets/img/studio/` joins the on-demand classification in `vite.config.js`, and update `README.md` accordingly.
- Update the README AI-image disclosure (PL and EN) if a studio directory is added; record a changelog entry only when authorized, following `docs/CHANGELOG.md`.
- Decide whether to re-capture the PWA screenshots in `public/assets/screenshots/pwa/`, which show the current photography; `npm run test:manifest` covers their contract.
- Verification, following `IMPROVEMENTS-DESIGN.md` Section 8: `npm run build` (on-demand cache list), `npm run test:interactions` (six images, AVIF `currentSrc`, lightbox), `git diff --check`, crop review at every `sizes` breakpoint in both themes, and an alt-text review; `npm run test:manifest` if the screenshots change.

### 9.2 Relationship to IMP-DESIGN-V2-03

IMP-DESIGN-V2-03 (darkroom band for the gallery, printed-plate treatment for the hero and team images) is defined around the photography and must be re-reviewed if IMP-DESIGN-V2-02 changes the images. This brief prepares for it — graphite edges for the hero and team, darker Work backdrops intended for a dark band — but does not implement it. Recommended order: approve the collection (G5) before the final visual acceptance of V2-03; if V2-03 is implemented first, re-review it with the new images. Whether the plate treatment also applies to the studio image is a V2-03 decision.

### 9.3 Other improvements

- IMP-DESIGN-V2-01 (completed): the studio image must not change section tiers, bands, or the standard tier of About.
- IMP-DESIGN-V2-05: draft captions that contain single-letter words („Kolor w ruchu”, „Krótkie cięcie z teksturą”) need its non-breaking binding.
- IMP-DESIGN-V2-06: the monogram closing is the planned final brand moment; the optional closing photograph in Section 10.4 would have to be reconciled with it.

## 10. Owner decisions and approval status

### 10.1 Approved

| Decision | Status |
| --- | --- |
| Entirely new collection instead of a selective replacement | Approved by the owner |
| Fixed primary count of 11 (1 Campaign, 3 Team, 6 Work, 1 Studio) | Approved by the owner |
| New hero without embedded lettering | Approved by the owner |
| Chaptered Noir direction; IMP-DESIGN-V2-01 completed | Approved; completed |

### 10.2 Required before image generation (G0)

| # | Decision | Recommendation | Status |
| --- | --- | --- | --- |
| 1 | Adopt this brief as the production specification | Approve | Pending |
| 2 | Campaign concept: espresso precision bob in near profile | Approve | Pending |
| 3 | Team appearances: Maja honey-blonde lob, Leon salt-and-pepper taper and beard, Sofia chocolate shag (names and roles unchanged; visual descriptions and alt text change) | Approve | Pending |
| 4 | Work concepts and slot mapping (Section 3.4); captions finalized at integration | Approve | Pending |
| 5 | Studio concept (precision cutting) and the still-life fallback | Approve both | Pending |
| 6 | Image-generation tool (the brief is provider-independent) | Owner choice | Pending |
| 7 | Asset policy: production originals archived outside the repository, repository masters at the Section 6.1 sizes, generation log outside the repository | Approve | Pending |

### 10.3 Decided at integration

| # | Decision | Recommendation | Status |
| --- | --- | --- | --- |
| 8 | Studio placement in About | Option C, verified at 900–1440 px | Pending |
| 9 | Studio variant widths 720/1200 and on-demand caching for `assets/img/studio/` | Approve with build verification | Pending |
| 10 | README AI-disclosure update for the studio image | Approve | Pending |
| 11 | Re-capture of the PWA manifest screenshots | Recommended after integration | Pending |
| 12 | Final Polish captions and alt text | Start from the Section 4 drafts | Pending |

### 10.4 Optional concept (not authorized; outside the count of 11)

A closing atmosphere photograph — for example, the workstation at the end of the day, closed shears and a folded cape in a single pool of warm light — could anchor the closing band. It overlaps in role with the monogram closing proposed in IMP-DESIGN-V2-06 and would add page weight near the final CTA. It requires a separate owner decision, its own shot card, and evaluation against V2-06; it is not part of this production.
