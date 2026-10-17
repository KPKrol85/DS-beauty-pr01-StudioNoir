# Studio Noir

## PL

### Przegląd projektu

Studio Noir — Hair & Style to statyczna, polskojęzyczna strona internetowa studia fryzjerskiego, przygotowana w ramach KP_Code Digital Studio. Strona główna (`index.html`) ma układ jednostronicowy z nawigacją kotwicową: hero, O studio, Usługi, Cennik, Styliści, Galeria, Rezerwacja, Opinie, Lokalizacja i końcowe CTA. Uzupełniają ją strony polityki prywatności, regulaminu, polityki cookies, strona offline oraz strona 404.

Projekt jest budowany przez Vite jako aplikacja wielostronicowa (MPA). Kod działający w przeglądarce to HTML, CSS i moduły JavaScript bez frameworków i bez zależności runtime.

Aktualny zakres:

- rezerwacja jest demonstracją działającą wyłącznie po stronie przeglądarki — akcja „Zakończ demo” zmienia jedynie status w interfejsie; wybór nie jest nigdzie wysyłany ani zapisywany i nie tworzy wizyty;
- obrazy w `assets/img/` (hero, styliści, galeria) to demonstracyjne obrazy wygenerowane przez AI na potrzeby fikcyjnego Studio Noir — informuje o tym sekcja Galeria na stronie głównej; nie dokumentują realizacji rzeczywistego salonu. Oryginały PNG są przechowywane obok responsywnych wariantów AVIF i WebP, a strony odwołują się wyłącznie do wariantów;
- `privacy.html`, `terms.html` i `cookies.html` zawierają treści prawne i informacyjne opracowane dla demonstracyjnego serwisu Studio Noir; nie stanowią gotowej dokumentacji prawnej dla rzeczywistego salonu.

### Kluczowe funkcje

