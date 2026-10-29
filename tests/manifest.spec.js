import { expect, test } from "@playwright/test";

// public/manifest.webmanifest declares the install-dialog screenshots and three app
// shortcuts. Chromium's richer install UI ignores screenshots with a side outside
// 320–3840 px, a side more than 2.3 times the other, or an aspect ratio that differs
// from the first screenshot of the same form_factor.
const PRIMARY_ICONS = [
  "/assets/icons/favicon/web-app-manifest-192x192.png",
  "/assets/icons/favicon/web-app-manifest-512x512.png",
  "/assets/icons/favicon/favicon.svg",
];
const SCREENSHOT_SIZES = { wide: "1440x900", narrow: "390x844" };
const SHORTCUTS = [
  { name: "Usługi", url: "/index.html#services", section: "services" },
  { name: "Galeria", url: "/index.html#gallery", section: "gallery" },
  { name: "Demo rezerwacji", url: "/index.html#booking", section: "booking" },
];
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
];

const readManifest = async (request) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBe(true);
  return response.json();
};

// Fetches the delivered file and decodes it in the browser, so the declared MIME
// type and pixel size are checked against the actual image.
const inspectImage = async (page, src) => {
  const response = await page.request.get(src);
  expect(response.ok(), `${src} is served`).toBe(true);
  const size = await page.evaluate(async (url) => {
    const image = new Image();
    image.src = url;
    await image.decode();
    return `${image.naturalWidth}x${image.naturalHeight}`;
  }, src);
  return { type: response.headers()["content-type"], size, body: await response.body() };
};

test("manifest keeps its existing fields and primary icons", async ({ request }) => {
  const manifest = await readManifest(request);
  expect(manifest).toMatchObject({ start_url: "/", scope: "/", display: "standalone" });
  expect(manifest.icons.map((icon) => icon.src)).toEqual(PRIMARY_ICONS);
});

test("screenshots match their declared size, type and form factor", async ({ page, request }) => {
  const { screenshots } = await readManifest(request);
  await page.goto("/offline.html");

  expect(screenshots).toHaveLength(4);
  for (const formFactor of Object.keys(SCREENSHOT_SIZES)) {
    expect(screenshots.filter((shot) => shot.form_factor === formFactor)).toHaveLength(2);
  }

  for (const shot of screenshots) {
    expect(shot.sizes).toBe(SCREENSHOT_SIZES[shot.form_factor]);
    expect(shot.type).toBe("image/jpeg");
    expect(shot.label.trim()).not.toBe("");

    const image = await inspectImage(page, shot.src);
    expect(image.type).toBe(shot.type);
    expect(image.size, `${shot.src} pixel size`).toBe(shot.sizes);

    const [width, height] = shot.sizes.split("x").map(Number);
    for (const side of [width, height]) {
      expect(side).toBeGreaterThanOrEqual(320);
      expect(side).toBeLessThanOrEqual(3840);
    }
    expect(Math.max(width, height) / Math.min(width, height)).toBeLessThanOrEqual(2.3);
  }
});

test("shortcuts open in-scope sections with their own 192px icons", async ({ page, request }) => {
  const { scope, shortcuts } = await readManifest(request);
  await page.goto("/offline.html");

  expect(shortcuts.map(({ name, url }) => ({ name, url }))).toEqual(
    SHORTCUTS.map(({ name, url }) => ({ name, url }))
  );

  const bodies = [];
  for (const shortcut of shortcuts) {
    expect(shortcut.short_name.trim()).not.toBe("");
    expect(shortcut.description.trim()).not.toBe("");
    expect(new URL(shortcut.url, page.url()).pathname.startsWith(scope)).toBe(true);
    expect(shortcut.icons).toHaveLength(1);

    const [icon] = shortcut.icons;
    expect(icon).toMatchObject({ sizes: "192x192", type: "image/png", purpose: "any" });
    const image = await inspectImage(page, icon.src);
    expect(image.type).toBe("image/png");
    expect(image.size, `${icon.src} pixel size`).toBe("192x192");
    bodies.push(image.body);
  }

  // Each shortcut has distinct artwork, not one image under three names.
  for (const [index, body] of bodies.entries()) {
    for (const other of bodies.slice(index + 1)) expect(body.equals(other)).toBe(false);
  }
});

test.describe("shortcut destinations", () => {
  // Fragment navigation then scrolls instantly, without the smooth-scroll animation.
  test.use({ reducedMotion: "reduce" });

  for (const viewport of VIEWPORTS) {
    for (const { url, section } of SHORTCUTS) {
      test(`${viewport.width}x${viewport.height}: ${url} shows its section below the sticky header`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(url);

        const target = page.locator(`main section[id="${section}"]`);
        await expect(target).toBeInViewport();
        await expect(target.locator(".section__title")).toBeInViewport();
        // The fragment target clears the sticky header (scroll-padding-top in css/base.css).
        await expect
          .poll(() =>
            target.evaluate((node) => {
              const header = document.querySelector("[data-header]").getBoundingClientRect();
              return Math.round(node.getBoundingClientRect().top - header.bottom);
            })
          )
          .toBeGreaterThanOrEqual(0);
      });
    }
  }
});
