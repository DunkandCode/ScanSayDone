/// <reference types="vitest/globals" />
import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import PanelPage from "@/app/(panel)/panel/page";
import { PanelNavLinks } from "@/components/panel/panel-nav";
import { limpiarCacheEmpresas } from "@/lib/api/empresas";
import type { EncuestaEmpresa } from "@/lib/api/encuesta";
import {
  IDS_FIXTURE,
  nombreFixture,
  payloadPanelReal,
} from "@/test/fixtures/panel";

/**
 * Panel con datos del servicio (mockeado): Resumen global (4 consultas),
 * Resultados, Encuesta y Reseñas como pestañas. Números esperados =
 * fixture con los valores reales del servicio local (80 respuestas,
 * 19–31 de octubre).
 */

function payloadEncuesta(id: number, nombre: string): EncuestaEmpresa {
  return {
    empresa_id: id,
    nombre_negocio: nombre,
    rubro: "Rubro de prueba",
    preguntas: {
      p1: { texto: "¿Qué nota le pones a la experiencia?", escala: [0, 10] },
      p2: { texto: "¿Qué tan satisfecho quedaste?", escala: [1, 5] },
      p3: {
        texto: "¿Qué nota le pones al atributo tres?",
        etiqueta: "Atributo tres",
        escala: [1, 5],
      },
      p4: {
        texto: "¿Qué nota le pones al atributo cuatro?",
        etiqueta: "Atributo cuatro",
        escala: [1, 5],
      },
      p5: { texto: "Cuéntanos qué pasó", max_caracteres: 500 },
    },
  };
}

const ENCUESTAS: Record<number, EncuestaEmpresa> = Object.fromEntries(
  IDS_FIXTURE.map((id) => [id, payloadEncuesta(id, nombreFixture(id))]),
);

/** Stub de fetch: encuesta para ids 1..4, panel para ids 1..4, resto 404. */
function stubFetchServicio() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const panel = String(url).match(/\/api\/v1\/empresas\/(\d+)\/panel$/);
      if (panel) {
        const id = Number(panel[1]);
        if (payloadPanelReal(id)) {
          return {
            status: 200,
            ok: true,
            headers: {
              get: (nombre: string) =>
                nombre.toLowerCase() === "content-type"
                  ? "application/json"
                  : null,
            },
            json: async () => payloadPanelReal(id),
          };
        }
        return { status: 404, ok: false, json: async () => ({}) };
      }

      const encuesta = String(url).match(/\/api\/v1\/empresas\/(\d+)\/encuesta$/);
      if (encuesta) {
        const id = Number(encuesta[1]);
        if (ENCUESTAS[id]) {
          return {
            status: 200,
            ok: true,
            headers: {
              get: (nombre: string) =>
                nombre.toLowerCase() === "content-type"
                  ? "application/json"
                  : null,
            },
            json: async () => ENCUESTAS[id],
          };
        }
        return { status: 404, ok: false, json: async () => ({}) };
      }

      return { status: 404, ok: false, json: async () => ({}) };
    }),
  );
}

function abrirPestana(nombre: "Resumen" | "Resultados" | "Encuesta" | "Reseñas") {
  fireEvent.click(screen.getByRole("tab", { name: nombre }));
}

