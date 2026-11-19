/// <reference types="vitest/globals" />
import { obtenerPanelEmpresa, validarPanel } from "@/lib/api/panel";
import { payloadPanelReal } from "@/test/fixtures/panel";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

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

describe("obtenerPanelEmpresa: clasificación de estados", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("1. 200 con JSON válido → ok, con empresa, agregado y respuestas", async () => {
    const { res } = respuestaHttp(200, payloadPanelReal(1));
    vi.stubGlobal("fetch", vi.fn(async () => res));

    const resultado = await obtenerPanelEmpresa(1);

    expect(resultado.estado).toBe("ok");
    if (resultado.estado === "ok") {
      expect(resultado.panel.empresa.nombre_negocio).toBe("Minimarket Don Lucho");
      expect(resultado.panel.agregado.respuestas).toBe(20);
      expect(resultado.panel.respuestas).toHaveLength(20);
      // creado_en no se usa: el tipo no lo contempla y el fixture no lo trae.
      expect(
        Object.prototype.hasOwnProperty.call(
          resultado.panel.respuestas[0],
          "creado_en",
        ),
      ).toBe(false);
    }
  });

  it("2. 404 → no-encontrada", async () => {
    const { res } = respuestaHttp(404, {});
    vi.stubGlobal("fetch", vi.fn(async () => res));

    expect(await obtenerPanelEmpresa(7)).toEqual({ estado: "no-encontrada" });
  });

  it("3. todo 5xx (500/502/503/504) → no-disponible, sin parsear cuerpo", async () => {
    for (const status of [500, 502, 503, 504]) {
      const { res, json } = respuestaHttp(status, { error: "upstream" });
      vi.stubGlobal("fetch", vi.fn(async () => res));

      // El 500 del proxy de next dev con el backend caído entra aquí.
      expect(await obtenerPanelEmpresa(1)).toEqual({ estado: "no-disponible" });
      expect(json).not.toHaveBeenCalled();
    }
  });

  it("4. 4xx distinto de 404 (400/409/422) → error", async () => {
    for (const status of [400, 409, 422]) {
      const { res } = respuestaHttp(status, {});
      vi.stubGlobal("fetch", vi.fn(async () => res));

      expect(await obtenerPanelEmpresa(1)).toEqual({ estado: "error" });
    }
  });

  it("5. 200 con application/json; charset=utf-8 también es ok", async () => {
    const { res } = respuestaHttp(
      200,
      payloadPanelReal(2),
      "application/json; charset=utf-8",
    );
    vi.stubGlobal("fetch", vi.fn(async () => res));

    expect((await obtenerPanelEmpresa(2)).estado).toBe("ok");
  });

  it("6. 200 con text/html → error y NO se intenta parsear el cuerpo", async () => {
    const { res, json } = respuestaHttp(
      200,
      "<html>Bad Gateway</html>",
      "text/html; charset=utf-8",
    );
    vi.stubGlobal("fetch", vi.fn(async () => res));

    expect(await obtenerPanelEmpresa(1)).toEqual({ estado: "error" });
    expect(json).not.toHaveBeenCalled();
  });

  it("7. 200 con JSON pero shape inválido → error", async () => {
    const { res } = respuestaHttp(200, { esto: "no es un panel" });
    vi.stubGlobal("fetch", vi.fn(async () => res));

    expect(await obtenerPanelEmpresa(1)).toEqual({ estado: "error" });
  });

  it("8. fallo de red (fetch que revienta) → no-disponible", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    expect(await obtenerPanelEmpresa(1)).toEqual({ estado: "no-disponible" });
  });
});

/* ── validarPanel: casos puntuales de shape ───────────────────────────────── */

describe("validarPanel (defensivo)", () => {
  it("acepta el payload real del fixture", () => {
    expect(validarPanel(payloadPanelReal(3))).not.toBeNull();
  });

  it("rechaza agregado sin serie_diaria", () => {
    const payload = payloadPanelReal(1);
    delete (payload.agregado as Record<string, unknown>).serie_diaria;
    expect(validarPanel(payload)).toBeNull();
  });

  it("rechaza respuesta con p1_nps fuera de 0..10", () => {
    const payload = payloadPanelReal(1);
    (payload.respuestas as Record<string, unknown>[])[0].p1_nps = 11;
    expect(validarPanel(payload)).toBeNull();
  });

  it("rechaza respuesta con alerta string (la API manda boolean)", () => {
    const payload = payloadPanelReal(1);
    (payload.respuestas as Record<string, unknown>[])[0].alerta = "sí";
    expect(validarPanel(payload)).toBeNull();
  });

  it("rechaza fecha que no calza con YYYY-MM-DD", () => {
    const payload = payloadPanelReal(1);
    (payload.respuestas as Record<string, unknown>[])[0].fecha = "31-10-2026";
    expect(validarPanel(payload)).toBeNull();
  });
});
