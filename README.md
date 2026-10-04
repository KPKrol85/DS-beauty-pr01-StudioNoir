# Studio Noir

## PL

### Przegląd projektu

Studio Noir — Hair & Style Atelier to statyczna, polskojęzyczna strona internetowa studia fryzjerskiego, przygotowana w ramach KP_Code Digital Studio. Strona główna (`index.html`) ma układ jednostronicowy z nawigacją kotwicową: hero, O studio, Usługi, Cennik, Styliści, Galeria, Rezerwacja, Opinie, Lokalizacja i końcowe CTA. Uzupełniają ją strony polityki prywatności, regulaminu, polityki cookies, strona offline oraz strona 404.

Projekt jest budowany przez Vite jako aplikacja wielostronicowa (MPA). Kod działający w przeglądarce to HTML, CSS i moduły JavaScript bez frameworków i bez zależności runtime.

Aktualny zakres:

- rezerwacja działa wyłącznie po stronie przeglądarki — potwierdzenie zmienia jedynie status w interfejsie, dane nie są nigdzie wysyłane ani zapisywane;
- grafiki w `assets/img/` to zastępcze ilustracje SVG;
- `privacy.html`, `terms.html` i `cookies.html` zawierają szablonową treść z polami do uzupełnienia (np. `[Nazwa firmy]`, `[Adres]`, `[E-mail kontaktowy]`).

### Kluczowe funkcje

- Nawigacja kotwicowa z oznaczaniem aktywnej sekcji (`IntersectionObserver`, `aria-current`) i stanem nagłówka po przewinięciu — `js/header.js`.
- Menu mobilne (poniżej 900 px) w panelu dialogowym z pułapką fokusu, zamykaniem klawiszem Escape i blokadą przewijania strony — `js/nav.js`.
- Galeria z podglądem zdjęć w lightboxie — `js/lightbox.js`.
- Trzyetapowy widżet rezerwacji (usługa, stylista, potwierdzenie) z podsumowaniem wyboru — `js/booking.js` — oraz alternatywne kanały kontaktu (telefon, Instagram, e-mail) i komunikat `<noscript>`.
- Przełącznik motywu ciemnego i jasnego z zapamiętaniem wyboru — `js/theme.js`.
- Poniżej 768 px: stały pasek szybkiego kontaktu u dołu ekranu oraz kompaktowy przycisk „Umów wizytę” w nagłówku, widoczny po opuszczeniu sekcji hero.
- Linki oznaczone `data-instagram-link` próbują otworzyć aplikację Instagram (`instagram://`), a jeśli strona pozostaje widoczna po 900 ms, przechodzą do wiadomości przez `ig.me` — `js/mobile-cta.js`, konfiguracja w `js/config.js`.
- Animacje pojawiania się sekcji — `js/reveal.js`.
- Własna strona 404 oraz strona offline serwowana przez service worker.

### Stack technologiczny

- **Runtime:** HTML, CSS z natywnymi custom properties (bez preprocesora), moduły ES JavaScript bez bibliotek.
- **Fonty:** lokalne pliki WOFF2 zadeklarowane w `css/base.css` jako Playfair Display i Inter (grubości 400–700).
- **Build:** Vite `^8.3.1` (8.3.1 w `package-lock.json`) — zależność deweloperska (`devDependencies`); wejścia buildu konfigurowane przez `build.rolldownOptions`.
- **Testy:** Playwright — `@playwright/test` `^1.63.0` (1.63.0 w `package-lock.json`), zależność deweloperska używana przez skoncentrowany test regresji przeglądarkowej nawigacji.
- **Środowisko:** Node.js `^20.19.0 || >=22.12.0` (`engines` w `package.json`), npm (`package-lock.json`).
- **Wdrożenie:** konfiguracja Netlify (`netlify.toml`, `public/_redirects`).

### Architektura

