/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { PanelPreview } from "./panel-preview";

describe("PanelPreview", () => {
  it("renders h2 with 'TODO EN UN MISMO LUGAR' and exactly one h2 in the component", () => {
    render(<PanelPreview />);

    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
    expect(h2s[0]).toHaveTextContent("TODO EN UN MISMO LUGAR");
  });

  it("section has id='panel' and aria-labelledby pointing to h2", () => {
    render(<PanelPreview />);

    const section = screen.getByRole("region", { name: "TODO EN UN MISMO LUGAR" });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "panel");
    expect(section).toHaveAttribute("aria-labelledby", "l3-title");

    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveAttribute("id", "l3-title");
  });

  it("renders the DEMO badge with literal text 'DEMO'", () => {
    render(<PanelPreview />);

    const badge = screen.getByText("DEMO");
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe("SPAN");
  });

  it("frame declaration is exactly 'Todavía no hay panel que mostrar.'", () => {
    render(<PanelPreview />);

    const declaration = screen.getByText("Todavía no hay panel que mostrar.");
    expect(declaration).toBeInTheDocument();
    expect(declaration.tagName).toBe("FIGCAPTION");
  });

  it("three bullets match approved copy and are inside ul role='list'", () => {
    render(<PanelPreview />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    const items = list.querySelectorAll("li");
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

  it("no links or buttons in the component (empty state has zero CTAs)", () => {
    render(<PanelPreview />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("no images and no elements with src attribute", () => {
    render(<PanelPreview />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    const elementsWithSrc = document.querySelectorAll("[src]");
    expect(elementsWithSrc).toHaveLength(0);
  });

  it("renders eyebrow text exactly as approved", () => {
    render(<PanelPreview />);

    expect(
      screen.getByText("TUS OPINIONES, EN UN PANEL")
    ).toBeInTheDocument();
  });

  it("renders lead text exactly as approved", () => {
    render(<PanelPreview />);

    expect(
      screen.getByText(
        "Ahí llegan las respuestas que te dejan tus clientes."
      )
    ).toBeInTheDocument();
  });

  it("has no h1 elements inside the component", () => {
    render(<PanelPreview />);

    const h1s = screen.queryAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(0);
  });

  it("figure frame has exactly 2 children (badge + figcaption) — nothing else inside", () => {
    render(<PanelPreview />);

    const declaration = screen.getByText("Todavía no hay panel que mostrar.");
    const figure = declaration.closest("figure");
    expect(figure).toBeInTheDocument();
    expect(figure!.children).toHaveLength(2);
  });
});
