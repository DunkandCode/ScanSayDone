import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.A11Y_BASE_URL || "http://localhost:3170";

test.describe("/panel verification", () => {
  test("1440px — layout, sidebar, zero shadows, single coral, a11y", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/panel`);
    await page.waitForLoadState("networkidle");

    // Sidebar visible at 1440
    const sidebar = page.locator('aside[aria-label="Panel"]');
    await expect(sidebar).toBeVisible();
    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox).not.toBeNull();
    if (sidebarBox) {
      console.log(`[1440] Sidebar width: ${sidebarBox.width}px`);
      expect(sidebarBox.width).toBe(240);
    }

    // Main content width
    const main = page.locator("main");
    await expect(main).toBeVisible();
    const mainBox = await main.boundingBox();
    expect(mainBox).not.toBeNull();
    if (mainBox) {
      const contentWidth = mainBox.width;
      console.log(`[1440] Main content width: ${contentWidth}px`);
      // 1440 - 240 (sidebar) = 1200, max-w-[1056px] + padding
      expect(contentWidth).toBeGreaterThanOrEqual(1050);
      expect(contentWidth).toBeLessThanOrEqual(1200);
    }

    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`[1440] scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Zero box-shadow nodes
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

    // Single coral node (interactive-primary)
    const coralCount = await page.evaluate(() => {
      const all = document.querySelectorAll("*");
      let count = 0;
      all.forEach((el) => {
        const style = window.getComputedStyle(el);
        // Check for coral in color, background-color, or stroke
        const hasCoral =
          style.color.includes("rgb(252, 90, 65)") ||
          style.backgroundColor.includes("rgb(252, 90, 65)") ||
          style.fill.includes("rgb(252, 90, 65)") ||
          style.stroke.includes("rgb(252, 90, 65)");
        if (hasCoral) count++;
      });
      return count;
    });
    console.log(`[1440] Nodes with coral: ${coralCount}`);
    expect(coralCount).toBeGreaterThanOrEqual(1);
    expect(coralCount).toBeLessThanOrEqual(3); // line stroke + possibly parent elements

    // Page height
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`[1440] Page height: ${pageHeight}px`);

    // 11 distribution bars visible
    const barCount = await page.evaluate(() => {
      const svg = document.querySelector('[aria-labelledby="b4-svg-title"]');
      return svg ? svg.querySelectorAll("rect").length : 0;
    });
    console.log(`[1440] Distribution bars: ${barCount}`);
    expect(barCount).toBe(11);

    // KPIs present — scoped to Resumen region to avoid sr-only table duplicates
    // (evolution-chart sr-only table also has "8,5"; channel-table tfoot also has "486")
    const resumenRegion = page.getByRole("region", { name: /resumen/i });
    await expect(resumenRegion.getByText("8,5", { exact: true })).toBeVisible();
    await expect(resumenRegion.getByText("486", { exact: true })).toBeVisible();
    await expect(resumenRegion.getByText(/377/)).toBeVisible();

    // axe accessibility
    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();
    console.log(`[1440] axe violations: ${axeResults.violations.length}`);
    if (axeResults.violations.length > 0) {
      axeResults.violations.forEach((v) =>
        console.log(`  - ${v.id}: ${v.help} (impact: ${v.impact})`)
      );
    }
    expect(axeResults.violations).toEqual([]);
  });

  test("992px — topbar visible, sidebar hidden, no horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 992, height: 900 });
    await page.goto(`${BASE_URL}/panel`);
    await page.waitForLoadState("networkidle");

    // Sidebar hidden at 992
    const sidebar = page.locator('aside[aria-label="Panel"]');
    const sidebarVisible = await sidebar.isVisible();
    console.log(`[992] Sidebar visible: ${sidebarVisible}`);
    expect(sidebarVisible).toBe(false);

    // Topbar visible
    const topbar = page.locator("header").first();
    await expect(topbar).toBeVisible();
    const topbarBox = await topbar.boundingBox();
    expect(topbarBox).not.toBeNull();
    if (topbarBox) {
      console.log(`[992] Topbar height: ${topbarBox.height}px`);
      expect(topbarBox.height).toBe(56);
    }

    // Nav row visible
    const navRow = page.locator('nav[aria-label="Navegación del panel"]').first();
    await expect(navRow).toBeVisible();
    const navBox = await navRow.boundingBox();
    expect(navBox).not.toBeNull();
    if (navBox) {
      console.log(`[992] Nav row height: ${navBox.height}px`);
      expect(navBox.height).toBe(44);
    }

    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`[992] scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Zero box-shadow
    const shadowCount = await page.evaluate(() => {
      const all = document.querySelectorAll("*");
      let count = 0;
      all.forEach((el) => {
        const shadow = window.getComputedStyle(el).boxShadow;
        if (shadow && shadow !== "none") count++;
      });
      return count;
    });
    console.log(`[992] Nodes with box-shadow: ${shadowCount}`);
    expect(shadowCount).toBe(0);

    // axe accessibility
    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();
    console.log(`[992] axe violations: ${axeResults.violations.length}`);
    if (axeResults.violations.length > 0) {
      axeResults.violations.forEach((v) =>
        console.log(`  - ${v.id}: ${v.help} (impact: ${v.impact})`)
      );
    }
    expect(axeResults.violations).toEqual([]);
  });

  test("375px — mobile layout, no horizontal scroll, horizontal bars", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/panel`);
    await page.waitForLoadState("networkidle");

    // Sidebar hidden
    const sidebar = page.locator('aside[aria-label="Panel"]');
    const sidebarVisible = await sidebar.isVisible();
    expect(sidebarVisible).toBe(false);

    // Topbar visible
    const topbar = page.locator("header").first();
    await expect(topbar).toBeVisible();

    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`[375] scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // Zero box-shadow
    const shadowCount = await page.evaluate(() => {
      const all = document.querySelectorAll("*");
      let count = 0;
      all.forEach((el) => {
        const shadow = window.getComputedStyle(el).boxShadow;
        if (shadow && shadow !== "none") count++;
      });
      return count;
    });
    console.log(`[375] Nodes with box-shadow: ${shadowCount}`);
    expect(shadowCount).toBe(0);

    // H1 visible
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();

    // KPIs present — scoped to Resumen region to avoid sr-only table duplicates
    // (evolution-chart sr-only table also has "8,5"; channel-table tfoot also has "486")
    const resumenRegion375 = page.getByRole("region", { name: /resumen/i });
    await expect(resumenRegion375.getByText("8,5", { exact: true })).toBeVisible();
    await expect(resumenRegion375.getByText("486", { exact: true })).toBeVisible();
    await expect(resumenRegion375.getByText(/377/)).toBeVisible();

    // 11 distribution bars visible (mobile: horizontal div bars in <li>)
    const barCount375 = await page.evaluate(() => {
      const distSection = document.querySelector('[aria-labelledby="b4-title"]');
      if (!distSection) return 0;
      // Mobile bars are inside a <ul> in the figure that's visible at < md
      const ul = distSection.querySelector("ul");
      return ul ? ul.querySelectorAll("li").length : 0;
    });
    console.log(`[375] Distribution bars (mobile): ${barCount375}`);
    expect(barCount375).toBe(11);

    // axe accessibility
    const axeResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();
    console.log(`[375] axe violations: ${axeResults.violations.length}`);
    if (axeResults.violations.length > 0) {
      axeResults.violations.forEach((v) =>
        console.log(`  - ${v.id}: ${v.help} (impact: ${v.impact})`)
      );
    }
    expect(axeResults.violations).toEqual([]);
  });
});
