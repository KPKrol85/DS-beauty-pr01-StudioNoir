const STORAGE_KEY = "studio-noir-theme";
const THEMES = ["light", "dark"];

// Storage only remembers the choice: when it is blocked, missing, or throws,
// the theme is still applied and switched on the current page.
const readStoredTheme = () => {
  try {
    const theme = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(theme) ? theme : null;
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The choice is not remembered; the applied theme stays in effect.
  }
};

const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export const initTheme = () => {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    // <html> drives tokens and color-scheme; <body> keeps the same class contract.
    for (const element of [root, document.body]) {
      element.classList.toggle("theme--light", theme === "light");
      element.classList.toggle("theme--dark", theme === "dark");
    }
    // Browser UI follows the active page background token.
    const color = getComputedStyle(root).getPropertyValue("--color-ink-900").trim();
    if (themeColor && color) themeColor.setAttribute("content", color);
    // The icon-only control names the action it performs; CSS draws its icon.
    toggle.setAttribute("aria-label", theme === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny");
  };

  const setTheme = (theme) => {
    applyTheme(theme);
    storeTheme(theme);
  };

  // public/theme-bootstrap.js has already resolved the first-paint theme on <html>;
  // resolving again only covers a page loaded without it.
  const firstPaintTheme = THEMES.find((theme) => root.classList.contains(`theme--${theme}`));
  setTheme(firstPaintTheme ?? readStoredTheme() ?? getSystemTheme());

  toggle.addEventListener("click", () => {
    setTheme(root.classList.contains("theme--light") ? "dark" : "light");
  });
};
