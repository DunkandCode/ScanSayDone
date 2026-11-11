/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { Applications } from "./applications";

describe("Applications", () => {
  it("renders exactly one h2 with 'NEGOCIOS QUE ATIENDEN EN PERSONA'", () => {
    render(<Applications />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(1);
    expect(h2s[0]).toHaveTextContent("NEGOCIOS QUE ATIENDEN EN PERSONA");
  });

  it("section is findable by region role with accessible name and has id='aplicaciones'", () => {
    render(<Applications />);
    const section = screen.getByRole("region", { name: "NEGOCIOS QUE ATIENDEN EN PERSONA" });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "aplicaciones");
  });

  it("renders exactly three h3 headings with correct names in order", () => {
    render(<Applications />);
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s).toHaveLength(3);
    expect(h3s[0]).toHaveTextContent("Restaurante");
    expect(h3s[1]).toHaveTextContent("Café");
    expect(h3s[2]).toHaveTextContent("Comercio pequeño");
  });

  it("renders exact line-2 copy for all three plates", () => {
    render(<Applications />);
    expect(
      screen.getByText("Quien paga la cuenta, puede opinar al salir.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("En la barra, la pregunta queda a la vista.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Da voz al cliente que calla en el trato.")
    ).toBeInTheDocument();
  });

  it("list has role='list' and exactly three items", () => {
    render(<Applications />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    const items = list.querySelectorAll("li");
    expect(items).toHaveLength(3);
  });

  it("renders three figures, each with a figcaption exposing the plate name", () => {
    render(<Applications />);
    const figures = screen.getAllByRole("figure");
    expect(figures).toHaveLength(3);
    const captions = figures.map((fig) => fig.querySelector("figcaption"));
    expect(captions[0]).toHaveTextContent("Restaurante");
    expect(captions[1]).toHaveTextContent("Café");
    expect(captions[2]).toHaveTextContent("Comercio pequeño");
  });

  it("'ILUSTRACIÓN' badge appears exactly 3 times", () => {
    render(<Applications />);
    const badges = screen.getAllByText("ILUSTRACIÓN");
    expect(badges).toHaveLength(3);
  });

  it("renders three images with correct alt texts", () => {
    render(<Applications />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    
    expect(images[0]).toHaveAttribute(
      "alt",
      "Mesa de restaurante con soporte de encuesta (ilustración generada)"
    );
    expect(images[1]).toHaveAttribute(
      "alt",
      "Taza de café junto a un soporte ilustrado (imagen generada)"
    );
    expect(images[2]).toHaveAttribute(
      "alt",
      "Mostrador de comercio con tarjeta de encuesta (imagen generada)"
    );
  });

  it("renders the declaration line exactly once", () => {
    render(<Applications />);
    const declaration = screen.getByText(
      /Estas tres imágenes son ilustraciones generadas por IA/
    );
    expect(declaration).toBeInTheDocument();
    expect(declaration).toHaveTextContent(
      "Estas tres imágenes son ilustraciones generadas por IA. No muestran locales reales. El patrón que parece un código es decorativo y no se puede escanear."
    );
  });

  it("has zero links and zero buttons", () => {
    render(<Applications />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the eyebrow text", () => {
    render(<Applications />);
    expect(screen.getByText("PARA QUIÉN ES")).toBeInTheDocument();
  });

  it("renders the lead text", () => {
    render(<Applications />);
    expect(
      screen.getByText("Un restaurante, un café, un comercio. La opinión llega igual.")
    ).toBeInTheDocument();
  });
});
