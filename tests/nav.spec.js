import { expect, test } from "@playwright/test";

// The header navigation switches to its inline desktop layout at 900px
// (css/components.css, js/nav.js). The legal pages share the same markup.
const MOBILE = { width: 375, height: 812 };
const BREAKPOINT = { width: 900, height: 800 };
const DESKTOP = { width: 1280, height: 800 };

const NAV_LINKS = ["O nas", "Usługi", "Cennik", "Styliści", "Galeria", "Rezerwacja", "Kontakt"];
const NAV_SECTIONS = ["about", "services", "pricing", "stylists", "gallery", "booking", "location"];

test.describe("primary navigation without browser JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: DESKTOP });

  for (const route of ["/", "/index.html", "/privacy.html", "/terms.html", "/cookies.html"]) {
    test(`${route}: rendered links retain their order and destinations`, async ({ page }) => {
      const prefix = route === "/" || route === "/index.html" ? "" : "/index.html";
      const response = await page.goto(route);
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).not.toContain("studio-noir:primary-navigation");
      expect(html).not.toContain("studio-noir:footer-navigation");

      const links = page.getByRole("navigation", { name: "Główna" }).getByRole("list").getByRole("link");
      await expect(links).toHaveText(NAV_LINKS);
      await expect(page.locator(".nav__list > li > .nav__link")).toHaveCount(7);

      for (const [index, section] of NAV_SECTIONS.entries()) {
        await page.goto(route);
        await expect(links.nth(index)).toHaveAttribute("href", `${prefix}#${section}`);
        await links.nth(index).click();
        await expect(page).toHaveURL(new URL(`${prefix || route}#${section}`, response.url()).href);
        await expect(page.locator(`main section[id="${section}"]`)).toBeInViewport();
      }
    });

    test(`${route}: footer links mirror the header entries and destinations`, async ({ page }) => {
      const prefix = route === "/" || route === "/index.html" ? "" : "/index.html";
      const response = await page.goto(route);
      expect(response.ok()).toBe(true);

      const entries = (links) =>
        links.evaluateAll((nodes) => nodes.map((node) => [node.textContent, node.getAttribute("href")]));
      const headerLinks = page.getByRole("navigation", { name: "Główna" }).getByRole("list").getByRole("link");
      const footerNav = page.getByRole("navigation", { name: "Nawigacja" });
      const links = footerNav.getByRole("list").getByRole("link");

      await expect(footerNav.locator(".footer__list > li > .footer__link")).toHaveCount(7);
      await expect(links).toHaveText(NAV_LINKS);
      expect(await entries(links)).toEqual(NAV_LINKS.map((label, index) => [label, `${prefix}#${NAV_SECTIONS[index]}`]));
      expect(await entries(links)).toEqual(await entries(headerLinks));

      for (const [index, section] of NAV_SECTIONS.entries()) {
        await page.goto(route);
        await links.nth(index).click();
        await expect(page).toHaveURL(new URL(`${prefix || route}#${section}`, response.url()).href);
        await expect(page.locator(`main section[id="${section}"]`)).toBeInViewport();
      }
    });
  }
});

const getNav = (page) => ({
  landmark: page.getByRole("navigation", { name: "Główna" }),
  toggle: page.locator("[data-nav-toggle]"),
  panel: page.locator("[data-nav-panel]"),
  dialog: page.locator("[data-nav-dialog]"),
  main: page.locator("[data-page-content]"),
  body: page.locator("body"),
});

const expectCurrentSection = async (page, sectionId = null) => {
  const nav = getNav(page).landmark;
  const active = nav.locator(".nav__link.is-active");
  const current = nav.locator(".nav__link[aria-current]");

  await expect(active).toHaveCount(sectionId ? 1 : 0);
  await expect(current).toHaveCount(sectionId ? 1 : 0);
  if (sectionId) {
    await expect(active).toHaveAttribute("href", `#${sectionId}`);
    await expect(current).toHaveAttribute("href", `#${sectionId}`);
    await expect(current).toHaveAttribute("aria-current", "location");
  }
  await expect(nav.locator('.nav__link[aria-current="page"]')).toHaveCount(0);
};

