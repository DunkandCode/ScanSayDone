/// <reference types="vitest/globals" />
import {
  render,
  screen,
  within,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { NegocioSelector } from "@/components/panel/negocio-selector";
import { EMPRESAS_DEMO } from "@/components/panel/empresas-demo";
import { limpiarCacheEmpresas } from "@/lib/api/empresas";
import type { EncuestaEmpresa } from "@/lib/api/encuesta";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function payloadEncuesta(
  id: number,
  nombre: string,
  rubro: string,
): EncuestaEmpresa {
  return {
    empresa_id: id,
    nombre_negocio: nombre,
    rubro,
    preguntas: {
      p1: { texto: "¿Qué nota le pones a la atención?", escala: [0, 10] },
      p2: { texto: "¿Qué nota le pones al lugar?", escala: [0, 10] },
      p3: { texto: "¿Volverías?", etiqueta: "Sí / No", escala: [0, 1] },
      p4: { texto: "¿Lo recomiendas?", etiqueta: "Sí / No", escala: [0, 1] },
      p5: { texto: "Cuéntanos qué pasó", max_caracteres: 500 },
    },
  };
}

const API_LISTA = {
  1: payloadEncuesta(1, "Minimarket Don Lucho", "Alimentos y bebidas"),
  3: payloadEncuesta(3, "Café Rincón Andino", "Cafetería"),
};

/** Stub de fetch: ids en `lista` responden 200 con payload; el resto 404. */
function stubFetchConLista(
  lista: Record<number, EncuestaEmpresa>,
  salud: { status: number } | "caido" = { status: 404 },
) {
  const fetchMock = vi.fn(async (url: string) => {
    if (/\/health$/.test(url)) {
      if (salud === "caido") throw new TypeError("Failed to fetch");
      return { status: salud.status, ok: salud.status === 200, json: async () => ({}) };
    }
    const m = url.match(/\/api\/v1\/empresas\/(\d+)\/encuesta$/);
    const id = m ? Number(m[1]) : 0;
    if (lista[id]) {
      return {
        status: 200,
        ok: true,
        headers: {
          get: (nombre: string) =>
            nombre.toLowerCase() === "content-type" ? "application/json" : null,
        },
        json: async () => lista[id],
      };
    }
    return { status: 404, ok: false, json: async () => ({}) };
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** Stub de fetch donde el upstream falla con 5xx (proxy sin backend). */
function stubFetchError500() {
  const fetchMock = vi.fn(async (url: string) => {
    if (/\/health$/.test(url)) {
      return { status: 500, ok: false, json: async () => ({}) };
    }
    return { status: 500, ok: false, json: async () => ({}) };
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** Stub de fetch que siempre falla como error de red. */
function stubFetchCaido() {
  const fetchMock = vi.fn(async () => {
    throw new TypeError("Failed to fetch");
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/* ── Suite ────────────────────────────────────────────────────────────────── */

describe("NegocioSelector", () => {
  beforeEach(() => {
    limpiarCacheEmpresas();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    limpiarCacheEmpresas();
  });

  it("1. lista las opciones que devolvió la API y muestra nombre y rubro reales", async () => {
    stubFetchConLista(API_LISTA);

    render(<NegocioSelector />);

    const select = await screen.findByLabelText("Negocio");
    await waitForValor(select, "1");

    // Solo los negocios que la API devolvió (ids 1 y 3; sin el 404).
    const opciones = screen.getAllByRole("option");
    expect(opciones.map((o) => o.textContent)).toEqual([
      "Minimarket Don Lucho",
      "Café Rincón Andino",
    ]);

    // Detalle: nombre + rubro reales del id seleccionado por defecto (1).
    // El detalle llega después de la lista (segunda consulta): esperar el rubro.
    await screen.findByText("Alimentos y bebidas");
    // El punto de estado anuncia la conexión con la API.
    expect(await screen.findByText("Conectado")).toBeInTheDocument();
    const estados = screen.getAllByRole("status");
    const detalle = estados.find((n) => n.textContent?.includes("Minimarket"));
    expect(detalle).toBeDefined();
    expect(within(detalle!).getByText("Alimentos y bebidas")).toBeInTheDocument();
  });

  it("2. cambiar de negocio consulta la encuesta del id elegido", async () => {
    const fetchMock = stubFetchConLista(API_LISTA);

    render(<NegocioSelector />);

    const select = await screen.findByLabelText("Negocio");
    await waitForValor(select, "1");

    fireEvent.change(select, { target: { value: "3" } });

    // Nombre y rubro del id 3 en la zona de detalle.
    await screen.findByText("Cafetería");

    const ultimaUrl = String(fetchMock.mock.calls.at(-1)?.[0]);
    expect(ultimaUrl).toContain("/api/v1/empresas/3/encuesta");
  });

  it("3. si la lista falla, cae a los nombres guardados con mensaje honesto", async () => {
    stubFetchCaido();

    render(<NegocioSelector />);

    // Mensaje honesto literal: deja claro el origen de los nombres.
    expect(
      await screen.findByText(
        "No se pudo consultar el servicio. Se muestran los nombres guardados en el proyecto.",
      ),
    ).toBeInTheDocument();

    // Las 4 etiquetas de respalto de empresas-demo.ts.
    const opciones = await screen.findAllByRole("option");
    expect(opciones.map((o) => o.textContent)).toEqual(
      EMPRESAS_DEMO.map((e) => e.nombre),
    );

    // Estado de conexión: sin conexión con la API.
    expect(await screen.findByText("Sin conexión")).toBeInTheDocument();
  });

  it("4. el selector no pierde el foco cuando llega la lista", async () => {
    // Lista que se resuelve recién cuando se suelta la compuerta.
    let abrir: () => void = () => {};
    const compuerta = new Promise<void>((resolver) => {
      abrir = resolver;
    });
    const fetchMock = vi.fn(async () => {
      await compuerta;
      return { status: 404, ok: false, json: async () => ({}) };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<NegocioSelector />);

    const select = await screen.findByLabelText("Negocio");
    select.focus();
    expect(document.activeElement).toBe(select);

    await act(async () => {
      abrir();
    });

    await waitForValor(select, "1");
    expect(document.activeElement).toBe(select);
  });

  it("5. tiene label real, región role=status y select siempre montado", async () => {
    stubFetchConLista(API_LISTA);

    const { container } = render(<NegocioSelector />);

    const select = await screen.findByLabelText("Negocio");
    expect(select.tagName).toBe("SELECT");

    const label = container.querySelector("label[for='negocio-selector']");
    expect(label).toBeInTheDocument();
    expect(label!.getAttribute("for")).toBe(select.id);

    // El mensaje de conexión vive en un role="status" (aria-live implícito).
    const estados = screen.getAllByRole("status");
    expect(estados.length).toBeGreaterThanOrEqual(1);
  });

  /* ── Diagnóstico del vacío (todos 404 + /health) ──────────────────────── */

  it("6. todos 404 + /health 200 → mensaje de base vacía y estado Sin negocios", async () => {
    // Lista vacía (todos los probes 404) pero /health responde 200.
    stubFetchConLista({}, { status: 200 });

    render(<NegocioSelector />);

    // Mensaje honesto literal: el servicio responde, la base está vacía y
    // los nombres del selector son los guardados en el proyecto.
    expect(
      await screen.findByText(
        "El servicio responde, pero no hay negocios cargados en la base. Se muestran los nombres guardados en el proyecto.",
      ),
    ).toBeInTheDocument();

    // Estado de la conexión visible.
    expect(await screen.findByText("Sin negocios")).toBeInTheDocument();

    // Respaldo para que el panel siga siendo navegable.
    const opciones = await screen.findAllByRole("option");
    expect(opciones.map((o) => o.textContent)).toEqual(
      EMPRESAS_DEMO.map((e) => e.nombre),
    );
  });

  it("7. todos 404 + /health caído → mensaje de servicio no consultable y Sin conexión", async () => {
    stubFetchConLista({}, "caido");

    render(<NegocioSelector />);

    expect(
      await screen.findByText(
        "No se pudo consultar el servicio. Se muestran los nombres guardados en el proyecto.",
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("Sin conexión")).toBeInTheDocument();
  });

  it("8. todos 404 + /health 503 → mismo mensaje de servicio no consultable", async () => {
    stubFetchConLista({}, { status: 503 });

    render(<NegocioSelector />);

    expect(
      await screen.findByText(
        "No se pudo consultar el servicio. Se muestran los nombres guardados en el proyecto.",
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("Sin conexión")).toBeInTheDocument();
  });

  it("9. probes 500 (proxy con backend caído) → Sin conexión y nota de nombres guardados", async () => {
    // El bug original: el rewrite del dev server devuelve 500 para cada
    // probe. La UI debe decir "sin conexión", nunca "sin negocios".
    stubFetchError500();

    render(<NegocioSelector />);

    expect(
      await screen.findByText(
        "No se pudo consultar el servicio. Se muestran los nombres guardados en el proyecto.",
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("Sin conexión")).toBeInTheDocument();
    expect(screen.queryByText("Sin negocios")).not.toBeInTheDocument();

    // Respaldo para que el panel siga siendo navegable.
    const opciones = await screen.findAllByRole("option");
    expect(opciones.map((o) => o.textContent)).toEqual(
      EMPRESAS_DEMO.map((e) => e.nombre),
    );
  });
});

/* ── Utilidades ───────────────────────────────────────────────────────────── */

function waitForValor(select: HTMLElement, valor: string) {
  return waitFor(
    () => {
      expect((select as HTMLSelectElement).value).toBe(valor);
    },
    { timeout: 2000 },
  );
}
