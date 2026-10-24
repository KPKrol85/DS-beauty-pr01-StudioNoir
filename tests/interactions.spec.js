import { expect, test } from "@playwright/test";

// Focused checks for the interactions outside the navigation: the booking demo
// (js/booking.js), the gallery lightbox (js/lightbox.js), the back-to-top
// control rendered by build/shared-footer.js (js/back-to-top.js), and theme
// persistence across a reload and pages. First-paint theme resolution and
// single-page switching are covered by tests/theme-first-paint.spec.js.
// From 768px the mobile contact bar is hidden, so it covers none of these controls.
const DESKTOP = { width: 1280, height: 800 };
const LEGAL_PAGES = ["/privacy.html", "/terms.html", "/cookies.html"];

test.use({ viewport: DESKTOP, reducedMotion: "reduce" });

// Summary status, action label, and described hint for each selection state.
const BOOKING_STATES = {
  empty: { status: "Brak wyboru.", hint: "Wybierz usługę i stylistę, aby zakończyć demo.", ready: false },
  noStylist: { status: "Brakuje stylisty.", hint: "Wybierz stylistę, aby zakończyć demo.", ready: false },
  noService: { status: "Brakuje usługi.", hint: "Wybierz usługę, aby zakończyć demo.", ready: false },
  ready: {
    status: "Wybór kompletny.",
    hint: "Pokaz kończy się na tej stronie — nic nie zostanie wysłane ani zapisane.",
    ready: true,
  },
  completed: {
    status: "Demo zakończone — wizyta nie została umówiona, nic nie wysłano ani nie zapisano.",
    hint: "Zmień usługę lub stylistę, aby powtórzyć demo.",
    ready: false,
    label: "Demo zakończone",
  },
};

const getBooking = (page) => {
  const root = page.locator("[data-booking]");
  return {
    services: root.locator("[data-booking-service]"),
    stylists: root.locator("[data-booking-stylist]"),
    choice: (name) => root.getByRole("button", { name, exact: true }),
    summaryService: root.locator("[data-summary-service]"),
    summaryStylist: root.locator("[data-summary-stylist]"),
    status: root.locator("[data-summary-status]"),
    action: root.locator("[data-booking-cta]"),
  };
};

// Only the selected choice of a step is pressed; every other one states aria-pressed="false".
const expectPressed = async (options, selected) => {
  const values = await options.evaluateAll((nodes) => nodes.map((node) => node.textContent));
  for (const [index, value] of values.entries()) {
    await expect(options.nth(index)).toHaveAttribute("aria-pressed", String(value === selected));
  }
};

// The pressed choices, summary, action state, and its hint are rendered together.
const expectBooking = async (booking, state, { service = null, stylist = null } = {}) => {
  await expectPressed(booking.services, service);
  await expectPressed(booking.stylists, stylist);
  await expect(booking.summaryService).toHaveText(service ?? "—");
  await expect(booking.summaryStylist).toHaveText(stylist ?? "—");
  await expect(booking.status).toHaveText(state.status);
  await expect(booking.action).toHaveText(state.label ?? "Zakończ demo");
  await expect(booking.action).toHaveAttribute("aria-disabled", String(!state.ready));
  await expect(booking.action).toHaveAccessibleDescription(state.hint);
};

