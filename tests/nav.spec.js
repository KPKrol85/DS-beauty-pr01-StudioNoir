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

// Each legal page lists its numbered sections in a "Spis treści" navigation,
// and every numbered section closes with a link back to it. Both are native
// fragment links, cleared of the sticky header by the root scroll padding
// (css/base.css). `inner` names a section with its own focus stops: inline
// links or a table region.
const LEGAL_DOCUMENTS = [
  { route: "/privacy.html", contents: "privacy-toc", sections: 14, inner: "privacy-recipients-title" },
  { route: "/terms.html", contents: "terms-toc", sections: 17, inner: "terms-data-title" },
  { route: "/cookies.html", contents: "cookies-toc", sections: 9, inner: "cookies-types-title" },
];
const NARROW = { width: 320, height: 640 };
const RETURN_LINK_NAME = "Wróć do spisu treści";

const getContentsLinks = (page) =>
  page.getByRole("navigation", { name: "Spis treści" }).getByRole("list").getByRole("link");

const getReturnLinks = (page) => page.getByRole("link", { name: RETURN_LINK_NAME, exact: true });

// Numbered top-level headings in document order, with the return links each
// section holds and whether one closes it after its content. A section runs to
// the next numbered heading or, for the last one, to the closing rule.
const readLegalOutline = (page) =>
  page.locator("main h2").evaluateAll((headings, name) => {
    const numbered = headings.filter((heading) => /^\d+\. /.test(heading.textContent));
    const isReturn = (node) => node.matches(`a[aria-label="${name}"]`);
    return numbered.map((heading, index) => {
      const end = numbered[index + 1] ?? heading.parentElement.querySelector(":scope > hr");
      const content = [];
      for (let node = heading.nextElementSibling; node && node !== end; node = node.nextElementSibling) content.push(node);
      return {
        id: heading.id,
        text: heading.textContent,
        returns: content.flatMap((node) => [node, ...node.querySelectorAll("a")].filter(isReturn).map((link) => link.getAttribute("href"))),
        closing: content.length > 1 && isReturn(content.at(-1)),
      };
    });
  }, RETURN_LINK_NAME);

// The first return link after a heading, which the outline test proves is its section's own.
const getReturnLink = (page, headingId) => page.locator(`[id="${headingId}"] ~ a[aria-label="${RETURN_LINK_NAME}"]`).first();

// The section's sequential focus stops in document order, and the focused one's position.
const readSectionFocus = (page, headingId) =>
  page.locator(`[id="${headingId}"]`).evaluate((heading) => {
    const stops = [];
    for (let node = heading.nextElementSibling; node && !node.matches("h2, hr"); node = node.nextElementSibling) {
      stops.push(...[node, ...node.querySelectorAll("*")].filter((element) => element.matches("a[href], [tabindex='0']")));
    }
    return { position: stops.indexOf(document.activeElement), count: stops.length };
  });

const expectFragmentTarget = async (page, id) => {
  const target = page.locator(`[id="${id}"]`);
  await expect(page).toHaveURL((url) => url.hash === `#${id}`);
  await expect(target).toBeInViewport();
  await expect
    .poll(async () => {
      const [header, box] = await Promise.all([page.locator("[data-header]").boundingBox(), target.boundingBox()]);
      return Math.round(box.y - header.y - header.height);
    })
    .toBeGreaterThanOrEqual(0);
};

// A section entry is restored where it was left: at its heading, at its return
// link, or in between, depending on whether the scroll that brought the link
// into view was saved before leaving. Either way the band below the header
// shows part of that section.
const expectSectionRestored = async (page, id) => {
  await expect(page).toHaveURL((url) => url.hash === `#${id}`);
  await expect
    .poll(() =>
      page.locator(`[id="${id}"]`).evaluate((heading, name) => {
        let link = heading.nextElementSibling;
        while (!link.matches(`a[aria-label="${name}"]`)) link = link.nextElementSibling;
        const headerBottom = document.querySelector("[data-header]").getBoundingClientRect().bottom;
        const [start, end] = [heading.getBoundingClientRect().top, link.getBoundingClientRect().bottom];
        return Math.min(innerHeight, end) - Math.max(headerBottom, start);
      }, RETURN_LINK_NAME)
    )
    .toBeGreaterThan(0);
};

const expectVisibleFocusBelowHeader = async (control) => {
  await expect(control).toBeFocused();
  const state = await control.evaluate((element) => {
    const style = getComputedStyle(element);
    const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
    const headerBottom = document.querySelector("[data-header]").getBoundingClientRect().bottom;
    return {
      visible: element.matches(":focus-visible") && style.outlineStyle === "solid" && parseFloat(style.outlineWidth) >= 2,
      clearance: Math.round(element.getBoundingClientRect().top - ring - headerBottom),
    };
  });
  expect(state.visible).toBe(true);
  expect(state.clearance).toBeGreaterThanOrEqual(0);
};

