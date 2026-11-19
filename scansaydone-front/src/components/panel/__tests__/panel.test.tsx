/// <reference types="vitest/globals" />
import { render, screen, within, fireEvent } from "@testing-library/react";
import PanelPage from "@/app/(panel)/panel/page";
import { PanelNavLinks } from "@/components/panel/panel-nav";
import { limpiarCacheEmpresas } from "@/lib/api/empresas";
import type { EncuestaEmpresa } from "@/lib/api/encuesta";

/**
 * Panel reestructurado: Resumen (por defecto), Resultados y Encuesta son
 * pestañas de una sola página. Todos los números visibles salen de la
 * instantánea local (60 respuestas, 4 empresas); nada del dataset de
 * ejemplo anterior (486 / 8,5 / canales / últimas respuestas) puede
 * aparecer.
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

const EMPRESAS_API: Record<number, EncuestaEmpresa> = {
  1: payloadEncuesta(1, "Minimarket Don Lucho"),
  2: payloadEncuesta(2, "Café Rincón Andino"),
  3: payloadEncuesta(3, "Peluquería Estilo Sur"),
  4: payloadEncuesta(4, "Cosmos Accesorios (Instagram)"),
};

/** Ids 1..4 responden 200 con encuesta; el resto 404 (sondeo de lista). */
function stubFetchListaReal() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const m = String(url).match(/\/api\/v1\/empresas\/(\d+)\/encuesta$/);
      const id = m ? Number(m[1]) : 0;
      if (EMPRESAS_API[id]) {
        return {
          status: 200,
          ok: true,
          headers: {
            get: (nombre: string) =>
              nombre.toLowerCase() === "content-type"
                ? "application/json"
                : null,
          },
          json: async () => EMPRESAS_API[id],
        };
      }
      return { status: 404, ok: false, json: async () => ({}) };
    }),
  );
}

function abrirPestana(nombre: "Resumen" | "Resultados" | "Encuesta" | "Reseñas") {
  fireEvent.click(screen.getByRole("tab", { name: nombre }));
}

describe("PanelPage: pestañas con datos reales", () => {
  beforeEach(() => {
    stubFetchListaReal();
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

    // Resultados, Encuesta y Reseñas existen como pestañas no seleccionadas.
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

  it("2. la etiqueta obligatoria de datos de prueba está presente", () => {
    render(<PanelPage />);
    expect(
      screen.getByText(
        "Datos de prueba locales · instantánea del 18-11-2026 · no son clientes reales",
      ),
    ).toBeInTheDocument();
  });

  it("3. las cifras reales del resumen: 60 respuestas, 4 empresas, media 8,1 y recomendación neta 36,7", () => {
    render(<PanelPage />);

    expect(screen.getByText("60")).toBeInTheDocument(); // Respuestas
    expect(screen.getByText("8,1")).toBeInTheDocument(); // Media general
    expect(screen.getByText("36,7")).toBeInTheDocument(); // Recomendación neta general

    // "4" también existe como etiqueta de nota en la distribución: se
    // consulta dentro de la tarjeta de la cifra Empresas.
    const tarjetaEmpresas = screen.getByText("Empresas").closest("div");
    expect(tarjetaEmpresas).toBeInTheDocument();
    expect(within(tarjetaEmpresas!).getByText("4")).toBeInTheDocument();
  });

  it("4. la distribución tiene 11 filas reales y la tabla 4 empresas en orden de id", () => {
    render(<PanelPage />);

    const distribucion = document.querySelector(
      'ul[aria-label="Cantidad de respuestas por nota, de la 0 a la 10"]',
    );
    expect(distribucion).toBeInTheDocument();
    expect(distribucion!.children).toHaveLength(11);

    const comparacion = document.querySelector(
      'ul[aria-label="Recomendación neta de cada negocio"]',
    );
    expect(comparacion).toBeInTheDocument();
    expect(comparacion!.children).toHaveLength(4);

    const tbody = document.querySelector("tbody");
    expect(tbody).toBeInTheDocument();
    const filas = within(tbody!).getAllByRole("row");
    expect(filas).toHaveLength(4);
    expect(filas[0]).toHaveTextContent(/Minimarket Don Lucho/);
    expect(filas[1]).toHaveTextContent(/Café Rincón Andino/);
    expect(filas[2]).toHaveTextContent(/Peluquería Estilo Sur/);
    expect(filas[3]).toHaveTextContent(/Cosmos Accesorios \(Instagram\)/);
  });

  it("5. nada del dataset de ejemplo anterior aparece en el panel", () => {
    render(<PanelPage />);

    expect(screen.queryByText("486")).not.toBeInTheDocument();
    expect(screen.queryByText("8,5")).not.toBeInTheDocument();

    const texto = document.body.textContent ?? "";
    expect(texto).not.toContain("486");
    expect(texto).not.toContain("8,5");
    expect(texto).not.toContain("Canales");
    expect(texto).not.toContain("Últimas respuestas");
    expect(texto).not.toContain("datos de ejemplo");
    expect(texto).not.toContain("DEMO");
    expect(texto).not.toContain("Panel de ejemplo");
  });

  it("6. las pestañas cambian de panel: Resultados y Encuesta con su selector", async () => {
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
    // Tras resolver la lista aparecen los resultados del negocio inicial.
    expect(
      await screen.findByRole("heading", { name: "Resultados de este negocio" }),
    ).toBeInTheDocument();

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

  it("6b. la pestaña Reseñas muestra el selector y el módulo del negocio", async () => {
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

    // La lista del negocio inicial (Minimarket Don Lucho, id 1) llega con
    // sus 15 reseñas y el conteo visible.
    expect(
      await screen.findByText("15 reseñas · 10 con comentario · 0 con alerta"),
    ).toBeInTheDocument();
    expect(screen.getByText("Mostrando 15 de 15 reseñas")).toBeInTheDocument();
  });

  it("7. navegación por teclado: la flecha derecha activa y enfoca Resultados", () => {
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

  it("8. el hash sincroniza la pestaña (enlaces de la navegación lateral)", () => {
    render(<PanelPage />);

    // Un clic en la barra lateral cambia el hash; la página escucha
    // hashchange y cambia de pestaña.
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

  it("9. activar una pestaña actualiza el hash de la URL", () => {
    render(<PanelPage />);

    abrirPestana("Resultados");
    expect(window.location.hash).toBe("#resultados");
  });
});

describe("PanelNavLinks: navegación lateral", () => {
  it("10. los módulos vivos son anclas de hash y Resumen queda activo por defecto", () => {
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

  it("11. Códigos QR y Ajustes quedan visibles pero deshabilitados, sin href", () => {
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