test.describe("booking demo", () => {
  test("starts unselected with a focusable, described, unavailable action", async ({ page }) => {
    await page.goto("/");
    const booking = getBooking(page);

    await expect(booking.services).toHaveCount(5);
    await expect(booking.stylists).toHaveCount(3);
    await expectBooking(booking, BOOKING_STATES.empty);
    await expect(booking.action).toHaveAttribute("aria-describedby", "booking-requirement");

    // aria-disabled, not disabled: the action stays the Tab stop after the last stylist.
    await booking.choice("Sofia").focus();
    await page.keyboard.press("Tab");
    await expect(booking.action).toBeFocused();

    await page.keyboard.press("Enter");
    await expectBooking(booking, BOOKING_STATES.empty);
    await expect(booking.action).toBeFocused();
  });

  test("card links preselect and focus the matching choice and keep the other step", async ({ page }) => {
    await page.goto("/");
    const booking = getBooking(page);
    const section = page.locator('main section[id="booking"]');

    const preselect = async (linkName, choice) => {
      const link = page.getByRole("link", { name: linkName });
      await expect(link).toHaveAttribute("href", "#booking");
      await link.click();
      await expect(page).toHaveURL(/\/#booking$/);
      await expect(section).toBeInViewport();
      // Retried until the fragment navigation's focus reset has been followed by the refocus.
      await expect(booking.choice(choice)).toBeFocused();
      await expect(booking.choice(choice)).toBeInViewport();
    };

    await preselect("Zarezerwuj usługę: Koloryzacja", "Koloryzacja");
    await expectBooking(booking, BOOKING_STATES.noStylist, { service: "Koloryzacja" });

    await preselect("Zarezerwuj wizytę u Leona Zawadzkiego", "Leon");
    await expectBooking(booking, BOOKING_STATES.ready, { service: "Koloryzacja", stylist: "Leon" });

    await preselect("Zarezerwuj usługę: Strzyżenie", "Strzyżenie");
    await expectBooking(booking, BOOKING_STATES.ready, { service: "Strzyżenie", stylist: "Leon" });

    // Keyboard order continues from the preselected choice, not from the section start.
    await page.keyboard.press("Tab");
    await expect(booking.choice("Koloryzacja")).toBeFocused();
  });

  test("completing the demo sends and stores nothing, and changing either choice resets it", async ({ page }) => {
    await page.goto("/");
    const booking = getBooking(page);

    await booking.choice("Sofia").click();
    await expectBooking(booking, BOOKING_STATES.noService, { stylist: "Sofia" });
    await booking.choice("Stylizacja").click();
    await expectBooking(booking, BOOKING_STATES.ready, { service: "Stylizacja", stylist: "Sofia" });

    const url = page.url();
    const submissions = [];
    page.on("request", (request) => {
      if (request.method() !== "GET" || ["document", "fetch", "xhr", "ping"].includes(request.resourceType())) {
        submissions.push(`${request.method()} ${request.url()}`);
      }
    });

    await booking.action.focus();
    await page.keyboard.press("Enter");
    await expectBooking(booking, BOOKING_STATES.completed, { service: "Stylizacja", stylist: "Sofia" });
    // aria-disabled keeps focus on the action once the demo is complete.
    await expect(booking.action).toBeFocused();
    expect(page.url()).toBe(url);
    expect(submissions).toEqual([]);
    // Nothing is stored apart from the theme preference, which js/theme.js owns.
    const stored = await page.evaluate(() => [
      Object.keys(localStorage).filter((key) => key !== "studio-noir-theme"),
      sessionStorage.length,
    ]);
    expect(stored).toEqual([[], 0]);

    await booking.choice("Maja").click();
    await expectBooking(booking, BOOKING_STATES.ready, { service: "Stylizacja", stylist: "Maja" });

    await booking.action.click();
    await expectBooking(booking, BOOKING_STATES.completed, { service: "Stylizacja", stylist: "Maja" });
    await booking.choice("Pielęgnacja").click();
    await expectBooking(booking, BOOKING_STATES.ready, { service: "Pielęgnacja", stylist: "Maja" });
  });
});

const getLightbox = (page) => {
  const root = page.locator("[data-lightbox-root]");
  return {
    root,
    thumbnails: page.locator("[data-lightbox]"),
    dialog: page.getByRole("dialog", { name: "Podgląd zdjęcia" }),
    image: root.locator("[data-lightbox-image]"),
    caption: root.locator("[data-lightbox-caption]"),
    close: root.getByRole("button", { name: "Zamknij" }),
    previous: root.getByRole("button", { name: "Poprzednie zdjęcie" }),
    next: root.getByRole("button", { name: "Następne zdjęcie" }),
  };
};

// The dialog shows the thumbnail's image and description; the caption adds its position.
const expectLightboxImage = async (lightbox, index) => {
  const count = await lightbox.thumbnails.count();
  const { src, alt } = await lightbox.thumbnails
    .nth(index)
    .locator("img")
    .evaluate((img) => ({ src: img.src, alt: img.alt }));

  await expect(lightbox.image).toHaveJSProperty("src", src);
  await expect(lightbox.image).toHaveAttribute("alt", alt);
  await expect(lightbox.caption).toHaveText(`${alt} · ${index + 1} / ${count}`);
};

test.describe("gallery lightbox", () => {
  test("a thumbnail opens a modal dialog that takes focus, locks scrolling, and keeps Tab inside", async ({ page }) => {
    await page.goto("/");
    const lightbox = getLightbox(page);
    const body = page.locator("body");

    await expect(lightbox.thumbnails).toHaveCount(6);
    await expect(lightbox.root).toHaveAttribute("aria-hidden", "true");
    await expect(lightbox.dialog).toHaveCount(0);

    await lightbox.thumbnails.nth(2).click();
    await expect(lightbox.root).toHaveAttribute("aria-hidden", "false");
    await expect(lightbox.dialog).toBeVisible();
    await expect(lightbox.dialog).toHaveAttribute("aria-modal", "true");
    await expect(lightbox.close).toBeFocused();
    await expectLightboxImage(lightbox, 2);
    await expect(body).toHaveCSS("overflow", "hidden");

    // Close, Previous, and Next are the only Tab stops; Tab and Shift+Tab wrap at the ends.
    for (const control of [lightbox.previous, lightbox.next, lightbox.close]) {
      await page.keyboard.press("Tab");
      await expect(control).toBeFocused();
    }
    await page.keyboard.press("Shift+Tab");
    await expect(lightbox.next).toBeFocused();
    await expectLightboxImage(lightbox, 2);

    await page.keyboard.press("Enter");
    await expectLightboxImage(lightbox, 3);
    await expect(lightbox.next).toBeFocused();
  });

  test("arrow keys browse in a loop, and Escape restores scrolling and focuses the current image's thumbnail", async ({ page }) => {
    await page.goto("/");
    const lightbox = getLightbox(page);
    const body = page.locator("body");

    await lightbox.thumbnails.first().focus();
    await page.keyboard.press("Enter");
    await expect(lightbox.close).toBeFocused();
    await expectLightboxImage(lightbox, 0);

    await page.keyboard.press("ArrowLeft");
    await expectLightboxImage(lightbox, 5);
    await page.keyboard.press("ArrowRight");
    await expectLightboxImage(lightbox, 0);
    await page.keyboard.press("ArrowRight");
    await expectLightboxImage(lightbox, 1);
    await expect(lightbox.close).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(lightbox.root).toHaveAttribute("aria-hidden", "true");
    await expect(lightbox.root).toBeHidden();
    await expect(lightbox.dialog).toHaveCount(0);
    await expect(lightbox.image).not.toHaveAttribute("src");
    await expect(body).not.toHaveCSS("overflow", "hidden");
    // Focus returns to the thumbnail of the image last shown, not to the one that opened the dialog.
    await expect(lightbox.thumbnails.nth(1)).toBeFocused();
  });
});

const getBackToTop = (page) => ({
  button: page.locator("[data-back-to-top]"),
  exposed: page.getByRole("button", { name: "Wróć na górę" }),
  trigger: page.locator(".footer__copyright"),
  skipLink: page.locator('a[href="#main"]'),
});

const expectBackToTopShown = async (control) => {
  await expect(control.button).toHaveClass(/\bis-visible\b/);
  await expect(control.button).toBeVisible();
  await expect(control.exposed).toHaveCount(1);
};

// Hidden, visibility removes the control from pointer, Tab, and accessibility-tree access.
const expectBackToTopHidden = async (control) => {
  await expect(control.button).not.toHaveClass(/\bis-visible\b/);
  await expect(control.button).toBeHidden();
  await expect(control.exposed).toHaveCount(0);
};

// Puts the copyright line's top edge `distance` px below the viewport;
// a negative distance brings it that far into view.
const scrollCopyrightBelowViewport = async (control, distance) => {
  await control.trigger.evaluate((trigger, distance) => {
    const top = trigger.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - window.innerHeight - distance, behavior: "instant" });
  }, distance);
  if (distance > 0) await expect(control.trigger).not.toBeInViewport();
  else await expect(control.trigger).toBeInViewport();
};

