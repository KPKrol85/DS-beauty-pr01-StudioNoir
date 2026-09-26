# Studio Noir — Hair & Style Atelier

Premium, single-page experience dla luksusowego studia fryzjerskiego. Projekt w duchu editorial: dużo whitespace, wysublimowana typografia, subtelne animacje i pełna dostępność.

## Struktura

```
/
  index.html
  privacy.html
  terms.html
  cookies.html
  offline.html
  404.html
  service-worker.js
  vite.config.js
  netlify.toml
  /public/
    robots.txt
    sitemap.xml
    _redirects
    manifest.webmanifest
    /assets/icons/favicon.svg
  /assets/
    /img/
    /fonts/
  /css/
    tokens.css
    base.css
    layout.css
    components.css
    sections.css
    style.css
  /js/
    main.js
    reveal.js
    header.js
    nav.js
    lightbox.js
    booking.js
    theme.js
    mobile-cta.js
    config.js
  package.json
  package-lock.json
  README.md
  /dist/                 # wynik buildu, poza Git
```

## Development i build

Wymagany Node.js 20.19+ w linii 20 lub 22.12+ (zgodnie z `engines` w `package.json`).

```bash
npm ci
npm run dev       # Vite, domyślnie http://localhost:5173
npm run build     # produkcyjny build wszystkich sześciu stron do dist/
npm run preview   # podgląd dist/, domyślnie http://localhost:4173
```

Źródła to dokumenty HTML w katalogu głównym, moduły `css/` i `js/` oraz obrazy
i fonty w `assets/`. HTML ładuje bezpośrednio `css/style.css` i `js/main.js`.
Vite rozwija importy CSS, bundluje moduły JS, minifikuje CSS/JS i przepisuje adresy
obrazów oraz fontów na pliki z hashem w `dist/assets/`. Nie generujemy zasobów
w katalogach źródłowych ani nie edytujemy `dist/` ręcznie.

`public/` zawiera pojedyncze źródła plików wymagających stałych adresów (manifest,
ikona, robots, sitemap i reguły Netlify); Vite kopiuje je bez przetwarzania do `dist/`.
`dist/` zawiera sześć stron HTML, `assets/`, `service-worker.js` oraz pliki z `public/`.
Wszystkie adresy zakładają publikację w katalogu głównym domeny, bez `/studio-noir/`.

## Publikacja ręczna

Po buildzie zawartość `dist/` można opublikować przez Netlify CLI:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

Polecenie publikacji uruchamia właściciel projektu po uwierzytelnieniu i wyborze
właściwej witryny. `netlify.toml` wskazuje `dist` jako katalog publikacji;
repozytorium nie konfiguruje automatycznego wdrażania przez GitHub.
Reguła w `public/_redirects` zachowuje istniejące pliki, a brakujące adresy zwracają
własną stronę `404.html` ze statusem 404. `vite preview` nie emuluje reguł Netlify:
stronę błędu można obejrzeć pod `/404.html`, a nieznane adresy zwracają lokalne 404.

## A11y

- Skip link i semantyczne landmarki.
- Focus-visible i pełna obsługa klawiatury.
- Obsługa prefers-reduced-motion.

## PWA

- Manifest i service worker działają w zakresie `/`. Rejestracja workera odbywa się
  tylko w buildzie produkcyjnym (także w `npm run preview`), nie w `npm run dev`.
- Vite bundluje i minifikuje źródło `service-worker.js`. Lokalny plugin w
  `vite.config.js` wstawia listę końcowych stron i zasobów oraz wersję cache wyliczoną
  z ich zawartości i kodu workera. Nie wymaga to dodatkowego frameworka PWA.
- Po udanej instalacji cache przechowuje wszystkie strony, CSS, JS, obrazy, fonty,
  manifest i ikonę. Nawigacja korzysta najpierw z sieci; offline zwraca zachowaną
  stronę lub `offline.html` dla nieznanego adresu. Zasoby z listy korzystają z cache.
  Aktywacja usuwa wyłącznie poprzednie cache z prefiksem `studio-noir-`.
- Do pracy używaj portu dev, a do sprawdzania offline osobnego portu preview.
  Jeżeli wcześniej zarejestrowano worker na tym samym lokalnym adresie i porcie,
  wyrejestruj go w narzędziach przeglądarki i odśwież stronę przed pracą w dev.

## Notatka o fontach

W środowisku bez dostępu do zewnętrznej sieci użyto placeholderów `.woff2`. Zastąp je docelowymi fontami (np. Playfair Display i Manrope) przed wdrożeniem produkcyjnym.
