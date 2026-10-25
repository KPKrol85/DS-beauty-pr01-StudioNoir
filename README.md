# Studio Noir

## PL

### Przegląd projektu

Studio Noir — Hair & Style to statyczna, polskojęzyczna strona internetowa studia fryzjerskiego, przygotowana w ramach KP_Code Digital Studio. Strona główna (`index.html`) ma układ jednostronicowy z nawigacją kotwicową: hero, O studio, Usługi, Cennik, Styliści, Galeria, Rezerwacja, Opinie, Lokalizacja i końcowe CTA. Uzupełniają ją strony polityki prywatności, regulaminu, polityki cookies, strona offline oraz strona 404.

Projekt jest budowany przez Vite jako aplikacja wielostronicowa (MPA). Kod działający w przeglądarce to HTML, CSS i moduły JavaScript bez frameworków i bez zależności runtime.

Aktualny zakres:

- rezerwacja jest demonstracją działającą wyłącznie po stronie przeglądarki — akcja „Zakończ demo” zmienia jedynie status w interfejsie; wybór nie jest nigdzie wysyłany ani zapisywany i nie tworzy wizyty;
- obrazy w `assets/img/` (hero, styliści, galeria) to demonstracyjne obrazy wygenerowane przez AI na potrzeby fikcyjnego Studio Noir; nie dokumentują realizacji rzeczywistego salonu. Oryginały PNG są przechowywane obok responsywnych wariantów AVIF i WebP, a strony odwołują się wyłącznie do wariantów;
- `privacy.html`, `terms.html` i `cookies.html` zawierają treści prawne i informacyjne opracowane dla demonstracyjnego serwisu Studio Noir; nie stanowią gotowej dokumentacji prawnej dla rzeczywistego salonu.
- dane kontaktowe publikowane w sekcji Lokalizacja, w stopkach, w dokumentach prawnych i w alternatywnych kanałach kontaktu należą do autora projektu (KP_Code Digital Studio) i nie są danymi działającego salonu fryzjerskiego; godziny otwarcia pozostają przykładem demonstracyjnym.

### Kluczowe funkcje