const scrollToReadingPosition = async (page, sectionId, boundaryOffset = 2) => {
  await page.evaluate(({ sectionId, boundaryOffset }) => {
    const section = document.getElementById(sectionId);
    const header = document.querySelector("[data-header]");
    window.scrollTo({
      top: section.offsetTop - header.offsetHeight - 24 + boundaryOffset,
      behavior: "instant",
    });
  }, { sectionId, boundaryOffset });
};

for (const observerAvailable of [true, false]) {
  test.describe(`section indicator ${observerAvailable ? "with" : "without"} IntersectionObserver`, () => {
    test.use({ reducedMotion: "reduce" });
    test.beforeEach(async ({ page }) => {
      if (!observerAvailable) {
        await page.addInitScript(() => { delete window.IntersectionObserver; });
      }
    });

    for (const [layout, viewport] of [["desktop", DESKTOP], ["mobile", MOBILE]]) {
      test(`${layout}: linked and unlinked reading positions and instant return to top`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/");
        await expectCurrentSection(page);

        for (const [sectionId, expected] of [
          ["about", "about"],
          ["services", "services"],
          ["pricing", "pricing"],
          ["stylists", "stylists"],
          ["gallery", "gallery"],
          ["booking", "booking"],
          ["testimonials", null],
          ["location", "location"],
          ["final-cta", null],
        ]) {
          await scrollToReadingPosition(page, sectionId);
          await expectCurrentSection(page, expected);
        }

        // Return from a linked position so a stale current link cannot pass this check.
        await scrollToReadingPosition(page, "services");
        await expectCurrentSection(page, "services");
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await expectCurrentSection(page);
      });

      test(`${layout}: a direct services hash load marks its in-page location`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto("/index.html#services");
        await expectCurrentSection(page, "services");
      });
    }

    test("section boundaries resolve in both directions and after resize", async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto("/");
      await scrollToReadingPosition(page, "testimonials", -2);
      await expectCurrentSection(page, "booking");
      await scrollToReadingPosition(page, "testimonials");
      await expectCurrentSection(page);
      await scrollToReadingPosition(page, "location");
      await expectCurrentSection(page, "location");
      await scrollToReadingPosition(page, "location", -2);
      await expectCurrentSection(page);

      await page.setViewportSize(MOBILE);
      await scrollToReadingPosition(page, "location");
      await expectCurrentSection(page, "location");
      await scrollToReadingPosition(page, "testimonials");
      await expectCurrentSection(page);
    });
  });
}

const expectPageUnlocked = async (nav) => {
  await expect(nav.main).toHaveJSProperty("inert", false);
  await expect(nav.body).not.toHaveCSS("overflow", "hidden");
};

const expectMobileMenuClosed = async (nav) => {
  await expect(nav.toggle).toHaveAttribute("aria-expanded", "false");
  await expect(nav.toggle).toHaveAccessibleName("Otwórz menu");
  await expect(nav.dialog).not.toHaveAttribute("role");
  await expect(nav.dialog).not.toHaveAttribute("aria-modal");
  await expect(nav.panel).not.toHaveClass(/\bis-open\b/);
  await expect(nav.panel).toHaveAttribute("aria-hidden", "true");
  await expect(nav.panel).toBeHidden();
  await expectPageUnlocked(nav);
};

const expectMobileMenuOpen = async (nav) => {
  const dialog = nav.landmark.getByRole("dialog");

  await expect(nav.toggle).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("button", { name: "Zamknij menu", expanded: true })).toHaveCount(1);
  await expect(nav.panel).toHaveClass(/\bis-open\b/);
  await expect(nav.panel).not.toHaveAttribute("aria-hidden");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toHaveAccessibleName("Menu główne");
  await expect(nav.main).toHaveJSProperty("inert", true);
  await expect(nav.body).toHaveCSS("overflow", "hidden");
};

