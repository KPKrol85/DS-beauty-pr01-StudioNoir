import { initReveal } from "./reveal.js";
import { initHeader } from "./header.js";
import { initNav } from "./nav.js";
import { initLightbox } from "./lightbox.js";
import { initBooking } from "./booking.js";
import { initTheme } from "./theme.js";
import { initMobileCta } from "./mobile-cta.js";

const init = () => {
  initHeader();
  initNav();
  initReveal();
  initLightbox();
  initBooking();
  initTheme();
  initMobileCta();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}
