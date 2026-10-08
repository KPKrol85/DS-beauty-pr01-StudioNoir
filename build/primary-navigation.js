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
const INSERTION_POINT = "<!-- studio-noir:primary-navigation -->";

const escapeText = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export function primaryNavigation(root) {
  return {
    name: "studio-noir-primary-navigation",
    transformIndexHtml: {
      order: "pre",
      handler(html, { filename }) {
        // Use the disk filename, so / and /index.html share the home-page URLs.
        const page = relative(root, filename);
        if (!PAGES.has(page)) return html;

        const lists = [...html.matchAll(/<ul class="nav__list">([\s\S]*?)<\/ul>/g)];
        if (
          lists.length !== 1 ||
          lists[0][1].trim() !== INSERTION_POINT ||
          html.split(INSERTION_POINT).length !== 2
        ) {
          throw new Error(
            `[studio-noir-primary-navigation] ${page}: expected exactly one <ul class="nav__list"> ` +
              `containing only ${INSERTION_POINT}. The insertion point is missing, duplicated, or malformed.`
          );
        }

        const prefix = page === "index.html" ? "" : "/index.html";
        const links = NAVIGATION.map(
          ({ label, section }) =>
            `<li><a class="nav__link" href="${prefix}#${section}">${escapeText(label)}</a></li>`
        );
        return html.replace(INSERTION_POINT, () => links.join("\n              "));
      },
    },
  };
}
