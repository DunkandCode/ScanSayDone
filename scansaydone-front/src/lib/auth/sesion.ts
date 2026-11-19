/**
 * Sesión del panel en `localStorage`.
 *
 * - Clave única `ssd.sesion`; la forma es exactamente la que devuelve
 *   `POST /api/v1/auth/login`: `{usuario, empresa_id, nombre_negocio}`.
 * - SSR-safe: sin `window` (render de servidor) `leerSesion` devuelve
 *   `null` y los demás son no-op.
 * - Defensivo: si el navegador bloquea el storage (modo privado, cuotas,
 *   políticas) ninguna función lanza; guardar/cerrar se ignoran y leer
 *   devuelve `null`.
 * - Un dato corrupto (JSON inválido o forma incorrecta) se trata como
 *   «sin sesión»: `null`, nunca un objeto a medias.
 */
import type { SesionUsuario } from "@/lib/api/auth";

/** Clave de la sesión en `localStorage`. */
export const CLAVE_SESION = "ssd.sesion";

// ── Guard de la forma ───────────────────────────────────────────────────────

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function esTextoNoVacio(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

/** Valida la forma `{usuario, empresa_id, nombre_negocio}`. Nunca lanza. */
export function esSesionValida(valor: unknown): valor is SesionUsuario {
  return (
    esObjeto(valor) &&
    esTextoNoVacio(valor.usuario) &&
    esEnteroPositivo(valor.empresa_id) &&
    esTextoNoVacio(valor.nombre_negocio)
  );
}

// ── API pública ─────────────────────────────────────────────────────────────

/** Guarda la sesión. No-op en el servidor o con storage bloqueado. */
export function guardarSesion(sesion: SesionUsuario): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  } catch {
    // Storage bloqueado: no hay nada que hacer sin romper el flujo.
  }
}

/**
 * Lee la sesión guardada. `null` si no hay, si el dato está corrupto o
 * si la forma no calza con la de la API.
 */
export function leerSesion(): SesionUsuario | null {
  if (typeof window === "undefined") return null;
  try {
    const crudo = window.localStorage.getItem(CLAVE_SESION);
    if (crudo === null) return null;

    let dato: unknown;
    try {
      dato = JSON.parse(crudo);
    } catch {
      // JSON corrupto: tratar como sin sesión.
      return null;
    }

    return esSesionValida(dato) ? dato : null;
  } catch {
    // Storage bloqueado (lectura): sin sesión conocida.
    return null;
  }
}

/** Elimina la sesión. No-op en el servidor o con storage bloqueado. */
export function cerrarSesion(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CLAVE_SESION);
  } catch {
    // Storage bloqueado: no hay nada que hacer sin romper el flujo.
  }
}
