import { expect, test } from "@playwright/test";

// Below 768px the quick-contact bar is fixed to the viewport bottom
// (css/components.css). A control reached with Tab from above is scrolled to the
// bottom edge, so it needs scroll-margin-bottom to stay clear of the bar.
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 320, height: 400 },
];
const CONTROLS = ".stylist-card__action, .gallery__item";
// The global :focus-visible outline: 2px width + 3px offset (css/base.css).
const FOCUS_RING = 5;

// The bar holds two actions; Instagram remains only in the page footers.
const MOBILE = { width: 375, height: 812 };
const BAR_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 767, height: 1024 },
];
const HIDDEN_VIEWPORTS = [
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
];
const BOOKING_NAME = "Demo rezerwacji – przejdź do demonstracyjnej rezerwacji wizyty";
const PHONE_NAME = "Telefon autora – zadzwoń do KP_Code Digital Studio pod numer +48 533 537 091";
const PHONE_HREF = "tel:+48533537091";
// The shared control height (--size-control, css/tokens.css).
const TOUCH_TARGET = 48;
const ROUTES = ["/", "/privacy.html", "/terms.html", "/cookies.html"];

test.use({ reducedMotion: "reduce" });

const getBar = (page) => {
  const bar = page.locator(".mobile-cta");
  return {
    bar,
    landmark: page.getByRole("navigation", { name: "Szybki kontakt" }),
    links: bar.locator("a"),
  };
};

// While a modal is open, visibility removes the bar's links from the
// accessibility tree, programmatic focus, and pointer hit testing.
const expectBarUnavailable = async (page) => {
  const { bar, landmark, links } = getBar(page);
  await expect(bar).toHaveCSS("visibility", "hidden");
  await expect(landmark).toHaveCount(0);

  for (let index = 0; index < 2; index += 1) {
    const access = await links.nth(index).evaluate((link) => {
      link.focus();
      const box = link.getBoundingClientRect();
      const target = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return { focused: document.activeElement === link, hit: Boolean(target?.closest(".mobile-cta")) };
    });
    expect(access, `link ${index}`).toEqual({ focused: false, hit: false });
  }
};

for (const viewport of VIEWPORTS) {
  test(`${viewport.width}x${viewport.height}: Tab keeps stylist and gallery focus clear of the contact bar`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const bar = page.locator(".mobile-cta");
    await expect(bar).toBeVisible();

    const controls = page.locator(CONTROLS);
    await expect(controls).toHaveCount(9);

    for (let index = 0; index < 9; index += 1) {
      const control = controls.nth(index);

      // Reach the control with Tab from its preceding tab stop while its top
      // edge peeks in under the bar, as when tabbing down the page: the browser
      // then scrolls only as far as the control's scroll margin requires.
      await control.evaluate((element) => element.focus({ preventScroll: true }));
      await page.keyboard.press("Shift+Tab");
      await control.evaluate((element) => {
        const top = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - window.innerHeight + 8, behavior: "instant" });
      });
      await page.keyboard.press("Tab");
      await expect(control).toBeFocused();

      const geometry = await control.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const barTop = document.querySelector(".mobile-cta").getBoundingClientRect().top;
        const headerBottom = document.querySelector("[data-header]").getBoundingClientRect().bottom;
        return { top: box.top, bottom: box.bottom, barTop, headerBottom };
      });
      const label = `control ${index} at ${JSON.stringify(geometry)}`;
      const band = geometry.barTop - geometry.headerBottom;

      if (geometry.bottom - geometry.top + 2 * FOCUS_RING <= band) {
        // The whole control and its focus ring sit above the bar.
        expect(geometry.bottom + FOCUS_RING, label).toBeLessThanOrEqual(geometry.barTop);
      } else {
        // A photograph taller than the visible band cannot fit; its focus ring
        // must still cross the band between the header and the bar.
        expect(geometry.top, label).toBeLessThan(geometry.barTop);
        expect(geometry.bottom, label).toBeGreaterThan(geometry.headerBottom);
      }
    }
  });
}

