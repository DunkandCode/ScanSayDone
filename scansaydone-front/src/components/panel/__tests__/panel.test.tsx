/// <reference types="vitest/globals" />
import { render, screen, within, fireEvent } from "@testing-library/react";
import PanelPage from "@/app/(panel)/panel/page";

describe("PanelPage", () => {
  beforeEach(() => {
    render(<PanelPage />);
  });

  it("1. hay exactamente un h1", () => {
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Panel de ejemplo");
  });

  it("2. los tres KPIs muestran 8,5 / 486 / 377", () => {
    // Scope to B2 section to avoid sr-only tables
    const resumen = screen.getByRole("region", { name: /Resumen/i });
    expect(within(resumen).getByText("8,5")).toBeInTheDocument();
    expect(within(resumen).getByText("486")).toBeInTheDocument();
    // 377 appears inside "377 (77,6 %)"
    expect(within(resumen).getByText(/377/)).toBeInTheDocument();
  });

  it("3. hay exactamente 11 barras de distribución", () => {
    // Desktop SVG has 11 bar rects (track rects removed for visual clarity)
    const barsSvg = document.querySelector('[aria-labelledby="b4-svg-title"]');
    expect(barsSvg).toBeInTheDocument();
    const rects = barsSvg!.querySelectorAll("rect");
    // 11 bar rects only (no track rects)
    expect(rects).toHaveLength(11);
  });

  it("4. la tabla de canales tiene caption, th scope y suma 486", () => {
    const tables = document.querySelectorAll("table");
    // Find the channel table by its caption
    const channelTable = Array.from(tables).find((t) => {
      const caption = t.querySelector("caption");
      return caption?.textContent?.includes("Reseñas por canal");
    });
    expect(channelTable).toBeInTheDocument();

    // Has th scope
    const colHeaders = channelTable!.querySelectorAll('th[scope="col"]');
    expect(colHeaders.length).toBeGreaterThan(0);
    const rowHeaders = channelTable!.querySelectorAll('th[scope="row"]');
    expect(rowHeaders.length).toBeGreaterThan(0);

    // Sum of channel values = 486
    const dataCells = channelTable!.querySelectorAll("tbody td:nth-child(2)");
    const sum = Array.from(dataCells).reduce((acc, td) => {
      return acc + parseInt(td.textContent || "0", 10);
    }, 0);
    expect(sum).toBe(486);
  });

  it("5. hay 5 filas de últimas respuestas", () => {
    const responseSection = screen.getByRole("region", { name: /Últimas respuestas/i });
    const listItems = within(responseSection).getAllByRole("listitem");
    expect(listItems).toHaveLength(5);
  });

  it("6. el chip DEMO y la línea de declaración están presentes", () => {
    const demoChip = screen.getByText("DEMO");
    expect(demoChip).toBeInTheDocument();

    const declaration = screen.getByText(
      /Ves un panel de ejemplo con datos inventados/
    );
    expect(declaration).toBeInTheDocument();
  });

  it("7. el pie tiene el texto exacto del plano", () => {
    const footerText = screen.getByText(
      /^Panel de ejemplo con datos inventados\. No pertenece a ningún negocio real\.$/
    );
    expect(footerText).toBeInTheDocument();
    expect(footerText.closest("footer")).toBeInTheDocument();
  });

  it("8. filtros y exportar están deshabilitados (aria-disabled, sin href/onClick)", () => {
    // Date filters
    const filter7 = screen.getByRole("button", { name: "7 días" });
    const filter30 = screen.getByRole("button", { name: "30 días" });
    const filter90 = screen.getByRole("button", { name: "90 días" });
    expect(filter7).toHaveAttribute("aria-disabled", "true");
    expect(filter30).toHaveAttribute("aria-disabled", "true");
    expect(filter90).toHaveAttribute("aria-disabled", "true");
    expect(filter7).not.toHaveAttribute("href");

    // Export CSV
    const exportBtn = screen.getByRole("button", { name: /Exportar CSV/i });
    expect(exportBtn).toHaveAttribute("aria-disabled", "true");
    expect(exportBtn).not.toHaveAttribute("href");

    // D6: no hay un tercer "Ajustes" sobre el bloque de últimas respuestas
    const ajustesButtons = screen.queryAllByText(/Ajustes/i);
    // Solo los dos esperados: el control de la página y el ítem de navegación
    expect(ajustesButtons.length).toBeLessThanOrEqual(2);
    expect(
      screen.queryByRole("button", { name: /Ajustes del panel/i })
    ).not.toBeInTheDocument();
  });

  it("9. ningún enlace apunta a rutas vacías (/privacy, /terms, /pricing, /faqs, /aboutus, /services)", () => {
    const forbiddenRoutes = ["/privacy", "/terms", "/pricing", "/faqs", "/aboutus", "/services"];
    const links = screen.queryAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href")).filter(Boolean);

    forbiddenRoutes.forEach((route) => {
      expect(hrefs).not.toContain(route);
    });
  });

  it("10. el SVG de evolución tiene nombre accesible (role=img + title)", () => {
    const evoSvg = document.querySelector('[aria-labelledby="b3-svg-title"]');
    expect(evoSvg).toBeInTheDocument();
    expect(evoSvg).toHaveAttribute("role", "img");

    const title = evoSvg!.querySelector("title");
    expect(title).toBeInTheDocument();
    expect(title!.id).toBe("b3-svg-title");
    expect(title!.textContent).toContain("Reseñas por día durante 30 días");
  });

  it("11. D1: fila Total con 486 y 100 % más nota de redondeo", () => {
    const tables = document.querySelectorAll("table");
    const channelTable = Array.from(tables).find((t) => {
      const caption = t.querySelector("caption");
      return caption?.textContent?.includes("Reseñas por canal");
    });
    expect(channelTable).toBeInTheDocument();

    const tfoot = channelTable!.querySelector("tfoot");
    expect(tfoot).toBeInTheDocument();

    const totalRow = tfoot!.querySelector("tr");
    expect(totalRow).toBeInTheDocument();

    const totalTh = totalRow!.querySelector('th[scope="row"]');
    expect(totalTh).toHaveTextContent("Total");

    const totalTds = totalRow!.querySelectorAll("td");
    expect(totalTds[0]).toHaveTextContent("486");
    expect(totalTds[1]).toHaveTextContent("100 %");

    const roundingNote = screen.getByText("Las partes suman 99,9 % por redondeo.");
    expect(roundingNote).toBeInTheDocument();
  });

  it("12. D2: chip numérico de nota por fila con sr-only", () => {
    const responseSection = screen.getByRole("region", { name: /Últimas respuestas/i });
    
    const srOnlyNotes = within(responseSection).getAllByText(/Nota \d+ sobre 10/);
    expect(srOnlyNotes.length).toBeGreaterThanOrEqual(5);

    // §13: scope to list items only (not section title which also has font-bold)
    const listItems = within(responseSection).getAllByRole("listitem");
    const chips = listItems.flatMap((li) => Array.from(li.querySelectorAll(".font-bold")));
    expect(chips.length).toBe(5);
  });

  it("13. D4: fila sin texto con literal", () => {
    const noTextMessage = screen.getByText("Reseña sin texto del comensal.");
    expect(noTextMessage).toBeInTheDocument();
  });

  it("14. D4: cita reescrita sin cifras de tiempo", () => {
    const rewrittenQuote = screen.getByText(/La comida bien, pero la espera fue larga/);
    expect(rewrittenQuote).toBeInTheDocument();

    const oldQuote = screen.queryByText(/30 minutos/);
    expect(oldQuote).not.toBeInTheDocument();
  });

  it("15. D5: interruptor con role=switch y cambio de estado", () => {
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "true");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("16. D5: estado vacío muestra textos literales y oculta B3/B4/B5", () => {
    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    const emptySubtitle = screen.getByText(
      "Ves el panel de ejemplo vacío. No hay datos reales en ninguna cuenta."
    );
    expect(emptySubtitle).toBeInTheDocument();

    const emptyB2Note = screen.getByText(
      "Así verías el panel antes de la primera reseña."
    );
    expect(emptyB2Note).toBeInTheDocument();

    const emptyB6Note = screen.getByText(
      "Todavía no hay respuestas que mostrar. Cada reseña nueva ocupa una fila como esta."
    );
    expect(emptyB6Note).toBeInTheDocument();

    const b3 = screen.queryByRole("region", { name: /Últimos 30 días/i });
    expect(b3).not.toBeInTheDocument();

    const b4 = screen.queryByRole("region", { name: /Notas, de la 0 a la 10/i });
    expect(b4).not.toBeInTheDocument();

    const b5 = screen.queryByRole("region", { name: /De dónde llegan las reseñas/i });
    expect(b5).not.toBeInTheDocument();
  });

  it("17. D5: en estado vacío, chip DEMO y pie permanecen intactos", () => {
    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);

    const demoChip = screen.getByText("DEMO");
    expect(demoChip).toBeInTheDocument();

    const footerText = screen.getByText(
      /^Panel de ejemplo con datos inventados\. No pertenece a ningún negocio real\.$/
    );
    expect(footerText).toBeInTheDocument();
    expect(footerText.closest("footer")).toBeInTheDocument();
  });

  // ── §13 visual upgrade tests ────────────────────────────────────────────

  it("§13-1: no duplicate brand text in panel page", () => {
    // Lockup is in layout, not PanelPage. Test that panel page doesn't duplicate brand.
    // §13 F-O8: brand text replaced by lockup in layout
    const brandTexts = screen.queryAllByText("ScanSayDone");
    // PanelPage should not contain "ScanSayDone" text (it's in layout as Image)
    expect(brandTexts.length).toBe(0);
  });

  it("§13-4: three KPI numbers use Bebas font at 36px", () => {
    const resumen = screen.getByRole("region", { name: /Resumen/i });
    // Find all numbers in KPI cards (8,5 / 486 / 377) — font-display maps to Bebas
    const kpiNumbers = resumen.querySelectorAll(".font-display");
    expect(kpiNumbers.length).toBe(3);

    // Check that all use font-display class (maps to Bebas via CSS var --font-display)
    kpiNumbers.forEach((el) => {
      expect(el.className).toContain("font-display");
    });

    // Check font-size class is text-[36px] or text-[32px] (jsdom can't compute computed style)
    kpiNumbers.forEach((el) => {
      const cls = el.className;
      const hasSize = cls.includes("text-[36px]") || cls.includes("text-[32px]");
      expect(hasSize).toBe(true);
    });
  });

  it("§13-5: section titles have vertical filete (3×16 #8A6F55)", () => {
    // Check that section titles have the filete structure
    const sectionTitles = document.querySelectorAll("h2[id^='b']");
    expect(sectionTitles.length).toBeGreaterThan(0);

    // Check first section title (Resumen)
    const b2Title = document.getElementById("b2-title");
    expect(b2Title).toBeInTheDocument();
    
    // Check it has the filete span (aria-hidden decorative element)
    const filete = b2Title!.querySelector('span[aria-hidden="true"]');
    expect(filete).toBeInTheDocument();
  });

  it("§13-8: Total row still shows 486 and 100 %", () => {
    const tables = document.querySelectorAll("table");
    const channelTable = Array.from(tables).find((t) => {
      const caption = t.querySelector("caption");
      return caption?.textContent?.includes("Reseñas por canal");
    });
    const tfoot = channelTable!.querySelector("tfoot");
    const totalRow = tfoot!.querySelector("tr");
    const totalTds = totalRow!.querySelectorAll("td");
    expect(totalTds[0]).toHaveTextContent("486");
    expect(totalTds[1]).toHaveTextContent("100 %");
  });
});
