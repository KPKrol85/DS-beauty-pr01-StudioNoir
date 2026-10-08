import { wrapTabFocus } from "./wrap-tab-focus.js";

export const initLightbox = () => {
  const root = document.querySelector("[data-lightbox-root]");
  const image = document.querySelector("[data-lightbox-image]");
  const dialog = root?.querySelector('[role="dialog"]');
  const closeButton = root?.querySelector("button[data-lightbox-close]");
  const previousButton = root?.querySelector("[data-lightbox-previous]");
  const nextButton = root?.querySelector("[data-lightbox-next]");
  const caption = root?.querySelector("[data-lightbox-caption]");
  const triggers = [...document.querySelectorAll("[data-lightbox]")];
  if (
    !root || !image || !dialog || !caption ||
    !previousButton || !nextButton || !triggers.length
  ) return;

  let currentIndex = 0;
  let previousOverflow = "";

  const render = () => {
    const thumbnail = triggers[currentIndex].querySelector("img");
    image.src = thumbnail.src;
    image.alt = thumbnail.alt;
    caption.textContent = `${thumbnail.alt} · ${currentIndex + 1} / ${triggers.length}`;
  };

  const navigate = (step) => {
    currentIndex = (currentIndex + step + triggers.length) % triggers.length;
    render();
  };

  const previous = () => navigate(-1);
  const next = () => navigate(1);

  const getFocusableElements = () => {
    const selector =
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    return [...dialog.querySelectorAll(selector)].filter((element) => {
      if (!(element instanceof HTMLElement)) return false;
      if (element.hasAttribute("disabled")) return false;
      return !element.hasAttribute("aria-hidden");
    });
  };

  const focusDialog = () => {
    if (closeButton instanceof HTMLElement) {
      closeButton.focus();
      return;
    }

    const [firstFocusable] = getFocusableElements();
    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus();
    }
  };

  const open = (index) => {
    currentIndex = index;
    render();
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    focusDialog();
  };

  const close = () => {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    image.removeAttribute("src");
    document.body.style.overflow = previousOverflow;

    const currentTrigger = triggers[currentIndex];
    if (document.contains(currentTrigger)) {
      currentTrigger.focus();
    }
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => {
      open(index);
    });
  });

  previousButton.addEventListener("click", previous);
  nextButton.addEventListener("click", next);

  root.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-lightbox-close]")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!root.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      close();
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      if (event.key === "ArrowLeft") previous();
      else next();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements();
    wrapTabFocus(event, focusableElements);
  });
};