- **Kanoniczne źródła:** dokumenty HTML w katalogu głównym, `css/`, `js/`, `assets/`, `public/` oraz `service-worker.js`. HTML odwołuje się bezpośrednio do `/css/style.css` i `/js/main.js`.
- **JavaScript:** `js/main.js` to jedyny punkt wejścia, ładowany przez stronę główną i strony prawne. Importuje moduły funkcjonalne i po załadowaniu DOM wywołuje ich funkcje `init*`. Moduły wyszukują swoje elementy przez atrybuty `data-*` i kończą działanie, gdy ich nie znajdą, dzięki czemu ten sam skrypt obsługuje wszystkie strony. `offline.html` i `404.html` ładują wyłącznie CSS.
- **CSS:** `css/style.css` importuje warstwy w kolejności `tokens.css` → `base.css` → `layout.css` → `components.css` → `sections.css`. Motyw jasny nadpisuje tokeny kolorów w klasie `.theme--light`.
- **Build:** `vite.config.js` ustawia `appType: "mpa"`, `base: "/"` i siedem wejść: sześć stron HTML oraz `service-worker.js`. Lokalny plugin `studio-noir-precache` uzupełnia service worker o listę precache i wersję cache.
- **Pliki o stałych adresach:** `public/` zawiera manifest, ikonę, `robots.txt`, `sitemap.xml` i `_redirects`; Vite kopiuje je do `dist/` bez przetwarzania.

### Struktura projektu

```text
.
├── index.html              # strona główna (układ jednostronicowy)
├── privacy.html            # polityka prywatności (szablon)
├── terms.html              # regulamin (szablon)
├── cookies.html            # polityka cookies (szablon)
├── offline.html            # strona zastępcza offline
├── 404.html                # strona błędu 404
├── service-worker.js       # źródło service workera
├── assets/
│   ├── fonts/              # fonty WOFF2
│   └── img/                # ilustracje SVG
├── css/
│   ├── style.css           # punkt wejścia CSS (@import warstw)
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── sections.css
├── js/
│   ├── main.js             # punkt wejścia JS, rejestracja service workera
│   ├── config.js
│   ├── header.js
│   ├── nav.js
│   ├── reveal.js
│   ├── lightbox.js
│   ├── booking.js
│   ├── theme.js
│   └── mobile-cta.js
├── public/
│   ├── _redirects
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   └── assets/icons/favicon.svg
├── tests/
│   └── nav.spec.js         # test regresji przeglądarkowej nawigacji
├── vite.config.js
├── playwright.config.js    # konfiguracja Playwright (Chromium, serwer Vite dev)
├── netlify.toml
├── package.json
├── package-lock.json
├── CHANGELOG.md
└── README.md
```

Katalog `dist/` powstaje podczas buildu i jest wykluczony z Git w `.gitignore`.

### Instalacja

Wymagany jest Node.js `^20.19.0 || >=22.12.0` oraz npm. Zależności instaluje się zgodnie z `package-lock.json`:

```bash
npm ci
```

### Development lokalny

```bash
npm run dev       # vite — serwer deweloperski, domyślnie http://localhost:5173
npm run build     # vite build — build produkcyjny do dist/
npm run preview   # vite preview — podgląd dist/, domyślnie http://localhost:4173
npm run test:nav  # playwright test — test regresji przeglądarkowej wspólnego kontraktu nawigacji
```

- Porty nie są ustawione w `vite.config.js`; podane wartości to domyślne ustawienia Vite.
- `npm run test:nav` sam uruchamia serwer Vite dev na porcie 5183 i wymaga przeglądarki Chromium dla Playwright (`npx playwright install chromium`).
- Strony korzystają ze ścieżek absolutnych i modułów ES, dlatego wymagają serwera HTTP — nie należy otwierać plików HTML bezpośrednio z dysku.
- Service worker jest rejestrowany tylko w buildzie produkcyjnym (`import.meta.env.PROD` w `js/main.js`), a więc w `npm run preview`, ale nie w `npm run dev`.
- Zachowanie offline sprawdza się w podglądzie. Jeżeli wcześniej zarejestrowano worker pod tym samym adresem i portem, należy go wyrejestrować w narzędziach deweloperskich przeglądarki i odświeżyć stronę.

