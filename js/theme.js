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

  const applyTheme = (theme) => {
    document.body.classList.toggle("theme--light", theme === "light");
    document.body.classList.toggle("theme--dark", theme === "dark");
    toggle.textContent = theme === "light" ? "Tryb ciemny" : "Tryb jasny";
  };

  const setTheme = (theme) => {
    applyTheme(theme);
    storeTheme(theme);
  };

  setTheme(readStoredTheme() ?? getSystemTheme());

  toggle.addEventListener("click", () => {
    setTheme(document.body.classList.contains("theme--light") ? "dark" : "light");
  });
};
