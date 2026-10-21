// The footer's closing line marks the end of the page: the control is shown
// only while it is in the viewport, in either scroll direction.
const TRIGGER_SELECTOR = ".footer__copyright";
const VISIBLE_CLASS = "is-visible";

export const initBackToTop = () => {
  const button = document.querySelector("[data-back-to-top]");
  const trigger = document.querySelector(TRIGGER_SELECTOR);
  if (!button || !trigger) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const skipLink = document.querySelector('a[href="#main"]');

  const setVisible = (visible) => {
    button.classList.toggle(VISIBLE_CLASS, visible);
  };

  if ("IntersectionObserver" in window) {
    // Entries can queue between deliveries; the latest one is current.
    const observer = new IntersectionObserver((entries) => {
      setVisible(entries.at(-1).isIntersecting);
    });

    observer.observe(trigger);
  } else {
    const update = () => {
      const { top, bottom } = trigger.getBoundingClientRect();
      setVisible(top < window.innerHeight && bottom > 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  button.addEventListener("click", (event) => {
    // A button, not a #top link, so the URL gains no fragment.
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "instant" : "smooth" });

    // The control hides as the page leaves the footer. Keyboard and assistive
    // technology activation (a click with no pointer count) continues from the
    // skip link at the start of the Tab sequence; a pointer only releases focus.
    if (event.detail === 0 && skipLink) {
      skipLink.focus({ preventScroll: true });
    } else {
      button.blur();
    }
  });
};
