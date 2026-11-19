/// <reference types="vitest/globals" />
import { render, screen } from "@testing-library/react";
import { ResumenGlobal } from "@/components/panel/resumen-global";
import { limpiarCacheEmpresas } from "@/lib/api/empresas";

/**
 * Resumen global sin servicio: estados honestos SIN cifras. Ni "0" ni
 * barras: si no se pudieron consultar los datos, no se muestran datos.
 */

describe("ResumenGlobal: estados sin servicio", () => {
  beforeEach(() => {
    limpiarCacheEmpresas();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    limpiarCacheEmpresas();
  });

  it("servicio caído (5xx en el sondeo) → «No se pudo consultar el servicio.» sin cifras", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 503,
        ok: false,
        json: async () => ({}),
      })),
    );

    render(<ResumenGlobal />);

    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();

    // Sin cifras: ni totales, ni barras, ni tabla.
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/por día/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/por nota/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/por momento/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^80$/)).not.toBeInTheDocument();
    expect(screen.queryByText("8,1")).not.toBeInTheDocument();
    expect(screen.queryByText("26,3")).not.toBeInTheDocument();
  });

  it("servicio sano pero sin negocios → «El servicio responde, pero no hay negocios cargados.»", async () => {
    // Sondeo: todas las encuestas 404 (ids inexistentes).
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (String(url).endsWith("/health")) {
          return { status: 200, ok: true, json: async () => ({ status: "ok" }) };
        }
        return { status: 404, ok: false, json: async () => ({}) };
      }),
    );

    render(<ResumenGlobal />);

    expect(
      await screen.findByText(
        "El servicio responde, pero no hay negocios cargados.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("cargando: «Consultando el servicio…» sin cifras", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );

    render(<ResumenGlobal />);

    expect(screen.getByText("Consultando el servicio…")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(/^80$/)).not.toBeInTheDocument();
  });

  it("la etiqueta de datos simulados está visible incluso sin servicio", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 503,
        ok: false,
        json: async () => ({}),
      })),
    );

    render(<ResumenGlobal />);

    expect(
      await screen.findByText(/Datos simulados del servicio/),
    ).toBeInTheDocument();
  });
});