- Nawigacja kotwicowa z oznaczaniem aktywnej sekcji (`IntersectionObserver`, `aria-current`) i stanem nagłówka po przewinięciu — `js/header.js`.
- Menu mobilne (poniżej 900 px) w panelu dialogowym z pułapką fokusu, zamykaniem klawiszem Escape i blokadą przewijania strony — `js/nav.js`.
- Galeria z podglądem zdjęć w lightboxie — `js/lightbox.js`.
- Demonstracyjny widżet rezerwacji z dwoma wyborami (usługa i stylista), podsumowaniem aktualizowanym na bieżąco i akcją „Zakończ demo” — `js/booking.js`. Zakończenie demo zmienia jedynie status i etykietę przycisku: nic nie jest wysyłane ani zapisywane i nie powstaje żadna wizyta. Zmiana usługi lub stylisty po zakończeniu demo resetuje ten stan. Linki w kartach usług i stylistów (`data-booking-preselect-service`, `data-booking-preselect-stylist`) wstępnie zaznaczają odpowiednią opcję i przenoszą do niej fokus; bez JavaScript lub przy kliknięciu z klawiszem modyfikującym działają jak zwykłe linki do `#booking`. Sekcję uzupełniają alternatywne kanały kontaktu (telefon, Instagram, e-mail) i komunikat `<noscript>`.
- Przełącznik motywu ciemnego i jasnego z zapamiętaniem motywu; motyw początkowy wynika z zapisanej wartości lub preferencji systemowej (szczegóły w sekcji [Dane i trwałość stanu](#dane-i-trwałość-stanu)) — `js/theme.js`.
- Poniżej 768 px: stały pasek szybkiego kontaktu u dołu ekranu (`nav` z etykietą „Szybki kontakt”) z główną akcją „Demo rezerwacji” (link do `#booking`) oraz drugorzędnymi linkami „Zadzwoń” i „Instagram”. Gdy otwarte jest menu mobilne lub lightbox, pasek jest ukryty (`visibility: hidden`) i niedostępny dla wskaźnika, klawisza Tab i technologii asystujących. Niezależnie od paska nagłówek zawiera kompaktowy przycisk „Umów wizytę”, widoczny po opuszczeniu sekcji hero — `js/header.js`.
- Linki oznaczone `data-instagram-link` próbują otworzyć aplikację Instagram (`instagram://`), a jeśli strona pozostaje widoczna po 900 ms, przechodzą do wiadomości przez `ig.me` — `js/mobile-cta.js`, konfiguracja w `js/config.js`.
- Animacje pojawiania się sekcji — `js/reveal.js`.
- Własna strona 404 oraz strona offline serwowana przez service worker.

### Stack technologiczny

- **Runtime:** HTML, CSS z natywnymi custom properties (bez preprocesora), moduły ES JavaScript bez bibliotek.
- **Fonty:** dwa pełne, lokalne fonty zmienne WOFF2 zadeklarowane w `css/base.css`: Playfair Display (400–900) i Inter (100–900); strona używa grubości 400–700. Oba obejmują podstawowy alfabet łaciński, polskie znaki, cyfry i interpunkcję treści.

  Playfair Display 1.203 pochodzi z [Google Fonts, commit `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/playfairdisplay); oryginalny TTF spakowano do WOFF2 bez subsettingu ani zmian glifów, metryk i nazw. Inter 4.001 to niezmieniony `InterVariable.woff2` z [wydania autora `v4.1`](https://github.com/rsms/inter/tree/v4.1/docs/font-files) (oś rozmiaru optycznego 14–32). Oba fonty są na SIL OFL 1.1; pełne noty i licencje w `public/font-licenses/playfair-display-OFL.txt` oraz `public/font-licenses/inter-OFL.txt` trafiają do `dist/font-licenses/` podczas buildu.
- **Build:** Vite `^8.3.1` (8.3.1 w `package-lock.json`) — zależność deweloperska (`devDependencies`); wejścia buildu konfigurowane przez `build.rolldownOptions`.
- **Testy:** Playwright — `@playwright/test` `^1.63.0` (1.63.0 w `package-lock.json`), zależność deweloperska używana przez skoncentrowany zestaw testów regresji przeglądarkowej nawigacji.
- **Środowisko:** Node.js `^20.19.0 || >=22.12.0` (`engines` w `package.json`), npm (`package-lock.json`).
- **Wdrożenie:** konfiguracja Netlify (`netlify.toml`, `public/_redirects`).

### Architektura

- **Kanoniczne źródła:** dokumenty HTML w katalogu głównym, `build/`, `css/`, `js/`, `assets/`, `public/` oraz `service-worker.js`. HTML odwołuje się bezpośrednio do `/css/style.css` i `/js/main.js`.
- **Nawigacja:** `build/primary-navigation.js` definiuje siedem głównych wpisów. Transformacja HTML Vite renderuje z tych samych wpisów listę `.nav__list` w nagłówku i listę `.footer__list` w grupie stopki „Nawigacja” w development i buildzie produkcyjnym: na stronie głównej cele mają postać `#section`, a na stronach prawnych `/index.html#section`. Wyrenderowane linki istnieją bez JavaScript w przeglądarce; otwarcie panelu mobilnego nadal wymaga JavaScript. Źródłowe HTML zawierają w tych listach znaczniki `<!-- studio-noir:primary-navigation -->` (nagłówek) i `<!-- studio-noir:footer-navigation -->` (stopka).
- **JavaScript:** `js/main.js` to jedyny punkt wejścia, ładowany przez stronę główną i strony prawne. Importuje moduły funkcjonalne i po załadowaniu DOM wywołuje ich funkcje `init*`. Moduły wyszukują swoje elementy przez atrybuty `data-*` i kończą działanie, gdy ich nie znajdą, dzięki czemu ten sam skrypt obsługuje wszystkie strony. `offline.html` i `404.html` ładują wyłącznie CSS.
- **Fokus nakładek:** `wrapTabFocus` z `js/wrap-tab-focus.js` obsługuje zawijanie Tab/Shift+Tab na granicach listy kontrolek w menu mobilnym i lightboxie. `js/nav.js` i `js/lightbox.js` nadal samodzielnie wybierają dostępne kontrolki i sprawdzają stan otwarcia.
- **CSS:** `css/style.css` importuje warstwy w kolejności `tokens.css` → `base.css` → `layout.css` → `components.css` → `sections.css`. Motyw jasny nadpisuje tokeny kolorów w klasie `.theme--light`. Poniżej 768 px token `--mobile-contact-bar-clearance` z `css/tokens.css` dostarcza wspólny odstęp dla `padding-bottom` elementu `body` w `css/components.css` i `scroll-margin-bottom` opcji rezerwacji w `css/sections.css`, uwzględniając safe area; `js/booking.js` odczytuje obliczony margines przy korekcie widoczności wyboru.
- **Build:** `vite.config.js` ustawia `appType: "mpa"`, `base: "/"` i siedem wejść: sześć stron HTML oraz `service-worker.js`. Lokalne pluginy: `studio-noir-primary-navigation` (`build/primary-navigation.js`) renderuje nawigację, `studio-noir-css-custom-properties` sprawdza odwołania do właściwości niestandardowych, `studio-noir-social-image-urls` zamienia ścieżkę `og:image` na adres absolutny, a `studio-noir-precache` uzupełnia service worker o listę precache, listę obrazów buforowanych na żądanie i wersję cache.
- **Pliki o stałych adresach:** `public/` zawiera manifest, ikonę, `robots.txt`, `sitemap.xml` i `_redirects`; Vite kopiuje je do `dist/` bez przetwarzania.

### Struktura projektu

```text
.
├── .gitignore
├── .gitattributes
├── .editorconfig
├── AGENTS.md               # wspólne instrukcje agentów
├── CLAUDE.md               # odwołanie do AGENTS.md dla Claude Code
├── LICENSE.md
├── index.html              # strona główna (układ jednostronicowy)
├── privacy.html            # polityka prywatności serwisu demonstracyjnego
├── terms.html              # regulamin serwisu demonstracyjnego
├── cookies.html            # polityka cookies serwisu demonstracyjnego
├── offline.html            # strona zastępcza offline
├── 404.html                # strona błędu 404
├── service-worker.js       # źródło service workera
├── assets/
│   ├── fonts/              # fonty WOFF2
│   └── img/
│       ├── hero/           # obraz hero: oryginał PNG, warianty AVIF/WebP
│       ├── stylists/       # portrety stylistów: oryginały PNG, warianty AVIF/WebP
│       └── gallery/        # zdjęcia galerii: oryginały PNG, warianty AVIF/WebP
├── build/
│   └── primary-navigation.js # wspólne wpisy i transformacja HTML nawigacji
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
│   ├── wrap-tab-focus.js
│   ├── pwa-paths.js
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
├── docs/
│   ├── CHANGELOG.md
│   └── archive/
│       └── improvements/   # zakończone raporty usprawnień
├── tests/
│   └── nav.spec.js         # testy regresji przeglądarkowej nawigacji
├── vite.config.js
├── playwright.config.js    # konfiguracja Playwright (Chromium, serwer Vite dev)
├── netlify.toml
├── package.json
├── package-lock.json
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
npm run test:nav  # playwright test — testy regresji przeglądarkowej wspólnego kontraktu nawigacji
```

- Porty nie są ustawione w `vite.config.js`; podane wartości to domyślne ustawienia Vite.
- `npm run test:nav` sam uruchamia serwer Vite dev na porcie 5183 i wymaga przeglądarki Chromium dla Playwright (`npx playwright install chromium`).
- Strony korzystają ze ścieżek absolutnych i modułów ES, dlatego wymagają serwera HTTP — nie należy otwierać plików HTML bezpośrednio z dysku.
- Service worker jest rejestrowany tylko w buildzie produkcyjnym (`import.meta.env.PROD` w `js/main.js`), a więc w `npm run preview`, ale nie w `npm run dev`.

### Weryfikacja zmian

Dla każdej zmiany uruchamia się najmniejszy zestaw kontroli obejmujący kontrakt, którego dotyczy zmiana — nie wszystkie polecenia po każdej zmianie.

Co weryfikują polecenia:

- `npm run build` — oprócz wygenerowania `dist/` jest statyczną walidacją projektu. Kontrole z `vite.config.js` (pluginy `studio-noir-precache` i `studio-noir-css-custom-properties`) działają tylko podczas buildu, nie w `npm run dev`. Build przerywa się błędem, gdy:
  1. w `service-worker.js` brakuje któregokolwiek ze znaczników `__STUDIO_NOIR_PRECACHE__`, `__STUDIO_NOIR_ON_DEMAND_IMAGES__` lub `__STUDIO_NOIR_CACHE_VERSION__`;
  2. strona `.html` w katalogu głównym nie jest zadeklarowana w `build.rolldownOptions.input`;
  3. w wygenerowanej liście precache brakuje `/index.html` lub `/offline.html`, z których worker korzysta przy nawigacji bez połączenia;
  4. odwołanie `var(--właściwość)` bez wartości zapasowej w pliku `css/*.css` wskazuje właściwość niestandardową, której nie definiuje żaden arkusz `css/*.css`;
  5. w `index.html`, `privacy.html`, `terms.html` lub `cookies.html` znacznik `<!-- studio-noir:primary-navigation -->` nie występuje dokładnie raz jako jedyna zawartość jedynej listy `<ul class="nav__list">` albo znacznik `<!-- studio-noir:footer-navigation -->` nie występuje dokładnie raz jako jedyna zawartość jednej listy `<ul class="footer__list">` w jedynym elemencie `<footer>`. Tę kontrolę wykonuje transformacja z `build/primary-navigation.js`, więc błąd pojawia się także przy serwowaniu strony w `npm run dev`.
- `npm run test:nav` — skoncentrowane testy regresji przeglądarkowej nawigacji (`tests/nav.spec.js`):
  - etykiety, kolejność, cele i działanie siedmiu linków nagłówka oraz zgodność z nimi linków stopki na stronie głównej (`/`, `/index.html`) i stronach prawnych (`/privacy.html`, `/terms.html`, `/cookies.html`) bez JavaScript w przeglądarce, w widoku desktopowym;
  - wskaźnik bieżącej sekcji z `IntersectionObserver` i bez niego, w widoku mobilnym i desktopowym: sekcje z linkiem i bez linku, powrót na górę, wejście przez fragment `#services`, granice sekcji i zmiana rozmiaru okna;
  - menu mobilne jako okno modalne: stan ARIA, `inert`, blokada przewijania, przenoszenie i zawijanie fokusu, otwieranie klawiaturą oraz zamykanie przez Escape i wybór linku;
  - czyszczenie stanu otwartego menu przy przejściu do układu desktopowego (900 px), zwolnienie pułapki fokusu i dostępność nawigacji desktopowej dla technologii asystujących.

  Testy działają w Chromium na serwerze Vite dev. Nie sprawdzają `dist/`, produkcyjnego PWA ani pozostałych interakcji; nie zapewniają pełnej regresji, audytu dostępności ani pokrycia wielu przeglądarek.
- `npm run preview` — serwuje `dist/` po `npm run build` i jako jedyne polecenie projektu uruchamia service worker, dlatego w nim sprawdza się ręcznie precache, zachowanie offline i produkcyjne działanie PWA. Jeżeli wcześniej zarejestrowano worker pod tym samym adresem i portem, należy go wyrejestrować w narzędziach deweloperskich przeglądarki i odświeżyć stronę. Podgląd nie stosuje konfiguracji Netlify (`_redirects`, nagłówki z `netlify.toml`).
- `git diff --check` — lekka, końcowa kontrola diffu przed commitem (błędy białych znaków, znaczniki konfliktów). Nie testuje aplikacji.

Dobór kontroli:

| Zmiana | Kontrole |
| --- | --- |
| CSS, strony HTML w katalogu głównym, pliki w `public/` | `npm run build`, `git diff --check` |
| Wspólna nawigacja: `build/primary-navigation.js`, markup nagłówka i menu, `js/header.js`, `js/nav.js`, `js/wrap-tab-focus.js`, style nawigacji i menu, przełączanie stanu mobilnego i desktopowego | `npm run build` (przy zmianach generowania HTML, CSS lub HTML), `npm run test:nav`, `git diff --check` |
| `service-worker.js`, `js/pwa-paths.js`, precache, `offline.html`, produkcyjne działanie PWA | `npm run build`, następnie `npm run preview`; `git diff --check` |
| Pozostałe skrypty w `js/` (np. rezerwacja, lightbox, motyw) — bez testów automatycznych | `npm run build`, ręczna kontrola w `npm run dev`, `git diff --check` |
| Wyłącznie dokumentacja | `git diff --check` |

### Build produkcyjny

`npm run build` tworzy w `dist/`:

- sześć stron HTML;
- katalog `assets/` z zminifikowanym JS i CSS oraz wariantami obrazów i fontami z hashem w nazwie pliku (`assetsInlineLimit: 0` wyłącza osadzanie zasobów w kodzie);
- `service-worker.js` w katalogu głównym, bez hasha w nazwie, z wstrzykniętą listą precache, listą obrazów buforowanych na żądanie i wersją cache;
- niezmienione kopie plików z `public/`.

Wszystkie adresy zakładają publikację w katalogu głównym domeny (`base: "/"`). Zawartość `dist/` jest generowana i nie jest edytowana ręcznie.

### Wdrożenie

Kanoniczną ścieżką wydania jest ręczna publikacja lokalnie zbudowanego katalogu `dist/` przez Netlify CLI.

Repozytorium zawiera konfigurację Netlify:

- `netlify.toml` — polecenie buildu `npm run build`, katalog publikacji `dist` oraz nagłówek `Cache-Control: no-cache` dla `/service-worker.js`;
- `public/_redirects` — reguła `/* /404.html 404`: istniejące pliki mają pierwszeństwo, a brakujące adresy zwracają `404.html` ze statusem 404.

Pliki te są konfiguracją repozytorium, a nie mechanizmem wydania: nie publikują niczego, a sama konfiguracja nie potwierdza aktywnego wdrożenia. Repozytorium nie zawiera workflow CI/CD.

Wydanie produkcyjne przygotowuje się w tej kolejności:

1. `git status` — drzewo robocze powinno być czyste, aby wydanie powstało z zatwierdzonego stanu projektu.
2. `npm ci` — instaluje zależności zgodnie z `package-lock.json`.
3. `npm run build` — tworzy świeży katalog `dist/` i uruchamia kontrole buildu opisane w sekcji [Weryfikacja zmian](#weryfikacja-zmian).
4. `npm run preview` — ręczna kontrola wyniku produkcyjnego przed publikacją, w zakresie istotnym dla wydania:
   - strona główna ładuje się poprawnie;
   - service worker rejestruje się, a PWA działa jak w środowisku produkcyjnym;
   - bez połączenia działa obsługa offline, w tym strona zastępcza `offline.html`;
   - strona błędu wyświetla się po bezpośrednim otwarciu `/404.html`.

   `vite preview` nie stosuje reguł z `_redirects` ani nagłówków z `netlify.toml`, więc nie odwzorowuje w pełni działania Netlify — dlatego stronę błędu sprawdza się bezpośrednio pod `/404.html`.
5. Po pozytywnej weryfikacji `dist/` publikuje się ręcznie przez Netlify CLI. Narzędzie nie jest zależnością projektu (`npx` pobiera je przy uruchomieniu), a publikacja wymaga uwierzytelnienia i wyboru właściwej witryny:

   ```bash
   npx netlify deploy --prod --dir=dist
   ```

Opcjonalnie, przed krokiem 5, to samo polecenie bez flagi `--prod` (`npx netlify deploy --dir=dist`) publikuje wersję roboczą (draft deploy) pod osobnym adresem, bez zmiany wdrożenia produkcyjnego. Nie jest to wymagany krok wydania.

### Dostępność

- Atrybut `lang="pl"`, skip link „Przejdź do treści” prowadzący do `#main` oraz landmarki `header`, `nav` (z etykietami), `main` i `footer` na stronie głównej i stronach prawnych.
- Globalny styl `:focus-visible` z wyraźnym obrysem.
- Menu mobilne: przycisk z `aria-expanded` i `aria-controls`, synchronizacja `aria-hidden` panelu, przeniesienie fokusu do panelu i z powrotem do przycisku, pułapka fokusu dla Tab i Shift+Tab, zamykanie klawiszem Escape oraz `inert` na treści głównej w widoku mobilnym.
- Lightbox: elementy galerii to natywne przyciski, okno ma `role="dialog"` i `aria-modal="true"`; przyciski Poprzednie/Następne i strzałki ←/→ przeglądają zdjęcia w pętli, a podpis z opisem i pozycją jest regionem `aria-live="polite"`. Fokus trafia na przycisk zamknięcia, Tab i Shift+Tab pozostają wśród kontrolek okna, a po zamknięciu fokus wraca do miniatury ostatnio oglądanego zdjęcia; Escape, nakładka i przycisk zamykają podgląd.
- Opcje rezerwacji to natywne przyciski z `aria-pressed`, a podsumowanie jest regionem `aria-live="polite"`. Do czasu wyboru usługi i stylisty oraz po zakończeniu demo przycisk „Zakończ demo” pozostaje dostępny przez Tab z `aria-disabled="true"` i wskazówką powiązaną przez `aria-describedby`, która opisuje brakujący wybór lub sposób powtórzenia demo; JavaScript blokuje zakończenie demo przy niepełnym wyborze.
- Obrazy treściowe mają teksty alternatywne.
- Przy `prefers-reduced-motion: reduce` CSS wyłącza płynne przewijanie i skraca animacje oraz przejścia, a `js/reveal.js` pomija animacje pojawiania się.

### SEO

- Strona główna i strony prawne mają własne `<title>`, `meta description` oraz metadane Open Graph i Twitter Card.
- `link rel="canonical"` i `og:url` wskazują adresy w domenie `https://ds-beauty-pr01-studionoir.netlify.app/`.
- `og:image` na stronie głównej i stronach prawnych wskazuje wariant WebP obrazu hero (1200 px). Źródłowy HTML używa ścieżki od katalogu głównego; podczas buildu plugin `studio-noir-social-image-urls` zamienia ją na adres absolutny wyznaczony względem adresu canonical danej strony, z nazwą pliku z hashem.
- `public/robots.txt` zezwala na indeksowanie całej witryny i wskazuje mapę strony; `public/sitemap.xml` zawiera wyłącznie adres strony głównej.
- `robots.txt` i `sitemap.xml` używają domeny `https://ds-beauty-pr01-studionoir.netlify.app/`, zgodnej z domeną w adresach canonical.

### PWA i obsługa offline

- `public/manifest.webmanifest` definiuje `start_url` i `scope` jako `/`, `display: "standalone"`, kolory motywu oraz jedną ikonę SVG (64×64). Manifest jest podpięty na stronie głównej i stronach prawnych.
- `js/main.js` rejestruje `/service-worker.js` po zdarzeniu `load`, wyłącznie w buildzie produkcyjnym.
- `js/pwa-paths.js` definiuje wspólne stałe `HOME_DOCUMENT` (`/index.html`) i `OFFLINE_DOCUMENT` (`/offline.html`), używane przez kontrolę precache w `vite.config.js` i obsługę nawigacji bez połączenia w `service-worker.js`.
- Podczas buildu plugin `studio-noir-precache` zastępuje w workerze znaczniki `__STUDIO_NOIR_PRECACHE__`, `__STUDIO_NOIR_ON_DEMAND_IMAGES__` i `__STUDIO_NOIR_CACHE_VERSION__`. Lista precache obejmuje pliki wyjściowe buildu poza samym `service-worker.js` oraz pliki z `public/` z wyjątkiem nazw zaczynających się od `_`. Wyjątkiem są warianty obrazów redakcyjnych z `assets/img/hero/`, `assets/img/stylists/` i `assets/img/gallery/`: nie trafiają do precache instalacyjnego, lecz na osobną listę obrazów buforowanych na żądanie. Wersja cache to fragment skrótu SHA-256 z kodu workera oraz nazw i zawartości plików z obu list. Kontrole, którymi plugin przerywa build, opisuje sekcja [Weryfikacja zmian](#weryfikacja-zmian).
- Instalacja zapisuje zasoby z listy precache w cache `studio-noir-<wersja>` i wywołuje `skipWaiting()`; aktywacja usuwa wyłącznie starsze cache z prefiksem `studio-noir-` i przejmuje otwarte karty (`clients.claim()`).
- Nawigacja korzysta najpierw z sieci. Bez połączenia worker zwraca zapisaną stronę (również dla adresów bez rozszerzenia, np. `/privacy`) lub `offline.html`.
- Worker przechwytuje żądania GET z tej samej domeny do zasobów z listy precache i z listy obrazów na żądanie: zwraca wpis z cache, a w razie jego braku pobiera zasób z sieci. Obraz z listy na żądanie trafia do cache bieżącej wersji dopiero po udanej odpowiedzi sieci. Bez połączenia dostępne są więc tylko te warianty obrazów, które wcześniej pobrano przy tej wersji cache; obrazy niewyświetlone lub inny wariant wybrany przez przeglądarkę mogą być niedostępne. Pozostałe żądania, żądania inne niż GET i żądania do innych domen nie są przechwytywane.

### Wydajność

- Brak bibliotek i frameworków w kodzie uruchamianym w przeglądarce.
- Fonty hostowane lokalnie z `font-display: swap`; strona główna i strony prawne wstępnie ładują dwa pliki fontów zmiennych (`rel="preload"`) potrzebne dla marki, nagłówków i tekstu początkowego widoku. Pozostałe grubości korzystają z tych samych plików.
- Obrazy hero, stylistów i galerii są osadzone w `<picture>`: `<source type="image/avif">` podaje warianty AVIF, a `img` — warianty WebP jako wersję zapasową. `srcset` (720 i 1200 px dla hero, 480 i 800 px dla stylistów i galerii) oraz `sizes` dopasowane do układu pozwalają przeglądarce wybrać wariant.
- Strona główna wstępnie ładuje warianty AVIF obrazu hero (`rel="preload"` z `imagesrcset`, `imagesizes` i `fetchpriority="high"`), a obraz hero ma `fetchpriority="high"`.
- Obrazy stylistów i galerii mają `loading="lazy"` oraz jawne atrybuty `width` i `height`.
- Build Vite minifikuje CSS i JS oraz nadaje zasobom w `dist/assets/` nazwy z hashem.

### Dane i trwałość stanu

- Treści (usługi, cennik, styliści, opinie, dane kontaktowe) są statycznym markupem HTML. Projekt nie korzysta z API, backendu ani bazy danych.
- Motyw jest zapisywany w `localStorage` pod kluczem `studio-noir-theme`. Bez poprawnej zapisanej wartości `js/theme.js` stosuje motyw wynikający z `prefers-color-scheme` i od razu go zapisuje, więc od tej chwili obowiązuje zapisana wartość, a późniejsza zmiana preferencji systemowej nie zmienia motywu. Gdy `localStorage` jest niedostępny, motyw działa na bieżącej stronie bez zapamiętania.
- Stan widżetu rezerwacji istnieje tylko w pamięci strony i znika po jej przeładowaniu.
- Service worker przechowuje w Cache Storage przeglądarki zasoby precache oraz obrazy redakcyjne pobrane podczas przeglądania.

### Utrzymanie projektu

- Zmiany wprowadza się w źródłach: HTML w katalogu głównym, `build/`, `css/`, `js/`, `assets/`, `public/` i `service-worker.js`. Katalog `dist/` jest wyłącznie wynikiem buildu.
- Etykiety, kolejność i cele głównych linków zmienia się w `build/primary-navigation.js`. Zmiana obejmuje jednocześnie nagłówek i grupę stopki „Nawigacja”. W czterech dokumentach (`index.html`, `privacy.html`, `terms.html`, `cookies.html`) pozostają znaczniki w `.nav__list` i `.footer__list`; otaczająca struktura nagłówka i pozostała zawartość stopki (linki prawne, kontakt, ikony społecznościowe, prawa autorskie) nadal są utrzymywane osobno w każdym HTML.
- `.gitignore` wyklucza wyniki buildu, zależności i lokalne artefakty. `.gitattributes` określa LF dla tekstowych źródeł i konfiguracji oraz traktuje fonty i obrazy rastrowe jako binarne. `.editorconfig` ustala UTF-8, LF, wcięcia po dwie spacje i końcowy znak nowej linii; zachowuje końcowe spacje w Markdown.
- Nowa strona HTML wymaga dodania wejścia w `build.rolldownOptions.input` w `vite.config.js`; brak wejścia dla strony w katalogu głównym przerywa build. Nowe strony i nowe pliki w `public/` trafiają do listy precache automatycznie, a nowe warianty obrazów z `assets/img/hero/`, `assets/img/stylists/` i `assets/img/gallery/` używane przez strony — na listę obrazów na żądanie.
- Wersji cache ani list cache nie zmienia się ręcznie; znaczniki `__STUDIO_NOIR_PRECACHE__`, `__STUDIO_NOIR_ON_DEMAND_IMAGES__` i `__STUDIO_NOIR_CACHE_VERSION__` muszą pozostać w `service-worker.js`.
- Uchwyt konta Instagram używany przez linki `data-instagram-link` jest zdefiniowany w `js/config.js`.
- Historia zmian jest prowadzona w [docs/CHANGELOG.md](docs/CHANGELOG.md).
- Cykl raportu usprawnień:
  - Aktywny raport (np. `IMPROVEMENTS-WORKFLOW.md`) znajduje się w katalogu głównym repozytorium do czasu rozstrzygnięcia wszystkich jego pozycji.
  - Kanonicznym kontraktem agentów, w tym formatu rekordów zakończenia, jest [AGENTS.md](AGENTS.md). Po wdrożeniu i weryfikacji usprawnienia jego szczegółową propozycję zastępuje się zwięzłym rekordem zakończenia (status, wynik, weryfikacja, pierwotny wpływ i nakład). Nieaktualne szczegóły propozycji (dowody, plan wdrożenia, kryteria akceptacji) usuwa się dopiero po potwierdzonej weryfikacji; otwarte i niedokończone propozycje pozostają bez zmian.
  - Raport pozostaje aktywny do czasu rozstrzygnięcia wszystkich pozycji. Sfinalizowany raport przenosi się do `docs/archive/improvements/` pod nazwą `IMPROVEMENTS-<CATEGORY>-<YYYY-MM-DD>.md`. Data w nazwie pliku to data zakończenia cyklu, nie data analizy — raport UI przeanalizowany 2026-09-28 zarchiwizowano jako `IMPROVEMENTS-UI-2026-10-04.md`.

## EN

### Project Overview

Studio Noir — Hair & Style is a static, Polish-language website for a hair studio, created within KP_Code Digital Studio. The home page (`index.html`) uses a one-page layout with anchor navigation: hero, about, services, pricing, stylists, gallery, booking, testimonials, location, and a closing call to action. It is complemented by privacy policy, terms, and cookie policy pages, an offline page, and a 404 page.

The project is built with Vite as a multi-page application (MPA). The browser-side code consists of HTML, CSS, and JavaScript modules without frameworks or runtime dependencies.

Current scope:

- booking is a demonstration that runs entirely in the browser — the "Zakończ demo" action only changes the status shown in the interface; the selection is not sent or stored anywhere and no appointment is created;
- the images in `assets/img/` (hero, stylists, gallery) are AI-generated demonstration images created for the fictional Studio Noir — the Gallery section on the home page states this; they do not document the work of a real salon. The original PNG files are kept alongside responsive AVIF and WebP variants, and the pages reference only the variants;
- `privacy.html`, `terms.html`, and `cookies.html` contain legal and informational content written for the Studio Noir demonstration site; they are not ready-to-use legal documentation for a real salon.

### Key Features

- Anchor navigation with active-section highlighting (`IntersectionObserver`, `aria-current`) and a scrolled header state — `js/header.js`.
- Mobile menu (below 900 px) in a dialog panel with a focus trap, Escape-key closing, and page scroll locking — `js/nav.js`.
- Gallery with a lightbox image preview — `js/lightbox.js`.
- Demonstration booking widget with two selections (service and stylist), a live summary, and a "Zakończ demo" action — `js/booking.js`. Completing the demo only changes the status and the button label: nothing is sent or stored and no appointment is created. Changing the service or stylist after completion resets that state. Links in the service and stylist cards (`data-booking-preselect-service`, `data-booking-preselect-stylist`) preselect the matching option and move focus to it; without JavaScript, or on a modifier-key click, they behave as ordinary links to `#booking`. The section also offers alternative contact channels (phone, Instagram, email) and a `<noscript>` message.
- Dark and light theme toggle that remembers the theme; the initial theme comes from the stored value or the system preference (details under [Data and State Persistence](#data-and-state-persistence)) — `js/theme.js`.
- Below 768 px: a fixed quick-contact bar at the bottom of the screen (a `nav` labelled "Szybki kontakt") with a primary "Demo rezerwacji" action (a link to `#booking`) and secondary "Zadzwoń" and "Instagram" links. While the mobile menu or the lightbox is open, the bar is hidden (`visibility: hidden`) and unavailable to pointer, Tab, and assistive-technology access. Separately, the header contains a compact "Umów wizytę" button that appears once the hero section leaves the viewport — `js/header.js`.
- Links marked with `data-instagram-link` attempt to open the Instagram app (`instagram://`) and, if the page is still visible after 900 ms, fall back to direct messaging via `ig.me` — `js/mobile-cta.js`, configured in `js/config.js`.
- Section reveal animations — `js/reveal.js`.
- Custom 404 page and an offline page served by the service worker.

### Tech Stack

- **Runtime:** HTML, CSS with native custom properties (no preprocessor), and dependency-free JavaScript ES modules.
- **Fonts:** two complete, self-hosted variable WOFF2 fonts declared in `css/base.css`: Playfair Display (400–900) and Inter (100–900); the site uses weights 400–700. Both cover basic Latin, Polish characters, numbers, and content punctuation.

  Playfair Display 1.203 comes from [Google Fonts, commit `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/playfairdisplay); the original TTF was packed into WOFF2 without subsetting or changes to glyphs, metrics, or names. Inter 4.001 is the unchanged `InterVariable.woff2` from [the author's `v4.1` release](https://github.com/rsms/inter/tree/v4.1/docs/font-files) (optical size axis 14–32). Both fonts use SIL OFL 1.1; full notices and licenses in `public/font-licenses/playfair-display-OFL.txt` and `public/font-licenses/inter-OFL.txt` are included in `dist/font-licenses/` during the build.
- **Build:** Vite `^8.3.1` (8.3.1 in `package-lock.json`) — a development dependency (`devDependencies`); build inputs are configured through `build.rolldownOptions`.
- **Testing:** Playwright — `@playwright/test` `^1.63.0` (1.63.0 in `package-lock.json`), a development dependency used by the focused browser regression test suite for the navigation.
- **Environment:** Node.js `^20.19.0 || >=22.12.0` (`engines` in `package.json`), npm (`package-lock.json`).
- **Deployment:** Netlify configuration (`netlify.toml`, `public/_redirects`).

### Architecture

- **Canonical sources:** HTML documents in the repository root, `build/`, `css/`, `js/`, `assets/`, `public/`, and `service-worker.js`. The HTML references `/css/style.css` and `/js/main.js` directly.
- **Navigation:** `build/primary-navigation.js` defines the seven primary entries. Vite's HTML transformation renders both the header `.nav__list` and the `.footer__list` in the "Nawigacja" footer group from the same entries during development and production builds: destinations are `#section` on the home page and `/index.html#section` on legal pages. The rendered links exist without browser JavaScript; opening the mobile panel still requires JavaScript. The source HTML contains the `<!-- studio-noir:primary-navigation -->` (header) and `<!-- studio-noir:footer-navigation -->` (footer) markers inside these lists.
- **JavaScript:** `js/main.js` is the single entry point, loaded by the home page and the legal pages. It imports the feature modules and calls their `init*` functions once the DOM is ready. Each module locates its elements through `data-*` attributes and exits early when they are absent, so the same script serves every page. `offline.html` and `404.html` load CSS only.
- **Overlay focus:** `wrapTabFocus` from `js/wrap-tab-focus.js` wraps Tab/Shift+Tab at the boundaries of the control list in the mobile menu and lightbox. `js/nav.js` and `js/lightbox.js` still select their own eligible controls and check their open state.
- **CSS:** `css/style.css` imports the layers in the order `tokens.css` → `base.css` → `layout.css` → `components.css` → `sections.css`. The light theme overrides the colour tokens in the `.theme--light` class. Below 768 px, the `--mobile-contact-bar-clearance` token from `css/tokens.css` supplies shared clearance for `padding-bottom` on `body` in `css/components.css` and booking-choice `scroll-margin-bottom` in `css/sections.css`, including the safe area; `js/booking.js` reads the computed margin when correcting choice visibility.
- **Build:** `vite.config.js` sets `appType: "mpa"`, `base: "/"`, and seven inputs: the six HTML pages and `service-worker.js`. Local plugins: `studio-noir-primary-navigation` (`build/primary-navigation.js`) renders the navigation, `studio-noir-css-custom-properties` checks custom-property references, `studio-noir-social-image-urls` turns the `og:image` path into an absolute URL, and `studio-noir-precache` injects the precache list, the on-demand image list, and the cache version into the service worker.
- **Stable-path files:** `public/` holds the manifest, icon, `robots.txt`, `sitemap.xml`, and `_redirects`; Vite copies them into `dist/` without processing.

### Project Structure

```text
.
├── .gitignore
├── .gitattributes
├── .editorconfig
├── AGENTS.md               # shared agent instructions
├── CLAUDE.md               # AGENTS.md reference for Claude Code
├── LICENSE.md
├── index.html              # home page (one-page layout)
├── privacy.html            # demonstration-site privacy policy
├── terms.html              # demonstration-site terms
├── cookies.html            # demonstration-site cookie policy
├── offline.html            # offline fallback page
├── 404.html                # 404 error page
├── service-worker.js       # service worker source
├── assets/
│   ├── fonts/              # WOFF2 fonts
│   └── img/
│       ├── hero/           # hero image: original PNG, AVIF/WebP variants
│       ├── stylists/       # stylist portraits: original PNGs, AVIF/WebP variants
│       └── gallery/        # gallery images: original PNGs, AVIF/WebP variants
├── build/
│   └── primary-navigation.js # shared entries and navigation HTML transform
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
│   ├── wrap-tab-focus.js
│   ├── pwa-paths.js
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
├── docs/
│   ├── CHANGELOG.md
│   └── archive/
│       └── improvements/   # completed improvement reports
├── tests/
│   └── nav.spec.js         # browser regression tests for the navigation
├── vite.config.js
├── playwright.config.js    # Playwright configuration (Chromium, Vite dev server)
├── netlify.toml
├── package.json
├── package-lock.json
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
npm run test:nav  # playwright test — browser regression tests for the shared navigation contract
```

- Ports are not set in `vite.config.js`; the values above are Vite defaults.
- `npm run test:nav` starts its own Vite dev server on port 5183 and requires the Playwright Chromium browser (`npx playwright install chromium`).
- Pages use absolute paths and ES modules, so they require an HTTP server — the HTML files should not be opened directly from disk.
- The service worker is registered only in production builds (`import.meta.env.PROD` in `js/main.js`), so it is active in `npm run preview` but not in `npm run dev`.

### Change Verification

Each change gets the smallest set of checks that covers the contract it affects — not every command after every change.

What each command verifies:

- `npm run build` — besides producing `dist/`, it is the project's static validation step. The checks in `vite.config.js` (the `studio-noir-precache` and `studio-noir-css-custom-properties` plugins) run only during the build, not in `npm run dev`. The build fails when:
  1. any of the `__STUDIO_NOIR_PRECACHE__`, `__STUDIO_NOIR_ON_DEMAND_IMAGES__`, or `__STUDIO_NOIR_CACHE_VERSION__` placeholders is missing from `service-worker.js`;
  2. a root-level `.html` page is not declared in `build.rolldownOptions.input`;
  3. the generated precache list is missing `/index.html` or `/offline.html`, which the worker relies on for navigation without a connection;
  4. a `var(--property)` reference without a fallback in a `css/*.css` file names a custom property that no `css/*.css` stylesheet defines;
  5. in `index.html`, `privacy.html`, `terms.html`, or `cookies.html`, the `<!-- studio-noir:primary-navigation -->` marker does not appear exactly once as the only content of a single `<ul class="nav__list">`, or the `<!-- studio-noir:footer-navigation -->` marker does not appear exactly once as the only content of one `<ul class="footer__list">` inside the single `<footer>` element. This check is performed by the transform in `build/primary-navigation.js`, so the error also appears when the page is served by `npm run dev`.
- `npm run test:nav` — focused browser regression tests for the navigation (`tests/nav.spec.js`):
  - labels, order, destinations, and activation of the seven header links, and the footer links matching them, on the home page (`/`, `/index.html`) and legal pages (`/privacy.html`, `/terms.html`, `/cookies.html`) without browser JavaScript, in the desktop layout;
  - the current-section indicator with and without `IntersectionObserver`, in mobile and desktop layouts: linked and unlinked sections, return to the top, a direct `#services` fragment load, section boundaries, and viewport resize;
  - the mobile menu as a modal: ARIA state, `inert`, scroll locking, focus movement and wrapping, keyboard opening, and closing on Escape and link activation;
  - clearing the open menu's mobile state when switching to the desktop layout (900 px), releasing the focus trap, and desktop navigation exposure to assistive technologies.

  The tests run in Chromium against the Vite dev server. They do not check `dist/`, production PWA behaviour, or other interactions; they do not provide complete regression, an accessibility audit, or cross-browser coverage.
- `npm run preview` — serves `dist/` after `npm run build` and is the only project command in which the service worker runs, so precache, offline behaviour, and production PWA behaviour are checked there manually. If a worker was previously registered on the same address and port, unregister it in the browser developer tools and reload the page. Preview does not apply the Netlify configuration (`_redirects`, headers from `netlify.toml`).
- `git diff --check` — lightweight final diff check before committing (whitespace errors, conflict markers). It does not test the application.

Choosing checks:

| Change | Checks |
| --- | --- |
| CSS, root-level HTML pages, files in `public/` | `npm run build`, `git diff --check` |
| Shared navigation: `build/primary-navigation.js`, header and menu markup, `js/header.js`, `js/nav.js`, `js/wrap-tab-focus.js`, navigation and menu styles, mobile/desktop state switching | `npm run build` (for changes to HTML generation, CSS, or HTML), `npm run test:nav`, `git diff --check` |
| `service-worker.js`, `js/pwa-paths.js`, precache, `offline.html`, production PWA behaviour | `npm run build`, then `npm run preview`; `git diff --check` |
| Other scripts in `js/` (e.g. booking, lightbox, theme) — no automated tests | `npm run build`, manual check in `npm run dev`, `git diff --check` |
| Documentation only | `git diff --check` |

### Production Build

`npm run build` produces the following in `dist/`:

- the six HTML pages;
- an `assets/` directory with minified JS and CSS, plus image variants and fonts with content hashes in their filenames (`assetsInlineLimit: 0` disables inlining assets into code);
- `service-worker.js` at the root, without a hash in its name, with the injected precache list, on-demand image list, and cache version;
- unmodified copies of the files from `public/`.

All URLs assume deployment at the domain root (`base: "/"`). The contents of `dist/` are generated and are not edited manually.

### Deployment

The canonical release path is a manual publish of the locally built `dist/` directory with the Netlify CLI.

The repository includes Netlify configuration:

- `netlify.toml` — build command `npm run build`, publish directory `dist`, and a `Cache-Control: no-cache` header for `/service-worker.js`;
- `public/_redirects` — the rule `/* /404.html 404`: existing files take precedence, and missing URLs return `404.html` with a 404 status.

These files are repository configuration, not the release mechanism: they do not publish anything by themselves, and the configuration alone does not confirm an active deployment. The repository contains no CI/CD workflow.

A production release is prepared in this order:

1. `git status` — the working tree should be clean, so that the release is built from the committed project state.
2. `npm ci` — installs dependencies as locked in `package-lock.json`.
3. `npm run build` — produces a fresh `dist/` and runs the build checks listed under [Change Verification](#change-verification).
4. `npm run preview` — manual check of the production output before publishing, as relevant to the release:
   - the home page loads correctly;
   - the service worker registers and the PWA behaves as in production;
   - offline behaviour works without a connection, including the `offline.html` fallback;
   - the error page renders when `/404.html` is opened directly.

   `vite preview` does not apply the `_redirects` rules or the `netlify.toml` headers, so it does not fully emulate Netlify — which is why the error page is checked directly at `/404.html`.
5. After successful verification, publish `dist/` manually with the Netlify CLI. The CLI is not a project dependency (`npx` fetches it on demand), and publishing requires authentication and selecting the correct site:

   ```bash
   npx netlify deploy --prod --dir=dist
   ```

Optionally, before step 5, the same command without the `--prod` flag (`npx netlify deploy --dir=dist`) publishes a draft deploy at a separate URL without changing the production deploy. It is not a required release step.

### Accessibility

- `lang="pl"`, a "Przejdź do treści" skip link targeting `#main`, and `header`, labelled `nav`, `main`, and `footer` landmarks on the home page and the legal pages.
- A global `:focus-visible` style with a clear outline.
- Mobile menu: a toggle button with `aria-expanded` and `aria-controls`, synchronised `aria-hidden` on the panel, focus moved into the panel and back to the toggle, a focus trap for Tab and Shift+Tab, Escape-key closing, and `inert` applied to the main content in the mobile viewport.
- Lightbox: gallery items are native buttons and the dialog has `role="dialog"` and `aria-modal="true"`; Previous/Next buttons and the ←/→ keys browse images in a loop, while the caption with the description and position is an `aria-live="polite"` region. Focus moves to the close button, Tab and Shift+Tab stay among the dialog controls, and closing returns focus to the thumbnail of the last viewed image; Escape, the overlay, and the close button close the preview.
- Booking options are native buttons with `aria-pressed`, and the summary is an `aria-live="polite"` region. Until both a service and a stylist are selected, and after the demo is completed, the "Zakończ demo" button stays in the Tab sequence with `aria-disabled="true"` and a hint linked through `aria-describedby` that describes the missing choice or how to repeat the demo; JavaScript blocks completing the demo with an incomplete selection.
- Content images have text alternatives.
- With `prefers-reduced-motion: reduce`, CSS disables smooth scrolling and shortens animations and transitions, and `js/reveal.js` skips the reveal animations.

### SEO

- The home page and the legal pages have their own `<title>`, `meta description`, and Open Graph and Twitter Card metadata.
- `link rel="canonical"` and `og:url` point to URLs on the `https://ds-beauty-pr01-studionoir.netlify.app/` domain.
- `og:image` on the home page and the legal pages points to the 1200 px WebP variant of the hero image. The source HTML uses a root-relative path; during the build, the `studio-noir-social-image-urls` plugin replaces it with an absolute URL resolved against the page's canonical URL, using the hashed filename.
- `public/robots.txt` allows indexing of the whole site and references the sitemap; `public/sitemap.xml` lists only the home page URL.
- `robots.txt` and `sitemap.xml` use the `https://ds-beauty-pr01-studionoir.netlify.app/` domain, consistent with the domain used in the canonical URLs.

### PWA and Offline Support

- `public/manifest.webmanifest` defines `start_url` and `scope` as `/`, `display: "standalone"`, theme colours, and a single SVG icon (64×64). The manifest is linked from the home page and the legal pages.
- `js/main.js` registers `/service-worker.js` after the `load` event, in production builds only.
- `js/pwa-paths.js` defines the shared `HOME_DOCUMENT` (`/index.html`) and `OFFLINE_DOCUMENT` (`/offline.html`) constants, used by the precache guard in `vite.config.js` and offline navigation handling in `service-worker.js`.
- During the build, the `studio-noir-precache` plugin replaces the `__STUDIO_NOIR_PRECACHE__`, `__STUDIO_NOIR_ON_DEMAND_IMAGES__`, and `__STUDIO_NOIR_CACHE_VERSION__` markers in the worker. The precache list covers build output files other than `service-worker.js`, plus the files from `public/`, except names starting with `_`. The exception is the editorial image variants from `assets/img/hero/`, `assets/img/stylists/`, and `assets/img/gallery/`: they are excluded from the installation precache and placed on a separate on-demand image list. The cache version is a truncated SHA-256 hash of the worker code and the names and contents of the files on both lists. The checks with which the plugin fails the build are listed under [Change Verification](#change-verification).
- Installation stores the precache-list assets in the `studio-noir-<version>` cache and calls `skipWaiting()`; activation deletes only older caches with the `studio-noir-` prefix and takes control of open tabs (`clients.claim()`).
- Navigation requests are network-first. When offline, the worker returns the cached page (including extensionless URLs such as `/privacy`) or `offline.html`.
- The worker intercepts same-origin GET requests for assets on the precache list and the on-demand image list: it returns the cached entry, falling back to the network when no entry exists. An on-demand image is added to the current cache version only after a successful network response. Offline, therefore, only image variants previously fetched under that cache version are available; images that were never displayed, or a different variant selected by the browser, may be unavailable. Other requests, non-GET requests, and cross-origin requests are not intercepted.

### Performance

- No libraries or frameworks in the browser-side code.
- Self-hosted fonts with `font-display: swap`; the home page and the legal pages preload two variable font files (`rel="preload"`) needed for the brand, headings, and text in the initial view. Other weights reuse the same files.
- Hero, stylist, and gallery images use `<picture>`: `<source type="image/avif">` provides the AVIF variants, and the `img` provides WebP variants as the fallback. `srcset` (720 and 1200 px for the hero, 480 and 800 px for stylists and gallery) and layout-matched `sizes` let the browser select a variant.
- The home page preloads the hero AVIF variants (`rel="preload"` with `imagesrcset`, `imagesizes`, and `fetchpriority="high"`), and the hero image itself uses `fetchpriority="high"`.
- Stylist and gallery images use `loading="lazy"` and explicit `width` and `height` attributes.
- The Vite build minifies CSS and JS and gives assets in `dist/assets/` content-hashed filenames.

### Data and State Persistence

- Content (services, pricing, stylists, testimonials, contact details) is static HTML markup. The project uses no API, backend, or database.
- The theme is stored in `localStorage` under the `studio-noir-theme` key. Without a valid stored value, `js/theme.js` applies the theme derived from `prefers-color-scheme` and stores it immediately, so the stored value applies from then on and later changes to the system preference do not change the theme. When `localStorage` is unavailable, the theme still works on the current page without being remembered.
- Booking widget state exists only in page memory and is lost on reload.
- The service worker keeps precached assets, plus editorial images fetched while browsing, in the browser's Cache Storage.

### Project Maintenance

- Changes are made in the sources: root HTML files, `build/`, `css/`, `js/`, `assets/`, `public/`, and `service-worker.js`. The `dist/` directory is build output only.
- Primary-link labels, order, and destinations are changed in `build/primary-navigation.js`. A change applies to both the header and the "Nawigacja" footer group. The four documents (`index.html`, `privacy.html`, `terms.html`, `cookies.html`) retain markers inside `.nav__list` and `.footer__list`; the surrounding header structure and the rest of the footer (legal links, contact details, social icons, copyright) are still maintained separately in each HTML document.
- `.gitignore` excludes build output, dependencies, and local artifacts. `.gitattributes` sets LF for text sources and configuration and treats fonts and raster images as binary. `.editorconfig` sets UTF-8, LF, two-space indentation, and a final newline; it preserves trailing spaces in Markdown.
- A new HTML page requires a new entry in `build.rolldownOptions.input` in `vite.config.js`; a root-level page without an entry fails the build. New pages and new files in `public/` are added to the precache list automatically, and new image variants from `assets/img/hero/`, `assets/img/stylists/`, and `assets/img/gallery/` used by the pages are added to the on-demand image list.
- The cache version and cache lists are never changed manually; the `__STUDIO_NOIR_PRECACHE__`, `__STUDIO_NOIR_ON_DEMAND_IMAGES__`, and `__STUDIO_NOIR_CACHE_VERSION__` markers must remain in `service-worker.js`.
- The Instagram handle used by `data-instagram-link` links is defined in `js/config.js`.
- The change history is kept in [docs/CHANGELOG.md](docs/CHANGELOG.md).
- Improvement-report lifecycle:
  - An active report (for example `IMPROVEMENTS-WORKFLOW.md`) stays in the repository root until all of its items are resolved.
  - [AGENTS.md](AGENTS.md) is the canonical agent contract, including the completion-record format. Once an improvement is implemented and verified, its detailed proposal is replaced with a concise completion record (status, result, verification, original impact and effort). Obsolete proposal details (evidence, implementation plan, acceptance criteria) are removed only after verified completion; open and incomplete proposals remain unchanged.
  - A report remains active until all of its items are resolved. The finalised report is moved to `docs/archive/improvements/` as `IMPROVEMENTS-<CATEGORY>-<YYYY-MM-DD>.md`. The filename date is the completion date of the cycle, not the analysis date — the UI report analysed on 2026-09-28 was archived as `IMPROVEMENTS-UI-2026-10-04.md`.
