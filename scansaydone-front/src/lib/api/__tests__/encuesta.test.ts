/// <reference types="vitest/globals" />
import { obtenerEncuestaEmpresa } from "@/lib/api/encuesta";
import type { EncuestaEmpresa } from "@/lib/api/encuesta";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function payloadValido(id: number): EncuestaEmpresa {
  return {
    empresa_id: id,
    nombre_negocio: `Negocio ${id}`,
    rubro: "Rubro general",
    preguntas: {
      p1: { texto: "¿Qué nota le pones a la atención?", escala: [0, 10] },
      p2: { texto: "¿Qué nota le pones al lugar?", escala: [0, 10] },
      p3: { texto: "¿Volverías?", etiqueta: "Sí / No", escala: [0, 1] },
      p4: { texto: "¿Lo recomiendas?", etiqueta: "Sí / No", escala: [0, 1] },
      p5: { texto: "Cuéntanos qué pasó", max_caracteres: 500 },
    },
  };
}

/** Response mínima para el cliente: status, cabeceras y cuerpo JSON. */
function respuestaHttp(
  status: number,
  payload: unknown,
  contentType = "application/json",
) {
  const json = vi.fn(async () => payload);
  const res = {
    status,
    ok: status === 200,
    headers: {
      get: (nombre: string) =>
        nombre.toLowerCase() === "content-type" ? contentType : null,
    },
    json: json as unknown as () => Promise<unknown>,
  };
  return { res, json };
}

/* ── Suite ────────────────────────────────────────────────────────────────── */

describe("obtenerEncuestaEmpresa: clasificación de estados", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("1. 404 → no-encontrada", async () => {
    const { res } = respuestaHttp(404, {});
    vi.stubGlobal("fetch", vi.fn(async () => res));

    expect(await obtenerEncuestaEmpresa(7)).toEqual({ estado: "no-encontrada" });
  });

  it("2. todo 5xx (500/502/503/504) → no-disponible, sin parsear cuerpo", async () => {
    for (const status of [500, 502, 503, 504]) {
      const { res, json } = respuestaHttp(status, { error: "upstream" });
      vi.stubGlobal("fetch", vi.fn(async () => res));

      // El 500 del proxy de next dev con el backend caído entra aquí.
      expect(await obtenerEncuestaEmpresa(1)).toEqual({ estado: "no-disponible" });
      expect(json).not.toHaveBeenCalled();
    }
  });

  it("3. 4xx distinto de 404 (400/409/422) → error", async () => {
    for (const status of [400, 409, 422]) {
      const { res } = respuestaHttp(status, {});
      vi.stubGlobal("fetch", vi.fn(async () => res));

      expect(await obtenerEncuestaEmpresa(1)).toEqual({ estado: "error" });
    }
  });

  it("4. 200 con JSON válido → ok", async () => {
    const { res } = respuestaHttp(200, payloadValido(3));
    vi.stubGlobal("fetch", vi.fn(async () => res));

    const resultado = await obtenerEncuestaEmpresa(3);

    expect(resultado.estado).toBe("ok");
    if (resultado.estado === "ok") {
      expect(resultado.encuesta.nombre_negocio).toBe("Negocio 3");
    }
  });

  it("5. 200 con application/json; charset=utf-8 también es ok", async () => {
    const { res } = respuestaHttp(
      200,
      payloadValido(1),
      "application/json; charset=utf-8",
    );
    vi.stubGlobal("fetch", vi.fn(async () => res));

    expect((await obtenerEncuestaEmpresa(1)).estado).toBe("ok");
  });

  it("6. 200 con text/html → error y NO se intenta parsear el cuerpo", async () => {
    const { res, json } = respuestaHttp(
      200,
      "<html>Bad Gateway</html>",
      "text/html; charset=utf-8",
    );
    vi.stubGlobal("fetch", vi.fn(async () => res));

    expect(await obtenerEncuestaEmpresa(1)).toEqual({ estado: "error" });
    expect(json).not.toHaveBeenCalled();
  });

  it("7. 200 con JSON pero payload inválido → error", async () => {
    const { res } = respuestaHttp(200, { esto: "no es una encuesta" });
    vi.stubGlobal("fetch", vi.fn(async () => res));

    expect(await obtenerEncuestaEmpresa(1)).toEqual({ estado: "error" });
  });

  it("8. fallo de red (fetch que revienta) → no-disponible", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    expect(await obtenerEncuestaEmpresa(1)).toEqual({ estado: "no-disponible" });
  });
});
