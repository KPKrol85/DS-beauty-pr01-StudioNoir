# Third-Party Notices

This file is an attribution index for third-party materials redistributed with Studio Noir and third-party names and marks used in the project. It does not replace, modify, or extend any upstream license; each listed material remains subject to its own applicable terms, and the referenced license text is authoritative.

Studio Noir itself is covered by the [KP_CODE Proprietary Project License](LICENSE.md). Section 8 of that license excludes third-party materials from its scope.

**Zakres (PL):** Niniejszy plik jest indeksem atrybucji materiałów podmiotów trzecich dołączonych do projektu Studio Noir oraz wykorzystywanych nazw i znaków podmiotów trzecich. Nie zastępuje ani nie zmienia ich licencji, a [Własnościowa Licencja Projektu KP_CODE](LICENSE.md), zgodnie z sekcją 8, nie obejmuje tych materiałów. Indeks nie obejmuje zależności developerskich instalowanych przez npm.

## Fonts

Both font families are self-hosted as variable WOFF2 files and declared in [`css/base.css`](css/base.css). Their source versions, redistribution details, and applicable licenses are documented below.

### Inter

- **File:** [`assets/fonts/inter-variable.woff2`](assets/fonts/inter-variable.woff2)
- **Version:** Inter 4.001
- **Upstream:** [github.com/rsms/inter — v4.1](https://github.com/rsms/inter/tree/v4.1/docs/font-files)
- **Distribution:** Unmodified `InterVariable.woff2` from the author's v4.1 release
- **Copyright:** Copyright (c) 2016 The Inter Project Authors
- **License:** SIL Open Font License, Version 1.1
- **License text:** [`public/font-licenses/inter-OFL.txt`](public/font-licenses/inter-OFL.txt)

### Playfair Display

- **File:** [`assets/fonts/playfair-display-variable.woff2`](assets/fonts/playfair-display-variable.woff2)
- **Version:** Playfair Display 1.203
- **Upstream:** [google/fonts — Playfair Display](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/playfairdisplay)
- **Distribution:** Original TTF converted to WOFF2 without subsetting or changes to glyphs, metrics, or font names
- **Copyright:** Copyright 2017 The Playfair Display Project Authors, with Reserved Font Name "Playfair Display"
- **License:** SIL Open Font License, Version 1.1
- **License text:** [`public/font-licenses/playfair-display-OFL.txt`](public/font-licenses/playfair-display-OFL.txt)

The font license files are stored in `public/font-licenses/` and copied to `dist/font-licenses/` during the production build.

## Third-party names and marks

The Studio Noir footer contains illustrative Instagram, Facebook, GitHub, and X icons. They are rendered from the SVG files listed below, applied as CSS alpha masks in [`css/sections.css`](css/sections.css) and drawn in the footer text color.

These names and logos are trademarks of their respective owners and are used solely to identify the corresponding services. No affiliation, sponsorship, or endorsement is implied.

The social-media graphics are currently non-interactive examples. The upstream source and license of the SVG artwork have not been verified, and this index does not establish either.

- **Instagram:** [`assets/icons/instagram.svg`](assets/icons/instagram.svg) — name and visual identity associated with Meta Platforms
- **Facebook:** [`assets/icons/facebook.svg`](assets/icons/facebook.svg) — name and visual identity associated with Meta Platforms
- **GitHub:** [`assets/icons/github.svg`](assets/icons/github.svg) — name and visual identity associated with GitHub, Inc.
- **X:** [`assets/icons/X.svg`](assets/icons/X.svg) — name and visual identity associated with X Corp.; the X glyph is cut out of the circular background as a single shape so the mark remains legible as a mask
- **Implementation:** Non-interactive `role="img"` elements with accessible names in the footer of the home and legal pages

The applicable trademark rights remain with their respective owners.
