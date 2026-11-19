/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { ResenasNegocio } from "@/components/panel/resenas-negocio";

/**
 * Estados de falla de ResenasNegocio: 404, 5xx, 200 sin JSON y error de
 * red. En todos, mensaje honesto SIN lista, SIN filtro y SIN cifras.
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

describe("ResenasNegocio: estados de falla", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("404 → «No encontramos este negocio.», sin lista ni filtro", async () => {
    stubRespuesta(404);
    render(<ResenasNegocio empresaId={9} />);

    expect(
      await screen.findByText("No encontramos este negocio."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Filtrar reseñas")).not.toBeInTheDocument();
  });

  it("500 (proxy con backend caído) → «No se pudo consultar el servicio.»", async () => {
    stubRespuesta(500);
    render(<ResenasNegocio empresaId={1} />);

    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("200 con text/html (HTML del proxy) → «No se pudo consultar el servicio.»", async () => {
    stubRespuesta(200, "text/html; charset=utf-8");
    render(<ResenasNegocio empresaId={1} />);
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
    render(<ResenasNegocio empresaId={1} />);
    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();
  });

  it("cargando: «Consultando las reseñas del servicio…» sin cifras", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    render(<ResenasNegocio empresaId={1} />);
    expect(
      screen.getByText("Consultando las reseñas del servicio…"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
