/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { CtaFinal } from "./cta-final";

describe("CtaFinal", () => {
  it("has exactly one h2 with '¿LISTO PARA EMPEZAR?'", () => {
    render(<CtaFinal />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("¿LISTO PARA EMPEZAR?");
  });

  it("renders kicker and lead with exact text", () => {
    render(<CtaFinal />);
    expect(screen.getByText("COMIENZA HOY")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Encuestas por QR para tu restaurante, café o comercio."
      )
    ).toBeInTheDocument();
  });

  it("button says 'Escríbenos' and links to /contactus", () => {
    render(<CtaFinal />);
    const link = screen.getByRole("link", { name: "Escríbenos" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/contactus");
  });

  it("does not contain 'Sin tarjeta' text", () => {
    const { container } = render(<CtaFinal />);
    expect(container.textContent).not.toContain("Sin tarjeta");
  });

  it("does not contain the generated image declaration", () => {
    const { container } = render(<CtaFinal />);
    expect(container.textContent).not.toContain(
      "La imagen de fondo es una ilustración generada"
    );
  });

  it("section has id='cta-final'", () => {
    render(<CtaFinal />);
    const section = document.getElementById("cta-final");
    expect(section).toBeInTheDocument();
    expect(section?.tagName.toLowerCase()).toBe("section");
  });
});
