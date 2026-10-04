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
  const pageContent = document.querySelector("[data-page-content]");
  if (!toggle || !panel) return;

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

  // All panel semantics derive from the viewport and the open state, so a
  // breakpoint change cannot leave mobile-only state on the desktop navigation.
  const render = () => {
    const isDesktop = desktopViewport.matches;

    toggle.setAttribute("aria-expanded", String(isOpen));
    panel.classList.toggle("is-open", isOpen);
    setOptionalAttribute(panel, "role", isDesktop ? null : "dialog");
    setOptionalAttribute(panel, "aria-modal", isDesktop ? null : "true");
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

  panel.addEventListener("click", (event) => {
    if (isOpen && event.target.closest(".nav__link")) {
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
      const focusables = getFocusableElements(panel);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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

  render();
};