// Position relative to the content above, so a shifted control fails regardless of scrolling.
const readReturnLink = (link) =>
  link.evaluate((node) => {
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    const above = node.previousElementSibling.getBoundingClientRect();
    return {
      box: [box.left - above.left, box.top - above.bottom, box.width, box.height],
      color: style.color,
      washed: style.backgroundColor !== "rgba(0, 0, 0, 0)",
      travel: getComputedStyle(node.firstElementChild).transform,
    };
  });

// The visible chevron, not just its mask box: the mask image's opaque pixels,
// drawn over the square icon box at ten times its scale, mapped onto the page.
const readChevron = (link) =>
  link.evaluate(async (node) => {
    const icon = node.firstElementChild;
    const image = new Image();
    image.src = getComputedStyle(icon).maskImage.match(/url\("(.+)"\)/)[1];
    await image.decode();
    const [control, box] = [node.getBoundingClientRect(), icon.getBoundingClientRect()];
    const scale = 10;
    const size = Math.round(box.width * scale);
    const canvas = Object.assign(document.createElement("canvas"), { width: size, height: size });
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    let [left, top, right, bottom] = [size, size, 0, 0];
    for (let pixel = 0; pixel < size * size; pixel += 1) {
      if (data[pixel * 4 + 3] === 0) continue;
      const [x, y] = [pixel % size, Math.floor(pixel / size)];
      [left, top, right, bottom] = [Math.min(left, x), Math.min(top, y), Math.max(right, x + 1), Math.max(bottom, y + 1)];
    }
    return {
      width: (right - left) / scale,
      offset: [
        box.left + (left + right) / 2 / scale - (control.left + control.width / 2),
        box.top + (top + bottom) / 2 / scale - (control.top + control.height / 2),
      ],
    };
  });