const expectDesktopNavigation = async (nav) => {
  await expect(nav.toggle).toBeHidden();
  await expect(nav.panel).toBeVisible();
  await expect(nav.panel).not.toHaveClass(/\bis-open\b/);
  await expect(nav.panel).not.toHaveAttribute("aria-hidden");
  await expect(nav.panel).not.toHaveAttribute("role");
  await expect(nav.panel).not.toHaveAttribute("aria-modal");
  await expect(nav.dialog).not.toHaveAttribute("role");
  await expect(nav.dialog).not.toHaveAttribute("aria-modal");
  await expect(nav.toggle).toHaveAttribute("aria-label", "Otwórz menu");
  await expect(nav.landmark.getByRole("button", { name: "Otwórz menu" })).toHaveCount(0);

  // Role queries skip anything hidden from assistive technology.
  await expect(nav.landmark).toBeVisible();
  await expect(nav.landmark.getByRole("list").getByRole("link")).toHaveText(NAV_LINKS);
  await expect(nav.landmark.getByRole("link", { name: "Umów wizytę" })).toBeVisible();
  await expect(nav.landmark.getByRole("button", { name: /^Włącz tryb/ })).toBeVisible();
};

test.describe("primary navigation state contract", () => {
  test("mobile menu opens as a modal, traps focus, and closes on Escape and link activation", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const nav = getNav(page);

    await expect(nav.toggle).toBeVisible();
    await expectMobileMenuClosed(nav);

    await nav.toggle.click();
    await expectMobileMenuOpen(nav);

    const dialog = nav.landmark.getByRole("dialog");
    const firstLink = dialog.getByRole("link", { name: "O nas" });
    const lastFocusable = dialog.getByRole("button", { name: /^Włącz tryb/ });
    await expect(firstLink).toBeFocused();

    await lastFocusable.focus();
    await page.keyboard.press("Tab");
    await expect(nav.toggle).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(firstLink).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(nav.toggle).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(lastFocusable).toBeFocused();

    await page.keyboard.press("Escape");
    await expectMobileMenuClosed(nav);
    await expect(nav.toggle).toBeFocused();

    await page.keyboard.press("Enter");
    await expectMobileMenuOpen(nav);

    await dialog.getByRole("link", { name: "Usługi" }).click();
    await expectMobileMenuClosed(nav);
    await expect(page).toHaveURL(/#services$/);
  });

  test("the visible close control works by pointer and keyboard inside the modal", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const nav = getNav(page);
    const lines = nav.toggle.locator(".nav__toggle-line");

    await expect(lines).toHaveCount(3);
    await expect(nav.toggle).toHaveAttribute("aria-controls", "primary-menu");
    const target = await nav.toggle.boundingBox();
    expect(target.width).toBeGreaterThanOrEqual(48);
    expect(target.height).toBeGreaterThanOrEqual(48);

    await nav.toggle.click();
    await expectMobileMenuOpen(nav);
    // A real click must reach the toggle above the fullscreen panel.
    await nav.landmark.getByRole("dialog").getByRole("button", { name: "Zamknij menu" }).click();
    await expectMobileMenuClosed(nav);
    await expect(nav.toggle).toBeFocused();

    for (const key of ["Enter", "Space"]) {
      await page.keyboard.press(key);
      await expectMobileMenuOpen(nav);
      await page.keyboard.press("Shift+Tab");
      await expect(nav.toggle).toBeFocused();
      expect(await nav.toggle.evaluate((button) => button.matches(":focus-visible"))).toBe(true);
      await expect(nav.toggle).toHaveCSS("outline-style", "solid");
      await expect(nav.toggle).toHaveCSS("outline-width", "2px");
      await page.keyboard.press(key);
      await expectMobileMenuClosed(nav);
      await expect(nav.toggle).toBeFocused();
    }
  });

  test("mobile booking CTA closes the menu on the home page; the theme toggle keeps it open", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const nav = getNav(page);
    const dialog = nav.landmark.getByRole("dialog");

    await nav.toggle.click();
    await expectMobileMenuOpen(nav);

    const themeToggle = dialog.getByRole("button", { name: /^Włącz tryb/ });
    const themeLabel = await themeToggle.getAttribute("aria-label");
    await themeToggle.click();
    await expect(themeToggle).not.toHaveAttribute("aria-label", themeLabel);
    await expectMobileMenuOpen(nav);
    await expect(themeToggle).toBeFocused();

    const cta = dialog.getByRole("link", { name: "Umów wizytę" });
    await expect(cta).toHaveAttribute("href", "#booking");
    await cta.focus();
    await page.keyboard.press("Enter");

    await expectMobileMenuClosed(nav);
    await expect(page).toHaveURL(/\/#booking$/);
    const booking = page.locator('main section[id="booking"]');
    await expect(booking).toBeInViewport();

    // Focus does not stay in the hidden panel; keyboard order resumes at the booking section.
    await expect(nav.panel.locator(":focus")).toHaveCount(0);
    await page.keyboard.press("Tab");
    await expect(booking.locator(":focus")).toHaveCount(1);
  });

  for (const route of ["/privacy.html", "/terms.html", "/cookies.html"]) {
    test(`${route}: mobile booking CTA leaves the menu for the home booking section`, async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto(route);
      const nav = getNav(page);

      await nav.toggle.click();
      await expectMobileMenuOpen(nav);

      const cta = nav.landmark.getByRole("dialog").getByRole("link", { name: "Umów wizytę" });
      await expect(cta).toHaveAttribute("href", "/index.html#booking");
      await cta.click();

      await expect(page).toHaveURL(/\/index\.html#booking$/);
      await expectMobileMenuClosed(nav);
      await expect(page.locator('main section[id="booking"]')).toBeInViewport();
    });
  }

  test("widening an open mobile menu to the desktop layout clears the mobile state", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const nav = getNav(page);

    await nav.toggle.click();
    await expectMobileMenuOpen(nav);

    await page.setViewportSize(BREAKPOINT);

    await expect(nav.toggle).toHaveAttribute("aria-expanded", "false");
    await expectPageUnlocked(nav);
    await expectDesktopNavigation(nav);

    // Keyboard order is no longer trapped: Tab leaves the navigation for the page content.
    await nav.landmark.getByRole("button", { name: /^Włącz tryb/ }).focus();
    await page.keyboard.press("Tab");
    await expect(nav.main.locator(":focus")).toHaveCount(1);

    await nav.landmark.getByRole("link", { name: "O nas" }).focus();
    await page.setViewportSize({ ...MOBILE, width: 899 });
    await expectMobileMenuClosed(nav);
    await expect(nav.toggle).toBeFocused();
  });

  test("narrowing returns focus to the toggle when the browser clears it before the breakpoint event", async ({ page }) => {
    // Chromium can blur a link in the newly hidden panel before it dispatches
    // the media query change event, the order behind intermittent CI failures.
    // Blurring at the start of the navigation listener reproduces it reliably.
    await page.addInitScript(() => {
      const addEventListener = MediaQueryList.prototype.addEventListener;
      MediaQueryList.prototype.addEventListener = function (type, listener, options) {
        const handle = type === "change" && this.media === "(min-width: 900px)"
          ? (event) => {
            if (!event.matches) document.activeElement.blur();
            listener(event);
          }
          : listener;
        return addEventListener.call(this, type, handle, options);
      };
    });
    await page.setViewportSize(BREAKPOINT);
    await page.goto("/");
    const nav = getNav(page);

    await nav.landmark.getByRole("link", { name: "O nas" }).focus();
    await page.setViewportSize({ ...BREAKPOINT, width: 899 });
    await expectMobileMenuClosed(nav);
    await expect(nav.toggle).toBeFocused();
  });

  test("desktop navigation is exposed to assistive technology", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const nav = getNav(page);

    await expect(nav.toggle).toHaveAttribute("aria-expanded", "false");
    await expectPageUnlocked(nav);
    await expectDesktopNavigation(nav);
  });
});