### Build produkcyjny

`npm run build` tworzy w `dist/`:

- sześć stron HTML;
- katalog `assets/` z zminifikowanym JS i CSS oraz obrazami i fontami z hashem w nazwie pliku (`assetsInlineLimit: 0` wyłącza osadzanie zasobów w kodzie);
- `service-worker.js` w katalogu głównym, bez hasha w nazwie, z wstrzykniętą listą precache i wersją cache;
- niezmienione kopie plików z `public/`.

Wszystkie adresy zakładają publikację w katalogu głównym domeny (`base: "/"`). Zawartość `dist/` jest generowana i nie jest edytowana ręcznie.

### Wdrożenie

Repozytorium zawiera konfigurację Netlify:

- `netlify.toml` — polecenie buildu `npm run build`, katalog publikacji `dist` oraz nagłówek `Cache-Control: no-cache` dla `/service-worker.js`;
- `public/_redirects` — reguła `/* /404.html 404`: istniejące pliki mają pierwszeństwo, a brakujące adresy zwracają `404.html` ze statusem 404.

Po wykonaniu `npm run build` zawartość `dist/` można opublikować ręcznie przez Netlify CLI. Narzędzie nie jest zależnością projektu (`npx` pobiera je przy uruchomieniu), a publikacja wymaga uwierzytelnienia i wyboru właściwej witryny:

```bash
npx netlify deploy --prod --dir=dist
```

Repozytorium nie zawiera workflow CI/CD, a sama konfiguracja nie potwierdza aktywnego wdrożenia. `vite preview` nie interpretuje reguł z `_redirects`, dlatego lokalnie stronę błędu można obejrzeć pod `/404.html`.

### Dostępność

- Atrybut `lang="pl"`, skip link „Przejdź do treści” prowadzący do `#main` oraz landmarki `header`, `nav` (z etykietami), `main` i `footer` na stronie głównej i stronach prawnych.
- Globalny styl `:focus-visible` z wyraźnym obrysem.
- Menu mobilne: przycisk z `aria-expanded` i `aria-controls`, synchronizacja `aria-hidden` panelu, przeniesienie fokusu do panelu i z powrotem do przycisku, pułapka fokusu dla Tab i Shift+Tab, zamykanie klawiszem Escape oraz `inert` na treści głównej w widoku mobilnym.
- Lightbox: elementy galerii to natywne przyciski, okno ma `role="dialog"` i `aria-modal="true"`, fokus trafia na przycisk zamknięcia, pozostaje w oknie i wraca do elementu wywołującego; Escape zamyka podgląd.
- Podsumowanie rezerwacji jest regionem `aria-live="polite"`, a przycisk potwierdzenia pozostaje wyłączony do czasu wyboru usługi i stylisty.
- Obrazy treściowe mają teksty alternatywne, a dekoracyjna nakładka hero jest ukryta przed technologiami asystującymi (`aria-hidden="true"`).
- Przy `prefers-reduced-motion: reduce` CSS wyłącza płynne przewijanie i skraca animacje oraz przejścia, a `js/reveal.js` pomija animacje pojawiania się.

### SEO

- Strona główna i strony prawne mają własne `<title>`, `meta description` oraz metadane Open Graph i Twitter Card.
- `link rel="canonical"` i `og:url` wskazują adresy w domenie `https://ds-fashion-pr01-studionoir.netlify.app/`.
- `public/robots.txt` zezwala na indeksowanie całej witryny i wskazuje mapę strony; `public/sitemap.xml` zawiera wyłącznie adres strony głównej.
- `robots.txt` i `sitemap.xml` używają domeny `https://ds-fashion-pr01-studionoir.netlify.app/`, zgodnej z domeną w adresach canonical.

