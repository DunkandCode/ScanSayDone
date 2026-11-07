/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { PanelPreview } from "./panel-preview";

describe("PanelPreview", () => {
  // ── Structural tests (updated) ──

  it("renders exactly one h2 with 'TODO EN UN MISMO LUGAR' and section has id='panel'", () => {
    render(<PanelPreview />);

    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
    expect(h2s[0]).toHaveTextContent("TODO EN UN MISMO LUGAR");

    const section = screen.getByRole("region", {
      name: "TODO EN UN MISMO LUGAR",
    });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "panel");
    expect(section).toHaveAttribute("aria-labelledby", "l3-title");

    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveAttribute("id", "l3-title");
  });

  it("renders eyebrow and lead text", () => {
    render(<PanelPreview />);

    expect(
      screen.getByText("TUS OPINIONES, EN UN PANEL")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ahí llegan las respuestas que te dejan tus clientes."
      )
    ).toBeInTheDocument();
  });

  it("three bullets match approved copy inside ul role='list'", () => {
    render(<PanelPreview />);

    const list = screen
      .getByText("Cada opinión llega con su fecha y su canal.")
      .closest("ul");
    expect(list).toBeInTheDocument();

    const items = list!.querySelectorAll("li");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent(
      "Cada opinión llega con su fecha y su canal."
    );
    expect(items[1]).toHaveTextContent(
      "Todo junto, sin repartirlo en planillas."
    );
    expect(items[2]).toHaveTextContent(
      "Se leen las respuestas, no un número suelto."
    );
  });

  it("has no h1 elements inside the component", () => {
    render(<PanelPreview />);

    const h1s = screen.queryAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(0);
  });

  // ── New panel content tests ──

  it("renders KPI values 8,5 and 486 and 377", () => {
    render(<PanelPreview />);

    expect(screen.getByText("8,5")).toBeInTheDocument();
    expect(screen.getByText("486")).toBeInTheDocument();
    expect(screen.getByText("377")).toBeInTheDocument();
  });

  it("does NOT render '42 %', '42%', or '8,7'", () => {
    render(<PanelPreview />);

    const panel = screen.getByRole("region", { name: "TODO EN UN MISMO LUGAR" });
    const textContent = panel.textContent ?? "";
    expect(textContent).not.toContain("42 %");
    expect(textContent).not.toContain("42%");
    expect(textContent).not.toContain("8,7");
  });

  it("figcaption contains the exact declaration text", () => {
    render(<PanelPreview />);

    const declaration = screen.getByText(
      "Panel de ejemplo con datos inventados. No pertenece a ningún negocio real."
    );
    expect(declaration).toBeInTheDocument();
    expect(declaration.tagName).toBe("FIGCAPTION");
  });

  it("renders the DEMO badge", () => {
    render(<PanelPreview />);

    const badge = screen.getByText("DEMO");
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe("SPAN");
  });

  it("renders exactly 11 distribution bars", () => {
    render(<PanelPreview />);

    const barsSvg = document.querySelector(
      '[data-decorativo="panel-barras"]'
    );
    expect(barsSvg).toBeInTheDocument();
    const rects = barsSvg!.querySelectorAll("rect");
    expect(rects).toHaveLength(11);
    expect(Array.from(rects).map((rect) => rect.getAttribute("fill"))).toEqual([
      ...Array(7).fill("var(--color-border-mid)"),
      ...Array(2).fill("color-mix(in srgb, var(--color-text-primary) 20%, var(--color-border-mid))"),
      ...Array(2).fill("color-mix(in srgb, var(--color-text-primary) 40%, var(--color-border-mid))"),
    ]);
  });

  it("exposes every distribution value in a screen-reader table", () => {
    render(<PanelPreview />);

    const table = screen.getByRole("table", {
      name: "Respuestas por nota, panel de ejemplo",
    });
    const rows = table.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(11);
    expect(Array.from(rows[0].querySelectorAll("td")).map((cell) => cell.textContent)).toEqual(["0", "1"]);
    expect(Array.from(rows[10].querySelectorAll("td")).map((cell) => cell.textContent)).toEqual(["10", "150"]);
  });

  it("line SVG has role='img' with descriptive aria-label and data-decorativo", () => {
    render(<PanelPreview />);

    const lineSvg = document.querySelector(
      '[data-decorativo="panel-linea"]'
    );
    expect(lineSvg).toBeInTheDocument();
    expect(lineSvg).toHaveAttribute("role", "img");
    expect(lineSvg).toHaveAttribute(
      "aria-label",
      "Evolución de la nota media en 30 días, sobre una escala de 0 a 10"
    );
  });

  it("line path is aria-hidden and not focusable", () => {
    render(<PanelPreview />);

    const lineSvg = document.querySelector(
      '[data-decorativo="panel-linea"]'
    );
    const path = lineSvg!.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute("aria-hidden", "true");
    expect(path).toHaveAttribute("focusable", "false");
  });

  it("renders three reference lines at values 0, 5, 10", () => {
    render(<PanelPreview />);

    const lineSvg = document.querySelector(
      '[data-decorativo="panel-linea"]'
    );
    const lines = lineSvg!.querySelectorAll("line");
    expect(lines).toHaveLength(3);
  });

  it("renders reference labels 0, 5, 10 as accessible text inside SVG", () => {
    render(<PanelPreview />);

    const lineSvg = document.querySelector(
      '[data-decorativo="panel-linea"]'
    );
    const texts = lineSvg!.querySelectorAll("text");
    expect(texts).toHaveLength(3);
    const values = Array.from(texts).map((t) => t.textContent);
    expect(values).toContain("0");
    expect(values).toContain("5");
    expect(values).toContain("10");
  });

  it("line SVG does not use preserveAspectRatio='none'", () => {
    render(<PanelPreview />);

    const lineSvg = document.querySelector(
      '[data-decorativo="panel-linea"]'
    );
    expect(lineSvg).not.toHaveAttribute("preserveAspectRatio", "none");
  });

  it("no longer contains the old empty-state text", () => {
    render(<PanelPreview />);

    expect(
      screen.queryByText("Todavía no hay panel que mostrar.")
    ).not.toBeInTheDocument();
  });

  it("has no active links or enabled buttons inside the panel", () => {
    render(<PanelPreview />);

    const panel = screen.getByRole("region", { name: "TODO EN UN MISMO LUGAR" });
    const links = panel.querySelectorAll("a");
    expect(links).toHaveLength(0);

    const enabledButtons = panel.querySelectorAll("button:not([disabled])");
    expect(enabledButtons).toHaveLength(0);
  });

  it("uses the dashboard's coral line over an ink under-stroke, not a coral control", () => {
    render(<PanelPreview />);

    const panel = screen.getByRole("region", { name: "TODO EN UN MISMO LUGAR" });
    const line = panel.querySelector('[data-decorativo="panel-linea"]');
    const coralStroke = line?.querySelector("path.text-interactive-primary");
    const inkUnderStroke = line?.querySelector("path.text-text-primary");
    expect(coralStroke).toHaveAttribute("stroke-width", "2.5");
    expect(inkUnderStroke).toHaveAttribute("stroke-width", "4.5");
    expect(panel.querySelector("button[class*='interactive-primary']")).toBeNull();
  });

  it("shows the existing dashboard's ranked channel sample", () => {
    render(<PanelPreview />);

    expect(screen.getByText("Canales principales")).toBeInTheDocument();
    expect(screen.getByText("QR en la mesa")).toBeInTheDocument();
    expect(screen.getByText("210")).toBeInTheDocument();
    expect(screen.getByText("Enlace de Instagram")).toBeInTheDocument();
    expect(screen.getByText("112")).toBeInTheDocument();
    expect(screen.getByText("Google Maps")).toBeInTheDocument();
    expect(screen.getByText("89")).toBeInTheDocument();
  });
});