test.describe("legal document contents", () => {
  test.use({ reducedMotion: "reduce" });

  for (const { route, contents, sections, inner } of LEGAL_DOCUMENTS) {
    test(`${route}: one contents link per numbered section, each section closed by one return link`, async ({ page }) => {
      await page.goto(route);
      const nav = page.getByRole("navigation", { name: "Spis treści" });
      const links = getContentsLinks(page);
      const outline = await readLegalOutline(page);

      await expect(nav).toHaveCount(1);
      await expect(nav).toHaveAttribute("id", contents);
      await expect(nav.getByRole("heading", { level: 2, name: "Spis treści", exact: true })).toHaveCount(1);

      // Every numbered section, in order, under its exact title and a unique target.
      expect(outline.map(({ text }) => Number.parseInt(text, 10))).toEqual(
        Array.from({ length: sections }, (_, index) => index + 1)
      );
      const entries = await links.evaluateAll((nodes) => nodes.map((node) => [node.textContent, node.getAttribute("href")]));
      expect(entries).toEqual(outline.map(({ id, text }) => [text, `#${id}`]));
      const ids = await page.locator("[id]").evaluateAll((nodes) => nodes.map((node) => node.id));
      expect(new Set(ids).size).toBe(ids.length);

      // Each section holds exactly one return link, to the contents, as its
      // final element after the content, so none sits beside a heading or
      // after the closing rule; headings keep their own accessible names.
      expect(outline.map(({ returns }) => returns)).toEqual(Array(sections).fill([`#${contents}`]));
      expect(outline.map(({ closing }) => closing)).toEqual(Array(sections).fill(true));
      await expect(getReturnLinks(page)).toHaveCount(sections);
      for (const { id, text } of outline) {
        await expect(page.locator(`[id="${id}"]`)).toHaveAccessibleName(text);
      }

      // Named regions, including the table regions, still resolve to their headings.
      for (const labelled of await page.locator("main [aria-labelledby]").all()) {
        const label = page.locator(`[id="${await labelled.getAttribute("aria-labelledby")}"]`);
        await expect(label).toHaveCount(1);
        await expect(labelled).toHaveAccessibleName(await label.textContent());
      }
    });

    test(`${route}: keyboard moves from the contents through a section to its return link and back`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(route);
      const links = getContentsLinks(page);
      const outline = await readLegalOutline(page);

      for (const id of [outline[0].id, inner, outline.at(-1).id]) {
        await links.nth(outline.findIndex((section) => section.id === id)).focus();
        await page.keyboard.press("Enter");
        await expectFragmentTarget(page, id);

        // Sequential focus resumes at the fragment target and passes the
        // section's own links and table regions in order before its return link.
        const { count } = await readSectionFocus(page, id);
        if (id === inner) expect(count).toBeGreaterThan(1);
        for (let position = 0; position < count; position += 1) {
          await page.keyboard.press("Tab");
          expect(await readSectionFocus(page, id)).toEqual({ position, count });
        }
        const link = getReturnLink(page, id);
        await expectVisibleFocusBelowHeader(link);
        await expect(link).toBeInViewport();
        await page.keyboard.press("Enter");
        await expectFragmentTarget(page, contents);
        await page.keyboard.press("Tab");
        await expectVisibleFocusBelowHeader(links.first());
      }
    });
  }

  test.describe("without browser JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    for (const { route, contents, inner } of LEGAL_DOCUMENTS) {
      for (const [layout, viewport] of [["desktop", DESKTOP], ["320px", NARROW]]) {
        test(`${route} ${layout}: contents, return, and history navigation`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.goto(route);
          const links = getContentsLinks(page);
          const outline = await readLegalOutline(page);
          const [first, last] = [outline[0], outline.at(-1)];

          await links.first().click();
          await expectFragmentTarget(page, first.id);
          await getReturnLink(page, first.id).click();
          await expectFragmentTarget(page, contents);
          await links.last().click();
          await expectFragmentTarget(page, last.id);
          await getReturnLink(page, last.id).click();
          await expectFragmentTarget(page, contents);

          // History traversal restores each entry's URL and the position it was
          // left from, which on a narrow screen may lie further down the contents.
          await page.goBack();
          await expectSectionRestored(page, last.id);
          await page.goBack();
          await expect(page).toHaveURL((url) => url.hash === `#${contents}`);
          await expect(links.last()).toBeInViewport();
          await page.goBack();
          await expectSectionRestored(page, first.id);

          // A direct link opens a section with nested content. Every return link
          // sits on the text column's start edge with the same gap below its
          // section's content, and its 48px hit area stays clear of that content,
          // the heading or rule below, and the viewport edges.
          await page.goto(`${route}#${inner}`);
          await expectFragmentTarget(page, inner);
          const geometry = await getReturnLinks(page).evaluateAll((nodes) =>
            nodes.map((node) => {
              const box = node.getBoundingClientRect();
              const column = node.parentElement.getBoundingClientRect();
              const reach = (48 - box.height) / 2;
              return {
                start: box.left - column.left,
                above: Math.round(box.top - node.previousElementSibling.getBoundingClientRect().bottom),
                clear: [
                  box.top - reach >= node.previousElementSibling.getBoundingClientRect().bottom,
                  box.bottom + reach <= node.nextElementSibling.getBoundingClientRect().top,
                  box.left - reach >= 0,
                  box.right + reach <= document.documentElement.clientWidth,
                ],
              };
            })
          );
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          expect(new Set(geometry.map(({ start, above }) => `${start} ${above}`))).toEqual(new Set(["0 16"]));
          expect(geometry.map(({ clear }) => clear)).toEqual(Array(geometry.length).fill([true, true, true, true]));
          expect(overflow).toBe(0);
        });
      }
    }
  });

  for (const colorScheme of ["dark", "light"]) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      test(`${colorScheme}, ${reducedMotion} motion: return link feedback keeps its box, centered chevron, and 48px hit area`, async ({ page }) => {
        await page.emulateMedia({ colorScheme, reducedMotion });
        await page.setViewportSize(DESKTOP);
        await page.goto("/terms.html");
        await expect(page.locator("html")).toHaveClass(new RegExp(`theme--${colorScheme}`));
        const link = getReturnLink(page, "terms-services-title");
        const closing = link.locator("xpath=preceding-sibling::*[1]");
        // The contents title carries the theme's gold accent token.
        const gold = await page.locator(".legal-toc__title").evaluate((node) => getComputedStyle(node).color);
        await link.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));

        const rest = await readReturnLink(link);
        expect(rest).toMatchObject({ washed: false, travel: "none" });
        expect(rest.color).not.toBe(gold);
        expect(rest.box).toEqual([0, 16, 32, 32]);

        // A compact 15px chevron, its visible center on the control's center.
        const chevron = await readChevron(link);
        expect(chevron.width).toBeLessThanOrEqual(16);
        for (const offset of chevron.offset) expect(Math.abs(offset)).toBeLessThanOrEqual(0.25);

        // The pseudo-element extends the 32px square to a 48px target.
        const hits = await link.evaluate((node) => {
          const box = node.getBoundingClientRect();
          const [x, y] = [box.left + box.width / 2, box.top + box.height / 2];
          return [[-23, 0], [23, 0], [0, -23], [0, 23]].map(
            ([dx, dy]) => document.elementFromPoint(x + dx, y + dy)?.closest("a") === node
          );
        });
        expect(hits).toEqual([true, true, true, true]);

        // Hover and keyboard focus give the same gold feedback in a fixed box;
        // the chevron rises only when motion is allowed.
        const active = { box: rest.box, color: gold, washed: true, travel: reducedMotion === "reduce" ? "none" : "matrix(1, 0, 0, 1, 0, -2)" };
        await link.hover();
        await expect.poll(() => readReturnLink(link)).toEqual(active);

        // The section's closing paragraph has no links, so Tab moves from it to the return link.
        await closing.click();
        await expect.poll(() => readReturnLink(link)).toEqual(rest);
        await page.keyboard.press("Tab");
        await expectVisibleFocusBelowHeader(link);
        await expect.poll(() => readReturnLink(link)).toEqual(active);
      });
    }
  }
});
