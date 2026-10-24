import { relative } from "node:path";

// Build-time source only; the browser receives ordinary footer HTML. Each legal
// page marks its own entry as current; the home page marks none.
const LEGAL_LINKS = [
  { page: "privacy.html", label: "Polityka prywatności" },
  { page: "terms.html", label: "Regulamin" },
  { page: "cookies.html", label: "Polityka cookies" },
];

const PAGES = new Set(["index.html", ...LEGAL_LINKS.map(({ page }) => page)]);
const MARKER_NAME = "studio-noir:shared-footer";
const INSERTION_POINT = `<!-- ${MARKER_NAME} -->`;
const PLUGIN = "studio-noir-shared-footer";

const escapeText = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const occurrences = (html, marker) => html.split(marker).length - 1;

// The marker stands alone on its line after </main>: the footer stays the page's
// contentinfo landmark, and the rendered lines continue the marker's indentation.
function assertInsertionPoint(html, page) {
  const lines = [...html.matchAll(/^[ \t]*<!-- studio-noir:shared-footer -->[ \t]*\r?$/gm)];
  const index = html.indexOf(INSERTION_POINT);
  if (
    lines.length !== 1 ||
    occurrences(html, MARKER_NAME) !== 1 ||
    index < html.lastIndexOf("</main>") ||
    index > html.lastIndexOf("</body>")
  ) {
    throw new Error(
      `[${PLUGIN}] ${page}: expected exactly one ${INSERTION_POINT} on its own line between </main> and </body>. ` +
        "The insertion point is missing, duplicated, or malformed."
    );
  }
}

// Hand-written markup left beside the marker would duplicate the footer landmark,
// the .footer__copyright trigger, or the [data-back-to-top] control.
function assertNoHandWrittenFooter(html, page) {
  if (/<footer\b|footer__copyright|data-back-to-top/.test(html)) {
    throw new Error(
      `[${PLUGIN}] ${page}: found hand-written <footer>, .footer__copyright, or [data-back-to-top] markup. ` +
        `The footer and back-to-top button come only from ${INSERTION_POINT}; remove the duplicate markup.`
    );
  }
}

function renderLegalLinks(page) {
  return LEGAL_LINKS.map(({ page: target, label }) => {
    const current = target === page ? ' aria-current="page"' : "";
    return `<li><a class="footer__link" href="/${target}"${current}>${escapeText(label)}</a></li>`;
  }).join("\n              ");
}

// The "Nawigacja" list keeps the footer insertion point of build/primary-navigation.js,
// which fills it after this transform. Back to top stays outside <footer>.
function renderFooter(page) {
  return `<footer class="footer">
      <div class="container">
        <div class="footer__columns">
          <div class="footer__brand">
            <span class="brand-symbol footer__symbol" aria-hidden="true"></span>
            <p class="footer__logo">Studio Noir</p>
            <p class="footer__tagline">Hair &amp; Style</p>
            <p class="footer__note">Fikcyjne studio fryzjerskie — projekt demonstracyjny z portfolio KP_Code Digital Studio. Usługi, ceny i informacje o salonie mają charakter przykładowy.</p>
          </div>
          <nav class="footer__group" aria-labelledby="footer-navigation-title">
            <h2 class="footer__heading" id="footer-navigation-title">Nawigacja</h2>
            <ul class="footer__list">
              <!-- studio-noir:footer-navigation -->
            </ul>
          </nav>
          <nav class="footer__group" aria-labelledby="footer-information-title">
            <h2 class="footer__heading" id="footer-information-title">Informacje</h2>
            <ul class="footer__list">
              ${renderLegalLinks(page)}
            </ul>
          </nav>
          <div class="footer__group">
            <h2 class="footer__heading">Kontakt</h2>
            <address class="footer__contact">
              <div class="footer__address-block">
                <p class="footer__address">ul. Marynarki Wojennej 12/31<br />33-100 Tarnów</p>
              </div>
              <a class="footer__map" href="https://www.google.com/maps/search/?api=1&amp;query=ul.%20Marynarki%20Wojennej%2012%2F31%2C%2033-100%20Tarn%C3%B3w" target="_blank" rel="noreferrer">
                <span class="footer__map-tile" aria-hidden="true">
                  <svg class="footer__map-pin" viewBox="0 0 24 24" focusable="false">
                    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
                    <circle cx="12" cy="10" r="2.25" />
                  </svg>
                </span>
                <span class="footer__map-text">
                  <span class="footer__map-place">Tarnów</span>
                  <span class="footer__map-action">Otwórz Mapy Google <span aria-hidden="true">↗</span></span>
                </span>
              </a>
              <dl class="footer__channels">
                <div class="footer__channel">
                  <dt>Telefon</dt>
                  <dd><a class="footer__link" href="tel:+48533537091">+48 533 537 091</a></dd>
                </div>
                <div class="footer__channel">
                  <dt>E-mail</dt>
                  <dd><a class="footer__link" href="mailto:kontakt@kp-code.pl">kontakt@kp-code.pl</a></dd>
                </div>
              </dl>
              <p class="footer__attribution">
                <span class="footer__attribution-line">Dane kontaktowe autora projektu</span>
                <span class="footer__attribution-line">KP_Code Digital Studio</span>
              </p>
            </address>
          </div>
        </div>
        <div class="footer__social">
          <p class="footer__social-title" id="footer-social-title">Media społecznościowe</p>
          <ul class="footer__social-list" role="list" aria-labelledby="footer-social-title">
            <li>
              <a class="footer__social-link" href="https://www.instagram.com/kp_code_/" target="_blank" rel="noopener noreferrer" aria-label="KP_Code na Instagramie (otwiera się w nowej karcie)">
                <span class="footer__social-icon footer__social-icon--instagram" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a class="footer__social-link" href="https://www.facebook.com/kpkrol85" target="_blank" rel="noopener noreferrer" aria-label="KP_Code na Facebooku (otwiera się w nowej karcie)">
                <span class="footer__social-icon footer__social-icon--facebook" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a class="footer__social-link" href="https://github.com/KPKrol85" target="_blank" rel="noopener noreferrer" aria-label="KP_Code na GitHubie (otwiera się w nowej karcie)">
                <span class="footer__social-icon footer__social-icon--github" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a class="footer__social-link" href="https://x.com/KP_Code_85" target="_blank" rel="noopener noreferrer" aria-label="KP_Code w serwisie X (otwiera się w nowej karcie)">
                <span class="footer__social-icon footer__social-icon--x" aria-hidden="true"></span>
              </a>
            </li>
          </ul>
        </div>
        <p class="footer__copyright"><span class="footer__copyright-part">© 2026 KP_Code Digital Studio |</span> <span class="footer__copyright-part">Wszelkie prawa zastrzeżone.</span></p>
      </div>
    </footer>

    <button class="back-to-top" type="button" data-back-to-top aria-label="Wróć na górę">
      <span class="back-to-top__icon" aria-hidden="true"></span>
    </button>`;
}

export function sharedFooter(root) {
  return {
    name: PLUGIN,
    transformIndexHtml: {
      order: "pre",
      handler(html, { filename }) {
        // Use the disk filename, so / and /index.html share the home-page footer.
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
        assertNoHandWrittenFooter(html, page);
        return html.replace(INSERTION_POINT, () => renderFooter(page));
      },
    },
  };
}
