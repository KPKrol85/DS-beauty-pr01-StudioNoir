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

test.use({ reducedMotion: "reduce" });

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
