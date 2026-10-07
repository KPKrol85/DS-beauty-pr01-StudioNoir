const SECTION_SELECTOR = 'main section[id]';
const ACTIVE_CLASS = 'is-active';

const updateActiveLink = (linksById, nextId) => {
  linksById.forEach((link, sectionId) => {
    const isActive = sectionId === nextId;
    link.classList.toggle(ACTIVE_CLASS, isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const initSectionSpy = (header) => {
  const navLinks = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
  if (!navLinks.length) return;

  const linksById = new Map();
  navLinks.forEach((link) => {
    const sectionId = link.getAttribute('href')?.slice(1);
    if (sectionId) {
      linksById.set(sectionId, link);
    }
  });

  const pageSections = Array.from(document.querySelectorAll(SECTION_SELECTOR));

  if (!pageSections.length) return;

  let activeSectionId = null;
  const updateFromViewport = () => {
    const headerOffset = header.offsetHeight + 24;
    const probeLine = window.scrollY + headerOffset;
    // A short final section may never reach the reading line before scrolling ends.
    const atPageEnd = window.scrollY > 0 &&
      Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;

    const current = atPageEnd ? pageSections[pageSections.length - 1] : pageSections.find((section, index) => {
      const next = pageSections[index + 1];
      if (!next) return probeLine >= section.offsetTop;
      return probeLine >= section.offsetTop && probeLine < next.offsetTop;
    });

    const nextId = current && linksById.has(current.id) ? current.id : null;
    if (nextId !== activeSectionId) {
      activeSectionId = nextId;
      updateActiveLink(linksById, activeSectionId);
    }
  };

  updateActiveLink(linksById, activeSectionId);

  // Observer thresholds need not fire when the reading line crosses a section boundary.
  // Both paths use the same boundaries, including sections without a navigation link.
  window.addEventListener('scroll', updateFromViewport, { passive: true });
  window.addEventListener('resize', updateFromViewport);
  updateFromViewport();

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    updateFromViewport,
    {
      root: null,
      rootMargin: `-${header.offsetHeight + 20}px 0px -52% 0px`,
      threshold: [0.2, 0.4, 0.6, 0.8]
    }
  );

  pageSections.forEach((section) => observer.observe(section));
};

const initHeaderMiniCta = () => {
  const miniCta = document.querySelector('[data-header-mini-cta]');
  const hero = document.querySelector('.hero');

  if (!miniCta || !hero) return;

  if (!('IntersectionObserver' in window)) {
    const onScroll = () => {
      miniCta.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * 0.6);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      miniCta.classList.toggle('is-visible', !entry.isIntersecting);
    },
    { threshold: 0.15 }
  );

  observer.observe(hero);
};

export const initHeader = () => {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const update = () => {
    if (window.scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  update();
  window.addEventListener('scroll', update, { passive: true });

  initSectionSpy(header);
  initHeaderMiniCta();
};