### PWA i obsługa offline

- `public/manifest.webmanifest` definiuje `start_url` i `scope` jako `/`, `display: "standalone"`, kolory motywu oraz jedną ikonę SVG (64×64). Manifest jest podpięty na stronie głównej i stronach prawnych.
- `js/main.js` rejestruje `/service-worker.js` po zdarzeniu `load`, wyłącznie w buildzie produkcyjnym.
- Podczas buildu plugin `studio-noir-precache` zastępuje w workerze znaczniki `__STUDIO_NOIR_PRECACHE__` i `__STUDIO_NOIR_CACHE_VERSION__`. Lista precache obejmuje wszystkie pliki wyjściowe buildu oraz pliki z `public/` z wyjątkiem nazw zaczynających się od `_`. Wersja cache to fragment skrótu SHA-256 z kodu workera oraz nazw i zawartości tych plików. Brak znaczników przerywa build błędem.
- Instalacja zapisuje zasoby w cache `studio-noir-<wersja>` i wywołuje `skipWaiting()`; aktywacja usuwa wyłącznie starsze cache z prefiksem `studio-noir-` i przejmuje otwarte karty (`clients.claim()`).
- Nawigacja korzysta najpierw z sieci. Bez połączenia worker zwraca zapisaną stronę (również dla adresów bez rozszerzenia, np. `/privacy`) lub `offline.html`.
- Zasoby z listy precache są serwowane z cache, a w razie braku wpisu — z sieci. Żądania spoza listy i do innych domen nie są przechwytywane.

### Wydajność

- Brak bibliotek i frameworków w kodzie uruchamianym w przeglądarce.
- Fonty hostowane lokalnie z `font-display: swap`; strona główna i strony prawne wstępnie ładują pięć plików fontów (`rel="preload"`).
- Obraz hero na stronie głównej jest wstępnie ładowany i ma `fetchpriority="high"`.
- Obrazy stylistów i galerii mają `loading="lazy"` oraz jawne atrybuty `width` i `height`.
- Build Vite minifikuje CSS i JS oraz nadaje zasobom w `dist/assets/` nazwy z hashem.

### Dane i trwałość stanu

- Treści (usługi, cennik, styliści, opinie, dane kontaktowe) są statycznym markupem HTML. Projekt nie korzysta z API, backendu ani bazy danych.
- Wybrany motyw jest zapisywany w `localStorage` pod kluczem `studio-noir-theme`; bez zapisanej wartości motyw wynika z `prefers-color-scheme`.
- Stan widżetu rezerwacji istnieje tylko w pamięci strony i znika po jej przeładowaniu.
- Service worker przechowuje zasoby precache w Cache Storage przeglądarki.

### Utrzymanie projektu

- Zmiany wprowadza się w źródłach: HTML w katalogu głównym, `css/`, `js/`, `assets/`, `public/` i `service-worker.js`. Katalog `dist/` jest wyłącznie wynikiem buildu.
- Nagłówek i stopka są powielone w `index.html`, `privacy.html`, `terms.html` i `cookies.html` — zmiany nawigacji lub stopki trzeba nanieść w każdym z tych plików.
- Nowa strona HTML wymaga dodania wejścia w `build.rolldownOptions.input` w `vite.config.js`. Nowe strony i nowe pliki w `public/` trafiają do listy precache automatycznie.
- Wersji cache nie zmienia się ręcznie; znaczniki `__STUDIO_NOIR_PRECACHE__` i `__STUDIO_NOIR_CACHE_VERSION__` muszą pozostać w `service-worker.js`.
- Uchwyt konta Instagram używany przez linki `data-instagram-link` jest zdefiniowany w `js/config.js`.
- Historia zmian jest prowadzona w [CHANGELOG.md](CHANGELOG.md).

## EN

### Project Overview

