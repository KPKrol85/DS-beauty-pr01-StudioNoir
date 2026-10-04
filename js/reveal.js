// Returns null when the observer is unavailable or cannot be created, so the
// caller can leave content visible instead of hiding it with no way back.
const createRevealObserver = () => {
  if (!("IntersectionObserver" in window)) return null;

  try {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    return observer;
  } catch {
    return null;
  }
};

export const initReveal = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("reveal", "is-visible"));
    return;
  }

  const observer = createRevealObserver();
  if (!observer) return;

  // Hide an element only once it is observed, so the observer can reveal it.
  elements.forEach((el) => {
    observer.observe(el);
    el.classList.add("reveal");
  });
};
