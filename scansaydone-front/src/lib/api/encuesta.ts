/**
 * Cliente del único endpoint de lectura del backend:
 * `GET /api/v1/empresas/{empresa_id}/encuesta`
 *
 * - URL relativa (el rewrite de Vercel la dirige al backend); sin hosts
 *   hardcodeados. Base opcional vía `NEXT_PUBLIC_API_BASE_URL` (ver
 *   `src/lib/config/api.ts`).
 * - Timeout de 5 s con `AbortController`; se puede pasar un `signal` externo
 *   (p. ej. al desmontar un componente).
 * - La función nunca rechaza: todo resultado sale por la unión discriminada
 *   `ResultadoEncuesta`:
 *   - 404 → `no-encontrada`.
 *   - 5xx (500, 502, 503, 504…) → `no-disponible`: el upstream falló, no
 *     es un "no hay datos". Incluye el 500 que devuelve el proxy de
 *     `next dev` cuando el backend está caído.
 *   - Otro 4xx → `error`.
 *   - Error de red o timeout → `no-disponible`.
 *   - 200 sin `Content-Type: application/json` (p. ej. HTML del proxy) o
 *     payload inválido → `error`: nunca se intenta parsear un cuerpo que
 *     no se declara JSON.
 * - Validación defensiva del payload con `unknown` + type guards (sin `any`).
 */
import { apiConfig } from "@/lib/config/api";

// ── Tipos del contrato ──────────────────────────────────────────────────────

/** Pregunta de escala numérica: `escala` es un par [mínimo, máximo]. */
export interface PreguntaEscala {
  texto: string;
  escala: readonly [number, number];
}

/** Pregunta de escala con etiqueta (p3, p4). */
export interface PreguntaEtiqueta extends PreguntaEscala {
  etiqueta: string;
}

/** Pregunta de texto libre (p5). */
export interface PreguntaTexto {
  texto: string;
  max_caracteres: number;
}

export interface PreguntasEncuesta {
  p1: PreguntaEscala;
  p2: PreguntaEscala;
  p3: PreguntaEtiqueta;
  p4: PreguntaEtiqueta;
  p5: PreguntaTexto;
}

export interface EncuestaEmpresa {
  empresa_id: number;
  nombre_negocio: string;
  rubro: string;
  preguntas: PreguntasEncuesta;
}

// ── Resultado discriminado ──────────────────────────────────────────────────

export type ResultadoEncuesta =
  | { estado: "ok"; encuesta: EncuestaEmpresa }
  | { estado: "no-encontrada" }
  | { estado: "no-disponible" }
  | { estado: "error" };

// ── Constantes ──────────────────────────────────────────────────────────────

const TIMEOUT_MS = 5000;

// ── Guards de validación (sin `any`) ────────────────────────────────────────

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function esTexto(valor: unknown): valor is string {
  return typeof valor === "string";
}

function esTextoNoVacio(valor: unknown): valor is string {
  return esTexto(valor) && valor.trim().length > 0;
}

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

function esEscala(valor: unknown): valor is readonly [number, number] {
  return (
    Array.isArray(valor) &&
    valor.length === 2 &&
    typeof valor[0] === "number" &&
    Number.isFinite(valor[0]) &&
    typeof valor[1] === "number" &&
    Number.isFinite(valor[1]) &&
    valor[0] <= valor[1]
  );
}

function esPreguntaEscala(valor: unknown): valor is PreguntaEscala {
  return esObjeto(valor) && esTextoNoVacio(valor.texto) && esEscala(valor.escala);
}

function esPreguntaEtiqueta(valor: unknown): valor is PreguntaEtiqueta {
  return (
    esObjeto(valor) &&
    esTextoNoVacio(valor.texto) &&
    esTextoNoVacio(valor.etiqueta) &&
    esEscala(valor.escala)
  );
}

function esPreguntaTexto(valor: unknown): valor is PreguntaTexto {
  return (
    esObjeto(valor) &&
    esTextoNoVacio(valor.texto) &&
    typeof valor.max_caracteres === "number" &&
    Number.isFinite(valor.max_caracteres) &&
    valor.max_caracteres > 0
  );
}

/**
 * Valida la forma del payload. Devuelve `null` ante cualquier campo
 * faltante o con tipo incorrecto; nunca lanza.
 */
function validarEncuesta(payload: unknown): EncuestaEmpresa | null {
  if (!esObjeto(payload)) return null;

  const { empresa_id, nombre_negocio, rubro, preguntas } = payload;
  if (!esEnteroPositivo(empresa_id)) return null;
  if (!esTextoNoVacio(nombre_negocio)) return null;
  if (!esTexto(rubro)) return null;
  if (!esObjeto(preguntas)) return null;

  const { p1, p2, p3, p4, p5 } = preguntas;
  if (!esPreguntaEscala(p1)) return null;
  if (!esPreguntaEscala(p2)) return null;
  if (!esPreguntaEtiqueta(p3)) return null;
  if (!esPreguntaEtiqueta(p4)) return null;
  if (!esPreguntaTexto(p5)) return null;

  return {
    empresa_id,
    nombre_negocio,
    rubro,
    preguntas: { p1, p2, p3, p4, p5 },
  };
}

// ── Función pública ─────────────────────────────────────────────────────────

export async function obtenerEncuestaEmpresa(
  empresaId: number,
  signal?: AbortSignal,
): Promise<ResultadoEncuesta> {
  const url = `${apiConfig.baseUrl}/api/v1/empresas/${empresaId}/encuesta`;

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
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (res.status === 404) return { estado: "no-encontrada" };
    // Todo 5xx es un fallo del upstream (backend caído, proxy sin destino,
    // gateway sobrecargado): no un listado válido ni un 404.
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

    const encuesta = validarEncuesta(payload);
    if (encuesta === null) return { estado: "error" };
    return { estado: "ok", encuesta };
  } catch {
    // AbortError (timeout o signal externo) y errores de red (TypeError):
    // en ambos casos no se pudo consultar el servicio.
    return { estado: "no-disponible" };
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener("abort", onAbortExterno);
  }
}
