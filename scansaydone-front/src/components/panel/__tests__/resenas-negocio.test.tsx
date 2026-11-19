/// <reference types="vitest/globals" />
import { render, screen, within, fireEvent } from "@testing-library/react";
import { ResenasNegocio } from "@/components/panel/resenas-negocio";
import {
  filaRespuestaPanel,
  payloadPanelConRespuestas,
} from "@/test/fixtures/panel";

/**
 * Reseñas por negocio contra el servicio mockeado. Fixture con 6 filas:
 * - 4 con comentario (2 Felicitación, 1 Reclamo, 1 Sugerencia), 2 sin.
 * - 2 con alerta (notas 2 y 4).
 * - Fechas/horas descendentes para verificar el orden más reciente
 *   primero y el formato dd-mm-aaaa.
 */

const RESPUESTAS = [
  filaRespuestaPanel({
    encuesta_id: 60,
    fecha: "2026-10-31",
    hora: "18:19:00",
    p1_nps: 10,
    p5_comentario: "Buenos precios y buena atención.",
    categoria_nps: "Promotor",
    tipo_comentario: "Felicitación",
    bloque_horario: "Tarde",
  }),
  filaRespuestaPanel({
    encuesta_id: 59,
    fecha: "2026-10-30",
    hora: "16:43:00",
    p1_nps: 2,
    p5_comentario: "Encontré productos vencidos.",
    categoria_nps: "Detractor",
    alerta: true,
    tipo_comentario: "Reclamo",
    bloque_horario: "Tarde",
  }),
  filaRespuestaPanel({
    encuesta_id: 58,
    fecha: "2026-10-30",
    hora: "09:15:00",
    p1_nps: 8,
    p5_comentario: null,
    categoria_nps: "Pasivo",
    tipo_comentario: "Sin comentario",
    bloque_horario: "Mañana",
  }),
  filaRespuestaPanel({
    encuesta_id: 57,
    fecha: "2026-10-28",
    hora: "20:45:00",
    p1_nps: 4,
    p5_comentario: "Podrían abrir más temprano.",
    categoria_nps: "Detractor",
    alerta: true,
    tipo_comentario: "Sugerencia",
    bloque_horario: "Noche",
  }),
  filaRespuestaPanel({
    encuesta_id: 56,
    fecha: "2026-10-27",
    hora: "11:30:00",
    p1_nps: 9,
    p5_comentario: "Muy amable la señora de la caja.",
    categoria_nps: "Promotor",
    tipo_comentario: "Felicitación",
    bloque_horario: "Mañana",
  }),
  filaRespuestaPanel({
    encuesta_id: 55,
    fecha: "2026-10-26",
    hora: "13:00:00",
    p1_nps: 7,
    p5_comentario: null,
    categoria_nps: "Pasivo",
    tipo_comentario: "Sin comentario",
    bloque_horario: "Tarde",
  }),
];

function stubResenas() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      status: 200,
      ok: true,
      headers: {
        get: (nombre: string) =>
          nombre.toLowerCase() === "content-type" ? "application/json" : null,
      },
      json: async () => payloadPanelConRespuestas(1, RESPUESTAS),
    })),
  );
}

function listaResenas() {
  return document.querySelector(
    'ul[aria-label^="Reseñas del negocio"]',
  ) as HTMLElement | null;
}

