import { relative } from "node:path";

// Build-time source only; the browser receives ordinary header HTML.
const PAGES = new Set(["index.html", "privacy.html", "terms.html", "cookies.html"]);
const MARKER_NAME = "studio-noir:shared-header";
const INSERTION_POINT = `<!-- ${MARKER_NAME} -->`;
const PLUGIN = "studio-noir-shared-header";

const occurrences = (html, marker) => html.split(marker).length - 1;

// Keep the header a body-level landmark, directly after the skip link and
// before <main>. The rendered lines continue the marker's indentation.
function assertInsertionPoint(html, page) {
  const lines = [...html.matchAll(/^[ \t]*<!-- studio-noir:shared-header -->[ \t]*\r?$/gm)];
  const index = html.indexOf(INSERTION_POINT);
  if (
    lines.length !== 1 ||
    occurrences(html, MARKER_NAME) !== 1 ||
    !/<body\b[^>]*>\s*<a class="skip-link" href="#main">[^<]*<\/a>\s*$/i.test(html.slice(0, index)) ||
    !/^\s*<main\b/i.test(html.slice(index + INSERTION_POINT.length))
  ) {
    throw new Error(
      `[${PLUGIN}] ${page}: expected exactly one ${INSERTION_POINT} on its own line directly after the skip link and before <main>, at body level. ` +
        "The insertion point is missing, duplicated, malformed, or misplaced."
    );
  }
}

// Leftover header/menu markup would duplicate landmarks, IDs, or DOM hooks.
function assertNoHandWrittenHeader(html, page) {
  if (/<header\b|\bdata-header\b|\bdata-nav\b|\bnav__list\b/i.test(html)) {
    throw new Error(
      `[${PLUGIN}] ${page}: found hand-written <header>, [data-header], [data-nav], or .nav__list markup. ` +
        `The header comes only from ${INSERTION_POINT}; remove the duplicate markup.`
    );
  }
}

// primaryNavigation() validates and fills the sole content of .nav__list
// after both shared renderers have emitted their navigation insertion points.
function renderHeader(page) {
  const isHome = page === "index.html";
  const prefix = isHome ? "" : "/index.html";
  const miniCta = isHome
    ? `
        <a class="button header__booking header__mini-cta" href="#booking" data-header-mini-cta inert>
          Umów wizytę
        </a>`
    : "";

  return `<header class="header" data-header>
      <div class="container header__inner">
        <a class="logo" href="${prefix}#top" aria-label="Studio Noir">
          <span class="brand-symbol logo__symbol" aria-hidden="true"></span>
          <span class="logo__mark">Studio Noir</span>
          <span class="logo__sub">Hair &amp; Style</span>
        </a>${miniCta}
        <nav class="nav" aria-label="Główna" data-nav>
          <div data-nav-dialog>
            <button
              class="nav__toggle"
              type="button"
              data-nav-toggle
              aria-expanded="false"
              aria-controls="primary-menu"
              aria-label="Otwórz menu">
              <span class="nav__toggle-line" aria-hidden="true"></span>
              <span class="nav__toggle-line" aria-hidden="true"></span>
              <span class="nav__toggle-line" aria-hidden="true"></span>
            </button>
            <div class="nav__panel" id="primary-menu" data-nav-panel>
              <ul class="nav__list">
                <!-- studio-noir:primary-navigation -->
              </ul>
              <div class="nav__cta">
                <a class="button header__booking" href="${prefix}#booking">Umów wizytę</a>
                <button class="theme-toggle" data-theme-toggle type="button" aria-label="Przełącz motyw kolorystyczny"></button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>`;
}

export function sharedHeader(root) {
  return {
    name: PLUGIN,
    transformIndexHtml: {
      order: "pre",
      handler(html, { filename }) {
        // Use the disk filename, so / and /index.html share the home-page header.
        const page = relative(root, filename);
        if (!PAGES.has(page)) {
          if (html.includes(MARKER_NAME)) {
            throw new Error(
              `[${PLUGIN}] ${page}: ${INSERTION_POINT} is rendered only on ${[...PAGES].join(", ")}. Remove the marker.`
            );
          }
          return html;
        }

        assertInsertionPoint(html, page);
        assertNoHandWrittenHeader(html, page);
        return html.replace(INSERTION_POINT, () => renderHeader(page));
      },
    },
  };
}
