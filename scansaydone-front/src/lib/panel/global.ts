/**
 * Cálculos del resumen global y de los gráficos del panel, sobre los
 * datos que devuelve `GET /api/v1/empresas/{id}/panel`.
 *
 * Módulo puro: sin estado ni efectos. Reglas de honestidad:
 * - La recomendación neta general se calcula DESDE LAS FILAS
 *   (`(Σpromotores − Σdetractores) / Σrespuestas × 100`), nunca
 *   promediando la recomendación neta de cada empresa: con distinta
 *   cantidad de respuestas por empresa ambos números difieren.
 * - La media general es la media de todos los `p1_nps` de todas las
 *   filas, no la media de las medias.
 * - Con cero respuestas las medias y la recomendación neta valen `null`
 *   (nunca un 0 disfrazado de promedio real).
 */
import type {
  PanelEmpresaDatos,
  PuntoSerieDiaria,
  RespuestaPanel,
} from "@/lib/api/panel";
import { redondear1 } from "@/lib/panel/calculos";

// ── Momentos del día ────────────────────────────────────────────────────────

/**
 * Bloques horarios del producto: Mañana 6–11, Tarde 12–19, Noche 20–5.
 * El conteo usa el campo `bloque_horario` que ya viene clasificado en
 * cada fila; los rangos quedan como referencia del negocio.
 */
export const BLOQUES_HORARIO = ["Mañana", "Tarde", "Noche"] as const;

export type BloqueHorario = (typeof BLOQUES_HORARIO)[number];

/**
 * Umbral de muestra mínima: por debajo de esta cantidad de respuestas,
 * el gráfico por momento marca «muestra mínima» junto al conteo.
 */
export const MUESTRA_MINIMA = 5;

export interface ConteoBloques {
  manana: number;
  tarde: number;
  noche: number;
}

/**
 * Cuenta las respuestas por momento del día usando `bloque_horario`.
 * Valores desconocidos o vacíos se ignoran (defensivo: el total del
 * conteo puede ser menor al total de filas si la fila viene mal
 * clasificada, pero nunca se inventa una categoría nueva).
 */
export function contarPorBloqueHorario(
  respuestas: readonly RespuestaPanel[],
): ConteoBloques {
  const conteo: ConteoBloques = { manana: 0, tarde: 0, noche: 0 };
  for (const r of respuestas) {
    if (r.bloque_horario === "Mañana") conteo.manana += 1;
    else if (r.bloque_horario === "Tarde") conteo.tarde += 1;
    else if (r.bloque_horario === "Noche") conteo.noche += 1;
  }
  return conteo;
}

/** `true` cuando el conteo de un bloque no alcanza la muestra mínima. */
export function esMuestraMinima(conteo: number): boolean {
  return conteo < MUESTRA_MINIMA;
}

// ── Serie por día (global) ──────────────────────────────────────────────────

export interface PuntoDia {
  /** "YYYY-MM-DD". */
  fecha: string;
  respuestas: number;
}

/**
 * Fusiona las series por día de varios negocios en una sola: suma las
 * respuestas de cada fecha y ordena de la más antigua a la más reciente.
 * Los días sin respuestas de ningún negocio simplemente no aparecen
 * (no se rellenan huecos con ceros inventados).
 */
export function agregarSerieDiaria(
  series: readonly (readonly PuntoSerieDiaria[])[],
): PuntoDia[] {
  const acumulado = new Map<string, number>();
  for (const serie of series) {
    for (const punto of serie) {
      acumulado.set(punto.fecha, (acumulado.get(punto.fecha) ?? 0) + punto.respuestas);
    }
  }
  return [...acumulado.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([fecha, respuestas]) => ({ fecha, respuestas }));
}

// ── Resumen global ──────────────────────────────────────────────────────────

/** Fila de la tabla por negocio: números que ya vienen calculados en `agregado`. */
export interface FilaNegocioGlobal {
  empresaId: number;
  nombre: string;
  rubro: string;
  respuestas: number;
  mediaP1: number | null;
  promotores: number;
  detractores: number;
  /** Recomendación neta del negocio (promotores % − detractores %). */
  recomendacionNeta: number | null;
}

export interface ResumenGlobal {
  totalRespuestas: number;
  /** Media de TODOS los `p1_nps` de todas las filas. */
  mediaGeneral: number | null;
  /** (Σpromotores − Σdetractores) / Σrespuestas × 100, contado desde filas. */
  recomendacionNetaGeneral: number | null;
  /** 11 contadores, índice 0..10 = nota (conteo desde filas). */
  distribucion: readonly number[];
  filas: readonly FilaNegocioGlobal[];
}

/**
 * Resumen global a partir de los paneles consultados.
 *
 * Los totales (media general, recomendación neta general y distribución)
 * se cuentan desde las filas de respuestas; la tabla por negocio usa los
 * valores de cada `agregado` (son los números oficiales de esa empresa).
 */
export function resumenGlobalDesdePaneles(
  paneles: readonly PanelEmpresaDatos[],
): ResumenGlobal {
  const distribucion = new Array<number>(11).fill(0);
  let sumaP1 = 0;
  let total = 0;
  let promotores = 0;
  let detractores = 0;

  for (const panel of paneles) {
    for (const r of panel.respuestas) {
      total += 1;
      sumaP1 += r.p1_nps;
      if (r.p1_nps >= 9) promotores += 1;
      else if (r.p1_nps <= 6) detractores += 1;
      if (Number.isInteger(r.p1_nps) && r.p1_nps >= 0 && r.p1_nps <= 10) {
        distribucion[r.p1_nps] += 1;
      }
    }
  }

  const filas: FilaNegocioGlobal[] = paneles.map((panel) => ({
    empresaId: panel.empresa.empresa_id,
    nombre: panel.empresa.nombre_negocio,
    rubro: panel.empresa.rubro,
    respuestas: panel.agregado.respuestas,
    mediaP1: panel.agregado.media_p1,
    promotores: panel.agregado.promotores,
    detractores: panel.agregado.detractores,
    recomendacionNeta: panel.agregado.nps,
  }));

  return {
    totalRespuestas: total,
    mediaGeneral: total === 0 ? null : redondear1(sumaP1 / total),
    recomendacionNetaGeneral:
      total === 0 ? null : redondear1(((promotores - detractores) / total) * 100),
    distribucion,
    filas,
  };
}

// ── Reseñas ─────────────────────────────────────────────────────────────────

export interface ConteoResenas {
  total: number;
  conComentario: number;
  conAlerta: number;
}

/** Conteo de reseñas por comentario y alerta (para la línea de resumen). */
export function contarResenas(
  respuestas: readonly RespuestaPanel[],
): ConteoResenas {
  let conComentario = 0;
  let conAlerta = 0;
  for (const r of respuestas) {
    if (typeof r.p5_comentario === "string" && r.p5_comentario.trim() !== "") {
      conComentario += 1;
    }
    if (r.alerta) conAlerta += 1;
  }
  return { total: respuestas.length, conComentario, conAlerta };
}