test.describe("two-action contact bar", () => {
  for (const viewport of BAR_VIEWPORTS) {
    test(`${viewport.width}x${viewport.height}: booking demo and telephone fit one row without overflow`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const { bar, landmark, links } = getBar(page);

      await expect(landmark).toBeVisible();
      await expect(links).toHaveCount(2);
      await expect(landmark.getByRole("link")).toHaveCount(2);
      await expect(links.nth(0)).toHaveAttribute("href", "#booking");
      await expect(links.nth(0)).toHaveAccessibleName(BOOKING_NAME);
      await expect(links.nth(0)).toHaveText("Demo rezerwacji");
      await expect(links.nth(1)).toHaveAttribute("href", PHONE_HREF);
      await expect(links.nth(1)).toHaveAccessibleName(PHONE_NAME);
      await expect(links.nth(1)).toHaveText("Telefon autora");
      await expect(bar.locator('[data-instagram-link], a[href*="instagram"]')).toHaveCount(0);
      await expect(page.locator("[data-instagram-link]")).toHaveCount(0);

      const layout = await bar.evaluate((element) => {
        const root = document.documentElement;
        const rect = (node) => {
          const { left, right, top, bottom, width, height } = node.getBoundingClientRect();
          return { left, right, top, bottom, width, height };
        };
        return {
          viewportWidth: root.clientWidth,
          viewportHeight: window.innerHeight,
          pageScrollWidth: root.scrollWidth,
          barScrollWidth: element.scrollWidth,
          barClientWidth: element.clientWidth,
          clearance: parseFloat(getComputedStyle(document.body).paddingBottom),
          bar: rect(element),
          links: [...element.querySelectorAll("a")].map((link) => ({
            ...rect(link),
            scrollWidth: link.scrollWidth,
            clientWidth: link.clientWidth,
          })),
        };
      });
      const label = JSON.stringify(layout);

      expect(layout.pageScrollWidth, label).toBeLessThanOrEqual(layout.viewportWidth);
      expect(layout.barScrollWidth, label).toBeLessThanOrEqual(layout.barClientWidth);
      expect(layout.bar.bottom, label).toBeCloseTo(layout.viewportHeight, 0);
      expect(layout.bar.height, label).toBeLessThanOrEqual(layout.clearance);

      for (const link of layout.links) {
        expect(link.left, label).toBeGreaterThanOrEqual(0);
        expect(link.right, label).toBeLessThanOrEqual(layout.viewportWidth);
        expect(link.scrollWidth, label).toBeLessThanOrEqual(link.clientWidth);
        expect(link.width, label).toBeGreaterThanOrEqual(TOUCH_TARGET);
        expect(link.height, label).toBeGreaterThanOrEqual(TOUCH_TARGET);
      }

      // Both actions share one row, and the booking demo keeps the free width.
      expect(layout.links[0].top, label).toBe(layout.links[1].top);
      expect(layout.links[0].width, label).toBeGreaterThan(layout.links[1].width);
    });
  }

  for (const viewport of HIDDEN_VIEWPORTS) {
    test(`${viewport.width}x${viewport.height}: the bar stays hidden`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const { bar, landmark } = getBar(page);

      await expect(bar).toHaveCSS("display", "none");
      await expect(bar).toBeHidden();
      await expect(landmark).toHaveCount(0);
    });
  }

  test("both actions are Tab stops with a visible focus ring inside the bar", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const { links } = getBar(page);

    // The final CTA is the last tab stop in <main>, directly before the bar.
    await page.locator("#final-cta .cta__action").focus();

    for (let index = 0; index < 2; index += 1) {
      const link = links.nth(index);
      await page.keyboard.press("Tab");
      await expect(link).toBeFocused();
      expect(await link.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
      await expect(link).toHaveCSS("outline-style", "solid");
      await expect(link).toHaveCSS("outline-width", "2px");

      const geometry = await link.evaluate((element) => {
        const { left, right, top, bottom } = element.getBoundingClientRect();
        const barTop = element.closest(".mobile-cta").getBoundingClientRect().top;
        return { left, right, top, bottom, barTop, width: window.innerWidth, height: window.innerHeight };
      });
      const label = `link ${index} at ${JSON.stringify(geometry)}`;
      expect(geometry.top - FOCUS_RING, label).toBeGreaterThanOrEqual(geometry.barTop);
      expect(geometry.left - FOCUS_RING, label).toBeGreaterThanOrEqual(0);
      expect(geometry.right + FOCUS_RING, label).toBeLessThanOrEqual(geometry.width);
      expect(geometry.bottom + FOCUS_RING, label).toBeLessThanOrEqual(geometry.height);
    }

    await page.keyboard.press("Shift+Tab");
    await expect(links.nth(0)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/#booking$/);
    await expect(page.locator('main section[id="booking"]')).toBeInViewport();
  });

  test("the bar is unavailable while the navigation dialog is open", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const { bar, landmark } = getBar(page);
    const panel = page.locator("[data-nav-panel]");

    await page.locator("[data-nav-toggle]").click();
    await expect(panel).toHaveClass(/\bis-open\b/);
    await expectBarUnavailable(page);

    await page.keyboard.press("Escape");
    await expect(panel).not.toHaveClass(/\bis-open\b/);
    await expect(bar).toHaveCSS("visibility", "visible");
    await expect(landmark).toBeVisible();
  });

  test("the bar is unavailable while the gallery lightbox is open", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const { bar, landmark } = getBar(page);
    const lightbox = page.locator("[data-lightbox-root]");

    await page.locator(".gallery__item").first().click();
    await expect(lightbox).toHaveClass(/\bis-open\b/);
    await expectBarUnavailable(page);

    await page.keyboard.press("Escape");
    await expect(lightbox).not.toHaveClass(/\bis-open\b/);
    await expect(bar).toHaveCSS("visibility", "visible");
    await expect(landmark).toBeVisible();
  });

  for (const route of ROUTES) {
    test(`${route}: the footer keeps the KP_Code Instagram profile link`, async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto(route);
      const instagram = page.locator(".footer .footer__social-link[href*='instagram']");

      await expect(instagram).toHaveCount(1);
      await expect(instagram).toHaveAttribute("href", "https://www.instagram.com/kp_code_/");
      await expect(instagram).toHaveAttribute("target", "_blank");
      await expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
      await expect(instagram).toHaveAccessibleName("KP_Code na Instagramie (otwiera się w nowej karcie)");
    });
  }
});
