/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { TrustStrip } from "./trust-strip";
import { QR_CLAIM_TITLE, QR_CLAIM_BODY } from "../../lib/copy-landing";

describe("TrustStrip", () => {
  it("renders the three titles literally", () => {
    render(<TrustStrip />);
    expect(
      screen.getByText("SIN INSTALAR NADA")
    ).toBeInTheDocument();
    expect(
      screen.getByText("SIN CUENTA PARA TUS CLIENTES")
    ).toBeInTheDocument();
    expect(
      screen.getByText(QR_CLAIM_TITLE)
    ).toBeInTheDocument();
  });

  it("renders the three bodies literally", () => {
    render(<TrustStrip />);
    expect(
      screen.getByText(
        "El cliente contesta en el navegador de su teléfono. No hay app."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Nada de registros ni correos para responder."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        QR_CLAIM_BODY
      )
    ).toBeInTheDocument();
  });

  it("has three SVGs with correct data-decorativo and aria-hidden", () => {
    render(<TrustStrip />);
    
    const sinAppIcon = document.querySelector(
      'svg[data-decorativo="icon-sin-app"]'
    );
    expect(sinAppIcon).toBeInTheDocument();
    expect(sinAppIcon).toHaveAttribute("aria-hidden", "true");
    expect(sinAppIcon).toHaveAttribute("focusable", "false");

    const sinCuentaIcon = document.querySelector(
      'svg[data-decorativo="icon-sin-cuenta"]'
    );
    expect(sinCuentaIcon).toBeInTheDocument();
    expect(sinCuentaIcon).toHaveAttribute("aria-hidden", "true");
    expect(sinCuentaIcon).toHaveAttribute("focusable", "false");

    const sinReimpresionIcon = document.querySelector(
      'svg[data-decorativo="icon-sin-reimpresion"]'
    );
    expect(sinReimpresionIcon).toBeInTheDocument();
    expect(sinReimpresionIcon).toHaveAttribute("aria-hidden", "true");
    expect(sinReimpresionIcon).toHaveAttribute("focusable", "false");
  });

  it("has no h2 or h3 headings (titles are <p>)", () => {
    render(<TrustStrip />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });

  it("has no links or buttons", () => {
    render(<TrustStrip />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not contain the string '3 PREGUNTAS'", () => {
    const { container } = render(<TrustStrip />);
    expect(container.textContent).not.toContain("3 PREGUNTAS");
  });
});