describe("PanelPage: pestañas con datos del servicio", () => {
  beforeEach(() => {
    stubFetchServicio();
    limpiarCacheEmpresas();
    window.history.replaceState(null, "", "#");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    limpiarCacheEmpresas();
    window.history.replaceState(null, "", "#");
  });

  it("1. la pestaña por defecto es Resumen, con un solo h1 y estructura aria correcta", () => {
    render(<PanelPage />);

    const tabResumen = screen.getByRole("tab", { name: "Resumen" });
    expect(tabResumen).toHaveAttribute("aria-selected", "true");
    expect(tabResumen).toHaveAttribute("aria-controls", "panel-resumen");

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "panel-resumen");
    expect(panel).toHaveAttribute("aria-labelledby", "tab-resumen");

    expect(screen.getByRole("tab", { name: "Resultados" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "Encuesta" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "Reseñas" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Resumen");
  });

  it("2. la etiqueta obligatoria de datos simulados está presente", async () => {
    render(<PanelPage />);
    expect(
      screen.getByText(
        "Datos simulados del servicio local · 19 al 31 de octubre · no son clientes reales",
      ),
    ).toBeInTheDocument();
    // El resumen llega (no queda en "consultando").
    expect(await screen.findByText("80")).toBeInTheDocument();
  });

  it("3. cifras globales: 80 respuestas, media 8,1, 4 negocios y recomendación neta 26,3", async () => {
    render(<PanelPage />);

    expect(await screen.findByText("26,3")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument(); // Respuestas
    expect(screen.getByText("8,1")).toBeInTheDocument(); // Media general

    // "4" también aparece como nota en la distribución: se consulta dentro
    // de la tarjeta de la cifra Negocios.
    const tarjetaNegocios = screen.getByText("Negocios").closest("div");
    expect(tarjetaNegocios).toBeInTheDocument();
    expect(within(tarjetaNegocios!).getByText("4")).toBeInTheDocument();
  });

  it("4. gráfico por día: 13 barras con conteos visibles y rótulo dd-mm", async () => {
    render(<PanelPage />);

    const dia = await screen.findByLabelText(
      "Cantidad de respuestas por día, de la más antigua a la más reciente",
    );
    const barras = within(dia).getAllByRole("listitem");
    expect(barras).toHaveLength(13);

    // Primera y última barra con su texto alternativo (aria-label del li).
    expect(barras[0]).toHaveAttribute("aria-label", "19-10: 4 respuestas");
    expect(barras.at(-1)).toHaveAttribute("aria-label", "31-10: 6 respuestas");
    // El conteo es texto visible dentro de cada barra.
    expect(within(barras[0]).getByText("4")).toBeInTheDocument();
    expect(within(barras.at(-1)!).getByText("6")).toBeInTheDocument();
  });

  it("5. distribución 11 filas y momento del día: 3 barras con muestra mínima en Noche", async () => {
    render(<PanelPage />);

    const distribucion = await screen.findByLabelText(
      "Cantidad de respuestas por nota, de la 0 a la 10",
    );
    expect(within(distribucion).getAllByRole("listitem")).toHaveLength(11);

    const momento = screen.getByLabelText(
      "Cantidad de respuestas por momento del día",
    );
    const bloques = within(momento).getAllByRole("listitem");
    expect(bloques).toHaveLength(3);

    // Global: Mañana 15 · Tarde 63 · Noche 2 (conteos del fixture).
    expect(within(bloques[0]).getByText("15")).toBeInTheDocument();
    expect(within(bloques[1]).getByText("63")).toBeInTheDocument();
    expect(within(bloques[2]).getByText("2")).toBeInTheDocument();

    // Global: Mañana 15 y Tarde 63 superan la muestra mínima; Noche 2
    // no la alcanza y lleva la nota visible junto al conteo.
    expect(within(bloques[0]).queryByText("muestra mínima")).not.toBeInTheDocument();
    expect(within(bloques[1]).queryByText("muestra mínima")).not.toBeInTheDocument();
    expect(within(bloques[2]).getByText("muestra mínima")).toBeInTheDocument();
  });

  it("6. tabla por negocio: 4 empresas con recomendación neta 25,0 / 25,0 / 50,0 / 5,0", async () => {
    render(<PanelPage />);

    const tbody = await waitFor(() => {
      const el = document.querySelector("tbody");
      expect(el).not.toBeNull();
      return el as HTMLElement;
    });
    expect(tbody).toBeInTheDocument();
    const cuerpo = within(tbody as HTMLElement).getAllByRole("row");
    expect(cuerpo).toHaveLength(4);
    expect(cuerpo[0]).toHaveTextContent(/Minimarket Don Lucho/);
    expect(cuerpo[1]).toHaveTextContent(/Café Rincón Andino/);
    expect(cuerpo[2]).toHaveTextContent(/Peluquería Estilo Sur/);
    expect(cuerpo[3]).toHaveTextContent(/Cosmos Accesorios/);

    // Recomendación neta por negocio (números oficiales del agregado).
    // Empresas 1 y 2 comparten 25,0: se esperan DOS apariciones (una por
    // fila de la tabla).
    expect(screen.getAllByText("25,0")).toHaveLength(2);
    expect(screen.getByText("50,0")).toBeInTheDocument();
    expect(screen.getByText("5,0")).toBeInTheDocument();
  });

  it("7. ninguna palabra prohibida aparece en el panel", async () => {
    render(<PanelPage />);
    expect(await screen.findByText("26,3")).toBeInTheDocument();

    const texto = (document.body.textContent ?? "").toLowerCase();
    const prohibidas = [
      "kpi",
      "csat",
      "nps",
      "score",
      "dashboard",
      "insights",
      "tiempo real",
      "en construcción",
      "próximamente",
      "proximamente",
      "demo",
      "ejemplo",
    ];
    const encontradas = prohibidas.filter((p) => texto.includes(p));
    expect(encontradas).toEqual([]);
  });

  it("8. las pestañas cambian de panel: Resultados y Encuesta con su selector", async () => {
    render(<PanelPage />);

    abrirPestana("Resultados");
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "id",
      "panel-resultados",
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Resultados" }),
    ).toBeInTheDocument();
    // El selector del negocio está en la pestaña.
    expect(screen.getByLabelText("Negocio")).toBeInTheDocument();
    // Tras resolver la lista aparecen los resultados del negocio inicial
    // (empresa 1: recomendación neta 25,0, media 8,05).
    expect(
      await screen.findByRole("heading", { name: "Resultados de este negocio" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("25,0")).toBeInTheDocument();
    expect(screen.getByText("8,05")).toBeInTheDocument();

    abrirPestana("Encuesta");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-encuesta");
    expect(
      screen.getByRole("heading", { level: 1, name: "Encuesta" }),
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("Negocio")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: "Encuesta definida para este negocio",
      }),
    ).toBeInTheDocument();

    // Al cambiar de pestaña, el panel anterior deja de estar en el DOM.
    expect(
      screen.queryByRole("heading", { name: "Resultados de este negocio" }),
    ).not.toBeInTheDocument();
  });

  it("8b. la pestaña Reseñas muestra el selector y la lista del negocio inicial", async () => {
    render(<PanelPage />);

    abrirPestana("Reseñas");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-resenas");
    expect(
      screen.getByRole("heading", { level: 1, name: "Reseñas" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Negocio")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: "Reseñas de este negocio",
      }),
    ).toBeInTheDocument();

    // Empresa 1 del fixture: 20 reseñas · 17 con comentario · 5 con alerta.
    expect(
      await screen.findByText("20 reseñas · 17 con comentario · 5 con alerta"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mostrando 20 de 20 reseñas")).toBeInTheDocument();
  });

  it("8c. cambiar el negocio en el selector cambia los resultados", async () => {
    render(<PanelPage />);

    abrirPestana("Resultados");
    expect(await screen.findByText("25,0")).toBeInTheDocument();

    const select = screen.getByLabelText("Negocio");
    await waitForSelect(select, "1");

    fireEvent.change(select, { target: { value: "3" } });

    // Empresa 3: recomendación neta 50,0 y media 8,55.
    expect(await screen.findByText("50,0")).toBeInTheDocument();
    expect(screen.getByText("8,55")).toBeInTheDocument();
    // Los números del negocio anterior ya no están.
    expect(screen.queryByText("25,0")).not.toBeInTheDocument();
    expect(screen.queryByText("8,05")).not.toBeInTheDocument();
  });

  it("9. navegación por teclado: la flecha derecha activa y enfoca Resultados", () => {
    render(<PanelPage />);

    const tablist = screen.getByRole("tablist");
    fireEvent.keyDown(tablist, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Resultados" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "id",
      "panel-resultados",
    );
    expect(document.activeElement).toBe(
      screen.getByRole("tab", { name: "Resultados" }),
    );

    // La flecha izquierda vuelve a Resumen (orden circular).
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("10. el hash sincroniza la pestaña (enlaces de la navegación lateral)", () => {
    render(<PanelPage />);

    window.location.hash = "#encuesta";
    fireEvent(window, new Event("hashchange"));

    expect(screen.getByRole("tab", { name: "Encuesta" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-encuesta");

    // Un hash desconocido cae a Resumen.
    window.location.hash = "#cualquiera";
    fireEvent(window, new Event("hashchange"));
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("11. activar una pestaña actualiza el hash de la URL", () => {
    render(<PanelPage />);

    abrirPestana("Resultados");
    expect(window.location.hash).toBe("#resultados");
  });
});

/** Espera a que el select tome el valor esperado (la lista llega async). */
async function waitForSelect(select: HTMLElement, valor: string) {
  for (let i = 0; i < 20; i++) {
    if ((select as HTMLSelectElement).value === valor) return;
    await new Promise((r) => setTimeout(r, 10));
  }
}

describe("PanelNavLinks: navegación lateral", () => {
  it("12. los módulos vivos son anclas de hash y Resumen queda activo por defecto", () => {
    render(<PanelNavLinks variante="sidebar" />);

    const resumen = screen.getByRole("link", { name: "Resumen" });
    expect(resumen).toHaveAttribute("href", "#resumen");
    expect(resumen).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Resultados" })).toHaveAttribute(
      "href",
      "#resultados",
    );
    expect(screen.getByRole("link", { name: "Encuesta" })).toHaveAttribute(
      "href",
      "#encuesta",
    );
    expect(screen.getByRole("link", { name: "Reseñas" })).toHaveAttribute(
      "href",
      "#resenas",
    );
  });

  it("13. Códigos QR y Ajustes quedan visibles pero deshabilitados, sin href", () => {
    render(<PanelNavLinks variante="topbar" />);

    for (const nombre of ["Códigos QR", "Ajustes"]) {
      const item = screen.getByRole("link", { name: nombre });
      expect(item).toHaveAttribute("aria-disabled", "true");
      expect(item).not.toHaveAttribute("href");
    }

    // Reseñas ya es un módulo vivo: enlace real, nunca deshabilitado.
    const resenas = screen.getByRole("link", { name: "Reseñas" });
    expect(resenas).toHaveAttribute("href", "#resenas");
    expect(resenas).not.toHaveAttribute("aria-disabled");
  });
});