Studio Noir — Hair & Style Atelier is a static, Polish-language website for a hair studio, created within KP_Code Digital Studio. The home page (`index.html`) uses a one-page layout with anchor navigation: hero, about, services, pricing, stylists, gallery, booking, testimonials, location, and a closing call to action. It is complemented by privacy policy, terms, and cookie policy pages, an offline page, and a 404 page.

The project is built with Vite as a multi-page application (MPA). The browser-side code consists of HTML, CSS, and JavaScript modules without frameworks or runtime dependencies.

Current scope:

- booking runs entirely in the browser — confirmation only changes the status shown in the interface; no data is sent or stored anywhere;
- the graphics in `assets/img/` are placeholder SVG illustrations;
- `privacy.html`, `terms.html`, and `cookies.html` contain template content with fields to be completed (e.g. `[Nazwa firmy]`, `[Adres]`, `[E-mail kontaktowy]`).

### Key Features

- Anchor navigation with active-section highlighting (`IntersectionObserver`, `aria-current`) and a scrolled header state — `js/header.js`.
- Mobile menu (below 900 px) in a dialog panel with a focus trap, Escape-key closing, and page scroll locking — `js/nav.js`.
- Gallery with a lightbox image preview — `js/lightbox.js`.
- Three-step booking widget (service, stylist, confirmation) with a selection summary — `js/booking.js` — plus alternative contact channels (phone, Instagram, email) and a `<noscript>` message.
- Dark and light theme toggle with a remembered preference — `js/theme.js`.
- Below 768 px: a fixed quick-contact bar at the bottom of the screen and a compact "Umów wizytę" header button that appears once the hero section leaves the viewport.
- Links marked with `data-instagram-link` attempt to open the Instagram app (`instagram://`) and, if the page is still visible after 900 ms, fall back to direct messaging via `ig.me` — `js/mobile-cta.js`, configured in `js/config.js`.
- Section reveal animations — `js/reveal.js`.
- Custom 404 page and an offline page served by the service worker.

### Tech Stack

- **Runtime:** HTML, CSS with native custom properties (no preprocessor), and dependency-free JavaScript ES modules.
- **Fonts:** local WOFF2 files declared in `css/base.css` as Playfair Display and Inter (weights 400–700).
- **Build:** Vite `^8.3.1` (8.3.1 in `package-lock.json`) — a development dependency (`devDependencies`); build inputs are configured through `build.rolldownOptions`.
- **Testing:** Playwright — `@playwright/test` `^1.63.0` (1.63.0 in `package-lock.json`), a development dependency used by the focused browser regression test for the navigation.
- **Environment:** Node.js `^20.19.0 || >=22.12.0` (`engines` in `package.json`), npm (`package-lock.json`).
- **Deployment:** Netlify configuration (`netlify.toml`, `public/_redirects`).

### Architecture

- **Canonical sources:** HTML documents in the repository root, `css/`, `js/`, `assets/`, `public/`, and `service-worker.js`. The HTML references `/css/style.css` and `/js/main.js` directly.
- **JavaScript:** `js/main.js` is the single entry point, loaded by the home page and the legal pages. It imports the feature modules and calls their `init*` functions once the DOM is ready. Each module locates its elements through `data-*` attributes and exits early when they are absent, so the same script serves every page. `offline.html` and `404.html` load CSS only.
- **CSS:** `css/style.css` imports the layers in the order `tokens.css` → `base.css` → `layout.css` → `components.css` → `sections.css`. The light theme overrides the colour tokens in the `.theme--light` class.
- **Build:** `vite.config.js` sets `appType: "mpa"`, `base: "/"`, and seven inputs: the six HTML pages and `service-worker.js`. The local `studio-noir-precache` plugin injects the precache list and cache version into the service worker.
- **Stable-path files:** `public/` holds the manifest, icon, `robots.txt`, `sitemap.xml`, and `_redirects`; Vite copies them into `dist/` without processing.

### Project Structure

