// Loaded as a classic, synchronous script in <head>, so the stored or
// system theme is on <html> before the first paint. js/theme.js reads it from
// there and keeps switching and persistence. Without JavaScript the page stays dark.
(() => {
  let theme = null;
  try {
    theme = window.localStorage.getItem("studio-noir-theme");
  } catch {
    // Blocked storage falls back to the system preference, as in js/theme.js.
  }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.documentElement.classList.add(`theme--${theme}`);

  // The production stylesheet may still be loading, so the page backgrounds
  // (--color-ink-900 in css/tokens.css) are repeated here for browser UI.
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", theme === "light" ? "#f5f1ec" : "#0b0b0e");
})();
