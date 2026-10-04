import { expect, test } from "@playwright/test";

// The header navigation switches to its inline desktop layout at 900px
// (css/components.css, js/nav.js). The legal pages share the same markup.
const MOBILE = { width: 375, height: 812 };
const BREAKPOINT = { width: 900, height: 800 };
const DESKTOP = { width: 1280, height: 800 };

const NAV_LINKS = ["O nas", "Usługi", "Cennik", "Styliści", "Galeria", "Rezerwacja"];

const getNav = (page) => ({
  landmark: page.getByRole("navigation", { name: "Główna" }),
  toggle: page.locator("[data-nav-toggle]"),
  panel: page.locator("[data-nav-panel]"),
  main: page.locator("[data-page-content]"),
  body: page.locator("body"),
});

const expectPageUnlocked = async (nav) => {
  await expect(nav.main).toHaveJSProperty("inert", false);
  await expect(nav.body).not.toHaveCSS("overflow", "hidden");
};

const expectMobileMenuClosed = async (nav) => {
  await expect(nav.toggle).toHaveAttribute("aria-expanded", "false");
  await expect(nav.panel).not.toHaveClass(/\bis-open\b/);
  await expect(nav.panel).toHaveAttribute("aria-hidden", "true");
  await expect(nav.panel).toBeHidden();
  await expectPageUnlocked(nav);
};

const expectMobileMenuOpen = async (nav) => {
  const dialog = nav.landmark.getByRole("dialog");

  await expect(nav.toggle).toHaveAttribute("aria-expanded", "true");
  await expect(nav.panel).toHaveClass(/\bis-open\b/);
  await expect(nav.panel).not.toHaveAttribute("aria-hidden");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
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

  // Role queries skip anything hidden from assistive technology.
  await expect(nav.landmark).toBeVisible();
  await expect(nav.landmark.getByRole("list").getByRole("link")).toHaveText(NAV_LINKS);
  await expect(nav.landmark.getByRole("link", { name: "Umów wizytę" })).toBeVisible();
  await expect(nav.landmark.getByRole("button", { name: /^Tryb/ })).toBeVisible();
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
    const firstFocusable = dialog.getByRole("link", { name: "O nas" });
    const lastFocusable = dialog.getByRole("button", { name: /^Tryb/ });
    await expect(firstFocusable).toBeFocused();

    await lastFocusable.focus();
    await page.keyboard.press("Tab");
    await expect(firstFocusable).toBeFocused();

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
    await nav.landmark.getByRole("button", { name: /^Tryb/ }).focus();
    await page.keyboard.press("Tab");
    await expect(nav.main.locator(":focus")).toHaveCount(1);
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
