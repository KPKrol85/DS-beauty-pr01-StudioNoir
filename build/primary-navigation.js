import { relative } from "node:path";

// Build-time source only; the browser receives ordinary HTML links.
const NAVIGATION = [
  { label: "O nas", section: "about" },
  { label: "Usługi", section: "services" },
  { label: "Cennik", section: "pricing" },
  { label: "Styliści", section: "stylists" },
  { label: "Galeria", section: "gallery" },
  { label: "Rezerwacja", section: "booking" },
  { label: "Kontakt", section: "location" },
];

const PAGES = new Set(["index.html", "privacy.html", "terms.html", "cookies.html"]);
const HEADER_INSERTION_POINT = "<!-- studio-noir:primary-navigation -->";
const FOOTER_INSERTION_POINT = "<!-- studio-noir:footer-navigation -->";
const PLUGIN = "studio-noir-primary-navigation";

const escapeText = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const occurrences = (html, marker) => html.split(marker).length - 1;

function assertHeaderInsertionPoint(html, page) {
  const lists = [...html.matchAll(/<ul class="nav__list">([\s\S]*?)<\/ul>/g)];
  if (
    lists.length !== 1 ||
    lists[0][1].trim() !== HEADER_INSERTION_POINT ||
    occurrences(html, HEADER_INSERTION_POINT) !== 1
  ) {
    throw new Error(
      `[${PLUGIN}] ${page}: expected exactly one <ul class="nav__list"> ` +
        `containing only ${HEADER_INSERTION_POINT}. The insertion point is missing, duplicated, or malformed.`
    );
  }
}

// The footer also holds the legal-link list, so only the list carrying the marker is checked.
function assertFooterInsertionPoint(html, page) {
  const footers = [...html.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/g)];
  const lists =
    footers.length === 1
      ? [...footers[0][0].matchAll(/<ul class="footer__list">([\s\S]*?)<\/ul>/g)].filter(([, content]) =>
          content.includes(FOOTER_INSERTION_POINT)
        )
      : [];
  if (
    lists.length !== 1 ||
    lists[0][1].trim() !== FOOTER_INSERTION_POINT ||
    occurrences(html, FOOTER_INSERTION_POINT) !== 1
  ) {
    throw new Error(
      `[${PLUGIN}] ${page}: expected exactly one <ul class="footer__list"> inside the single <footer> ` +
        `containing only ${FOOTER_INSERTION_POINT}. The insertion point is missing, duplicated, or malformed.`
    );
  }
}

function renderLinks(linkClass, prefix) {
  return NAVIGATION.map(
    ({ label, section }) => `<li><a class="${linkClass}" href="${prefix}#${section}">${escapeText(label)}</a></li>`
  ).join("\n              ");
}

export function primaryNavigation(root) {
  return {
    name: PLUGIN,
    transformIndexHtml: {
      order: "pre",
      handler(html, { filename }) {
        // Use the disk filename, so / and /index.html share the home-page URLs.
        const page = relative(root, filename);
        if (!PAGES.has(page)) return html;

        assertHeaderInsertionPoint(html, page);
        assertFooterInsertionPoint(html, page);

        const prefix = page === "index.html" ? "" : "/index.html";
        return html
          .replace(HEADER_INSERTION_POINT, () => renderLinks("nav__link", prefix))
          .replace(FOOTER_INSERTION_POINT, () => renderLinks("footer__link", prefix));
      },
    },
  };
}
