/**
 * Cliente del endpoint de inicio de sesión:
 * `POST /api/v1/auth/login`
 *
 * Espejo de `src/lib/api/panel.ts` / `src/lib/api/encuesta.ts` (mismo
 * contrato de estados):
 * - URL relativa (`/api/v1/...`) + base opcional de `src/lib/config/api.ts`
 *   (en dev el proxy de `next.config.ts` ya apunta a producción).
 * - Timeout de 15 s con `AbortController`: el backend valida la contraseña
 *   con PBKDF2 y tarda 0,5–0,9 s; un timeout corto trataría un login sano
 *   como fallo. Se puede pasar un `signal` externo.
 * - La función nunca rechaza: todo sale por la unión discriminada
 *   `ResultadoLogin`:
 *   - 200 válido → `ok` (con la sesión).
 *   - 401 → `credenciales` (usuario o contraseña incorrectos).
 *   - 422 → `datos-invalidos` (validación del backend).
 *   - 5xx → `no-disponible` (el upstream falló).
 *   - Otro 4xx, 200 sin `Content-Type: application/json` (HTML del proxy)
 *     o payload con forma inválida → `error`.
 *   - Error de red o timeout → `no-disponible`.
 * - Validación defensiva con `unknown` + type guards (sin `any`).
 * - La API no entrega token: la sesión es solo el payload `{usuario,
 *   empresa_id, nombre_negocio}`.
 */
import { apiConfig } from "@/lib/config/api";

// ── Tipos del contrato ──────────────────────────────────────────────────────

/** Credenciales del formulario: `{usuario, contrasena}` (nombres de la API). */
export interface CredencialesLogin {
  usuario: string;
  contrasena: string;
}

/** Sesión que devuelve la API en el 200 (sin token). */
export interface SesionUsuario {
  usuario: string;
  empresa_id: number;
  nombre_negocio: string;
}

// ── Resultado discriminado ──────────────────────────────────────────────────

export type ResultadoLogin =
  | { estado: "ok"; sesion: SesionUsuario }
  | { estado: "credenciales" }
  | { estado: "datos-invalidos" }
  | { estado: "no-disponible" }
  | { estado: "error" };

// ── Constantes ──────────────────────────────────────────────────────────────

/** 15 s: el login real tarda 0,5–0,9 s (PBKDF2); margen para redes lentas. */
const TIMEOUT_MS = 15000;

// ── Guards de validación (sin `any`) ────────────────────────────────────────

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function esTextoNoVacio(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

/**
 * Valida la forma del payload de sesión. Exportada para pruebas.
 * Ante cualquier campo faltante o con tipo incorrecto devuelve `null`;
 * nunca lanza.
 */
export function validarSesionLogin(payload: unknown): SesionUsuario | null {
  if (!esObjeto(payload)) return null;
  const { usuario, empresa_id, nombre_negocio } = payload;
  if (!esTextoNoVacio(usuario)) return null;
  if (!esEnteroPositivo(empresa_id)) return null;
  if (!esTextoNoVacio(nombre_negocio)) return null;
  return { usuario, empresa_id, nombre_negocio };
}

// ── Función pública ─────────────────────────────────────────────────────────

export async function iniciarSesion(
  datos: CredencialesLogin,
  signal?: AbortSignal,
): Promise<ResultadoLogin> {
  const url = `${apiConfig.baseUrl}/api/v1/auth/login`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Encadenar un signal externo sin acoplar los timers de quien llama.
  const onAbortExterno = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onAbortExterno, { once: true });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(datos),
    });

    // 401: la API respondió, pero el usuario o la contraseña no calzan.
    if (res.status === 401) return { estado: "credenciales" };
    // 422: la validación del backend rechazó el cuerpo enviado.
    if (res.status === 422) return { estado: "datos-invalidos" };
    // Todo 5xx es un fallo del upstream (backend caído, proxy sin destino).
    if (res.status >= 500) return { estado: "no-disponible" };
    if (!res.ok) return { estado: "error" };

    // Un 200 cuyo cuerpo no se declara JSON (HTML del proxy, texto plano)
    // no es una respuesta del backend: fallar sin intentar parsearlo.
    const tipoContenido = res.headers.get("content-type") ?? "";
    if (!tipoContenido.toLowerCase().includes("application/json")) {
      return { estado: "error" };
    }

    let payload: unknown;
    try {
      payload = await res.json();
    } catch {
      return { estado: "error" };
    }

    const sesion = validarSesionLogin(payload);
    if (sesion === null) return { estado: "error" };
    return { estado: "ok", sesion };
  } catch {
    // AbortError (timeout o signal externo) y errores de red (TypeError):
    // en ambos casos no se pudo consultar el servicio.
    return { estado: "no-disponible" };
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener("abort", onAbortExterno);
  }
}
