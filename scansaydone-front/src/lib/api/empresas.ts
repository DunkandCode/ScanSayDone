/**
 * Listado de negocios por sondeo controlado.
 *
 * El backend NO expone un endpoint de listado (`GET /empresas`): el único
 * recurso de lectura es `GET /api/v1/empresas/{empresa_id}/encuesta`.
 * Los ids sembrados en el backend son secuenciales (1, 2, 3, ...), así que
 * la lista se arma sondeando `obtenerEncuestaEmpresa(id)` para
 * `1..MAX_SONDEO` y quedándose con las respuestas `ok`.
 *
 * Reglas del sondeo:
 * - `no-encontrada` (404) → el id no existe: se salta y se sigue.
 * - `no-disponible` (5xx / red / timeout) → la API está caída, no es culpa
 *   del negocio: se abortan los lotes restantes y se devuelve
 *   `no-disponible` completo.
 * - `error` (payload malformado, 200 sin JSON u otro 4xx en un probe
 *   puntual) → se salta ese id; NO tumba la lista.
 * - `error` del listador completo solo si el propio sondeo falla de forma
 *   inesperada (excepción interna). La función nunca lanza.
 *
 * Diagnóstico del vacío: NUNCA se devuelve `ok` con cero empresas. Si el
 * sondeo no encontró ninguna, SIEMPRE se consulta `GET /health`
 * (`comprobarServicio`) y se clasifica:
 * - `vacio` solo si el servicio está `disponible` Y todos los probes
 *   respondieron 404 limpio (la API contestó bien y no hay filas).
 * - `no-disponible` en cualquier otro caso (servicio caído/`error`, o
 *   probes que fallaron con 5xx/cuerpos no JSON): sin evidencia de un
 *   vacío real no se adivina "base sin sembrar".
 *
 * Cache de sesión: la primera lista `ok` (o `vacio`) se guarda 60 s a nivel
 * de módulo para no repetir el sondeo en cada montaje. El resultado
 * `no-disponible` NO se cachea (el estado de red puede cambiar en segundos).
 * `limpiarCacheEmpresas()` permite resetearla en pruebas.
 */
import { obtenerEncuestaEmpresa } from "@/lib/api/encuesta";
import { comprobarServicio } from "@/lib/api/servicio";

// ── Tipos del contrato ──────────────────────────────────────────────────────

/** Resumen mínimo para poblar el selector del panel. */
export interface EmpresaResumen {
  empresaId: number;
  nombre: string;
  rubro: string;
}

export type ResultadoEmpresas =
  | { estado: "ok"; empresas: EmpresaResumen[] }
  | { estado: "vacio" }
  | { estado: "no-disponible" }
  | { estado: "error" };

// ── Constantes del sondeo ───────────────────────────────────────────────────

/**
 * Tope de ids a sondear. Los ids del backend son secuenciales y hoy no hay
 * endpoint de listado; 12 cubre las empresas sembradas con margen sin
 * disparar decenas de peticiones.
 */
export const MAX_SONDEO = 12;

/** Ids sondeados por lote (3-4 para no saturar el backend por panel). */
const CONCURRENCIA = 3;

/** Vigencia de la lista cacheada, en milisegundos. */
const TTL_MS = 60_000;

// ── Cache de sesión (nivel módulo) ──────────────────────────────────────────

let cache: { empresas: EmpresaResumen[]; vacio: boolean; expiraEn: number } | null =
  null;

/** Resetea la cache del listado. Pensado para pruebas. */
export function limpiarCacheEmpresas(): void {
  cache = null;
}

// ── Sondeo ──────────────────────────────────────────────────────────────────

function aResumen(empresaId: number, nombre: string, rubro: string): EmpresaResumen {
  // El id sondeado manda: el payload ya viene validado por encuesta.ts,
  // pero el identificador de la lista es el que se pidió.
  return { empresaId, nombre, rubro };
}

/**
 * Arma la lista de negocios sondeando `1..MAX_SONDEO` por lotes de
 * `CONCURRENCIA`. Nunca rechaza: todo sale por `ResultadoEmpresas`.
 */
export async function listarEmpresas(): Promise<ResultadoEmpresas> {
  if (cache && cache.expiraEn > Date.now()) {
    return cache.vacio
      ? { estado: "vacio" }
      : { estado: "ok", empresas: cache.empresas };
  }

  try {
    const ids = Array.from({ length: MAX_SONDEO }, (_, i) => i + 1);
    const encontradas: EmpresaResumen[] = [];
    let apiCaida = false;
    // Evidencia para diagnosticar el vacío sin adivinar:
    // - `vistoNoEncontrada`: al menos un probe respondió 404 (la API
    //   contestó y ese id no existe).
    // - `vistoIlegible`: algún probe terminó en `error` (200 sin JSON,
    //   payload malformado u otro 4xx): la API NO contestó limpio.
    let vistoNoEncontrada = false;
    let vistoIlegible = false;

    for (let inicio = 0; inicio < ids.length && !apiCaida; inicio += CONCURRENCIA) {
      const lote = ids.slice(inicio, inicio + CONCURRENCIA);
      const resultados = await Promise.all(
        lote.map((id) => obtenerEncuestaEmpresa(id)),
      );

      for (let i = 0; i < lote.length; i++) {
        const resultado = resultados[i];
        if (resultado.estado === "ok") {
          encontradas.push(
            aResumen(
              lote[i],
              resultado.encuesta.nombre_negocio,
              resultado.encuesta.rubro,
            ),
          );
        } else if (resultado.estado === "no-disponible") {
          // La API no respondió: abortar los lotes restantes.
          apiCaida = true;
        } else if (resultado.estado === "error") {
          vistoIlegible = true;
        } else {
          // "no-encontrada" (404): el id se salta, pero queda como
          // evidencia de que la API sí contesta.
          vistoNoEncontrada = true;
        }
      }
    }

    if (apiCaida) return { estado: "no-disponible" };

    // Con empresas no hay nada que diagnosticar: solo existe `ok` con al
    // menos una fila.
    if (encontradas.length > 0) {
      cache = {
        empresas: encontradas,
        vacio: false,
        expiraEn: Date.now() + TTL_MS,
      };
      return { estado: "ok", empresas: encontradas };
    }

    // Cero empresas: SIEMPRE diagnosticar con /health. `vacio` exige que
    // el servicio esté disponible y que todos los probes hayan sido 404
    // limpio (la API respondió correctamente y no hay filas). Con probes
    // 5xx/no-JSON o el servicio caído/`error` → `no-disponible`: sin
    // evidencia de vacío real no se adivina.
    const salud = await comprobarServicio();
    const sondeoLimpio = vistoNoEncontrada && !vistoIlegible;
    if (salud === "disponible" && sondeoLimpio) {
      cache = { empresas: [], vacio: true, expiraEn: Date.now() + TTL_MS };
      return { estado: "vacio" };
    }
    return { estado: "no-disponible" };
  } catch {
    // Defensa: nada de este camino debería lanzar, pero el contrato dice
    // "nunca throw".
    return { estado: "error" };
  }
}
