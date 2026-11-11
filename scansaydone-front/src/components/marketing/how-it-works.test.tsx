/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "./how-it-works";

describe("HowItWorks", () => {
  it("renders h2 with 'ASÍ FUNCIONA' and exactly 3 h3 headings with step titles", () => {
    render(<HowItWorks />);

    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveTextContent("ASÍ FUNCIONA");

    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s).toHaveLength(3);
    expect(h3s[0]).toHaveTextContent("Escanea");
    expect(h3s[1]).toHaveTextContent("Responde");
    expect(h3s[2]).toHaveTextContent("Tú las lees");
  });

  it("has id='como-funciona' and aria-labelledby pointing to h2", () => {
    render(<HowItWorks />);

    const section = document.querySelector("section#como-funciona");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-labelledby", "l2-title");

    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveAttribute("id", "l2-title");
  });

  it("has exactly one link with href='#encuesta-demo'", () => {
    render(<HowItWorks />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "#encuesta-demo");
    expect(links[0]).toHaveTextContent("Ver una encuesta de ejemplo");
  });

  it("renders exact copy for all three steps", () => {
    render(<HowItWorks />);

    // Step 1
    expect(screen.getByText("Escanea")).toBeInTheDocument();
    expect(
      screen.getByText(
        "El QR está en la mesa o en el mostrador. El cliente lo enfoca y la encuesta se abre en el navegador."
      )
    ).toBeInTheDocument();

    // Step 2
    expect(screen.getByText("Responde")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Responde desde el navegador. No hay que instalar nada ni crear una cuenta."
      )
    ).toBeInTheDocument();

    // Step 3
    expect(screen.getByText("Tú las lees")).toBeInTheDocument();
    expect(
      screen.getByText("Tú lees las opiniones de tus clientes en tu panel.")
    ).toBeInTheDocument();
  });

  it("badge numbers are aria-hidden and not accessible names", () => {
    render(<HowItWorks />);

    const badges = screen.getAllByText(/^[1-3]$/);
    expect(badges).toHaveLength(3);

    badges.forEach((badge) => {
      expect(badge).toHaveAttribute("aria-hidden", "true");
    });

    // Verify the step titles are the accessible names, not the numbers
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s[0]).toHaveTextContent("Escanea");
    expect(h3s[0]).not.toHaveTextContent(/^[1-3]$/);
  });

  it("has no links to /panel or /e/demo", () => {
    render(<HowItWorks />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      expect(href).not.toMatch(/^\/panel/);
      expect(href).not.toMatch(/^\/e\/demo/);
    });
  });

  it("renders eyebrow text", () => {
    render(<HowItWorks />);

    expect(
      screen.getByText("DE LA MESA A TUS RESPUESTAS")
    ).toBeInTheDocument();
  });

  it("renders lead text", () => {
    render(<HowItWorks />);

    expect(
      screen.getByText("El cliente opina desde la mesa. Tú lo lees después.")
    ).toBeInTheDocument();
  });

  it("uses ordered list with role='list' for steps", () => {
    render(<HowItWorks />);

    const list = document.querySelector("ol[role='list']");
    expect(list).toBeInTheDocument();

    const items = list?.querySelectorAll("li");
    expect(items).toHaveLength(3);
  });
});
