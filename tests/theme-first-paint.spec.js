import { expect, test } from "@playwright/test";

// public/theme-bootstrap.js puts the stored or system theme on <html> from <head>;
// js/theme.js, run by the deferred /js/main.js module, then owns switching and
// persistence. Holding the /js/main.js request lets each test read the parsed and
// rendered page before application initialization, then release it and check the
// final state. A MutationObserver records every <html> class value from the start.
const PAGES = ["/index.html", "/privacy.html", "/terms.html", "/cookies.html"];
const STORAGE_KEY = "studio-noir-theme";

const THEMES = {
  light: {
    background: "rgb(245, 241, 236)",
    foreground: "rgb(43, 43, 51)",
    themeColor: "#f5f1ec",
    label: "Włącz tryb ciemny",
  },
  dark: {
    background: "rgb(11, 11, 14)",
    foreground: "rgb(232, 231, 228)",
    themeColor: "#0b0b0e",
    label: "Włącz tryb jasny",
  },
};
// The static markup name, neutral until js/theme.js names the action.
const INITIAL_LABEL = "Przełącz motyw kolorystyczny";
const other = (theme) => (theme === "light" ? "dark" : "light");

// `stored` is written before any page script runs; `blocked` makes localStorage throw.
const SCENARIOS = [
  { name: "stored light preference", system: "dark", stored: "light", expected: "light" },
  { name: "stored dark preference", system: "light", stored: "dark", expected: "dark" },
  { name: "no stored value, light system preference", system: "light", expected: "light" },
  { name: "no stored value, dark system preference", system: "dark", expected: "dark" },
  { name: "invalid stored value", system: "light", stored: "sepia", expected: "light" },
  { name: "throwing localStorage", system: "light", blocked: true, expected: "light" },
];

const readThemeState = (page) =>
  page.evaluate(() => {
    const root = document.documentElement;
    const body = getComputedStyle(document.body);
    return {
      rootClasses: [...root.classList],
      bodyClasses: [...document.body.classList],
      colorScheme: getComputedStyle(root).colorScheme,
      background: body.backgroundColor,
      foreground: body.color,
      themeColor: document.querySelector('meta[name="theme-color"]').getAttribute("content"),
    };
  });

const expectTheme = (state, theme) => {
  expect(state.rootClasses).toContain(`theme--${theme}`);
  expect(state.rootClasses).not.toContain(`theme--${other(theme)}`);
  expect(state.colorScheme).toBe(theme);
  expect(state.background).toBe(THEMES[theme].background);
  expect(state.foreground).toBe(THEMES[theme].foreground);
  expect(state.themeColor).toBe(THEMES[theme].themeColor);
};

const readStorage = (page) =>
  page.evaluate((key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return "unavailable";
    }
  }, STORAGE_KEY);

for (const path of PAGES) {
  test.describe(path, () => {
    for (const scenario of SCENARIOS) {
      test(`${scenario.name}: ${scenario.expected} theme from first paint, then toggles`, async ({ page }) => {
        const { expected } = scenario;
        await page.emulateMedia({ colorScheme: scenario.system });

        await page.addInitScript(
          ({ key, stored, blocked }) => {
            if (blocked) {
              Object.defineProperty(window, "localStorage", {
                configurable: true,
                get() {
                  throw new DOMException("Storage is blocked.", "SecurityError");
                },
              });
            } else if (stored) {
              window.localStorage.setItem(key, stored);
            }

            window.__rootClassHistory = [];
            new MutationObserver((records) => {
              for (const record of records) {
                const root = document.documentElement;
                if (record.target === root || [...record.addedNodes].includes(root)) {
                  window.__rootClassHistory.push(root.className);
                }
              }
            }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
          },
          { key: STORAGE_KEY, stored: scenario.stored, blocked: scenario.blocked }
        );

        let markMainHeld;
        let releaseMain;
        const mainHeld = new Promise((resolve) => (markMainHeld = resolve));
        const mainReleased = new Promise((resolve) => (releaseMain = resolve));
        await page.route("**/js/main.js", async (route) => {
          markMainHeld();
          await mainReleased;
          await route.continue();
        });

        await page.goto(path, { waitUntil: "commit" });
        await mainHeld;
        // The parser has finished; deferred modules, including /js/main.js, have not run.
        await page.waitForFunction(() => document.readyState === "interactive");
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve())));

        const toggle = page.locator("[data-theme-toggle]");
        await expect(toggle).toHaveCount(1);
        // The static markup label, untouched until js/theme.js runs.
        await expect(toggle).toHaveAttribute("aria-label", INITIAL_LABEL);

        const early = await readThemeState(page);
        expectTheme(early, expected);
        expect(early.bodyClasses).toContain("theme--dark");
        if (scenario.blocked) {
          expect(await readStorage(page)).toBe("unavailable");
        } else {
          // The bootstrap only reads storage; js/theme.js has not persisted anything yet.
          expect(await readStorage(page)).toBe(scenario.stored ?? null);
        }

        releaseMain();
        // The load event follows execution of the deferred module graph.
        await page.waitForLoadState("load");
        await expect(toggle).toHaveAttribute("aria-label", THEMES[expected].label);

        const initialized = await readThemeState(page);
        expectTheme(initialized, expected);
        expect(initialized.bodyClasses).toContain(`theme--${expected}`);
        expect(initialized.bodyClasses).not.toContain(`theme--${other(expected)}`);
        // The resolved choice, including a system-derived one, is persisted as before.
        expect(await readStorage(page)).toBe(scenario.blocked ? "unavailable" : expected);

        const history = await page.evaluate(() => window.__rootClassHistory);
        expect(history.length).toBeGreaterThan(0);
        for (const value of history) {
          expect(value.split(/\s+/)).not.toContain(`theme--${other(expected)}`);
        }

        await toggle.click();
        const switched = other(expected);
        await expect(toggle).toHaveAttribute("aria-label", THEMES[switched].label);
        const toggled = await readThemeState(page);
        expectTheme(toggled, switched);
        expect(toggled.bodyClasses).toContain(`theme--${switched}`);
        expect(toggled.bodyClasses).not.toContain(`theme--${expected}`);
        expect(await readStorage(page)).toBe(scenario.blocked ? "unavailable" : switched);

        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-label", THEMES[expected].label);
        expectTheme(await readThemeState(page), expected);
      });
    }
  });
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, colorScheme: "light" });

  for (const path of PAGES) {
    test(`${path} keeps the static dark theme`, async ({ page }) => {
      await page.goto(path);
      const root = page.locator("html");
      await expect(root).not.toHaveClass(/theme--/);
      await expect(page.locator("body")).toHaveClass(/theme--dark/);
      await expect(root).toHaveCSS("color-scheme", "dark");
      await expect(page.locator("body")).toHaveCSS("background-color", THEMES.dark.background);
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", THEMES.dark.themeColor);
      await expect(page.locator("[data-theme-toggle]")).toHaveAttribute("aria-label", INITIAL_LABEL);
    });
  }
});
