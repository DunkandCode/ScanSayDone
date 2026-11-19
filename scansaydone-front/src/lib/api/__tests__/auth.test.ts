/// <reference types="vitest/globals" />
import { describe, expect, it, vi } from "vitest";
import { iniciarSesion, validarSesionLogin } from "@/lib/api/auth";

/**
 * iniciarSesion: mapeo de estados del contrato de
 * `POST /api/v1/auth/login` (200/401/422/5xx/no-JSON/shape inválido).
 */

interface OpcionesRespuesta {
  status: number;
  cuerpo?: unknown;
  contentType?: string;
}

/** Respuesta fetch mínima con headers.get (lo único que usa el cliente). */
function respuestaHttp({
  status,
  cuerpo = {},
  contentType = "application/json",
}: OpcionesRespuesta) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: {
      get: (nombre: string) =>
        nombre.toLowerCase() === "content-type" ? contentType : null,
    },
    json: async () => cuerpo,
  };
}

const CREDENCIALES = { usuario: "minimarket_don_lucho", contrasena: "secreta" };

function stubFetch(valor: OpcionesRespuesta | Error) {
  const fn = vi.fn(async () => {
    if (valor instanceof Error) throw valor;
    return respuestaHttp(valor);
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("iniciarSesion: clasificación de estados", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("1. 200 válido → ok con la sesión de la API", async () => {
    const fetchMock = stubFetch({
      status: 200,
      cuerpo: {
        usuario: "minimarket_don_lucho",
        empresa_id: 1,
        nombre_negocio: "Minimarket Don Lucho",
      },
    });

    const resultado = await iniciarSesion(CREDENCIALES);

    expect(resultado).toEqual({
      estado: "ok",
      sesion: {
        usuario: "minimarket_don_lucho",
        empresa_id: 1,
        nombre_negocio: "Minimarket Don Lucho",
      },
    });

    // POST JSON a la ruta relativa del login (el proxy la dirige al
    // backend en dev, el rewrite en producción).
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/v1/auth/login");
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body as string)).toEqual(CREDENCIALES);
  });

  it("2. 401 → credenciales (sin distinguir usuario de contraseña)", async () => {
    stubFetch({
      status: 401,
      cuerpo: { detail: "Usuario o contraseña incorrectos." },
    });

    expect(await iniciarSesion(CREDENCIALES)).toEqual({ estado: "credenciales" });
  });

  it("3. 422 → datos-invalidos", async () => {
    stubFetch({ status: 422, cuerpo: { detail: "Validación fallida" } });

    expect(await iniciarSesion(CREDENCIALES)).toEqual({ estado: "datos-invalidos" });
  });

  it("4. 5xx (500/503) → no-disponible", async () => {
    for (const status of [500, 503]) {
      stubFetch({ status, cuerpo: {} });
      expect(await iniciarSesion(CREDENCIALES)).toEqual({ estado: "no-disponible" });
      vi.unstubAllGlobals();
    }
  });

  it("5. 200 con text/html → error (no es una respuesta del backend)", async () => {
    stubFetch({
      status: 200,
      contentType: "text/html; charset=utf-8",
      cuerpo: "<html>proxy</html>",
    });

    expect(await iniciarSesion(CREDENCIALES)).toEqual({ estado: "error" });
  });

  it("6. 200 JSON con shape inválido → error", async () => {
    stubFetch({
      status: 200,
      // empresa_id no es entero ≥1: la forma no calza.
      cuerpo: { usuario: "alguien", empresa_id: 0, nombre_negocio: "Negocio" },
    });

    expect(await iniciarSesion(CREDENCIALES)).toEqual({ estado: "error" });
  });

  it("7. error de red → no-disponible", async () => {
    stubFetch(new TypeError("Failed to fetch"));

    expect(await iniciarSesion(CREDENCIALES)).toEqual({ estado: "no-disponible" });
  });
});

describe("validarSesionLogin: forma del payload", () => {
  it("rechaza formas incompletas o con tipos incorrectos", () => {
    expect(validarSesionLogin(null)).toBeNull();
    expect(validarSesionLogin({})).toBeNull();
    expect(validarSesionLogin({ usuario: "u", empresa_id: 1 })).toBeNull();
    expect(
      validarSesionLogin({ usuario: "u", empresa_id: "1", nombre_negocio: "N" }),
    ).toBeNull();
    expect(
      validarSesionLogin({ usuario: 1, empresa_id: 1, nombre_negocio: "N" }),
    ).toBeNull();
  });

  it("acepta la forma exacta de la API", () => {
    expect(
      validarSesionLogin({
        usuario: "cafe_rincon_andino",
        empresa_id: 2,
        nombre_negocio: "Café Rincón Andino",
      }),
    ).toEqual({
      usuario: "cafe_rincon_andino",
      empresa_id: 2,
      nombre_negocio: "Café Rincón Andino",
    });
  });
});
