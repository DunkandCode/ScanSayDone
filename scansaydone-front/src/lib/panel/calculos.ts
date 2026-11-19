/**
 * Cálculos del panel sobre las respuestas de la instantánea local.
 *
 * Módulo puro: sin imports y sin estado. La entrada usa los nombres de
 * campo del snapshot (`p1_nps`, `p2_csat`, …) para que las filas de
 * `instantanea.ts` sirvan directamente, sin capa de mapeo.
 *
 * Regla de honestidad: con cero respuestas las medias y la recomendación
 * neta valen `null` (nunca `0` disfrazado de promedio real); una
 * recomendación neta real de 0 sí existe (empate promotores/detractores).
 */

/** Campos que consume el resumen, con los nombres del snapshot. */
export interface RespuestaResumen {
  p1_nps: number;
  p2_csat: number;
  p3_atributo: number;
  p4_atributo: number;
  p5_comentario: string | null;
  alerta: string;
  tipo_comentario: string;
}

export interface ResumenEmpresa {
  total: number;
  mediaP1: number | null;
  promotores: number;
  pasivos: number;
  detractores: number;
  /** Promotores % − detractores %, con un decimal. `null` sin respuestas. */
  nps: number | null;
  /** 11 contadores, índice 0..10 = nota. */
  distribucion: readonly number[];
  mediaP2: number | null;
  mediaP3: number | null;
  mediaP4: number | null;
  conComentario: number;
  conAlerta: number;
  porTipoComentario: ReadonlyMap<string, number>;
}

/** Redondea a un decimal (86,666… → 86,7). */
export function redondear1(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 10) / 10;
}

/** Formatea a un decimal con coma decimal (es-CL): 9.3 → "9,3". */
export function formatear1(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n);
}

/**
 * Formatea una fecha "YYYY-MM-DD" del snapshot como es-CL (dd-mm-yyyy).
 * Determinista: parsea el texto, sin `Date` ni zona horaria (así el
 * "2026-11-18" no se desplaza un día según la zona del navegador).
 * Si la entrada no calza con el patrón, se devuelve tal cual.
 */
export function formatearFechaCL(fecha: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha.trim());
  if (!m) return fecha;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

const DISTRIBUCION_LARGO = 11;

function esNumero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
}

function mediaDe(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const suma = valores.reduce((acum, v) => acum + v, 0);
  return redondear1(suma / valores.length);
}

/**
 * Resumen de las respuestas de un negocio.
 *
 * - Promotores: nota 9–10 · Pasivos: 7–8 · Detractores: 0–6.
 * - `nps` = promotores % − detractores % sobre el total de respuestas.
 * - Defensivo: filtra valores no finitos por campo; la distribución solo
 *   cuenta notas enteras dentro de 0..10.
 */
export function resumenEmpresa(
  respuestas: readonly RespuestaResumen[],
): ResumenEmpresa {
  const distribucion = new Array<number>(DISTRIBUCION_LARGO).fill(0);
  const p1s: number[] = [];
  const p2s: number[] = [];
  const p3s: number[] = [];
  const p4s: number[] = [];
  let promotores = 0;
  let pasivos = 0;
  let detractores = 0;
  let conComentario = 0;
  let conAlerta = 0;
  const porTipoComentario = new Map<string, number>();

  for (const r of respuestas) {
    if (esNumero(r?.p1_nps)) {
      p1s.push(r.p1_nps);
      if (r.p1_nps >= 9) promotores += 1;
      else if (r.p1_nps >= 7) pasivos += 1;
      else detractores += 1;
      if (Number.isInteger(r.p1_nps) && r.p1_nps >= 0 && r.p1_nps <= 10) {
        distribucion[r.p1_nps] += 1;
      }
    }
    if (esNumero(r?.p2_csat)) p2s.push(r.p2_csat);
    if (esNumero(r?.p3_atributo)) p3s.push(r.p3_atributo);
    if (esNumero(r?.p4_atributo)) p4s.push(r.p4_atributo);

    if (typeof r?.p5_comentario === "string" && r.p5_comentario.trim() !== "") {
      conComentario += 1;
    }
    if (typeof r?.alerta === "string" && r.alerta.trim() !== "") {
      conAlerta += 1;
    }
    if (
      typeof r?.tipo_comentario === "string" &&
      r.tipo_comentario.trim() !== ""
    ) {
      const clave = r.tipo_comentario.trim();
      porTipoComentario.set(clave, (porTipoComentario.get(clave) ?? 0) + 1);
    }
  }

  const total = respuestas.length;
  // Sin respuestas (o sin notas válidas) no hay recomendación neta real:
  // 0 − 0 sería un 0 falso.
  const nps =
    p1s.length === 0
      ? null
      : redondear1((promotores / total) * 100 - (detractores / total) * 100);

  return {
    total,
    mediaP1: mediaDe(p1s),
    promotores,
    pasivos,
    detractores,
    nps,
    distribucion,
    mediaP2: mediaDe(p2s),
    mediaP3: mediaDe(p3s),
    mediaP4: mediaDe(p4s),
    conComentario,
    conAlerta,
    porTipoComentario,
  };
}
