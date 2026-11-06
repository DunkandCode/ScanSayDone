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

  it("renders the generated image declaration line", () => {
    render(<CtaFinal />);
    expect(
      screen.getByText(/La imagen de fondo es una ilustración generada/)
    ).toBeInTheDocument();
  });

  it("background image has alt='' and aria-hidden (decorative)", () => {
    const { container } = render(<CtaFinal />);
    const imgs = container.querySelectorAll("img");
    const bgImg = Array.from(imgs).find(
      (img) =>
        img.getAttribute("src")?.includes("banda-9-escena") ||
        img.getAttribute("data-src")?.includes("banda-9-escena") ||
        img.getAttribute("srcset")?.includes("banda-9-escena")
    );
    expect(bgImg).not.toBeNull();
    expect(bgImg).toHaveAttribute("alt", "");
    expect(bgImg).toHaveAttribute("aria-hidden", "true");
    expect(bgImg).toHaveAttribute("loading", "lazy");
  });

  it("veil layer exists with surface-dark/88 class", () => {
    const { container } = render(<CtaFinal />);
    const section = container.querySelector("section");
    const veil = section?.querySelector('div[aria-hidden="true"]');
    expect(veil).not.toBeNull();
    expect(veil?.className).toMatch(/bg-surface-dark\/88/);
  });

  it("section has id='cta-final'", () => {
    render(<CtaFinal />);
    const section = document.getElementById("cta-final");
    expect(section).toBeInTheDocument();
    expect(section?.tagName.toLowerCase()).toBe("section");
  });
});
