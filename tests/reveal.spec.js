import { expect, test } from "@playwright/test";

// js/reveal.js hides each [data-reveal] element once it is observed and reveals it
// from an IntersectionObserver callback; css/sections.css fades it in over 0.6s.
// On short viewports, such as a landscape phone or the 320x256 CSS px reflow case,
// some containers are more than five viewport heights tall, so a reveal that waits
// for a 0.2 intersection ratio never fires for them, however far they are scrolled.
const VIEWPORTS = [
  { width: 667, height: 375 },
  { width: 320, height: 256 },
];
const REVEAL_COUNT = 11;

// Reduced motion reveals every element up front and would bypass the observer.
test.use({ reducedMotion: "no-preference" });

for (const viewport of VIEWPORTS) {
  test(`${viewport.width}x${viewport.height}: every [data-reveal] element is visible once scrolled into view`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(false);

    const elements = page.locator("[data-reveal]");
    await expect(elements).toHaveCount(REVEAL_COUNT);

    // Elements below the initial viewport must start hidden, so a pass below
    // comes from the observer revealing them rather than from a fallback.
    const belowFold = await elements.evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().top >= window.innerHeight)
    );
    for (const [index, hidden] of belowFold.entries()) {
      if (!hidden) continue;
      await expect(elements.nth(index)).toHaveClass(/\breveal\b/);
      await expect(elements.nth(index)).not.toHaveClass(/\bis-visible\b/);
    }

    for (let index = 0; index < REVEAL_COUNT; index += 1) {
      const element = elements.nth(index);
      const label = await element.evaluate(
        (node) => `#${node.closest("section").id} [data-reveal] (${Math.round(node.offsetHeight)}px tall)`
      );

      // Centred, the element covers as much of the viewport as it can.
      await element.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
      await expect(element, `${label} intersects the viewport`).toBeInViewport();

      // Soft, so one run reports every element that stays hidden. The opacity
      // check waits out the fade-in, by which time the class is settled.
      await expect.soft(element, `${label} is opaque`).toHaveCSS("opacity", "1");
      expect.soft(await element.getAttribute("class"), `${label} is revealed`).toMatch(/\bis-visible\b/);
    }
  });
}
