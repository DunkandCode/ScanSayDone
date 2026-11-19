/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { ResultadosNegocio } from "@/components/panel/resultados-negocio";

/**
 * Estados de falla de ResultadosNegocio: 404, 5xx, 200 sin JSON y error
 * de red. En todos, mensaje honesto SIN cifras (nada de "0" disfrazado).
 */

function stubRespuesta(status: number, contentType?: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      status,
      ok: status === 200,
      headers: {
        get: (nombre: string) =>
          nombre.toLowerCase() === "content-type"
            ? (contentType ?? "application/json")
            : null,
      },
      json: async () => ({ esto: "no es un panel" }),
    })),
  );
}

describe("ResultadosNegocio: estados de falla", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("404 → «No encontramos este negocio.», sin cifras", async () => {
    stubRespuesta(404);
    render(<ResultadosNegocio empresaId={9} />);

    expect(
      await screen.findByText("No encontramos este negocio."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\/10/)).not.toBeInTheDocument();
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });

  it("500 (proxy con backend caído) → «No se pudo consultar el servicio.»", async () => {
    stubRespuesta(500);
    render(<ResultadosNegocio empresaId={1} />);

    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\/10/)).not.toBeInTheDocument();
  });

  it("503 → «No se pudo consultar el servicio.»", async () => {
    stubRespuesta(503);
    render(<ResultadosNegocio empresaId={1} />);
    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();
  });

  it("200 con text/html (HTML del proxy) → «No se pudo consultar el servicio.»", async () => {
    stubRespuesta(200, "text/html; charset=utf-8");
    render(<ResultadosNegocio empresaId={1} />);
    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();
  });

  it("error de red (fetch que revienta) → «No se pudo consultar el servicio.»", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    render(<ResultadosNegocio empresaId={1} />);
    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();
  });

  it("la etiqueta de origen sigue visible en los estados de falla", async () => {
    stubRespuesta(500);
    render(<ResultadosNegocio empresaId={1} />);
    expect(
      await screen.findByText(/Datos simulados del servicio/),
    ).toBeInTheDocument();
  });
});