```text
.
├── index.html              # home page (one-page layout)
├── privacy.html            # privacy policy (template)
├── terms.html              # terms (template)
├── cookies.html            # cookie policy (template)
├── offline.html            # offline fallback page
├── 404.html                # 404 error page
├── service-worker.js       # service worker source
├── assets/
│   ├── fonts/              # WOFF2 fonts
│   └── img/                # SVG illustrations
├── css/
│   ├── style.css           # CSS entry point (@import of layers)
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── sections.css
├── js/
│   ├── main.js             # JS entry point, service worker registration
│   ├── config.js
│   ├── header.js
│   ├── nav.js
│   ├── reveal.js
│   ├── lightbox.js
│   ├── booking.js
│   ├── theme.js
│   └── mobile-cta.js
├── public/
│   ├── _redirects
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   └── assets/icons/favicon.svg
├── tests/
│   └── nav.spec.js         # browser regression test for the navigation
├── vite.config.js
├── playwright.config.js    # Playwright configuration (Chromium, Vite dev server)
├── netlify.toml
├── package.json
├── package-lock.json
├── CHANGELOG.md
└── README.md
```

The `dist/` directory is produced by the build and excluded from Git in `.gitignore`.

### Installation

Node.js `^20.19.0 || >=22.12.0` and npm are required. Dependencies are installed from `package-lock.json`:

```bash
npm ci
```

### Local Development

```bash
npm run dev       # vite — development server, default http://localhost:5173
npm run build     # vite build — production build into dist/
npm run preview   # vite preview — serves dist/, default http://localhost:4173
npm run test:nav  # playwright test — browser regression test for the shared navigation contract
```

- Ports are not set in `vite.config.js`; the values above are Vite defaults.
- `npm run test:nav` starts its own Vite dev server on port 5183 and requires the Playwright Chromium browser (`npx playwright install chromium`).
- Pages use absolute paths and ES modules, so they require an HTTP server — the HTML files should not be opened directly from disk.
- The service worker is registered only in production builds (`import.meta.env.PROD` in `js/main.js`), so it is active in `npm run preview` but not in `npm run dev`.
- Offline behaviour is checked in preview. If a worker was previously registered on the same address and port, unregister it in the browser developer tools and reload the page.

### Production Build

`npm run build` produces the following in `dist/`:

- the six HTML pages;
- an `assets/` directory with minified JS and CSS, plus images and fonts with content hashes in their filenames (`assetsInlineLimit: 0` disables inlining assets into code);
- `service-worker.js` at the root, without a hash in its name, with the injected precache list and cache version;
- unmodified copies of the files from `public/`.

All URLs assume deployment at the domain root (`base: "/"`). The contents of `dist/` are generated and are not edited manually.

### Deployment

The repository includes Netlify configuration:

- `netlify.toml` — build command `npm run build`, publish directory `dist`, and a `Cache-Control: no-cache` header for `/service-worker.js`;
- `public/_redirects` — the rule `/* /404.html 404`: existing files take precedence, and missing URLs return `404.html` with a 404 status.

After running `npm run build`, the contents of `dist/` can be published manually with the Netlify CLI. The CLI is not a project dependency (`npx` fetches it on demand), and publishing requires authentication and selecting the correct site:

```bash
npx netlify deploy --prod --dir=dist
```

The repository contains no CI/CD workflow, and the configuration alone does not confirm an active deployment. `vite preview` does not apply the `_redirects` rules, so the error page can be viewed locally at `/404.html`.

### Accessibility