// Added after js/back-to-top.js, this listener runs right after its click
// handler and records how far the page has scrolled at that moment.
const recordScrollAfterActivation = (control) =>
  control.button.evaluate((button) => {
    button.addEventListener("click", () => {
      window.__scrollAfterActivation = window.scrollY;
    });
  });

const readScroll = (page) => page.evaluate(() => window.scrollY);

test.describe("back to top", () => {
  test("follows the footer copyright line in both scroll directions and leaves the Tab order while hidden", async ({ page }) => {
    await page.goto("/");
    const control = getBackToTop(page);
    const lastFooterLink = page.locator(".footer a").last();

    await expect(control.button).toHaveCount(1);
    await expectBackToTopHidden(control);

    // Near the end of the page, but short of the copyright line, it stays hidden
    // and Tab from the last footer link passes it by.
    await scrollCopyrightBelowViewport(control, 2);
    await expectBackToTopHidden(control);
    await lastFooterLink.evaluate((link) => link.focus({ preventScroll: true }));
    await page.keyboard.press("Tab");
    await expect(control.button).not.toBeFocused();

    await scrollCopyrightBelowViewport(control, -2);
    await expectBackToTopShown(control);
    await lastFooterLink.evaluate((link) => link.focus({ preventScroll: true }));
    await page.keyboard.press("Tab");
    await expect(control.button).toBeFocused();

    await scrollCopyrightBelowViewport(control, 2);
    await expectBackToTopHidden(control);
    await scrollCopyrightBelowViewport(control, -2);
    await expectBackToTopShown(control);
  });

  test("keyboard activation returns instantly to the top without a fragment and continues from the skip link", async ({ page }) => {
    await page.goto("/");
    const control = getBackToTop(page);
    const url = page.url();

    await control.trigger.scrollIntoViewIfNeeded();
    await expectBackToTopShown(control);
    await recordScrollAfterActivation(control);

    await control.button.focus();
    await page.keyboard.press("Enter");
    // Under reduced motion the page is already at the top when the handler returns.
    expect(await page.evaluate(() => window.__scrollAfterActivation)).toBe(0);
    expect(await readScroll(page)).toBe(0);
    expect(page.url()).toBe(url);
    await expect(control.skipLink).toBeFocused();
    await expectBackToTopHidden(control);

    // The Tab sequence resumes at the start of the page, not at the hidden control.
    await page.keyboard.press("Tab");
    await expect(page.locator("[data-header]").getByRole("link", { name: "Studio Noir" })).toBeFocused();
  });

  test.describe("without reduced motion", () => {
    test.use({ reducedMotion: "no-preference" });

    test("pointer activation scrolls smoothly to the top and releases focus", async ({ page }) => {
      await page.goto("/");
      const control = getBackToTop(page);
      const url = page.url();

      await control.trigger.scrollIntoViewIfNeeded();
      await expectBackToTopShown(control);
      await recordScrollAfterActivation(control);

      await control.button.click();
      // A smooth scroll has not yet moved the page when the handler returns.
      expect(await page.evaluate(() => window.__scrollAfterActivation)).toBeGreaterThan(0);
      await expect.poll(() => readScroll(page)).toBe(0);
      expect(page.url()).toBe(url);
      await expect(control.button).not.toBeFocused();
      await expect(control.skipLink).not.toBeFocused();
      expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
      await expectBackToTopHidden(control);
    });
  });

  test("legal pages share the control, its copyright-line trigger, and the skip-link hand-off", async ({ page }) => {
    for (const route of LEGAL_PAGES) {
      await test.step(route, async () => {
        await page.goto(route);
        const control = getBackToTop(page);
        const url = page.url();

        await expect(control.button).toHaveCount(1);
        await expectBackToTopHidden(control);
        await control.trigger.scrollIntoViewIfNeeded();
        await expectBackToTopShown(control);

        await control.button.focus();
        await page.keyboard.press("Enter");
        expect(await readScroll(page)).toBe(0);
        expect(page.url()).toBe(url);
        await expect(control.skipLink).toBeFocused();
        await expectBackToTopHidden(control);
      });
    }
  });
});

