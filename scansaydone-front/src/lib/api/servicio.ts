/**
 * Comprobación de disponibilidad del backend vía `GET /health`.
 *
 * - URL relativa (mismo esquema que `encuesta.ts`): en desarrollo la sirve el
 *   `rewrites()` de `next.config.ts`; en producción, el rewrite de Vercel.
 * - Timeout de 5 s con `AbortController`; se puede pasar un `signal` externo.
 * - La función nunca rechaza: todo sale por `EstadoServicio`.
 *   - 2xx → `disponible`.
 *   - 503, error de red o timeout → `no-disponible`.
 *   - Otro HTTP (404, 500…) → `error` (el servicio respondió, pero no como
 *     se esperaba de un `/health` sano).
 */
import { apiConfig } from "@/lib/config/api";

// ── Tipos del contrato ──────────────────────────────────────────────────────

export type EstadoServicio = "disponible" | "no-disponible" | "error";

// ── Constantes ──────────────────────────────────────────────────────────────

const TIMEOUT_MS = 5000;

// ── Función pública ─────────────────────────────────────────────────────────

export async function comprobarServicio(
  signal?: AbortSignal,
): Promise<EstadoServicio> {
  const url = `${apiConfig.baseUrl}/health`;

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

    if (res.ok) return "disponible";
    if (res.status === 503) return "no-disponible";
    return "error";
  } catch {
    // AbortError (timeout o signal externo) y errores de red: no se pudo
    // contactar el servicio.
    return "no-disponible";
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener("abort", onAbortExterno);
  }
}