- `lang="pl"`, a "Przejdź do treści" skip link targeting `#main`, and `header`, labelled `nav`, `main`, and `footer` landmarks on the home page and the legal pages.
- A global `:focus-visible` style with a clear outline.
- Mobile menu: a toggle button with `aria-expanded` and `aria-controls`, synchronised `aria-hidden` on the panel, focus moved into the panel and back to the toggle, a focus trap for Tab and Shift+Tab, Escape-key closing, and `inert` applied to the main content in the mobile viewport.
- Lightbox: gallery items are native buttons, the overlay has `role="dialog"` and `aria-modal="true"`, focus moves to the close button, stays within the dialog, and returns to the triggering element; Escape closes the preview.
- The booking summary is an `aria-live="polite"` region, and the confirmation button stays disabled until both a service and a stylist are selected.
- Content images have text alternatives, and the decorative hero overlay is hidden from assistive technologies (`aria-hidden="true"`).
- With `prefers-reduced-motion: reduce`, CSS disables smooth scrolling and shortens animations and transitions, and `js/reveal.js` skips the reveal animations.

### SEO

- The home page and the legal pages have their own `<title>`, `meta description`, and Open Graph and Twitter Card metadata.
- `link rel="canonical"` and `og:url` point to URLs on the `https://ds-fashion-pr01-studionoir.netlify.app/` domain.
- `public/robots.txt` allows indexing of the whole site and references the sitemap; `public/sitemap.xml` lists only the home page URL.
- `robots.txt` and `sitemap.xml` use the `https://ds-fashion-pr01-studionoir.netlify.app/` domain, consistent with the domain used in the canonical URLs.

### PWA and Offline Support

- `public/manifest.webmanifest` defines `start_url` and `scope` as `/`, `display: "standalone"`, theme colours, and a single SVG icon (64×64). The manifest is linked from the home page and the legal pages.
- `js/main.js` registers `/service-worker.js` after the `load` event, in production builds only.
- During the build, the `studio-noir-precache` plugin replaces the `__STUDIO_NOIR_PRECACHE__` and `__STUDIO_NOIR_CACHE_VERSION__` markers in the worker. The precache list covers every build output file plus the files from `public/`, except names starting with `_`. The cache version is a truncated SHA-256 hash of the worker code and the names and contents of those files. Missing markers fail the build with an error.
- Installation stores the assets in the `studio-noir-<version>` cache and calls `skipWaiting()`; activation deletes only older caches with the `studio-noir-` prefix and takes control of open tabs (`clients.claim()`).
- Navigation requests are network-first. When offline, the worker returns the cached page (including extensionless URLs such as `/privacy`) or `offline.html`.
- Assets on the precache list are served from the cache, falling back to the network when no entry exists. Requests outside the list and cross-origin requests are not intercepted.

### Performance

- No libraries or frameworks in the browser-side code.
- Self-hosted fonts with `font-display: swap`; the home page and the legal pages preload five font files (`rel="preload"`).
- The home page hero image is preloaded and uses `fetchpriority="high"`.
- Stylist and gallery images use `loading="lazy"` and explicit `width` and `height` attributes.
- The Vite build minifies CSS and JS and gives assets in `dist/assets/` content-hashed filenames.

### Data and State Persistence

- Content (services, pricing, stylists, testimonials, contact details) is static HTML markup. The project uses no API, backend, or database.
- The selected theme is stored in `localStorage` under the `studio-noir-theme` key; without a stored value, the theme follows `prefers-color-scheme`.
- Booking widget state exists only in page memory and is lost on reload.
- The service worker keeps precached assets in the browser's Cache Storage.

### Project Maintenance

- Changes are made in the sources: root HTML files, `css/`, `js/`, `assets/`, `public/`, and `service-worker.js`. The `dist/` directory is build output only.
- The header and footer are duplicated in `index.html`, `privacy.html`, `terms.html`, and `cookies.html` — navigation or footer changes must be applied in each of these files.
- A new HTML page requires a new entry in `build.rolldownOptions.input` in `vite.config.js`. New pages and new files in `public/` are added to the precache list automatically.
- The cache version is never changed manually; the `__STUDIO_NOIR_PRECACHE__` and `__STUDIO_NOIR_CACHE_VERSION__` markers must remain in `service-worker.js`.
- The Instagram handle used by `data-instagram-link` links is defined in `js/config.js`.
- The change history is kept in [CHANGELOG.md](CHANGELOG.md).
