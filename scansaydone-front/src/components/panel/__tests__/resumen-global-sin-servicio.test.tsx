/// <reference types="vitest/globals" />
import { render, screen, within } from "@testing-library/react";
import { ResumenEmpresa } from "@/components/panel/resumen-global";
import { payloadPanelReal } from "@/test/fixtures/panel";

/**
 * ResumenEmpresa (negocio de la sesión): estados honestos sin servicio y
 * cifras de UNA empresa del fixture. Ya no existe la tabla de 4 negocios
 * ni el cálculo global agrupado.
 */

/** Respuesta fetch mínima con headers.get (lo único que usa el cliente). */
function respuestaPanel(empresaId: number) {
  return {
    status: 200,
    ok: true,
    headers: {
      get: (nombre: string) =>
        nombre.toLowerCase() === "content-type" ? "application/json" : null,
    },
    json: async () => payloadPanelReal(empresaId),
  };
}

describe("ResumenEmpresa: estados sin servicio", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("servicio caído (5xx) → «No se pudo consultar el servicio.» sin cifras", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 503,
        ok: false,
        headers: { get: () => null },
        json: async () => ({}),
      })),
    );

    render(<ResumenEmpresa empresaId={1} />);

    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();

    // Sin cifras: ni totales, ni barras, ni tabla.
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/por día/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/por nota/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/por momento/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^20$/)).not.toBeInTheDocument();
    expect(screen.queryByText("8,05")).not.toBeInTheDocument();
    expect(screen.queryByText("25,0")).not.toBeInTheDocument();
  });

  it("empresa inexistente (404) → «No se pudo consultar el servicio.»", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 404,
        ok: false,
        headers: { get: () => null },
        json: async () => ({}),
      })),
    );

    render(<ResumenEmpresa empresaId={99} />);

    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("cargando: «Consultando el servicio…» sin cifras", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );

    render(<ResumenEmpresa empresaId={1} />);

    expect(screen.getByText("Consultando el servicio…")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText(/^20$/)).not.toBeInTheDocument();
  });

  it("la etiqueta de datos simulados está visible incluso sin servicio", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 503,
        ok: false,
        headers: { get: () => null },
        json: async () => ({}),
      })),
    );

    render(<ResumenEmpresa empresaId={1} />);

    expect(
      await screen.findByText(/Datos simulados del servicio/),
    ).toBeInTheDocument();
  });
});

describe("ResumenEmpresa: cifras del negocio de la sesión", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("muestra las cifras oficiales de la empresa 1 y NO la tabla de 4 negocios", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => respuestaPanel(1)));

    render(<ResumenEmpresa empresaId={1} />);

    // Agregado oficial de la empresa 1 del fixture: 20 respuestas,
    // media 8,05, recomendación neta 25, 5 alertas.
    // El fetch es async: esperar a que el agregado cargue antes de las
    // aserciones síncronas (mismo patrón findBy del resto del archivo).
    expect(await screen.findByText("Respuestas")).toBeInTheDocument();
    const tarjetaRespuestas = screen.getByText("Respuestas").closest("div");
    expect(tarjetaRespuestas).toBeInTheDocument();
    expect(within(tarjetaRespuestas!).getByText("20")).toBeInTheDocument();

    const tarjetaMedia = screen.getByText("Media").closest("div");
    expect(within(tarjetaMedia!).getByText("8,05")).toBeInTheDocument();

    const tarjetaNps = screen.getByText("Recomendación neta").closest("div");
    expect(within(tarjetaNps!).getByText("25,0")).toBeInTheDocument();

    const tarjetaAlertas = screen.getByText("Requiere atención").closest("div");
    expect(within(tarjetaAlertas!).getByText("5")).toBeInTheDocument();

    // Ya no hay tabla por negocio ni nombres de otros negocios.
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Café Rincón Andino")).not.toBeInTheDocument();
    expect(screen.queryByText("Peluquería Estilo Sur")).not.toBeInTheDocument();
    expect(screen.queryByText("Cosmos Accesorios")).not.toBeInTheDocument();

    // La consulta fue UNA, a la empresa de la sesión.
    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toBe("/api/v1/empresas/1/panel");
  });

  it("gráfico por día con la serie propia de la empresa (11 días)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => respuestaPanel(3)));

    render(<ResumenEmpresa empresaId={3} />);

    const dia = await screen.findByLabelText(
      "Cantidad de respuestas por día, de la más antigua a la más reciente",
    );
    const barras = within(dia).getAllByRole("listitem");
    // La serie de la empresa 3 del fixture tiene 11 días con respuestas
    // (19 al 31 de octubre, sin el 25 ni el 30).
    expect(barras).toHaveLength(11);
    expect(barras[0]).toHaveAttribute("aria-label", "19-10: 1 respuesta");
    expect(barras.at(-1)).toHaveAttribute("aria-label", "31-10: 1 respuesta");
  });

  it("distribución 11 filas y momentos 5/14/1 con muestra mínima en Noche", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => respuestaPanel(3)));

    render(<ResumenEmpresa empresaId={3} />);

    const distribucion = await screen.findByLabelText(
      "Cantidad de respuestas por nota, de la 0 a la 10",
    );
    expect(within(distribucion).getAllByRole("listitem")).toHaveLength(11);

    const momento = screen.getByLabelText(
      "Cantidad de respuestas por momento del día",
    );
    const bloques = within(momento).getAllByRole("listitem");
    expect(within(bloques[0]).getByText("5")).toBeInTheDocument();
    expect(within(bloques[1]).getByText("14")).toBeInTheDocument();
    expect(within(bloques[2]).getByText("1")).toBeInTheDocument();
    expect(within(bloques[2]).getByText("muestra mínima")).toBeInTheDocument();
  });
});
