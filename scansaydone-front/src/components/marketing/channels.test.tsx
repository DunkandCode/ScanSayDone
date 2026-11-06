/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { Channels } from "./channels";

describe("Channels", () => {
  it("renders exactly one h2 with 'DONDE ESTÁ TU CLIENTE'", () => {
    render(<Channels />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
    expect(h2s[0]).toHaveTextContent("DONDE ESTÁ TU CLIENTE");
  });

  it("section is findable by region role with accessible name and has id='canales'", () => {
    render(<Channels />);
    const section = screen.getByRole("region", { name: "DONDE ESTÁ TU CLIENTE" });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "canales");
  });

  it("renders exactly four h3 headings with correct titles in order", () => {
    render(<Channels />);
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s).toHaveLength(4);
    expect(h3s[0]).toHaveTextContent("En la mesa");
    expect(h3s[1]).toHaveTextContent("En el mostrador");
    expect(h3s[2]).toHaveTextContent("En el cartel");
    expect(h3s[3]).toHaveTextContent("En la tablet");
  });

  it("renders exact body copy for all four cards", () => {
    render(<Channels />);
    expect(
      screen.getByText("Un QR sobre la mesa. El cliente lo enfoca desde su asiento y responde.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("El QR junto a la caja: se escanea al pagar, antes de irte.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Un cartel en la pared o junto a la fila. Quien espera contesta desde ahí.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Si atiendes con tablet, la encuesta se abre ahí, sin instalar nada.")
    ).toBeInTheDocument();
  });

  it("all four SVGs have aria-hidden, focusable=false, and data-decorativo", () => {
    render(<Channels />);
    const svgs = document.querySelectorAll("svg[data-decorativo='ilustracion']");
    expect(svgs).toHaveLength(4);
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    });
  });

  it("list has role='list' and exactly four items", () => {
    render(<Channels />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    const items = list.querySelectorAll("li");
    expect(items).toHaveLength(4);
  });

  it("has zero links and zero buttons", () => {
    render(<Channels />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the illustration note with exact text", () => {
    render(<Channels />);
    expect(
      screen.getByText(
        "Estas figuras son ilustraciones propias. Los códigos dibujados no son códigos QR y no se pueden escanear."
      )
    ).toBeInTheDocument();
  });

  it("renders eyebrow text", () => {
    render(<Channels />);
    expect(screen.getByText("SIEMPRE CERCA DE TUS CLIENTES")).toBeInTheDocument();
  });

  it("renders lead text", () => {
    render(<Channels />);
    expect(
      screen.getByText("Tus clientes ya están en la mesa o en la caja. Ahí empieza todo.")
    ).toBeInTheDocument();
  });
});
