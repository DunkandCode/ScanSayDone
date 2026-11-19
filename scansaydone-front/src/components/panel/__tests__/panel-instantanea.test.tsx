/// <reference types="vitest/globals" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PanelPage from "@/app/(panel)/panel/page";
import { limpiarCacheEmpresas } from "@/lib/api/empresas";
import type { EncuestaEmpresa } from "@/lib/api/encuesta";
import { formatear1 } from "@/lib/panel/calculos";

/**
 * Integración: dentro de la pestaña Resultados, el selector alimenta los
 * resultados de la instantánea. Cambiar de negocio en el `<select>` cambia
 * los números que se ven. Los bloques de ejemplo del panel anterior
 * (chip DEMO, interruptor, pie con declaración) ya no existen.
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

describe("Panel: resultados que reaccionan al selector", () => {
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

  it("en la pestaña Resultados aparece la etiqueta de datos de prueba y las cifras del negocio inicial", async () => {
    render(<PanelPage />);

    // Abrir la pestaña Resultados.
    fireEvent.click(screen.getByRole("tab", { name: "Resultados" }));

    // Sección con la etiqueta obligatoria.
    expect(
      await screen.findByRole("heading", { name: "Resultados de este negocio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Datos de prueba locales · instantánea del 18-11-2026 · no son clientes reales",
      ),
    ).toBeInTheDocument();

    // Negocio inicial (id 1): 15 respuestas, media 9,3, recomendación neta 86,7.
    expect(await screen.findByText("86,7")).toBeInTheDocument();
    expect(screen.getByText("9,3")).toBeInTheDocument();
  });

  it("cambiar el negocio en el selector cambia los números", async () => {
    render(<PanelPage />);

    fireEvent.click(screen.getByRole("tab", { name: "Resultados" }));

    // Esperar la carga inicial del negocio 1.
    expect(await screen.findByText("86,7")).toBeInTheDocument();

    const select = screen.getByLabelText("Negocio");
    await waitFor(() =>
      expect((select as HTMLSelectElement).value).toBe("1"),
    );

    fireEvent.change(select, { target: { value: "3" } });

    // Empresa 3: media 7,1 y recomendación neta -20.
    expect(await screen.findByText("7,1")).toBeInTheDocument();
    expect(screen.getByText(formatear1(-20))).toBeInTheDocument();
    // Los números del negocio anterior ya no están.
    expect(screen.queryByText("86,7")).not.toBeInTheDocument();

    // La definición de encuesta vive en su propia pestaña.
    fireEvent.click(screen.getByRole("tab", { name: "Encuesta" }));
    expect(
      await screen.findByRole("heading", {
        name: "Encuesta definida para este negocio",
      }),
    ).toBeInTheDocument();
  });

  it("los bloques de ejemplo del panel anterior ya no existen", async () => {
    render(<PanelPage />);

    // Ni chip DEMO, ni interruptor, ni pie con la declaración vieja,
    // en Resumen ni en Resultados.
    expect(screen.queryByText("DEMO")).not.toBeInTheDocument();
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Panel de ejemplo con datos inventados/),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Resultados" }));
    expect(await screen.findByText("86,7")).toBeInTheDocument();

    expect(screen.queryByText("DEMO")).not.toBeInTheDocument();
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Panel de ejemplo con datos inventados/),
    ).not.toBeInTheDocument();
  });
});
