/// <reference types="vitest/globals" />
import { render, screen, within } from "@testing-library/react";
import { ResultadosNegocio } from "@/components/panel/resultados-negocio";
import { payloadPanelReal } from "@/test/fixtures/panel";

/**
 * Resultados por negocio contra el servicio mockeado (fixture con los
 * números reales). Empresa 1: 20 respuestas, recomendación neta 25,
 * media 8,05, satisfacción 70 %, 10/5/5, alertas 5, comentarios
 * 10 felicitaciones · 4 reclamos · 3 sugerencias · 3 sin comentario.
 */

function stubPanel(empresaId: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      status: 200,
      ok: true,
      headers: {
        get: (nombre: string) =>
          nombre.toLowerCase() === "content-type" ? "application/json" : null,
      },
      json: async () => payloadPanelReal(empresaId),
    })),
  );
}

describe("ResultadosNegocio", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("empresa 1: etiqueta obligatoria, cifras y etiquetas p3/p4 del servicio", async () => {
    stubPanel(1);
    render(<ResultadosNegocio empresaId={1} />);

    // Etiqueta obligatoria de origen de los datos.
    expect(
      screen.getByText(
        "Datos simulados del servicio local · 19 al 31 de octubre · no son clientes reales",
      ),
    ).toBeInTheDocument();

    // Título de la sección y bloque con el nombre sin siglas.
    expect(
      screen.getByRole("heading", { name: "Resultados de este negocio" }),
    ).toBeInTheDocument();

    // Cifras de la empresa 1 (agregado del servicio); primero se espera
    // a que la consulta resuelva.
    expect(await screen.findByText("25,0")).toBeInTheDocument();
    expect(screen.getByText("Recomendación neta")).toBeInTheDocument();
    expect(screen.getByText("8,05")).toBeInTheDocument(); // media
    expect(screen.getByText("70,0 %")).toBeInTheDocument(); // satisfacción
    expect(screen.getByText("% respondieron 4 o 5")).toBeInTheDocument();

    // Etiquetas de p3/p4 del negocio (las define la API).
    expect(screen.getByText(/Surtido y disponibilidad/)).toBeInTheDocument();
    expect(screen.getByText(/Calidad de la atención/)).toBeInTheDocument();

    // Clasificación 10/5/5 y alertas (buscando dentro de cada fila del
    // listado: "10" y "5" también aparecen como etiquetas de la
    // distribución de notas).
    const filaPromotores = screen.getByText("Promotores").closest("div");
    expect(within(filaPromotores!).getByText("10")).toBeInTheDocument();
    const filaPasivos = screen.getByText("Pasivos").closest("div");
    expect(within(filaPasivos!).getByText("5")).toBeInTheDocument();
    const filaDetractores = screen.getByText("Detractores").closest("div");
    expect(within(filaDetractores!).getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Requiere atención")).toBeInTheDocument();

    // Línea de comentarios por tipo.
    expect(
      screen.getByText(
        "Comentarios: 10 felicitaciones · 4 reclamos · 3 sugerencias · 3 sin comentario",
      ),
    ).toBeInTheDocument();
  });

  it("empresa 3: sus propias cifras (recomendación neta 50,0, media 8,55)", async () => {
    stubPanel(3);
    render(<ResultadosNegocio empresaId={3} />);

    expect(await screen.findByText("50,0")).toBeInTheDocument();
    expect(screen.getByText("8,55")).toBeInTheDocument();
    expect(screen.getByText(/Calidad técnica del servicio/)).toBeInTheDocument();
  });

  it("cambiar de empresa vuelve a consultar y cambia los números", async () => {
    stubPanel(1);
    const { rerender } = render(<ResultadosNegocio empresaId={1} />);
    expect(await screen.findByText("25,0")).toBeInTheDocument();

    stubPanel(4);
    rerender(<ResultadosNegocio empresaId={4} />);
    expect(await screen.findByText("5,0")).toBeInTheDocument();
    expect(screen.getByText("7,65")).toBeInTheDocument();
    // Los números del negocio anterior ya no están.
    expect(screen.queryByText("25,0")).not.toBeInTheDocument();
  });

  it("negocio sin respuestas: mensaje explícito, sin ceros disfrazados", async () => {
    const vacio = payloadPanelReal(1);
    (vacio.agregado as Record<string, unknown>).respuestas = 0;
    vacio.respuestas = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 200,
        ok: true,
        headers: {
          get: (nombre: string) =>
            nombre.toLowerCase() === "content-type" ? "application/json" : null,
        },
        json: async () => vacio,
      })),
    );

    render(<ResultadosNegocio empresaId={1} />);
    expect(
      await screen.findByText("Sin respuestas registradas para este negocio."),
    ).toBeInTheDocument();
    // La etiqueta obligatoria sigue visible y no hay cifras.
    expect(screen.getByText(/Datos simulados del servicio local/)).toBeInTheDocument();
    expect(screen.queryByText("25,0")).not.toBeInTheDocument();
  });

  it("sin id todavía (selector cargando): no renderiza nada", () => {
    const { container } = render(<ResultadosNegocio empresaId={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("cargando: estado honesto mientras llega la respuesta", () => {
    // Fetch que nunca resuelve: el componente queda en "consultando".
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    render(<ResultadosNegocio empresaId={1} />);
    expect(
      screen.getByText("Consultando los resultados del servicio…"),
    ).toBeInTheDocument();
    expect(screen.queryByText("25,0")).not.toBeInTheDocument();
  });

  it("no tiene botones: la sección es de solo lectura", async () => {
    stubPanel(1);
    render(<ResultadosNegocio empresaId={1} />);
    await screen.findByText("25,0");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("la distribución 0–10 muestra los 11 valores con sus conteos", async () => {
    stubPanel(1);
    render(<ResultadosNegocio empresaId={1} />);

    const lista = await screen.findByLabelText(
      "Cantidad de respuestas por nota, de la 0 a la 10",
    );
    const filas = within(lista).getAllByRole("listitem");
    expect(filas).toHaveLength(11);
    // Empresa 1 (fixture real): nota 8 → 4, nota 9 → 1, nota 10 → 9.
    expect(within(filas[8]).getByText("4")).toBeInTheDocument();
    expect(within(filas[9]).getByText("1")).toBeInTheDocument();
    expect(within(filas[10]).getByText("9")).toBeInTheDocument();
  });

  it("con fallo de red anterior al cambio, el id nuevo vuelve a consultar", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    const { rerender } = render(<ResultadosNegocio empresaId={1} />);
    expect(
      await screen.findByText("No se pudo consultar el servicio."),
    ).toBeInTheDocument();

    stubPanel(2);
    rerender(<ResultadosNegocio empresaId={2} />);
    expect(await screen.findByText("25,0")).toBeInTheDocument();
    expect(
      screen.queryByText("No se pudo consultar el servicio."),
    ).not.toBeInTheDocument();
  });
});
