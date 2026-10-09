import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";
import { defineConfig } from "vite";
import { primaryNavigation } from "./build/primary-navigation.js";
import { HOME_DOCUMENT, OFFLINE_DOCUMENT } from "./js/pwa-paths.js";

const root = import.meta.dirname;
// The service worker's navigation fallback resolves to these cached documents.
const FALLBACK_DOCUMENTS = [HOME_DOCUMENT, OFFLINE_DOCUMENT];

function rootPages() {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name);
}

function publicAssets(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = `${prefix}${entry.name}`;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return publicAssets(path, `${name}/`);
    // Netlify routing/header files are deployment metadata, not fetchable assets.
    if (entry.name.startsWith("_")) return [];
    return [[name, readFileSync(path)]];
  });
}

function precacheServiceWorker() {
  let declaredInputs = new Set();

  return {
    name: "studio-noir-precache",
    apply: "build",
    enforce: "post",
    buildStart({ input }) {
      declaredInputs = new Set(Object.values(input).map((path) => relative(root, resolve(root, path))));
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const worker = bundle["service-worker.js"];
        if (
          worker?.type !== "chunk" ||
          !worker.code.includes("__STUDIO_NOIR_PRECACHE__") ||
          !worker.code.includes("__STUDIO_NOIR_CACHE_VERSION__")
        ) {
          this.error("Service worker precache placeholders are missing.");
        }

        const assets = new Map(publicAssets(resolve(root, "public")));
        for (const [name, output] of Object.entries(bundle)) {
          if (name === "service-worker.js") continue;
          assets.set(name, output.type === "chunk" ? output.code : output.source);
        }

        const names = [...assets.keys()].sort();
        const precache = names.map((name) => `/${name}`);

        // Report every broken page/fallback contract at once; one cause can break both.
        const problems = [
          ...rootPages()
            .filter((page) => !declaredInputs.has(page))
            .map((page) => `Root page ${page} is not declared in build.rolldownOptions.input.`),
          ...FALLBACK_DOCUMENTS.filter((path) => !precache.includes(path)).map(
            (path) => `Precache is missing ${path}, required by the service worker navigation fallback.`
          ),
        ];
        if (problems.length > 0) this.error(problems.join("\n"));

        // Include document/static-file contents and worker logic, not just hashed names.
        const hash = createHash("sha256").update(worker.code);
        for (const name of names) {
          hash.update(name).update("\0").update(assets.get(name)).update("\0");
        }

        worker.code = worker.code
          .replaceAll("__STUDIO_NOIR_PRECACHE__", JSON.stringify(precache))
          .replaceAll("__STUDIO_NOIR_CACHE_VERSION__", JSON.stringify(hash.digest("hex").slice(0, 16)));
      },
    },
  };
}

// Comments are blanked, not removed, so match offsets keep their line numbers.
function readStylesheets() {
  const directory = resolve(root, "css");
  return readdirSync(directory)
    .filter((name) => name.endsWith(".css"))
    .sort()
    .map((name) => ({
      file: `css/${name}`,
      css: readFileSync(resolve(directory, name), "utf8").replace(/\/\*[\s\S]*?\*\//g, (comment) =>
        comment.replace(/[^\n]/g, " ")
      ),
    }));
}

// Project-level name resolution only: a declaration in any selector scope defines
// a property, and a var() with a fallback may name an undefined one.
function cssCustomPropertyGuard() {
  return {
    name: "studio-noir-css-custom-properties",
    apply: "build",
    buildStart() {
      const stylesheets = readStylesheets();
      const defined = new Set(
        stylesheets.flatMap(({ css }) => [...css.matchAll(/(?<=^|[\s{;])(--[\w-]+)\s*:/g)].map((match) => match[1]))
      );

      const problems = stylesheets.flatMap(({ file, css }) =>
        [...css.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)]
          .filter((match) => !defined.has(match[1]))
          .map((match) => {
            const line = css.slice(0, match.index).split("\n").length;
            return `${file}:${line} references undefined custom property ${match[1]} without a fallback.`;
          })
      );
      if (problems.length > 0) this.error(problems.join("\n"));
    },
  };
}

export default defineConfig({
  base: "/",
  appType: "mpa",
  plugins: [primaryNavigation(root), cssCustomPropertyGuard(), precacheServiceWorker()],
  build: {
    outDir: "dist",
    // Keep images/fonts as cacheable files, including the gallery's lightbox sources.
    assetsInlineLimit: 0,
    rolldownOptions: {
      input: {
        main: resolve(root, "index.html"),
        privacy: resolve(root, "privacy.html"),
        terms: resolve(root, "terms.html"),
        cookies: resolve(root, "cookies.html"),
        notFound: resolve(root, "404.html"),
        offline: resolve(root, "offline.html"),
        "service-worker": resolve(root, "service-worker.js"),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "service-worker" ? "service-worker.js" : "assets/[name]-[hash].js",
      },
    },
  },
});
