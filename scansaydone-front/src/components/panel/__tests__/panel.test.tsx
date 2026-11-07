/// <reference types="vitest/globals" />
import { render, screen, within } from "@testing-library/react";
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
    // Desktop SVG has 11 rect elements
    const barsSvg = document.querySelector('[aria-labelledby="b4-svg-title"]');
    expect(barsSvg).toBeInTheDocument();
    const rects = barsSvg!.querySelectorAll("rect");
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

    // Ajustes del panel
    const settingsBtn = screen.getByRole("button", { name: /Ajustes del panel/i });
    expect(settingsBtn).toHaveAttribute("aria-disabled", "true");
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
});