// Geometry and hit testing catch clipped controls that toBeVisible() accepts.
const menuControlReachability = (controls) => controls.evaluateAll((elements) =>
  elements.map((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const focused = element.matches(":focus-visible");
    const ring = focused ? parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset) : 0;
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return {
      reachable: box.top - ring >= 0 && box.bottom + ring <= innerHeight &&
        box.left - ring >= 0 && box.right + ring <= innerWidth && element.contains(hit),
      focusVisible: focused && style.outlineStyle === "solid" && parseFloat(style.outlineWidth) >= 2,
    };
  })
);

const expectFocusedMenuControl = async (control) => {
  await expect(control).toBeFocused();
  await expect.poll(() => menuControlReachability(control)).toEqual([
    { reachable: true, focusVisible: true },
  ]);
};

test.describe("mobile menu viewport reachability", () => {
  test.use({ reducedMotion: "reduce" });

  const viewports = [
    { width: 667, height: 375, colorScheme: "dark" },
    { width: 812, height: 375, colorScheme: "light" },
    { width: 320, height: 256, colorScheme: "dark" },
    { ...MOBILE, colorScheme: "light" },
  ];

  for (const route of ["/", "/privacy.html", "/terms.html", "/cookies.html"]) {
    for (const { colorScheme, ...viewport } of viewports) {
      test(`${route} ${viewport.width}x${viewport.height} ${colorScheme}: pointer, focus, and cleanup`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme });
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator("html")).toHaveClass(new RegExp(`theme--${colorScheme}`));
        const nav = getNav(page);
        const controls = nav.panel.locator("a[href], button");
        const first = controls.first();
        const theme = controls.last();
        const booking = nav.panel.getByRole("link", { name: "Umów wizytę" });
        const contactBar = page.locator(".mobile-cta");
        const hasContactBar = route === "/" && viewport.width < 768;

        await nav.toggle.click();
        await expectMobileMenuOpen(nav);
        await expect(controls).toHaveCount(9);
        await expect(first).toBeFocused();
        expect((await menuControlReachability(first))[0].reachable).toBe(true);
        if (hasContactBar) await expect(contactBar).toHaveCSS("visibility", "hidden");

        const geometry = await nav.panel.evaluate((panel) => ({
          height: panel.clientHeight,
          scrollHeight: panel.scrollHeight,
          width: panel.clientWidth,
          scrollWidth: panel.scrollWidth,
          documentWidth: document.documentElement.scrollWidth,
          stackCenter: (panel.firstElementChild.getBoundingClientRect().top +
            panel.lastElementChild.getBoundingClientRect().bottom) / 2,
        }));
        expect(geometry.height).toBe(viewport.height);
        expect(geometry.scrollWidth).toBe(geometry.width);
        expect(geometry.documentWidth).toBe(viewport.width);
        if (viewport.height === MOBILE.height) {
          expect(geometry.scrollHeight).toBe(geometry.height);
          expect(Math.abs(geometry.stackCenter - viewport.height / 2)).toBeLessThan(1);
        } else {
          expect(geometry.scrollHeight).toBeGreaterThan(geometry.height);
        }

        // Use real wheel input; locator scrolling could conceal a broken panel.
        const pageY = await page.evaluate(() => scrollY);
        const reached = new Set();
        await page.mouse.move(viewport.width / 2, viewport.height / 2);
        for (let step = 0; step < 10; step += 1) {
          const states = await menuControlReachability(controls);
          for (const [index, state] of states.entries()) {
            if (state.reachable && !reached.has(index)) {
              await controls.nth(index).click({ trial: true });
              reached.add(index);
            }
          }
          const { top, max } = await nav.panel.evaluate((panel) => ({
            top: panel.scrollTop, max: panel.scrollHeight - panel.clientHeight,
          }));
          if (top >= max - 1) break;
          await page.mouse.wheel(0, viewport.height / 2);
          await expect.poll(() => nav.panel.evaluate((panel) => panel.scrollTop)).toBeGreaterThan(top);
        }
        expect([...reached].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        expect(await page.evaluate(() => scrollY)).toBe(pageY);

        const themeLabel = await theme.getAttribute("aria-label");
        await theme.click();
        await expect(theme).not.toHaveAttribute("aria-label", themeLabel);
        await expect(page.locator("html")).toHaveClass(new RegExp(`theme--${colorScheme === "dark" ? "light" : "dark"}`));
        await expectMobileMenuOpen(nav);
        // The close control remains clickable above the panel at its scroll end.
        expect((await menuControlReachability(nav.toggle))[0].reachable).toBe(true);
        await nav.toggle.click();
        await expectMobileMenuClosed(nav);
        await expect(nav.toggle).toBeFocused();
        if (hasContactBar) await expect(contactBar).toHaveCSS("visibility", "visible");

        // Reopen from the scrolled end. Native focus must reveal the first link.
        await page.keyboard.press("Enter");
        for (let index = 0; index < 9; index += 1) {
          await expectFocusedMenuControl(controls.nth(index));
          await page.keyboard.press("Tab");
        }
        await expectFocusedMenuControl(nav.toggle);
        await page.keyboard.press("Tab");
        await expectFocusedMenuControl(first);
        // Traverse backwards too, including both ends of the focus trap.
        await page.keyboard.press("Shift+Tab");
        await expectFocusedMenuControl(nav.toggle);
        for (let index = 8; index >= 0; index -= 1) {
          await page.keyboard.press("Shift+Tab");
          await expectFocusedMenuControl(controls.nth(index));
        }
        await page.keyboard.press("Escape");
        await expectMobileMenuClosed(nav);
        await expect(nav.toggle).toBeFocused();

        await page.keyboard.press("Enter");
        await page.keyboard.press("Shift+Tab");
        await page.keyboard.press("Shift+Tab");
        await expectFocusedMenuControl(theme);
        await page.setViewportSize({ width: 900, height: viewport.height });
        await expectDesktopNavigation(nav);
        await expectPageUnlocked(nav);
        await expect(nav.panel).toHaveCSS("overflow-y", "visible");
        await expect(nav.panel).toHaveCSS("padding-top", "0px");
        await expect(nav.panel.locator(".nav__list")).toHaveCSS("margin-top", "0px");
        for (const state of await menuControlReachability(controls)) expect(state.reachable).toBe(true);
        await theme.focus();
        await page.keyboard.press("Tab");
        await expect(nav.main.locator(":focus")).toHaveCount(1);

        await first.focus();
        await page.setViewportSize({ width: 899, height: viewport.height });
        await expectMobileMenuClosed(nav);
        await expect(nav.toggle).toBeFocused();
        await page.setViewportSize(viewport);
        await page.keyboard.press("Enter");
        await expectFocusedMenuControl(first);
        await first.press("Enter");
        await expect(page).toHaveURL(/#about$/);
        await expectMobileMenuClosed(nav);
        await expect(page.locator('main section[id="about"]')).toBeInViewport();

        await page.goto(route);
        await nav.toggle.click();
        await booking.click();
        await expect(page).toHaveURL(/#booking$/);
        await expectMobileMenuClosed(nav);
        await expect(page.locator('main section[id="booking"]')).toBeInViewport();
      });
    }
  }
});