describe("ResenasNegocio contra el servicio", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("1. encabezado, etiqueta obligatoria y línea de resumen del negocio", async () => {
    stubResenas();
    render(<ResenasNegocio empresaId={1} />);

    expect(
      screen.getByRole("heading", { name: "Reseñas de este negocio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Datos simulados del servicio local · 19 al 31 de octubre · no son clientes reales",
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("6 reseñas · 4 con comentario · 2 con alerta"),
    ).toBeInTheDocument();
  });

  it("2. lista semántica con 6 ítems y conteo visible en role=status", async () => {
    stubResenas();
    render(<ResenasNegocio empresaId={1} />);

    const lista = await waitForLista();
    expect(lista).toBeInTheDocument();
    expect(lista!.children).toHaveLength(6);

    expect(screen.getByText("Mostrando 6 de 6 reseñas")).toBeInTheDocument();
    // El conteo vive en una región role="status" (aria-live implícito).
    const estados = screen.getAllByRole("status");
    expect(
      estados.some((n) => n.textContent?.includes("Mostrando 6 de 6")),
    ).toBe(true);
  });

  it("3. la más reciente primero: nota 10 del 31-10-2026 arriba, la más antigua al final", async () => {
    stubResenas();
    render(<ResenasNegocio empresaId={1} />);

    const items = within((await waitForLista())!).getAllByRole("listitem");
    expect(items).toHaveLength(6);

    // Primera de la lista = 2026-10-31 18:19 (nota 10, Felicitación).
    expect(within(items[0]).getByText("10 / 10")).toBeInTheDocument();
    expect(
      within(items[0]).getByText("Buenos precios y buena atención."),
    ).toBeInTheDocument();
    expect(within(items[0]).getByText("Felicitación")).toBeInTheDocument();
    expect(within(items[0]).getByText("31-10-2026")).toBeInTheDocument();
    expect(within(items[0]).getByText(/Momento del día: tarde/)).toBeInTheDocument();

    // La más antigua (2026-10-26) queda al final.
    const ultima = items[items.length - 1];
    expect(within(ultima).getByText("26-10-2026")).toBeInTheDocument();
    expect(within(ultima).getByText("7 / 10")).toBeInTheDocument();
  });

  it("4. sin comentario: el texto secundario aparece en los 2 ítems sin texto", async () => {
    stubResenas();
    render(<ResenasNegocio empresaId={1} />);

    const items = within((await waitForLista())!).getAllByRole("listitem");
    expect(screen.getAllByText("Sin comentario")).toHaveLength(2);
    // El texto secundario no es un control interactivo anidado.
    for (const item of items) {
      expect(item.querySelector("a,button,select,input")).toBeNull();
    }
  });

  it("5. filtro Con comentario: 4 ítems, todos con texto real y conteo actualizado", async () => {
    stubResenas();
    render(<ResenasNegocio empresaId={1} />);

    await waitForLista();
    fireEvent.change(screen.getByLabelText("Filtrar reseñas"), {
      target: { value: "comentario" },
    });

    expect(screen.getByText("Mostrando 4 de 6 reseñas")).toBeInTheDocument();
    const items = within(listaResenas()!).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(screen.queryAllByText("Sin comentario")).toHaveLength(0);
  });

  it("6. filtro Con alerta: solo los 2 ítems con etiqueta Requiere atención", async () => {
    stubResenas();
    render(<ResenasNegocio empresaId={1} />);

    await waitForLista();
    fireEvent.change(screen.getByLabelText("Filtrar reseñas"), {
      target: { value: "alerta" },
    });

    expect(screen.getByText("Mostrando 2 de 6 reseñas")).toBeInTheDocument();
    const items = within(listaResenas()!).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    for (const item of items) {
      expect(within(item).getByText("Requiere atención")).toBeInTheDocument();
    }
  });

  it("7. las etiquetas Requiere atención llevan ícono + texto (no solo color)", async () => {
    stubResenas();
    render(<ResenasNegocio empresaId={1} />);

    const etiquetas = await screen.findAllByText("Requiere atención");
    expect(etiquetas).toHaveLength(2);
    const etiqueta = etiquetas[0].closest("span");
    expect(etiqueta?.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });

  it("8. filtro sin resultados (fixture sin alertas) → mensaje de filtro vacío", async () => {
    const sinAlertas = RESPUESTAS.map((r) => ({ ...r, alerta: false }));
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 200,
        ok: true,
        headers: {
          get: (nombre: string) =>
            nombre.toLowerCase() === "content-type" ? "application/json" : null,
        },
        json: async () => payloadPanelConRespuestas(1, sinAlertas),
      })),
    );
    render(<ResenasNegocio empresaId={1} />);

    await waitForLista();
    fireEvent.change(screen.getByLabelText("Filtrar reseñas"), {
      target: { value: "alerta" },
    });

    expect(screen.getByText("Mostrando 0 de 6 reseñas")).toBeInTheDocument();
    expect(screen.getByText("No hay reseñas con ese filtro.")).toBeInTheDocument();
    expect(listaResenas()).toBeNull();
  });

  it("9. cambiar de empresa vuelve a consultar (lista del otro negocio)", async () => {
    stubResenas();
    const { rerender } = render(<ResenasNegocio empresaId={1} />);
    expect(
      await screen.findByText("6 reseñas · 4 con comentario · 2 con alerta"),
    ).toBeInTheDocument();

    const otra = payloadPanelConRespuestas(2, [
      filaRespuestaPanel({ encuesta_id: 1, fecha: "2026-10-20", p1_nps: 9 }),
    ]);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        status: 200,
        ok: true,
        headers: {
          get: (nombre: string) =>
            nombre.toLowerCase() === "content-type" ? "application/json" : null,
        },
        json: async () => otra,
      })),
    );
    rerender(<ResenasNegocio empresaId={2} />);

    expect(
      await screen.findByText("1 reseña · 1 con comentario · 0 con alerta"),
    ).toBeInTheDocument();
  });
});

describe("ResenasNegocio sin negocio seleccionado", () => {
  it("10. empresaId null: no renderiza nada", () => {
    const { container } = render(<ResenasNegocio empresaId={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

/** Espera la lista de reseñas (llega tras la consulta). */
async function waitForLista() {
  return await vi.waitFor(
    () => {
      const lista = listaResenas();
      expect(lista).not.toBeNull();
      return lista!;
    },
    { timeout: 2000 },
  );
}
