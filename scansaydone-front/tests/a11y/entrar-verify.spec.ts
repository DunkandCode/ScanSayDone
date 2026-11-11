import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.A11Y_BASE_URL || "http://localhost:3155";

test.describe("/entrar verification", () => {
  test("1440px — layout, gradients, shadows, links, status", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/entrar`);
    await page.waitForLoadState("networkidle");

    // 1. Two columns at 1440 (grid-cols-2)
    const grid = page.locator(".grid.grid-cols-1.lg\\:grid-cols-2");
    await expect(grid).toBeVisible();
    const gridClass = await grid.getAttribute("class");
    expect(gridClass).toContain("lg:grid-cols-2");

    // 2. Card visible
    const card = page.locator(".rounded-\\[16px\\].border.border-border-mid.bg-surface-default");
    await expect(card).toBeVisible();
    const cardBox = await card.boundingBox();
    expect(cardBox).not.toBeNull();
    if (cardBox) {
      console.log(`[1440] Card width: ${cardBox.width}px`);
    }

    // 3. Right piece visible at 1440
    const visualPiece = page.locator("figure.hidden.lg\\:block");
    await expect(visualPiece).toBeVisible();

    // 4. No header/footer (count = 0)
    const headerCount = await page.locator("header").count();
    const footerCount = await page.locator("footer").count();
    console.log(`[1440] header count: ${headerCount}, footer count: ${footerCount}`);
    expect(headerCount).toBe(0);
    expect(footerCount).toBe(0);

    // 5. Background contains linear-gradient
    const main = page.locator("main");
    const bgImage = await main.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    console.log(`[1440] background-image: ${bgImage}`);
    expect(bgImage).toContain("linear-gradient");

    // 6. Zero box-shadow nodes
    const shadowCount = await page.evaluate(() => {
      const all = document.querySelectorAll("*");
      let count = 0;
      all.forEach((el) => {
        const shadow = window.getComputedStyle(el).boxShadow;
        if (shadow && shadow !== "none") count++;
      });
      return count;
    });
    console.log(`[1440] Nodes with box-shadow: ${shadowCount}`);
    expect(shadowCount).toBe(0);

    // 7. Only one href="/" internal link
    const links = await page.locator('a[href="/"]').all();
    console.log(`[1440] Links with href="/": ${links.length}`);
    expect(links.length).toBe(1);

    // 8. Only one role="status" node
    const statusNodes = await page.locator('[role="status"]').all();
    console.log(`[1440] Nodes with role="status": ${statusNodes.length}`);
    expect(statusNodes.length).toBe(1);

    // 9. axe accessibility
    const axeResults = await new AxeBuilder({ page }).analyze();
    console.log(`[1440] axe violations: ${axeResults.violations.length}`);
    if (axeResults.violations.length > 0) {
      axeResults.violations.forEach((v) => console.log(`  - ${v.id}: ${v.help}`));
    }
    expect(axeResults.violations).toEqual([]);
  });

  test("375px — single column, card width, no horizontal scroll, right piece hidden", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/entrar`);
    await page.waitForLoadState("networkidle");

    // 1. Single column at 375 (lg:grid-cols-2 not applied)
    const grid = page.locator(".grid.grid-cols-1.lg\\:grid-cols-2");
    await expect(grid).toBeVisible();
    const gridClass = await grid.getAttribute("class");
    // At 375, the lg breakpoint should NOT be active
    const computedCols = await grid.evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    console.log(`[375] grid-template-columns: ${computedCols}`);

    // 2. Card width ~343px (with padding 16px each side = 375 - 32)
    const card = page.locator(".rounded-\\[16px\\].border.border-border-mid.bg-surface-default");
    await expect(card).toBeVisible();
    const cardBox = await card.boundingBox();
    expect(cardBox).not.toBeNull();
    if (cardBox) {
      console.log(`[375] Card width: ${cardBox.width}px`);
      expect(cardBox.width).toBeGreaterThanOrEqual(340);
      expect(cardBox.width).toBeLessThanOrEqual(350);
    }

    // 3. No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`[375] scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // 4. Right piece hidden at 375
    const visualPiece = page.locator("figure.hidden.lg\\:block");
    const isVisible = await visualPiece.isVisible();
    console.log(`[375] Right piece visible: ${isVisible}`);
    expect(isVisible).toBe(false);

    // 5. No header/footer
    const headerCount = await page.locator("header").count();
    const footerCount = await page.locator("footer").count();
    console.log(`[375] header count: ${headerCount}, footer count: ${footerCount}`);
    expect(headerCount).toBe(0);
    expect(footerCount).toBe(0);

    // 6. Only one href="/"
    const links = await page.locator('a[href="/"]').all();
    console.log(`[375] Links with href="/": ${links.length}`);
    expect(links.length).toBe(1);

    // 7. Only one role="status"
    const statusNodes = await page.locator('[role="status"]').all();
    console.log(`[375] Nodes with role="status": ${statusNodes.length}`);
    expect(statusNodes.length).toBe(1);

    // 8. axe accessibility
    const axeResults = await new AxeBuilder({ page }).analyze();
    console.log(`[375] axe violations: ${axeResults.violations.length}`);
    if (axeResults.violations.length > 0) {
      axeResults.violations.forEach((v) => console.log(`  - ${v.id}: ${v.help}`));
    }
    expect(axeResults.violations).toEqual([]);
  });
});
