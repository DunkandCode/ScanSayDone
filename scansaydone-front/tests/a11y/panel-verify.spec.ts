import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { payloadPanelReal } from "../../src/test/fixtures/panel";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] as const;

const SESION_DEMO = {
  usuario: "cafe_rincon_andino",
  empresa_id: 2,
  nombre_negocio: "Café Rincón Andino",
};

const ENCUESTA_DEMO = {
  empresa_id: 2,
  nombre_negocio: "Café Rincón Andino",
  rubro: "Cafetería / restaurante",
  preguntas: {
    p1: {
      texto: "¿Qué tan probable es que recomiendes este local a un amigo o familiar?",
      escala: [0, 10],
    },
    p2: {
      texto: "En general, ¿qué tan satisfecho/a quedaste?",
      escala: [1, 5],
    },
    p3: {
      texto: "¿Cómo evalúas la calidad del producto?",
      etiqueta: "Calidad del producto",
      escala: [1, 5],
    },
    p4: {
      texto: "¿Cómo evalúas el tiempo de servicio?",
      etiqueta: "Tiempo de servicio",
      escala: [1, 5],
    },
    p5: {
      texto: "¿Algo más que quieras contarnos?",
      max_caracteres: 300,
    },
  },
};

async function prepararSesionYApi(page: Page) {
  await page.addInitScript((sesion) => {
    window.localStorage.setItem("ssd.sesion", JSON.stringify(sesion));
  }, SESION_DEMO);

  await page.route("**/api/v1/empresas/2/panel", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payloadPanelReal(2)),
    });
  });

  await page.route("**/api/v1/empresas/2/encuesta", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(ENCUESTA_DEMO),
    });
  });
}

async function contarBoxShadow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const all = document.querySelectorAll("*");
    let count = 0;
    all.forEach((el) => {
      const shadow = window.getComputedStyle(el).boxShadow;
      if (shadow && shadow !== "none") count++;
    });
    return count;
  });
}

async function verificarAxe(page: Page, etiqueta: string) {
  const axeResults = await new AxeBuilder({ page })
    .withTags([...AXE_TAGS])
    .analyze();
  if (axeResults.violations.length > 0) {
    axeResults.violations.forEach((v) =>
      console.log(`  [${etiqueta}] ${v.id}: ${v.help} (impact: ${v.impact})`),
    );
  }
  expect(axeResults.violations).toEqual([]);
}

test.describe("/panel verification", () => {
  test("sin sesión — redirige a /entrar y no expone cifras", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("ssd.sesion");
    });

    await page.goto("/panel");
    await page.waitForURL(/\/entrar$/);

    await expect(page.getByRole("tab")).toHaveCount(0);
    await expect(page.getByText("Café Rincón Andino")).toHaveCount(0);
  });

  test("1440px — layout, sidebar, cero sombras, pestañas y a11y", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepararSesionYApi(page);

    await page.goto("/panel");
    await page.waitForLoadState("networkidle");

    // Sidebar visible at 1440
    const sidebar = page.locator('aside[aria-label="Panel"]');
    await expect(sidebar).toBeVisible();
    const sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox).not.toBeNull();
    if (sidebarBox) {
      expect(sidebarBox.width).toBe(240);
    }

    // Cabecera de sesión y contenido principal
    await expect(page.getByText(SESION_DEMO.nombre_negocio)).toBeVisible();
    await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();

    const main = page.locator("main");
    await expect(main).toBeVisible();
    const mainBox = await main.boundingBox();
    expect(mainBox).not.toBeNull();
    if (mainBox) {
      expect(mainBox.width).toBeGreaterThanOrEqual(1050);
      expect(mainBox.width).toBeLessThanOrEqual(1200);
    }

    // Sin desborde horizontal ni sombras
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    expect(await contarBoxShadow(page)).toBe(0);

    // KPIs oficiales de empresa 2 + 11 notas de distribución en Resumen
    const panelResumen = page.locator("#panel-resumen");
    await expect(panelResumen.getByText("8,15", { exact: true })).toBeVisible();
    await expect(panelResumen.getByText("25,0", { exact: true })).toBeVisible();
    await expect(
      panelResumen.getByRole("paragraph").filter({ hasText: /^20$/ }),
    ).toBeVisible();
    await expect(panelResumen.getByText("del 19-10-2026 al 31-10-2026")).toBeVisible();

    const distList = panelResumen.getByRole("list", {
      name: "Cantidad de respuestas por nota, de la 0 a la 10",
    });
    await expect(distList.getByRole("listitem")).toHaveCount(11);

    await verificarAxe(page, "1440-resumen");

    // Verificar las otras 3 pestañas del panel con axe-core
    await page.getByRole("tab", { name: "Resultados" }).click();
    await expect(
      page.getByRole("heading", { name: "Resultados de este negocio" }),
    ).toBeVisible();
    await verificarAxe(page, "1440-resultados");

    await page.getByRole("tab", { name: "Encuesta" }).click();
    await expect(
      page.getByRole("heading", { name: "Encuesta definida para este negocio" }),
    ).toBeVisible();
    await expect(page.getByLabel("Escala de la 0 a la 10")).toBeVisible();
    await verificarAxe(page, "1440-encuesta");

    await page.getByRole("tab", { name: "Reseñas" }).click();
    await expect(
      page.getByRole("heading", { name: "Reseñas de este negocio" }),
    ).toBeVisible();
    await verificarAxe(page, "1440-resenas");
  });

  test("992px — topbar visible, sidebar oculta, sin scroll horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 992, height: 900 });
    await prepararSesionYApi(page);

    await page.goto("/panel");
    await page.waitForLoadState("networkidle");

    const sidebar = page.locator('aside[aria-label="Panel"]');
    expect(await sidebar.isVisible()).toBe(false);

    const topbar = page.locator("header").first();
    await expect(topbar).toBeVisible();
    const topbarBox = await topbar.boundingBox();
    expect(topbarBox?.height).toBe(56);

    const navRow = page.locator('nav[aria-label="Navegación del panel"]').first();
    await expect(navRow).toBeVisible();
    const navBox = await navRow.boundingBox();
    expect(navBox?.height).toBe(44);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    expect(await contarBoxShadow(page)).toBe(0);

    await expect(page.getByText("8,15", { exact: true })).toBeVisible();
    await verificarAxe(page, "992-resumen");
  });

  test("375px — móvil sin scroll horizontal, barras y a11y en pestañas", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await prepararSesionYApi(page);

    await page.goto("/panel");
    await page.waitForLoadState("networkidle");

    const sidebar = page.locator('aside[aria-label="Panel"]');
    expect(await sidebar.isVisible()).toBe(false);

    const topbar = page.locator("header").first();
    await expect(topbar).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    expect(await contarBoxShadow(page)).toBe(0);

    await expect(page.getByRole("heading", { level: 1, name: "Resumen" })).toBeVisible();
    const panelResumen = page.locator("#panel-resumen");
    await expect(panelResumen.getByText("8,15", { exact: true })).toBeVisible();
    await expect(panelResumen.getByText("25,0", { exact: true })).toBeVisible();

    const distList = panelResumen.getByRole("list", {
      name: "Cantidad de respuestas por nota, de la 0 a la 10",
    });
    await expect(distList.getByRole("listitem")).toHaveCount(11);

    await verificarAxe(page, "375-resumen");

    // Validar también Encuesta en móvil (grilla de escala >= 44px y <dl> accesible)
    await page.getByRole("tab", { name: "Encuesta" }).click();
    await expect(page.getByLabel("Escala de la 0 a la 10")).toBeVisible();
    await verificarAxe(page, "375-encuesta");
  });
});