test.describe("mobile header booking link", () => {
  test("is skipped by Tab over the hero and reachable with a visible focus outline after it", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const header = page.locator("[data-header]");
    const logo = header.getByRole("link", { name: "Studio Noir" });
    const miniCta = page.locator("[data-header-mini-cta]");
    // The closed menu panel is aria-hidden, so only the header link can match.
    const exposedCta = header.getByRole("link", { name: "Umów wizytę" });

    await expect(page.locator(".hero")).toBeInViewport();
    await expect(miniCta).toHaveJSProperty("inert", true);
    await expect(miniCta).toHaveCSS("visibility", "hidden");
    await expect(exposedCta).toHaveCount(0);

    await logo.focus();
    await page.keyboard.press("Tab");
    await expect(getNav(page).toggle).toBeFocused();

    await page.evaluate(() => {
      const hero = document.querySelector(".hero");
      window.scrollTo({ top: hero.offsetTop + hero.offsetHeight + 1, behavior: "instant" });
    });
    await expect(miniCta).toHaveClass(/\bis-visible\b/);
    await expect(miniCta).toHaveJSProperty("inert", false);
    await expect(exposedCta).toHaveCount(1);
    await expect(miniCta).toHaveCSS("opacity", "1");

    await logo.focus();
    await page.keyboard.press("Tab");
    await expect(exposedCta).toBeFocused();
    expect(await miniCta.evaluate((link) => link.matches(":focus-visible"))).toBe(true);
    await expect(miniCta).toHaveCSS("outline-style", "solid");
    await expect(miniCta).toHaveCSS("outline-width", "2px");

    await expect(miniCta).toHaveAttribute("href", "#booking");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/#booking$/);
    await expect(page.locator('main section[id="booking"]')).toBeInViewport();
  });
});