const THEME_LABELS = { light: "Włącz tryb ciemny", dark: "Włącz tryb jasny" };

const expectTheme = async (page, theme) => {
  const other = theme === "light" ? "dark" : "light";
  for (const element of [page.locator("html"), page.locator("body")]) {
    await expect(element).toHaveClass(new RegExp(`\\btheme--${theme}\\b`));
    await expect(element).not.toHaveClass(new RegExp(`\\btheme--${other}\\b`));
  }
  await expect(page.locator("[data-theme-toggle]")).toHaveAttribute("aria-label", THEME_LABELS[theme]);
  expect(await page.evaluate(() => localStorage.getItem("studio-noir-theme"))).toBe(theme);
};

test.describe("theme persistence", () => {
  // A dark system preference, so only the stored choice can keep the pages light.
  test.use({ colorScheme: "dark" });

  test("a toggled theme survives a reload and navigation to a legal page", async ({ page }) => {
    await page.goto("/");
    await expectTheme(page, "dark");

    await page.locator("[data-theme-toggle]").click();
    await expectTheme(page, "light");

    await page.reload();
    await expectTheme(page, "light");

    await page.getByRole("navigation", { name: "Informacje" }).getByRole("link", { name: "Polityka prywatności" }).click();
    await expect(page).toHaveURL(/\/privacy\.html$/);
    await expectTheme(page, "light");
  });
});
