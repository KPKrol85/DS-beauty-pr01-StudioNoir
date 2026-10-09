import { HOME_DOCUMENT, OFFLINE_DOCUMENT } from "./js/pwa-paths.js";

// Vite injects the final production URLs and a content-derived cache version.
const CACHE_NAME = "studio-noir-" + __STUDIO_NOIR_CACHE_VERSION__;
const ASSETS = __STUDIO_NOIR_PRECACHE__;

async function handleDocumentRequest(request) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(CACHE_NAME);
    const pathname = new URL(request.url).pathname;
    // Netlify also serves clean URLs such as /privacy; queries do not change the shell.
    const path = pathname.replace(/\/$/, "") || HOME_DOCUMENT;
    const page = path.endsWith(".html") ? path : `${path}.html`;
    return (await cache.match(page)) || (await cache.match(OFFLINE_DOCUMENT)) || Response.error();
  }
}

async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  // Use the same key as precaching: Vary: Origin differs for module/font requests.
  const path = new URL(request.url).pathname;
  return (await cache.match(path)) || fetch(request);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("studio-noir-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleDocumentRequest(request));
  } else if (ASSETS.includes(url.pathname)) {
    event.respondWith(handleAssetRequest(request));
  }
});