// Moving backwards, the browser aligns each newly focused control with the top of
// the scrollport, where the sticky header would cover it without scroll padding.
test.describe("sticky header focus clearance", () => {
  test.use({ reducedMotion: "reduce" });

  for (const viewport of [MOBILE, BREAKPOINT, DESKTOP]) {
    test(`${viewport.width}x${viewport.height}: Shift+Tab keeps page controls below the header`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.locator(".footer__link").first().focus();

      let checked = 0;
      for (let step = 0; step < 80; step += 1) {
        await page.keyboard.press("Shift+Tab");
        const geometry = await page.evaluate(() => {
          const element = document.activeElement;
          if (element.closest("[data-header]")) return { done: true };
          if (!element.closest("[data-page-content]")) return null;

          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const headerBottom = document.querySelector("[data-header]").getBoundingClientRect().bottom;
          const bar = document.querySelector(".mobile-cta");
          const bandBottom = getComputedStyle(bar).display === "none" ? innerHeight : bar.getBoundingClientRect().top;
          return {
            label: element.getAttribute("aria-label") || element.textContent.trim().slice(0, 40),
            top: box.top,
            bottom: box.bottom,
            ring: parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset),
            headerBottom,
            band: bandBottom - headerBottom,
          };
        });
        if (geometry?.done) break;
        if (!geometry) continue;

        checked += 1;
        const label = `${geometry.label} at ${JSON.stringify(geometry)}`;
        if (geometry.bottom - geometry.top + 2 * geometry.ring <= geometry.band) {
          // The control and its focus outline clear the header.
          expect(geometry.top - geometry.ring, label).toBeGreaterThanOrEqual(geometry.headerBottom);
        } else {
          // A photograph taller than the visible band must still cross it.
          expect(geometry.bottom, label).toBeGreaterThan(geometry.headerBottom);
        }
      }

      // The walk reached the header after covering the page's controls.
      await expect(page.locator("[data-header] :focus")).toHaveCount(1);
      expect(checked).toBeGreaterThan(20);
    });
  }
});
