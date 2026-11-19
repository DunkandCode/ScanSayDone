/// <reference types="vitest/globals" />
import {
  listarEmpresas,
  limpiarCacheEmpresas,
  MAX_SONDEO,
} from "@/lib/api/empresas";
import type { EncuestaEmpresa } from "@/lib/api/encuesta";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function payloadEncuesta(
  id: number,
  nombre = `Negocio ${id}`,
  rubro = "Rubro general",
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

type RespuestaHttp =
  | { status: number; payload?: unknown; contentType?: string }
  | { rechazar: true };

/** Cabeceras mínimas de una Response para el guard de Content-Type. */
function cabecerasHttp(contentType: string) {
  return {
    get: (nombre: string) =>
      nombre.toLowerCase() === "content-type" ? contentType : null,
  };
}

function stubFetchPorId(
  reglas: Record<number, RespuestaHttp>,
  salud: RespuestaHttp = { status: 404 },
) {
  const llamadas: string[] = [];
  const fetchMock = vi.fn(async (url: string) => {
    llamadas.push(url);
    if (/\/health$/.test(url)) {
      if ("rechazar" in salud) throw new TypeError("Failed to fetch");
      return {
        status: salud.status,
        ok: salud.status === 200,
        json: async () => ({}),
      };
    }
    const m = url.match(/\/api\/v1\/empresas\/(\d+)\/encuesta$/);
    const id = m ? Number(m[1]) : 0;
    const regla = reglas[id];
    if (!regla) return { status: 404, ok: false, json: async () => ({}) };
    if ("rechazar" in regla) throw new TypeError("Failed to fetch");
    return {
      status: regla.status,
      ok: regla.status === 200,
      headers: cabecerasHttp(regla.contentType ?? "application/json"),
      json: async () => regla.payload,
    };
  });
  vi.stubGlobal("fetch", fetchMock);
  return { fetchMock, llamadas };
}

function idsLlamados(llamadas: string[]): number[] {
  return llamadas
    .map((u) => u.match(/\/empresas\/(\d+)\//)?.[1])
    .filter(Boolean)
    .map(Number);
}

/* ── Suite ────────────────────────────────────────────────────────────────── */

describe("listarEmpresas (sondeo controlado)", () => {
  beforeEach(() => {
    limpiarCacheEmpresas();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    limpiarCacheEmpresas();
  });

  it("1. con 200 y 404 mezclados, devuelve solo las encontradas", async () => {
    stubFetchPorId({
      1: { status: 200, payload: payloadEncuesta(1, "Minimarket Don Lucho", "Alimentos") },
      2: { status: 404 },
      3: { status: 200, payload: payloadEncuesta(3, "Café Rincón Andino", "Cafetería") },
    });

    const resultado = await listarEmpresas();

    expect(resultado.estado).toBe("ok");
    if (resultado.estado !== "ok") return;
    expect(resultado.empresas.map((e) => e.empresaId)).toEqual([1, 3]);
    expect(resultado.empresas[0]).toEqual({
      empresaId: 1,
      nombre: "Minimarket Don Lucho",
      rubro: "Alimentos",
    });
    expect(resultado.empresas[1].nombre).toBe("Café Rincón Andino");
  });

  it("2. sondea exactamente los ids 1..MAX_SONDEO cuando todos responden", async () => {
    const { llamadas } = stubFetchPorId({
      1: { status: 200, payload: payloadEncuesta(1) },
    });

    await listarEmpresas();

    expect(idsLlamados(llamadas).sort((a, b) => a - b)).toEqual(
      Array.from({ length: MAX_SONDEO }, (_, i) => i + 1),
    );
  });

  it("3. un 503 aborta los lotes restantes y devuelve no-disponible", async () => {
    const { llamadas } = stubFetchPorId({
      1: { status: 503 },
    });

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
    // Solo el primer lote (ids 1-3) se disparó; nada del id 4 en adelante.
    const ids = idsLlamados(llamadas);
    expect(ids.every((id) => id <= 3)).toBe(true);
    expect(ids.length).toBeLessThanOrEqual(3);
  });

  it("4. un fallo de red (fetch que revienta) también es no-disponible", async () => {
    stubFetchPorId({ 1: { rechazar: true } });

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
  });

  it("5. un payload malformado se salta sin tumbar la lista", async () => {
    stubFetchPorId({
      1: { status: 200, payload: { esto: "no es una encuesta" } },
      2: { status: 200, payload: payloadEncuesta(2, "Peluquería Estilo Sur", "Belleza") },
    });

    const resultado = await listarEmpresas();

    expect(resultado.estado).toBe("ok");
    if (resultado.estado !== "ok") return;
    expect(resultado.empresas.map((e) => e.empresaId)).toEqual([2]);
  });

  it("6. la cache evita repetir el sondeo dentro del TTL", async () => {
    const { fetchMock } = stubFetchPorId({
      1: { status: 200, payload: payloadEncuesta(1) },
    });

    const primera = await listarEmpresas();
    const llamadasTrasPrimera = fetchMock.mock.calls.length;

    const segunda = await listarEmpresas();

    expect(fetchMock.mock.calls.length).toBe(llamadasTrasPrimera);
    expect(segunda).toEqual(primera);
  });

  it("7. limpiarCacheEmpresas resetea la cache y vuelve a sondear", async () => {
    const { fetchMock } = stubFetchPorId({
      1: { status: 200, payload: payloadEncuesta(1) },
    });

    await listarEmpresas();
    const llamadasAntes = fetchMock.mock.calls.length;
    expect(llamadasAntes).toBe(MAX_SONDEO);

    limpiarCacheEmpresas();
    await listarEmpresas();

    expect(fetchMock.mock.calls.length).toBe(MAX_SONDEO * 2);
  });

  /* ── Diagnóstico del vacío vía /health ─────────────────────────────────── */

  it("8. todos 404 y /health 200 → estado vacio (servicio vivo, base sin sembrar)", async () => {
    const { llamadas } = stubFetchPorId({}, { status: 200 });

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "vacio" });
    // El diagnóstico consultó /health exactamente una vez.
    expect(llamadas.filter((u) => /\/health$/.test(u))).toHaveLength(1);
  });

  it("9. el estado vacio se cachea 60 s (no repite sondeo ni /health)", async () => {
    const { fetchMock } = stubFetchPorId({}, { status: 200 });

    await listarEmpresas();
    const llamadasTrasPrimera = fetchMock.mock.calls.length;

    const segunda = await listarEmpresas();

    expect(fetchMock.mock.calls.length).toBe(llamadasTrasPrimera);
    expect(segunda).toEqual({ estado: "vacio" });
  });

  it("10. todos 404 y /health caído (red) → no-disponible", async () => {
    stubFetchPorId({}, { rechazar: true });

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
  });

  it("11. todos 404 y /health 503 → no-disponible", async () => {
    stubFetchPorId({}, { status: 503 });

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
  });

  it("12. con al menos un 200 no se consulta /health", async () => {
    const { llamadas } = stubFetchPorId(
      { 1: { status: 200, payload: payloadEncuesta(1) } },
      { status: 200 },
    );

    await listarEmpresas();

    expect(llamadas.filter((u) => /\/health$/.test(u))).toHaveLength(0);
  });

  it("13. el 503 aborta sin consultar /health", async () => {
    const { llamadas } = stubFetchPorId(
      { 1: { status: 503 } },
      { status: 200 },
    );

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
    expect(llamadas.filter((u) => /\/health$/.test(u))).toHaveLength(0);
  });

  it("14. 404 + error de payload mixto → no-disponible (la API no contestó limpia)", async () => {
    // Id 1: la API responde 200 pero el payload es ilegible; el resto 404.
    // El estado `ok` con lista vacía ya no existe: sin sondeo limpio no se
    // certifica "base vacía", ni siquiera con /health en 200.
    const { llamadas } = stubFetchPorId(
      { 1: { status: 200, payload: { esto: "no es una encuesta" } } },
      { status: 200 },
    );

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
    // Cero empresas → /health SIEMPRE se consulta.
    expect(llamadas.filter((u) => /\/health$/.test(u))).toHaveLength(1);
  });

  /* ── 5xx del upstream: el bug del proxy con el backend caído ──────────── */

  it("15. un 500 en un probe + /health caído → no-disponible (bug original)", async () => {
    // Escenario real: backend caído, el rewrite de next dev devuelve 500.
    const { llamadas } = stubFetchPorId(
      { 1: { status: 500 } },
      { rechazar: true },
    );

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
    // El 5xx aborta el sondeo: no hay lotes siguientes ni /health.
    expect(llamadas.filter((u) => /\/health$/.test(u))).toHaveLength(0);
  });

  it("16. un 500 en un probe + /health 200 → igual no-disponible", async () => {
    // Aunque /health responda, los probes 5xx del upstream ganan: la lista
    // no puede construirse.
    stubFetchPorId({ 1: { status: 500 } }, { status: 200 });

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
  });

  it("17. todos los probes 200 con text/html + /health 200 → no-disponible (no se parsea HTML)", async () => {
    // El proxy responde HTML (p. ej. página de error) con status 200: sin
    // Content-Type JSON no hay nada que leer.
    const reglas = Object.fromEntries(
      Array.from({ length: MAX_SONDEO }, (_, i) => [
        i + 1,
        {
          status: 200,
          contentType: "text/html; charset=utf-8",
          payload: "<html>Bad Gateway</html>",
        },
      ]),
    );

    stubFetchPorId(reglas, { status: 200 });

    const resultado = await listarEmpresas();

    expect(resultado).toEqual({ estado: "no-disponible" });
  });
});