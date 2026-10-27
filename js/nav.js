import { wrapTabFocus } from "./wrap-tab-focus.js";

// Below this width the panel is a modal menu; from it, the inline desktop
// navigation. Keep in sync with the 900px rules in css/components.css.
const DESKTOP_QUERY = "(min-width: 900px)";

const getFocusableElements = (container) =>
  Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );

const setOptionalAttribute = (element, name, value) => {
  if (value === null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, value);
  }
};

export const initNav = () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  const dialog = document.querySelector("[data-nav-dialog]");
  const pageContent = document.querySelector("[data-page-content]");
  if (!toggle || !panel || !dialog) return;

  const desktopViewport = window.matchMedia(DESKTOP_QUERY);
  let isOpen = false;
  let isPageLocked = false;

  // Releases only a lock the menu applied, so a breakpoint change never clears
  // the scroll lock of another overlay, such as the lightbox.
  const setPageLocked = (locked) => {
    if (locked === isPageLocked) return;
    isPageLocked = locked;
    document.body.style.overflow = locked ? "hidden" : "";
    if (pageContent) pageContent.inert = locked;
  };

  // The open dialog includes both the panel and its visible close control.
  // Desktop navigation and the closed mobile toggle retain their normal roles.
  const render = () => {
    const isDesktop = desktopViewport.matches;

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
    panel.classList.toggle("is-open", isOpen);
    setOptionalAttribute(dialog, "role", isOpen ? "dialog" : null);
    setOptionalAttribute(dialog, "aria-modal", isOpen ? "true" : null);
    setOptionalAttribute(dialog, "aria-label", isOpen ? "Menu główne" : null);
    setOptionalAttribute(panel, "aria-hidden", isDesktop || isOpen ? null : "true");
    setPageLocked(isOpen);
  };

  const openMenu = () => {
    isOpen = true;
    render();
    const focusables = getFocusableElements(panel);
    focusables[0]?.focus();
  };

  const closeMenu = () => {
    isOpen = false;
    render();
    toggle.focus();
  };

  toggle.addEventListener("click", () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Navigation links, including the booking CTA, close the menu and keep their
  // native navigation; action buttons such as the theme toggle leave it open.
  panel.addEventListener("click", (event) => {
    if (isOpen && event.target.closest(".nav__link, .nav__cta a[href]")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      closeMenu();
      return;
    }

    if (event.key === "Tab") {
      const focusables = getFocusableElements(dialog);
      wrapTabFocus(event, focusables);
    }
  });

  // The menu is mobile-only: either direction across the breakpoint closes it.
  desktopViewport.addEventListener("change", () => {
    // In the mobile layout the closed panel is hidden, so focus must leave it.
    if (!desktopViewport.matches && panel.contains(document.activeElement)) {
      toggle.focus();
    }

    isOpen = false;
    render();
  });

  // The browser may clear focus from the newly hidden panel before the change
  // event above runs; send that focus to the toggle, not to the page body.
  panel.addEventListener("focusout", (event) => {
    if (!isOpen && !desktopViewport.matches && event.relatedTarget === null) {
      toggle.focus();
    }
  });

  render();
};