- Nawigacja kotwicowa z oznaczaniem aktywnej sekcji (`IntersectionObserver`, `aria-current`) i stanem nagłówka po przewinięciu — `js/header.js`.
- Menu mobilne (poniżej 900 px) w panelu dialogowym z pułapką fokusu, zamykaniem klawiszem Escape i blokadą przewijania strony — `js/nav.js`. Panel zachowuje wyśrodkowanie, gdy zawartość się mieści, i przewija się wewnętrznie przy małej wysokości, z dostępnym przyciskiem zamknięcia i miejscem na obrys fokusu — `css/components.css`.
- Galeria z podglądem zdjęć w lightboxie — `js/lightbox.js`.
- Demonstracyjny widżet rezerwacji z dwoma wyborami (usługa i stylista), podsumowaniem aktualizowanym na bieżąco i akcją „Zakończ demo” — `js/booking.js`. Zakończenie demo zmienia jedynie status i etykietę przycisku: nic nie jest wysyłane ani zapisywane i nie powstaje żadna wizyta. Zmiana usługi lub stylisty po zakończeniu demo resetuje ten stan. Linki w kartach usług i stylistów (`data-booking-preselect-service`, `data-booking-preselect-stylist`) wstępnie zaznaczają odpowiednią opcję i przenoszą do niej fokus; bez JavaScript lub przy kliknięciu z klawiszem modyfikującym działają jak zwykłe linki do `#booking`. Sekcję uzupełniają alternatywne kanały kontaktu (telefon, e-mail) i komunikat `<noscript>`.
- Przełącznik motywu ciemnego i jasnego z zapamiętaniem motywu; motyw początkowy wynika z zapisanej wartości lub preferencji systemowej (szczegóły w sekcji [Dane i trwałość stanu](#dane-i-trwałość-stanu)) — `js/theme.js`.
- Poniżej 768 px: stały pasek szybkiego kontaktu u dołu ekranu (`nav` z etykietą „Szybki kontakt”) z główną akcją „Demo rezerwacji” (link do `#booking`) oraz drugorzędnym linkiem „Telefon autora” (`tel:`); obie akcje są zwykłymi linkami bez obsługi JavaScript. Gdy otwarte jest menu mobilne lub lightbox, pasek jest ukryty (`visibility: hidden`) i niedostępny dla wskaźnika, klawisza Tab i technologii asystujących. Niezależnie od paska nagłówek zawiera kompaktowy przycisk „Umów wizytę”, widoczny po opuszczeniu sekcji hero — `js/header.js`.
- Animacje pojawiania się sekcji — `js/reveal.js`.
- Przycisk „Wróć na górę” na stronie głównej i stronach prawnych — `js/back-to-top.js`. Przycisk jest widoczny tylko wtedy, gdy linia praw autorskich stopki (`.footer__copyright`) przecina obszar widoku, niezależnie od kierunku przewijania; stan wyznacza `IntersectionObserver`, a bez niego — sprawdzenie położenia przy zdarzeniach `scroll` i `resize`. Aktywacja przewija stronę na początek bez dodawania fragmentu do adresu URL, a przy `prefers-reduced-motion: reduce` przewinięcie jest natychmiastowe. Poniżej 768 px na stronie głównej przycisk znajduje się nad paskiem szybkiego kontaktu.
- Własna strona 404 oraz strona offline serwowana przez service worker.

### Stack technologiczny

- **Runtime:** HTML, CSS z natywnymi custom properties (bez preprocesora), moduły ES JavaScript bez bibliotek.
- **Fonty:** dwa pełne, lokalne fonty zmienne WOFF2 zadeklarowane w `css/base.css`: Playfair Display (400–900) i Inter (100–900); strona używa grubości 400–700. Oba obejmują podstawowy alfabet łaciński, polskie znaki, cyfry i interpunkcję treści.

  Playfair Display 1.203 pochodzi z [Google Fonts, commit `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/playfairdisplay); oryginalny TTF spakowano do WOFF2 bez subsettingu ani zmian glifów, metryk i nazw. Inter 4.001 to niezmieniony `InterVariable.woff2` z [wydania autora `v4.1`](https://github.com/rsms/inter/tree/v4.1/docs/font-files) (oś rozmiaru optycznego 14–32). Oba fonty są na SIL OFL 1.1; pełne noty i licencje w `public/font-licenses/playfair-display-OFL.txt` oraz `public/font-licenses/inter-OFL.txt` trafiają do `dist/font-licenses/` podczas buildu.
- **Build:** Vite `^8.3.1` (8.3.1 w `package-lock.json`) — zależność deweloperska (`devDependencies`); wejścia buildu konfigurowane przez `build.rolldownOptions`.
- **Testy:** Playwright — `@playwright/test` `^1.63.0` (1.63.0 w `package-lock.json`), zależność deweloperska używana przez skoncentrowane testy regresji przeglądarkowej nawigacji, paska szybkiego kontaktu, interakcji (rezerwacja, lightbox, „Wróć na górę”, trwałość motywu), pojawiania się sekcji i inicjalizacji motywu.
- **Środowisko:** Node.js `^20.19.0 || >=22.12.0` (`engines` w `package.json`), npm (`package-lock.json`).
- **Wdrożenie:** konfiguracja Netlify (`netlify.toml`, `public/_redirects`).

### Architektura

- **Kanoniczne źródła:** dokumenty HTML w katalogu głównym, `build/`, `css/`, `js/`, `assets/`, `public/` oraz `service-worker.js`. HTML odwołuje się bezpośrednio do `/css/style.css` i `/js/main.js`.
- **Nagłówek:** `build/shared-header.js` renderuje wspólny nagłówek w miejscu jednego znacznika `<!-- studio-noir:shared-header -->` w `index.html`, `privacy.html`, `terms.html` i `cookies.html`, bezpośrednio po skip linku i przed `<main>`. Na stronie głównej logo prowadzi do `#top`, linki rezerwacji do `#booking`, a kompaktowe CTA ma początkowo `inert`; strony prawne używają `/index.html#top` i `/index.html#booking` i nie mają kompaktowego CTA. Struktura, klasy, ARIA i atrybuty `data-*` pozostają wspólne. W obu trybach Vite transformacje `pre` działają w kolejności `sharedHeader(root)` → `sharedFooter(root)` → `primaryNavigation(root)`; `404.html` i `offline.html` pozostają bez nagłówka.
- **Nawigacja:** `build/primary-navigation.js` definiuje siedem głównych wpisów. Transformacja HTML Vite renderuje z tych samych wpisów listę `.nav__list` w nagłówku i listę `.footer__list` w grupie stopki „Nawigacja” w development i buildzie produkcyjnym: na stronie głównej cele mają postać `#section`, a na stronach prawnych `/index.html#section`. Wyrenderowane linki istnieją bez JavaScript w przeglądarce; otwarcie panelu mobilnego nadal wymaga JavaScript. Znacznik `<!-- studio-noir:primary-navigation -->` znajduje się w liście nagłówka generowanej przez `build/shared-header.js`, a znacznik `<!-- studio-noir:footer-navigation -->` — w liście stopki generowanej przez `build/shared-footer.js`.
- **Stopka:** `build/shared-footer.js` jest kanonicznym źródłem wspólnej stopki strony głównej i stron prawnych: marki z opisem, grupy „Nawigacja” ze znacznikiem nawigacji, linków prawnych grupy „Informacje”, danych kontaktowych z atrybucją autora, linkiem do Map Google i kanałami kontaktu, linków społecznościowych i linii praw autorskich, a także przycisku „Wróć na górę” umieszczonego bezpośrednio za elementem `<footer>`. Transformacja HTML Vite zastępuje nią znacznik `<!-- studio-noir:shared-footer -->` w `index.html`, `privacy.html`, `terms.html` i `cookies.html` w development i buildzie produkcyjnym. Na stronie prawnej link do niej w grupie „Informacje” otrzymuje `aria-current="page"`; na stronie głównej żaden link prawny nie jest oznaczony. Transformacja stopki działa przed `build/primary-navigation.js`, który wypełnia listę „Nawigacja”. `404.html` i `offline.html` nie mają stopki.
- **JavaScript:** `js/main.js` to jedyny punkt wejścia, ładowany przez stronę główną i strony prawne. Importuje moduły funkcjonalne i po załadowaniu DOM wywołuje ich funkcje `init*`. Moduły wyszukują swoje elementy przez atrybuty `data-*` i kończą działanie, gdy ich nie znajdą, dzięki czemu ten sam skrypt obsługuje wszystkie strony. `offline.html` i `404.html` ładują wyłącznie CSS.
- **Fokus nakładek:** `wrapTabFocus` z `js/wrap-tab-focus.js` obsługuje zawijanie Tab/Shift+Tab na granicach listy kontrolek w menu mobilnym i lightboxie. `js/nav.js` i `js/lightbox.js` nadal samodzielnie wybierają dostępne kontrolki i sprawdzają stan otwarcia.
- **CSS:** `css/style.css` importuje warstwy w kolejności `tokens.css` → `base.css` → `layout.css` → `components.css` → `sections.css`. Motyw jasny nadpisuje tokeny kolorów w klasie `.theme--light`. Poniżej 768 px token `--mobile-contact-bar-clearance` z `css/tokens.css` dostarcza wspólny odstęp dla `padding-bottom` elementu `body` w `css/components.css` i `scroll-margin-bottom` opcji rezerwacji w `css/sections.css`, uwzględniając safe area; `js/booking.js` odczytuje obliczony margines przy korekcie widoczności wyboru.
- **Build:** `vite.config.js` ustawia `appType: "mpa"`, `base: "/"` i siedem wejść: sześć stron HTML oraz `service-worker.js`. Lokalne pluginy: `studio-noir-shared-header` (`build/shared-header.js`) renderuje nagłówek, `studio-noir-shared-footer` (`build/shared-footer.js`) renderuje stopkę i przycisk „Wróć na górę”, `studio-noir-primary-navigation` (`build/primary-navigation.js`) renderuje nawigację, `studio-noir-css-custom-properties` sprawdza odwołania do właściwości niestandardowych, `studio-noir-social-image-urls` zamienia ścieżkę `og:image` na adres absolutny, a `studio-noir-precache` uzupełnia service worker o listę precache, listę obrazów buforowanych na żądanie i wersję cache.
- **Pliki o stałych adresach:** `public/` zawiera manifest, ikonę, `robots.txt`, `sitemap.xml` i `_redirects`; Vite kopiuje je do `dist/` bez przetwarzania.

### Struktura projektu

```text
.
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .github/
│   └── workflows/
│       └── ci.yml          # workflow CI GitHub Actions (build, testy nawigacji, paska szybkiego kontaktu i interakcji)
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
│   ├── primary-navigation.js # wspólne wpisy i transformacja HTML nawigacji
│   ├── shared-header.js    # wspólny nagłówek i warianty strony głównej/prawnych (transformacja HTML)
│   └── shared-footer.js    # wspólna stopka i przycisk „Wróć na górę” (transformacja HTML)
├── css/
│   ├── style.css           # punkt wejścia CSS (@import warstw)
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── sections.css
├── js/
│   ├── main.js             # punkt wejścia JS, rejestracja service workera
│   ├── header.js
│   ├── nav.js
│   ├── wrap-tab-focus.js
│   ├── pwa-paths.js
│   ├── reveal.js
│   ├── lightbox.js
│   ├── booking.js
│   ├── theme.js
│   └── back-to-top.js
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
│   ├── nav.spec.js         # testy regresji przeglądarkowej nawigacji
│   ├── mobile-contact-bar.spec.js # testy regresji paska szybkiego kontaktu
│   ├── interactions.spec.js # testy regresji rezerwacji, lightboxa, „Wróć na górę” i trwałości motywu
│   ├── reveal.spec.js      # test pojawiania się sekcji na krótkich widokach
│   └── theme-first-paint.spec.js # testy motywu przed pierwszym renderowaniem
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
npm run dev                      # vite — serwer deweloperski, domyślnie http://localhost:5173
npm run build                    # vite build — build produkcyjny do dist/
npm run preview                  # vite preview — podgląd dist/, domyślnie http://localhost:4173
npm run test:nav                 # playwright test — testy regresji przeglądarkowej wspólnego kontraktu nawigacji
npm run test:mobile-contact-bar  # playwright test — testy regresji przeglądarkowej paska szybkiego kontaktu
npm run test:interactions        # playwright test — testy regresji przeglądarkowej rezerwacji, lightboxa, „Wróć na górę” i trwałości motywu
```

- Porty nie są ustawione w `vite.config.js`; podane wartości to domyślne ustawienia Vite.
- `npm run test:nav`, `npm run test:mobile-contact-bar` i `npm run test:interactions` korzystają z `playwright.config.js`, który sam uruchamia dedykowany serwer Vite dev na porcie 5183; wymagana jest przeglądarka Chromium dla Playwright (`npx playwright install chromium`).
- Specyfikacje bez skryptu npm uruchamia się bezpośrednio przez Playwright, z tą samą konfiguracją i tym samym serwerem: `npx playwright test tests/reveal.spec.js` oraz `npx playwright test tests/theme-first-paint.spec.js`.
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
  5. w `index.html`, `privacy.html`, `terms.html` lub `cookies.html` znacznik `<!-- studio-noir:primary-navigation -->` nie występuje dokładnie raz jako jedyna zawartość jedynej listy `<ul class="nav__list">` albo znacznik `<!-- studio-noir:footer-navigation -->` nie występuje dokładnie raz jako jedyna zawartość jednej listy `<ul class="footer__list">` w jedynym elemencie `<footer>` wyrenderowanej stopki. Tę kontrolę wykonuje transformacja z `build/primary-navigation.js`, więc błąd pojawia się także przy serwowaniu strony w `npm run dev`;
  6. w `index.html`, `privacy.html`, `terms.html` lub `cookies.html` znacznik `<!-- studio-noir:shared-footer -->` nie występuje dokładnie raz, samodzielnie w wierszu, między `</main>` a `</body>` (brak, duplikat lub zniekształcony wariant), źródłowy HTML nadal zawiera ręcznie wpisany element `<footer>`, `.footer__copyright` lub `[data-back-to-top]`, albo znacznik występuje w innym dokumencie HTML. Komunikat wskazuje stronę i oczekiwany znacznik. Tę kontrolę wykonuje transformacja z `build/shared-footer.js`, również przy serwowaniu strony w `npm run dev`;
  7. znacznik `<!-- studio-noir:shared-header -->` na jednej z czterech stron treści jest brakujący, powielony, zniekształcony lub nie znajduje się samodzielnie w wierszu bezpośrednio po skip linku i przed `<main>`, na poziomie `body`; pozostał ręcznie wpisany `<header>` lub hook nagłówka/menu (`data-header`, `data-nav`, `nav__list`); albo znacznik występuje na nieobsługiwanej stronie. `build/shared-header.js` wskazuje stronę i naruszony wymóg także w development. Wygenerowana lista nagłówka podlega następnie kontroli z punktu 5.
- `npm run test:nav` — skoncentrowane testy regresji przeglądarkowej nawigacji (`tests/nav.spec.js`):
  - etykiety, kolejność, cele i działanie siedmiu linków nagłówka oraz zgodność z nimi linków stopki na stronie głównej (`/`, `/index.html`) i stronach prawnych (`/privacy.html`, `/terms.html`, `/cookies.html`) bez JavaScript w przeglądarce, w widoku desktopowym;
  - wskaźnik bieżącej sekcji z `IntersectionObserver` i bez niego, w widoku mobilnym i desktopowym: sekcje z linkiem i bez linku, powrót na górę, wejście przez fragment `#services`, granice sekcji i zmiana rozmiaru okna;
  - menu mobilne jako okno modalne: stan ARIA, `inert`, blokada przewijania, przenoszenie i zawijanie fokusu, otwieranie klawiaturą oraz zamykanie przez Escape i wybór linku;
  - na czterech stronach treści przy 667×375, 812×375, 320×256 i 375×812: widoczny fokus początkowy i obrysy przy Tab/Shift+Tab, przewijanie kółkiem oraz geometria i trafianie wskaźnikiem do wszystkich akcji, dostępne zamknięcie, ponowne otwarcie, brak przepełnienia poziomego, wyśrodkowanie w pionie, oba motywy i przejście przez 900 px;
  - akcja „Umów wizytę” w menu mobilnym zamyka panel i prowadzi do sekcji rezerwacji (ze stron prawnych do `/index.html#booking`), a przełącznik motywu zmienia motyw bez zamykania menu;
  - kompaktowy link „Umów wizytę” w nagłówku przy 375 px: nad sekcją hero jest ukryty (`visibility: hidden`, `inert`), nie występuje w drzewie dostępności i jest pomijany przez Tab; po opuszczeniu hero jest osiągalny klawiszem Tab z widocznym obrysem fokusu i prowadzi do `#booking`;
  - czyszczenie stanu otwartego menu przy przejściu do układu desktopowego (900 px), zwolnienie pułapki fokusu i dostępność nawigacji desktopowej dla technologii asystujących.
- `npm run test:mobile-contact-bar` — skoncentrowane testy regresji przeglądarkowej paska szybkiego kontaktu (`tests/mobile-contact-bar.spec.js`), przy ograniczonym ruchu:
  - dwie akcje paska: liczba linków, cele (`#booking`, `tel:`), nazwy dostępne i teksty oraz brak akcji Instagram w pasku;
  - układ w jednym wierszu przy 320, 375 i 767 px: brak przepełnienia poziomego, cele dotykowe co najmniej 48 px i wysokość paska nie większa niż dolny odstęp `body` (`--mobile-contact-bar-clearance`); ukrycie paska przy 768 i 1280 px;
  - obie akcje jako kolejne przystanki Tab z widocznym obrysem fokusu mieszczącym się w pasku oraz przejście do sekcji rezerwacji klawiszem Enter;
  - niedostępność paska dla fokusu, wskaźnika i technologii asystujących przy otwartym menu mobilnym i lightboxie oraz jego powrót po zamknięciu klawiszem Escape;
  - odstęp fokusu przy 375×812 i 320×400: linki rezerwacji w kartach stylistów i elementy galerii osiągnięte klawiszem Tab pozostają wraz z obrysem fokusu nad paskiem, a element wyższy niż obszar między nagłówkiem a paskiem przynajmniej ten obszar przecina;
  - link do profilu Instagram w stopce strony głównej i stron prawnych (adres, `target`, `rel`, nazwa dostępna).
- `npm run test:interactions` — skoncentrowane testy regresji przeglądarkowej interakcji poza nawigacją (`tests/interactions.spec.js`), w widoku 1280×800 oraz w trzech dodatkowych rozmiarach lightboxa opisanych poniżej, przy ograniczonym ruchu (poza testem aktywacji wskaźnikiem):
  - rezerwacja: stan początkowy — opcje z `aria-pressed="false"`, „Zakończ demo” z `aria-disabled="true"` osiągalne klawiszem Tab, ze wskazówką z `aria-describedby` i bez skutku przy niepełnym wyborze; linki „Zarezerwuj” w kartach usług i stylistów zaznaczają opcję, zachowują wybór z drugiego kroku, prowadzą do `#booking` i przenoszą na opcję fokus, od którego kontynuuje się sekwencja Tab; zgodność podsumowania, `aria-pressed`, `aria-disabled` i wskazówki we wszystkich stanach; zakończenie demo bez nawigacji, żądań fetch, XHR lub beacon i zapisu w pamięci przeglądarki oraz jego reset po zmianie usługi lub stylisty;
  - lightbox: otwarcie miniaturą jako okno modalne z fokusem na przycisku zamknięcia, zdjęciem i podpisem z pozycją zgodnymi z miniaturą oraz blokadą przewijania; zawijanie Tab i Shift+Tab wśród kontrolek okna; strzałki ←/→ z przejściem w pętli przez oba końce galerii; zamknięcie klawiszem Escape z ukryciem okna przed technologiami asystującymi, przywróceniem przewijania i powrotem fokusu do miniatury ostatnio oglądanego zdjęcia, a nie tej, która otworzyła podgląd;
  - responsywny lightbox przy 320×256, 667×375 i 375×812, w obu motywach: załadowanie wszystkich sześciu zdjęć, użyteczny rozmiar rzeczywistej bitmapy z uwzględnieniem proporcji i przycinania, przewijanie kółkiem do obrazu, podpisu i kontrolek, trafianie wskaźnikiem, widoczny obrys fokusu przy Tab/Shift+Tab, cykliczna nawigacja i aktualizacja alt/podpisu, ponowne otwarcie, zamykanie klawiszem Escape, przyciskiem i nakładką, powrót fokusu, blokada i przywrócenie przewijania oraz ukrycie/powrót paska kontaktu;
  - „Wróć na górę”: widoczność tylko wtedy, gdy `.footer__copyright` przecina obszar widoku, w obu kierunkach przewijania, a w stanie ukrytym brak w sekwencji Tab i drzewie dostępności; aktywacja klawiaturą — natychmiastowy powrót na górę przy `prefers-reduced-motion: reduce`, bez fragmentu w adresie, z fokusem na skip linku i dalszą sekwencją Tab od początku strony; aktywacja wskaźnikiem bez ograniczenia ruchu — płynne przewinięcie i zdjęcie fokusu bez przenoszenia go do skip linku; ten sam przycisk, wyzwalacz i przekazanie fokusu na stronach prawnych;
  - trwałość motywu: motyw jasny wybrany przełącznikiem przy ciemnej preferencji systemowej zostaje zapisany w `localStorage` i pozostaje aktywny (klasy `<html>` i `body`, etykieta przełącznika) po przeładowaniu strony głównej i przejściu linkiem stopki do `privacy.html`. Rozstrzyganie motywu przed pierwszym renderowaniem, preferencje systemowe i błędy pamięci pozostają zakresem `tests/theme-first-paint.spec.js`.
- `npx playwright test tests/reveal.spec.js` — test regresji pojawiania się sekcji (`tests/reveal.spec.js`), uruchamiany bezpośrednio przez Playwright. Bez preferencji ograniczenia ruchu, na krótkich widokach 667×375 i 320×256 sprawdza, że elementy `[data-reveal]` poniżej początkowego widoku są początkowo ukryte, a każdy z jedenastu elementów — także kontenery wielokrotnie wyższe od widoku — po przewinięciu do niego przecina widok, ma klasę `is-visible` i pełną nieprzezroczystość.
- `npx playwright test tests/theme-first-paint.spec.js` — testy inicjalizacji motywu (`tests/theme-first-paint.spec.js`), uruchamiane bezpośrednio przez Playwright:
  - na `index.html`, `privacy.html`, `terms.html` i `cookies.html`, przy wstrzymanym `/js/main.js`, motyw ustawiony przez `public/theme-bootstrap.js` przed inicjalizacją aplikacji: klasa motywu na `<html>`, `color-scheme`, kolory `body` i `meta theme-color`, bez przeciwnego motywu na `<html>` na żadnym etapie ładowania;
  - przypadki: zapisany motyw jasny i ciemny, brak zapisanej wartości przy jasnej i ciemnej preferencji systemowej, niepoprawna zapisana wartość oraz `localStorage` zgłaszający wyjątek;
  - po inicjalizacji `js/theme.js`: etykieta przełącznika, zapis rozstrzygniętego motywu, przełączenie motywu i zapis zmiany;
  - bez JavaScript: statyczny ciemny motyw i neutralna etykieta przełącznika.
- `npm run preview` — serwuje `dist/` po `npm run build` i jako jedyne polecenie projektu uruchamia service worker, dlatego w nim sprawdza się ręcznie precache, zachowanie offline i produkcyjne działanie PWA. Jeżeli wcześniej zarejestrowano worker pod tym samym adresem i portem, należy go wyrejestrować w narzędziach deweloperskich przeglądarki i odświeżyć stronę. Podgląd nie stosuje konfiguracji Netlify (`_redirects`, nagłówki z `netlify.toml`).
- `git diff --check` — lekka, końcowa kontrola diffu przed commitem (błędy białych znaków, znaczniki konfliktów). Nie testuje aplikacji.

Wszystkich pięć specyfikacji Playwright działa w Chromium na serwerze Vite dev. Skrypty npm mają tylko `tests/nav.spec.js`, `tests/mobile-contact-bar.spec.js` i `tests/interactions.spec.js` i tylko one są uruchamiane w CI (sekcja [Ciągła integracja (CI)](#ciągła-integracja-ci)); `tests/reveal.spec.js` i `tests/theme-first-paint.spec.js` uruchamia się ręcznie. Testy nie sprawdzają `dist/` ani produkcyjnego PWA, w tym działania offline; nie zapewniają pełnej regresji, audytu dostępności ani pokrycia wielu przeglądarek.

Dobór kontroli:

| Zmiana | Kontrole |
| --- | --- |
| CSS, strony HTML w katalogu głównym, pliki w `public/` | `npm run build`, `git diff --check` |
| Wspólna nawigacja: `build/primary-navigation.js`, `build/shared-header.js`, znaczniki `<!-- studio-noir:shared-header -->`, markup nagłówka i menu, `js/header.js` (w tym kompaktowy link „Umów wizytę” w nagłówku), `js/nav.js`, `js/wrap-tab-focus.js`, style nawigacji i menu, przełączanie stanu mobilnego i desktopowego | `npm run build` (przy zmianach generowania HTML, CSS lub HTML), `npm run test:nav`, `npm run test:interactions` (przy zmianach `js/wrap-tab-focus.js`, używanego też przez lightbox), `git diff --check` |
| Wspólna stopka: `build/shared-footer.js` (marka, linki prawne i ich `aria-current`, dane kontaktowe, linki społecznościowe, prawa autorskie, markup przycisku „Wróć na górę”), znaczniki `<!-- studio-noir:shared-footer -->` | `npm run build`, `npm run test:nav` (linki stopki „Nawigacja”), `npm run test:mobile-contact-bar` (link Instagram w stopce), `npm run test:interactions` (przycisk „Wróć na górę” i jego wyzwalacz `.footer__copyright`), ręczna kontrola pozostałej zawartości stopki w `npm run dev`, `git diff --check` |
| Pasek szybkiego kontaktu: markup `.mobile-cta`, jego style, `--mobile-contact-bar-clearance`, `scroll-margin-bottom` linków w kartach stylistów i elementów galerii | `npm run build`, `npm run test:mobile-contact-bar`, `git diff --check` |
| Pojawianie się sekcji: `js/reveal.js`, atrybuty `data-reveal`, style `.reveal` | `npm run build`, `npx playwright test tests/reveal.spec.js`, `git diff --check` |
| Inicjalizacja i przełączanie motywu: `public/theme-bootstrap.js`, `js/theme.js`, tokeny motywu i `color-scheme` | `npm run build`, `npx playwright test tests/theme-first-paint.spec.js`, `npm run test:interactions` (trwałość motywu po przeładowaniu i między stronami), `git diff --check` |
| Przycisk „Wróć na górę”: `js/back-to-top.js`, style `.back-to-top`, markup w `build/shared-footer.js` | `npm run build`, `npm run test:interactions`, `git diff --check` |
| Rezerwacja i lightbox: `js/booking.js`, `js/lightbox.js`, markup i style sekcji rezerwacji, galerii i lightboxa | `npm run build`, `npm run test:interactions`, `npm run test:mobile-contact-bar` (ukrycie paska przy otwartym lightboxie), `git diff --check` |
| `service-worker.js`, `js/pwa-paths.js`, precache, `offline.html`, produkcyjne działanie PWA | `npm run build`, następnie `npm run preview`; `git diff --check` |
| Wyłącznie dokumentacja | `git diff --check` |

### Ciągła integracja (CI)

Workflow GitHub Actions `.github/workflows/ci.yml` uruchamia się przy pushu do `main` i dla pull requestów kierowanych do `main`. Jedno zadanie na `ubuntu-latest` z Node.js 22 wykonuje kolejno:

1. `npm ci`;
2. `npm run build` — build produkcyjny z kontrolami opisanymi w sekcji [Weryfikacja zmian](#weryfikacja-zmian);
3. `npx playwright install --with-deps chromium` — Chromium wraz z wymaganymi zależnościami systemowymi;
4. `npm run test:nav` — testy nawigacji na dedykowanym serwerze Vite dev (port 5183);
5. `npm run test:mobile-contact-bar` — testy paska szybkiego kontaktu, również na dedykowanym serwerze Vite dev;
6. `npm run test:interactions` — testy rezerwacji, lightboxa, przycisku „Wróć na górę” i trwałości motywu, w tym samym projekcie Chromium i na dedykowanym serwerze Vite dev.

CI nie uruchamia `tests/reveal.spec.js` ani `tests/theme-first-paint.spec.js`.

Błąd któregokolwiek kroku przerywa zadanie i oznacza przebieg jako nieudany. Workflow ma wyłącznie uprawnienie `contents: read`, a nowszy przebieg dla tej samej gałęzi lub pull requesta anuluje poprzedni, jeszcze trwający. CI tylko weryfikuje zmiany: nie modyfikuje repozytorium i nie wdraża witryny — wydanie produkcyjne pozostaje ręczną publikacją przez Netlify CLI, opisaną w sekcji [Wdrożenie](#wdrożenie).

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

Pliki te są konfiguracją repozytorium, a nie mechanizmem wydania: nie publikują niczego, a sama konfiguracja nie potwierdza aktywnego wdrożenia. Repozytorium nie zawiera workflow wdrożeniowego — workflow CI w GitHub Actions tylko weryfikuje zmiany i niczego nie publikuje.

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
- Przy wysokości okna do 480 px lightbox ma mniejsze odstępy i przeznacza na wiersz obrazu co najmniej połowę wysokości okna; obraz zachowuje proporcje dzięki `object-fit: contain`. Podpis i kontrolki można odsłonić przewijaniem wewnątrz dialogu, również przez zmianę fokusu klawiaturą. Przy 320×256 i 667×375 cały obraz jest widoczny po otwarciu; zwykły układ pionowy i desktopowy zachowują dotychczasowy wygląd.
- Opcje rezerwacji to natywne przyciski z `aria-pressed`, a podsumowanie jest regionem `aria-live="polite"`. Do czasu wyboru usługi i stylisty oraz po zakończeniu demo przycisk „Zakończ demo” pozostaje dostępny przez Tab z `aria-disabled="true"` i wskazówką powiązaną przez `aria-describedby`, która opisuje brakujący wybór lub sposób powtórzenia demo; JavaScript blokuje zakończenie demo przy niepełnym wyborze.
- Przycisk „Wróć na górę” to natywny `button` z etykietą `aria-label`. Aktywacja klawiaturą lub przez technologie asystujące (zdarzenie `click` bez liczby kliknięć wskaźnika) przenosi fokus do skip linku „Przejdź do treści” (`#main`) na początku sekwencji Tab; aktywacja wskaźnikiem jedynie zdejmuje fokus z przycisku. Gdy przycisk nie jest widoczny, `visibility: hidden` i `pointer-events: none` wykluczają go z obsługi wskaźnikiem, sekwencji Tab i drzewa dostępności; jest też ukryty, gdy otwarte jest menu mobilne lub lightbox.
- Obrazy treściowe mają teksty alternatywne.
- Przy `prefers-reduced-motion: reduce` CSS wyłącza płynne przewijanie i skraca animacje oraz przejścia, `js/reveal.js` pomija animacje pojawiania się, a `js/back-to-top.js` przewija na początek strony natychmiast.

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
- Etykiety, kolejność i cele głównych linków zmienia się w `build/primary-navigation.js`. Zmiana obejmuje jednocześnie nagłówek i grupę stopki „Nawigacja”.
- Strukturę nagłówka i warianty linków logo i rezerwacji oraz kompaktowego CTA zmienia się w `build/shared-header.js`. Cztery źródłowe strony zawierają wyłącznie znaczniki `<!-- studio-noir:shared-header -->` i `<!-- studio-noir:shared-footer -->` w miejscach nagłówka i stopki. Kolejność transformacji `pre` w `vite.config.js` musi pozostać `sharedHeader(root)` → `sharedFooter(root)` → `primaryNavigation(root)`; nawigacja wypełnia znaczniki list wygenerowane przez oba renderery, a błędna kolejność przerywa transformację.
- Pozostałą zawartość stopki (marka, linki prawne, dane kontaktowe, linki społecznościowe, prawa autorskie) i markup przycisku „Wróć na górę” zmienia się wyłącznie w `build/shared-footer.js`; zmiana obejmuje wszystkie cztery strony.
- `.gitignore` wyklucza wyniki buildu, zależności i lokalne artefakty. `.gitattributes` określa LF dla tekstowych źródeł i konfiguracji oraz traktuje fonty i obrazy rastrowe jako binarne. `.editorconfig` ustala UTF-8, LF, wcięcia po dwie spacje i końcowy znak nowej linii; zachowuje końcowe spacje w Markdown.
- Nowa strona HTML wymaga dodania wejścia w `build.rolldownOptions.input` w `vite.config.js`; brak wejścia dla strony w katalogu głównym przerywa build. Nowe strony i nowe pliki w `public/` trafiają do listy precache automatycznie, a nowe warianty obrazów z `assets/img/hero/`, `assets/img/stylists/` i `assets/img/gallery/` używane przez strony — na listę obrazów na żądanie.
- Wersji cache ani list cache nie zmienia się ręcznie; znaczniki `__STUDIO_NOIR_PRECACHE__`, `__STUDIO_NOIR_ON_DEMAND_IMAGES__` i `__STUDIO_NOIR_CACHE_VERSION__` muszą pozostać w `service-worker.js`.
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
- the images in `assets/img/` (hero, stylists, gallery) are AI-generated demonstration images created for the fictional Studio Noir; they do not document the work of a real salon. The original PNG files are kept alongside responsive AVIF and WebP variants, and the pages reference only the variants;
- `privacy.html`, `terms.html`, and `cookies.html` contain legal and informational content written for the Studio Noir demonstration site; they are not ready-to-use legal documentation for a real salon.
- the contact details published in the location section, the footers, the legal documents, and the alternative contact channels belong to the project author (KP_Code Digital Studio) and are not those of an operating hair salon; the opening hours remain a demonstration example.

### Key Features

- Anchor navigation with active-section highlighting (`IntersectionObserver`, `aria-current`) and a scrolled header state — `js/header.js`.
- Mobile menu (below 900 px) in a dialog panel with a focus trap, Escape-key closing, and page scroll locking — `js/nav.js`. The panel stays centered when content fits and scrolls internally on short viewports, with an accessible close control and room for focus outlines — `css/components.css`.
- Gallery with a lightbox image preview — `js/lightbox.js`.
- Demonstration booking widget with two selections (service and stylist), a live summary, and a "Zakończ demo" action — `js/booking.js`. Completing the demo only changes the status and the button label: nothing is sent or stored and no appointment is created. Changing the service or stylist after completion resets that state. Links in the service and stylist cards (`data-booking-preselect-service`, `data-booking-preselect-stylist`) preselect the matching option and move focus to it; without JavaScript, or on a modifier-key click, they behave as ordinary links to `#booking`. The section also offers alternative contact channels (phone, email) and a `<noscript>` message.
- Dark and light theme toggle that remembers the theme; the initial theme comes from the stored value or the system preference (details under [Data and State Persistence](#data-and-state-persistence)) — `js/theme.js`.
- Below 768 px: a fixed quick-contact bar at the bottom of the screen (a `nav` labelled "Szybki kontakt") with a primary "Demo rezerwacji" action (a link to `#booking`) and a secondary "Telefon autora" link (`tel:`); both actions are plain links without JavaScript handling. While the mobile menu or the lightbox is open, the bar is hidden (`visibility: hidden`) and unavailable to pointer, Tab, and assistive-technology access. Separately, the header contains a compact "Umów wizytę" button that appears once the hero section leaves the viewport — `js/header.js`.
- Section reveal animations — `js/reveal.js`.
- A "Wróć na górę" (back to top) button on the home page and the legal pages — `js/back-to-top.js`. The button is visible only while the footer's copyright line (`.footer__copyright`) intersects the viewport, in either scroll direction; the state comes from `IntersectionObserver`, or, without it, from a position check on `scroll` and `resize` events. Activation scrolls the page to the top without adding a fragment to the URL, and with `prefers-reduced-motion: reduce` the scroll is immediate. Below 768 px on the home page, the button sits above the quick-contact bar.
- Custom 404 page and an offline page served by the service worker.

### Tech Stack

- **Runtime:** HTML, CSS with native custom properties (no preprocessor), and dependency-free JavaScript ES modules.
- **Fonts:** two complete, self-hosted variable WOFF2 fonts declared in `css/base.css`: Playfair Display (400–900) and Inter (100–900); the site uses weights 400–700. Both cover basic Latin, Polish characters, numbers, and content punctuation.

  Playfair Display 1.203 comes from [Google Fonts, commit `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/playfairdisplay); the original TTF was packed into WOFF2 without subsetting or changes to glyphs, metrics, or names. Inter 4.001 is the unchanged `InterVariable.woff2` from [the author's `v4.1` release](https://github.com/rsms/inter/tree/v4.1/docs/font-files) (optical size axis 14–32). Both fonts use SIL OFL 1.1; full notices and licenses in `public/font-licenses/playfair-display-OFL.txt` and `public/font-licenses/inter-OFL.txt` are included in `dist/font-licenses/` during the build.
- **Build:** Vite `^8.3.1` (8.3.1 in `package-lock.json`) — a development dependency (`devDependencies`); build inputs are configured through `build.rolldownOptions`.
- **Testing:** Playwright — `@playwright/test` `^1.63.0` (1.63.0 in `package-lock.json`), a development dependency used by the focused browser regression tests for the navigation, the mobile contact bar, interactions (booking, lightbox, "Wróć na górę", theme persistence), section reveal, and theme initialization.
- **Environment:** Node.js `^20.19.0 || >=22.12.0` (`engines` in `package.json`), npm (`package-lock.json`).
- **Deployment:** Netlify configuration (`netlify.toml`, `public/_redirects`).

### Architecture

- **Canonical sources:** HTML documents in the repository root, `build/`, `css/`, `js/`, `assets/`, `public/`, and `service-worker.js`. The HTML references `/css/style.css` and `/js/main.js` directly.
- **Header:** `build/shared-header.js` renders the shared header at one `<!-- studio-noir:shared-header -->` marker in `index.html`, `privacy.html`, `terms.html`, and `cookies.html`, directly after the skip link and before `<main>`. On the home page, the logo targets `#top`, booking links target `#booking`, and the compact CTA starts `inert`; legal pages use `/index.html#top` and `/index.html#booking` and omit the compact CTA. Structure, classes, ARIA, and `data-*` attributes remain shared. In both Vite modes, the `pre` transforms run in the order `sharedHeader(root)` → `sharedFooter(root)` → `primaryNavigation(root)`; `404.html` and `offline.html` remain without a header.
- **Navigation:** `build/primary-navigation.js` defines the seven primary entries. Vite's HTML transformation renders both the header `.nav__list` and the `.footer__list` in the "Nawigacja" footer group from the same entries during development and production builds: destinations are `#section` on the home page and `/index.html#section` on legal pages. The rendered links exist without browser JavaScript; opening the mobile panel still requires JavaScript. The `<!-- studio-noir:primary-navigation -->` marker sits in the header list generated by `build/shared-header.js`, and the `<!-- studio-noir:footer-navigation -->` marker in the footer list generated by `build/shared-footer.js`.
- **Footer:** `build/shared-footer.js` is the canonical source of the shared footer on the home page and the legal pages: the brand and its description, the "Nawigacja" group with the navigation marker, the legal links of the "Informacje" group, the contact details with the author attribution, the Google Maps link, and the contact channels, the social links, and the copyright line, plus the "Wróć na górę" button placed directly after the `<footer>` element. Vite's HTML transformation replaces the `<!-- studio-noir:shared-footer -->` marker with it in `index.html`, `privacy.html`, `terms.html`, and `cookies.html` during development and production builds. On a legal page, its own link in the "Informacje" group receives `aria-current="page"`; on the home page, no legal link is marked. The footer transform runs before `build/primary-navigation.js`, which fills the "Nawigacja" list. `404.html` and `offline.html` have no footer.
- **JavaScript:** `js/main.js` is the single entry point, loaded by the home page and the legal pages. It imports the feature modules and calls their `init*` functions once the DOM is ready. Each module locates its elements through `data-*` attributes and exits early when they are absent, so the same script serves every page. `offline.html` and `404.html` load CSS only.
- **Overlay focus:** `wrapTabFocus` from `js/wrap-tab-focus.js` wraps Tab/Shift+Tab at the boundaries of the control list in the mobile menu and lightbox. `js/nav.js` and `js/lightbox.js` still select their own eligible controls and check their open state.
- **CSS:** `css/style.css` imports the layers in the order `tokens.css` → `base.css` → `layout.css` → `components.css` → `sections.css`. The light theme overrides the colour tokens in the `.theme--light` class. Below 768 px, the `--mobile-contact-bar-clearance` token from `css/tokens.css` supplies shared clearance for `padding-bottom` on `body` in `css/components.css` and booking-choice `scroll-margin-bottom` in `css/sections.css`, including the safe area; `js/booking.js` reads the computed margin when correcting choice visibility.
- **Build:** `vite.config.js` sets `appType: "mpa"`, `base: "/"`, and seven inputs: the six HTML pages and `service-worker.js`. Local plugins: `studio-noir-shared-header` (`build/shared-header.js`) renders the header, `studio-noir-shared-footer` (`build/shared-footer.js`) renders the footer and the "Wróć na górę" button, `studio-noir-primary-navigation` (`build/primary-navigation.js`) renders the navigation, `studio-noir-css-custom-properties` checks custom-property references, `studio-noir-social-image-urls` turns the `og:image` path into an absolute URL, and `studio-noir-precache` injects the precache list, the on-demand image list, and the cache version into the service worker.
- **Stable-path files:** `public/` holds the manifest, icon, `robots.txt`, `sitemap.xml`, and `_redirects`; Vite copies them into `dist/` without processing.

### Project Structure

```text
.
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI workflow (build, navigation, mobile contact-bar and interaction tests)
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
│   ├── primary-navigation.js # shared entries and navigation HTML transform
│   ├── shared-header.js    # shared header and home/legal variants (HTML transform)
│   └── shared-footer.js    # shared footer and "Wróć na górę" button (HTML transform)
├── css/
│   ├── style.css           # CSS entry point (@import of layers)
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── sections.css
├── js/
│   ├── main.js             # JS entry point, service worker registration
│   ├── header.js
│   ├── nav.js
│   ├── wrap-tab-focus.js
│   ├── pwa-paths.js
│   ├── reveal.js
│   ├── lightbox.js
│   ├── booking.js
│   ├── theme.js
│   └── back-to-top.js
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
│   ├── nav.spec.js         # browser regression tests for the navigation
│   ├── mobile-contact-bar.spec.js # browser regression tests for the mobile contact bar
│   ├── interactions.spec.js # booking, lightbox, "Wróć na górę", and theme persistence regression tests
│   ├── reveal.spec.js      # section reveal test on short viewports
│   └── theme-first-paint.spec.js # first-paint theme tests
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
npm run dev                      # vite — development server, default http://localhost:5173
npm run build                    # vite build — production build into dist/
npm run preview                  # vite preview — serves dist/, default http://localhost:4173
npm run test:nav                 # playwright test — browser regression tests for the shared navigation contract
npm run test:mobile-contact-bar  # playwright test — browser regression tests for the mobile contact bar
npm run test:interactions        # playwright test — browser regression tests for booking, the lightbox, "Wróć na górę", and theme persistence
```

- Ports are not set in `vite.config.js`; the values above are Vite defaults.
- `npm run test:nav`, `npm run test:mobile-contact-bar`, and `npm run test:interactions` use `playwright.config.js`, which starts its own dedicated Vite dev server on port 5183; the Playwright Chromium browser is required (`npx playwright install chromium`).
- Specifications without an npm script are run directly through Playwright, with the same configuration and server: `npx playwright test tests/reveal.spec.js` and `npx playwright test tests/theme-first-paint.spec.js`.
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
  5. in `index.html`, `privacy.html`, `terms.html`, or `cookies.html`, the `<!-- studio-noir:primary-navigation -->` marker does not appear exactly once as the only content of a single `<ul class="nav__list">`, or the `<!-- studio-noir:footer-navigation -->` marker does not appear exactly once as the only content of one `<ul class="footer__list">` inside the single `<footer>` element of the rendered footer. This check is performed by the transform in `build/primary-navigation.js`, so the error also appears when the page is served by `npm run dev`;
  6. in `index.html`, `privacy.html`, `terms.html`, or `cookies.html`, the `<!-- studio-noir:shared-footer -->` marker does not appear exactly once, on its own line, between `</main>` and `</body>` (missing, duplicated, or a malformed variant), the source HTML still contains a hand-written `<footer>` element, `.footer__copyright`, or `[data-back-to-top]`, or the marker appears in another HTML document. The message names the page and the expected marker. This check is performed by the transform in `build/shared-footer.js`, so the error also appears when the page is served by `npm run dev`;
  7. the `<!-- studio-noir:shared-header -->` marker on any of the four content pages is missing, duplicated, malformed, or is not on its own line directly after the skip link and before `<main>`, at body level; hand-written `<header>` or header/menu hooks (`data-header`, `data-nav`, `nav__list`) remain; or the marker appears on an unsupported page. `build/shared-header.js` names the page and violated requirement in development as well. The generated header list then undergoes the check in item 5.
- `npm run test:nav` — focused browser regression tests for the navigation (`tests/nav.spec.js`):
  - labels, order, destinations, and activation of the seven header links, and the footer links matching them, on the home page (`/`, `/index.html`) and legal pages (`/privacy.html`, `/terms.html`, `/cookies.html`) without browser JavaScript, in the desktop layout;
  - the current-section indicator with and without `IntersectionObserver`, in mobile and desktop layouts: linked and unlinked sections, return to the top, a direct `#services` fragment load, section boundaries, and viewport resize;
  - the mobile menu as a modal: ARIA state, `inert`, scroll locking, focus movement and wrapping, keyboard opening, and closing on Escape and link activation;
  - on all four content pages at 667×375, 812×375, 320×256, and 375×812: visible initial focus and Tab/Shift+Tab outlines, wheel scrolling and geometry/pointer hit testing for every action, close-control access, reopening, no horizontal overflow, portrait centering, both themes, and transitions across 900 px;
  - the "Umów wizytę" action in the mobile menu closes the panel and leads to the booking section (to `/index.html#booking` from the legal pages), while the theme toggle changes the theme without closing the menu;
  - the compact "Umów wizytę" header link at 375 px: over the hero section it is hidden (`visibility: hidden`, `inert`), absent from the accessibility tree, and skipped by Tab; once the hero leaves the viewport, it is reachable with Tab, shows a visible focus outline, and leads to `#booking`;
  - clearing the open menu's mobile state when switching to the desktop layout (900 px), releasing the focus trap, and desktop navigation exposure to assistive technologies.
- `npm run test:mobile-contact-bar` — focused browser regression tests for the quick-contact bar (`tests/mobile-contact-bar.spec.js`), with reduced motion:
  - the bar's two actions: link count, destinations (`#booking`, `tel:`), accessible names and text, and no Instagram action in the bar;
  - a one-row layout at 320, 375, and 767 px: no horizontal overflow, touch targets of at least 48 px, and a bar height no greater than the `body` bottom clearance (`--mobile-contact-bar-clearance`); the bar stays hidden at 768 and 1280 px;
  - both actions as consecutive Tab stops with a visible focus outline kept inside the bar, and moving to the booking section with Enter;
  - the bar unavailable to focus, pointer, and assistive technologies while the mobile menu or the lightbox is open, and its return after closing with Escape;
  - focus clearance at 375×812 and 320×400: stylist-card booking links and gallery items reached with Tab stay above the bar together with their focus outline, and an element taller than the area between the header and the bar at least crosses that area;
  - the Instagram profile link in the footer of the home page and the legal pages (URL, `target`, `rel`, accessible name).
- `npm run test:interactions` — focused browser regression tests for the interactions outside the navigation (`tests/interactions.spec.js`), at 1280×800 and the three additional lightbox sizes below, with reduced motion (except the pointer-activation test):
  - booking: the initial state — options with `aria-pressed="false"`, and "Zakończ demo" with `aria-disabled="true"` reachable with Tab, carrying its `aria-describedby` hint, and without effect on an incomplete selection; the "Zarezerwuj" links in the service and stylist cards select the option, keep the choice from the other step, lead to `#booking`, and move focus to the option, from which the Tab sequence continues; the summary, `aria-pressed`, `aria-disabled`, and the hint stay consistent in every state; completing the demo causes no navigation, no fetch, XHR, or beacon request, and no browser-storage write, and changing the service or stylist resets it;
  - lightbox: a thumbnail opens a modal dialog with focus on the close button, an image and position caption matching the thumbnail, and scrolling locked; Tab and Shift+Tab wrap among the dialog controls; the ←/→ keys loop through both ends of the gallery; Escape hides the dialog from assistive technologies, restores scrolling, and returns focus to the thumbnail of the last viewed image rather than the one that opened the preview;
  - responsive lightbox at 320×256, 667×375, and 375×812 in both themes: loading all six images, useful actual bitmap dimensions accounting for aspect ratio and clipping, wheel access to the image/caption/controls, pointer hit testing, visible Tab/Shift+Tab outlines, cyclic navigation and alt/caption updates, reopening, Escape/button/overlay closing, focus return, scroll locking/restoration, and contact-bar hiding/restoration;
  - "Wróć na górę": visible only while `.footer__copyright` intersects the viewport, in both scroll directions, and absent from the Tab sequence and the accessibility tree while hidden; keyboard activation returns to the top immediately with `prefers-reduced-motion: reduce`, adds no URL fragment, focuses the skip link, and the Tab sequence continues from the start of the page; pointer activation without reduced motion scrolls smoothly and releases focus without moving it to the skip link; the same control, trigger, and focus hand-off on the legal pages;
  - theme persistence: a light theme chosen with the toggle under a dark system preference is stored in `localStorage` and stays active (`<html>` and `body` classes, toggle label) after a home page reload and after following the footer link to `privacy.html`. First-paint theme resolution, system preferences, and storage failures remain the scope of `tests/theme-first-paint.spec.js`.
- `npx playwright test tests/reveal.spec.js` — the section reveal regression test (`tests/reveal.spec.js`), run directly through Playwright. Without a reduced-motion preference, on the short 667×375 and 320×256 viewports, it checks that `[data-reveal]` elements below the initial viewport start hidden, and that each of the eleven elements — including containers several times taller than the viewport — intersects the viewport once scrolled to, has the `is-visible` class, and is fully opaque.
- `npx playwright test tests/theme-first-paint.spec.js` — theme initialization tests (`tests/theme-first-paint.spec.js`), run directly through Playwright:
  - on `index.html`, `privacy.html`, `terms.html`, and `cookies.html`, with `/js/main.js` held back, the theme set by `public/theme-bootstrap.js` before application initialization: the theme class on `<html>`, `color-scheme`, `body` colours, and `meta theme-color`, with the opposite theme never present on `<html>` during loading;
  - cases: stored light and dark themes, no stored value with light and dark system preferences, an invalid stored value, and a throwing `localStorage`;
  - after `js/theme.js` initializes: the toggle label, persistence of the resolved theme, switching the theme, and persistence of the change;
  - without JavaScript: the static dark theme and the neutral toggle label.
- `npm run preview` — serves `dist/` after `npm run build` and is the only project command in which the service worker runs, so precache, offline behaviour, and production PWA behaviour are checked there manually. If a worker was previously registered on the same address and port, unregister it in the browser developer tools and reload the page. Preview does not apply the Netlify configuration (`_redirects`, headers from `netlify.toml`).
- `git diff --check` — lightweight final diff check before committing (whitespace errors, conflict markers). It does not test the application.

All five Playwright specifications run in Chromium against the Vite dev server. Only `tests/nav.spec.js`, `tests/mobile-contact-bar.spec.js`, and `tests/interactions.spec.js` have npm scripts, and only they run in CI (see [Continuous Integration (CI)](#continuous-integration-ci)); `tests/reveal.spec.js` and `tests/theme-first-paint.spec.js` are run manually. The tests do not check `dist/` or production PWA behaviour, including offline behaviour; they do not provide complete regression, an accessibility audit, or cross-browser coverage.

Choosing checks:

| Change | Checks |
| --- | --- |
| CSS, root-level HTML pages, files in `public/` | `npm run build`, `git diff --check` |
| Shared navigation: `build/primary-navigation.js`, `build/shared-header.js`, `<!-- studio-noir:shared-header -->` markers, header and menu markup, `js/header.js` (including the compact "Umów wizytę" header link), `js/nav.js`, `js/wrap-tab-focus.js`, navigation and menu styles, mobile/desktop state switching | `npm run build` (for changes to HTML generation, CSS, or HTML), `npm run test:nav`, `npm run test:interactions` (for changes to `js/wrap-tab-focus.js`, which the lightbox also uses), `git diff --check` |
| Shared footer: `build/shared-footer.js` (brand, legal links and their `aria-current`, contact details, social links, copyright, "Wróć na górę" button markup), the `<!-- studio-noir:shared-footer -->` markers | `npm run build`, `npm run test:nav` ("Nawigacja" footer links), `npm run test:mobile-contact-bar` (footer Instagram link), `npm run test:interactions` (the "Wróć na górę" button and its `.footer__copyright` trigger), manual check of the remaining footer content in `npm run dev`, `git diff --check` |
| Quick-contact bar: `.mobile-cta` markup, its styles, `--mobile-contact-bar-clearance`, stylist-card link and gallery-item `scroll-margin-bottom` | `npm run build`, `npm run test:mobile-contact-bar`, `git diff --check` |
| Section reveal: `js/reveal.js`, `data-reveal` attributes, `.reveal` styles | `npm run build`, `npx playwright test tests/reveal.spec.js`, `git diff --check` |
| Theme initialization and switching: `public/theme-bootstrap.js`, `js/theme.js`, theme tokens and `color-scheme` | `npm run build`, `npx playwright test tests/theme-first-paint.spec.js`, `npm run test:interactions` (theme persistence across a reload and pages), `git diff --check` |
| "Wróć na górę" button: `js/back-to-top.js`, `.back-to-top` styles, markup in `build/shared-footer.js` | `npm run build`, `npm run test:interactions`, `git diff --check` |
| Booking and lightbox: `js/booking.js`, `js/lightbox.js`, booking, gallery, and lightbox markup and styles | `npm run build`, `npm run test:interactions`, `npm run test:mobile-contact-bar` (bar hidden while the lightbox is open), `git diff --check` |
| `service-worker.js`, `js/pwa-paths.js`, precache, `offline.html`, production PWA behaviour | `npm run build`, then `npm run preview`; `git diff --check` |
| Documentation only | `git diff --check` |

### Continuous Integration (CI)

The GitHub Actions workflow `.github/workflows/ci.yml` runs on pushes to `main` and on pull requests targeting `main`. A single job on `ubuntu-latest` with Node.js 22 runs, in order:

1. `npm ci`;
2. `npm run build` — the production build with the checks listed under [Change Verification](#change-verification);
3. `npx playwright install --with-deps chromium` — Chromium with its required system dependencies;
4. `npm run test:nav` — the navigation tests against the dedicated Vite dev server (port 5183);
5. `npm run test:mobile-contact-bar` — the quick-contact bar tests, also against the dedicated Vite dev server;
6. `npm run test:interactions` — the booking, lightbox, "Wróć na górę", and theme persistence tests, in the same Chromium project and against the dedicated Vite dev server.

CI does not run `tests/reveal.spec.js` or `tests/theme-first-paint.spec.js`.

A failure in any step stops the job and marks the run as failed. The workflow has only the `contents: read` permission, and a newer run for the same branch or pull request cancels a superseded run still in progress. CI only validates changes: it does not modify the repository or deploy the site — production releases remain a manual Netlify CLI publish, as described under [Deployment](#deployment).

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

These files are repository configuration, not the release mechanism: they do not publish anything by themselves, and the configuration alone does not confirm an active deployment. The repository contains no deployment workflow — the GitHub Actions CI workflow only validates changes and publishes nothing.

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
- At viewport heights up to 480 px, the lightbox reduces spacing and reserves at least half the viewport height for the image row; `object-fit: contain` preserves the image aspect ratio. Internal scrolling reveals the caption and controls, including through keyboard focus movement. At 320×256 and 667×375 the entire image is visible on opening; ordinary portrait and desktop layouts retain their appearance.
- Booking options are native buttons with `aria-pressed`, and the summary is an `aria-live="polite"` region. Until both a service and a stylist are selected, and after the demo is completed, the "Zakończ demo" button stays in the Tab sequence with `aria-disabled="true"` and a hint linked through `aria-describedby` that describes the missing choice or how to repeat the demo; JavaScript blocks completing the demo with an incomplete selection.
- The "Wróć na górę" button is a native `button` with an `aria-label`. Keyboard or assistive-technology activation (a `click` event with no pointer click count) moves focus to the "Przejdź do treści" skip link (`#main`) at the start of the Tab sequence; pointer activation only releases the button's focus. While the button is not visible, `visibility: hidden` and `pointer-events: none` remove it from pointer, Tab, and accessibility-tree access; it is also hidden while the mobile menu or the lightbox is open.
- Content images have text alternatives.
- With `prefers-reduced-motion: reduce`, CSS disables smooth scrolling and shortens animations and transitions, `js/reveal.js` skips the reveal animations, and `js/back-to-top.js` scrolls to the top immediately.

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
- Primary-link labels, order, and destinations are changed in `build/primary-navigation.js`. A change applies to both the header and the "Nawigacja" footer group.
- Header structure and the logo, booking-link, and compact-CTA variants are changed in `build/shared-header.js`. The four source pages contain only `<!-- studio-noir:shared-header -->` and `<!-- studio-noir:shared-footer -->` markers in place of the header and footer. The `pre` transform order in `vite.config.js` must stay `sharedHeader(root)` → `sharedFooter(root)` → `primaryNavigation(root)`; navigation fills the list markers emitted by both renderers, and an incorrect order fails the transformation.
- The rest of the footer (brand, legal links, contact details, social links, copyright) and the "Wróć na górę" button markup are changed only in `build/shared-footer.js`; a change applies to all four pages.
- `.gitignore` excludes build output, dependencies, and local artifacts. `.gitattributes` sets LF for text sources and configuration and treats fonts and raster images as binary. `.editorconfig` sets UTF-8, LF, two-space indentation, and a final newline; it preserves trailing spaces in Markdown.
- A new HTML page requires a new entry in `build.rolldownOptions.input` in `vite.config.js`; a root-level page without an entry fails the build. New pages and new files in `public/` are added to the precache list automatically, and new image variants from `assets/img/hero/`, `assets/img/stylists/`, and `assets/img/gallery/` used by the pages are added to the on-demand image list.
- The cache version and cache lists are never changed manually; the `__STUDIO_NOIR_PRECACHE__`, `__STUDIO_NOIR_ON_DEMAND_IMAGES__`, and `__STUDIO_NOIR_CACHE_VERSION__` markers must remain in `service-worker.js`.
- The change history is kept in [docs/CHANGELOG.md](docs/CHANGELOG.md).
- Improvement-report lifecycle:
  - An active report (for example `IMPROVEMENTS-WORKFLOW.md`) stays in the repository root until all of its items are resolved.
  - [AGENTS.md](AGENTS.md) is the canonical agent contract, including the completion-record format. Once an improvement is implemented and verified, its detailed proposal is replaced with a concise completion record (status, result, verification, original impact and effort). Obsolete proposal details (evidence, implementation plan, acceptance criteria) are removed only after verified completion; open and incomplete proposals remain unchanged.
  - A report remains active until all of its items are resolved. The finalised report is moved to `docs/archive/improvements/` as `IMPROVEMENTS-<CATEGORY>-<YYYY-MM-DD>.md`. The filename date is the completion date of the cycle, not the analysis date — the UI report analysed on 2026-09-28 was archived as `IMPROVEMENTS-UI-2026-10-04.md`.
