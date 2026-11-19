/**
 * Instantánea local de datos de prueba.
 *
 * `src/data/local-snapshot.json` es una exportación de solo lectura de la
 * base SQLite local (4 negocios, 60 respuestas). NO son clientes reales.
 *
 * - Tipado completo del JSON, sin `any`.
 * - Validación defensiva en la importación (mismo estilo de guards que
 *   `src/lib/api/encuesta.ts`): si la forma no coincide, se expone una
 *   instantánea vacía e `valida: false` en vez de romper el panel.
 * - Contrato determinista: un solo ítem inválido invalida la instantánea
 *   completa (no se descarta fila por fila a ciegas).
 */
import crudo from "@/data/local-snapshot.json";

// ── Tipos ───────────────────────────────────────────────────────────────────

export interface EmpresaInstantanea {
  empresa_id: number;
  nombre_negocio: string;
  rubro_id: number;
  rubro: string;
  p3_label: string;
  p4_label: string;
}

export interface RespuestaInstantanea {
  empresa_id: number;
  p1_nps: number;
  p2_csat: number;
  p3_atributo: number;
  p4_atributo: number;
  p5_comentario: string | null;
  fecha: string;
  hora: string;
  categoria_nps: string;
  alerta: string;
  tipo_comentario: string;
  bloque_horario: string;
  dia_semana: string;
  semana_anio: number;
  anio: number;
  mes_nombre: string;
}

export interface Instantanea {
  /** `false` cuando el JSON no tiene la forma esperada. */
  valida: boolean;
  generadoEn: string | null;
  fuente: string | null;
  empresas: readonly EmpresaInstantanea[];
  respuestas: readonly RespuestaInstantanea[];
}

const INSTANTANEA_VACIA: Instantanea = {
  valida: false,
  generadoEn: null,
  fuente: null,
  empresas: [],
  respuestas: [],
};

// ── Guards (sin `any`) ──────────────────────────────────────────────────────

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function esTexto(valor: unknown): valor is string {
  return typeof valor === "string";
}

function esTextoNoVacio(valor: unknown): valor is string {
  return esTexto(valor) && valor.trim().length > 0;
}

function esEntero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor);
}

function esNota(valor: unknown): valor is number {
  return esEntero(valor) && valor >= 0 && valor <= 10;
}

function esNumero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
}

function esComentario(valor: unknown): valor is string | null {
  return valor === null || esTexto(valor);
}

function esEmpresa(valor: unknown): valor is EmpresaInstantanea {
  return (
    esObjeto(valor) &&
    esEntero(valor.empresa_id) &&
    valor.empresa_id > 0 &&
    esTextoNoVacio(valor.nombre_negocio) &&
    esEntero(valor.rubro_id) &&
    esTexto(valor.rubro) &&
    esTextoNoVacio(valor.p3_label) &&
    esTextoNoVacio(valor.p4_label)
  );
}

function esRespuesta(valor: unknown): valor is RespuestaInstantanea {
  return (
    esObjeto(valor) &&
    esEntero(valor.empresa_id) &&
    valor.empresa_id > 0 &&
    esNota(valor.p1_nps) &&
    esNumero(valor.p2_csat) &&
    esNumero(valor.p3_atributo) &&
    esNumero(valor.p4_atributo) &&
    esComentario(valor.p5_comentario) &&
    esTextoNoVacio(valor.fecha) &&
    esTexto(valor.hora) &&
    esTexto(valor.categoria_nps) &&
    esTexto(valor.alerta) &&
    esTexto(valor.tipo_comentario) &&
    esTexto(valor.bloque_horario) &&
    esTexto(valor.dia_semana) &&
    esEntero(valor.semana_anio) &&
    esEntero(valor.anio) &&
    esTexto(valor.mes_nombre)
  );
}

// ── Validación ──────────────────────────────────────────────────────────────

/**
 * Valida la forma de un payload de instantánea. Exportada para pruebas.
 * Ante cualquier campo faltante o con tipo incorrecto devuelve la
 * instantánea vacía (`valida: false`); nunca lanza.
 */
export function validarInstantanea(payload: unknown): Instantanea {
  if (!esObjeto(payload)) return INSTANTANEA_VACIA;

  const { generado_en, fuente, empresas, respuestas } = payload;
  if (!esTextoNoVacio(generado_en)) return INSTANTANEA_VACIA;
  if (!esTextoNoVacio(fuente)) return INSTANTANEA_VACIA;
  if (!Array.isArray(empresas)) return INSTANTANEA_VACIA;
  if (!Array.isArray(respuestas)) return INSTANTANEA_VACIA;
  if (!empresas.every(esEmpresa)) return INSTANTANEA_VACIA;
  if (!respuestas.every(esRespuesta)) return INSTANTANEA_VACIA;

  return {
    valida: true,
    generadoEn: generado_en,
    fuente,
    empresas,
    respuestas,
  };
}

// ── Instantánea activa (nivel módulo, inmutable en la práctica) ─────────────

export const instantanea: Instantanea = validarInstantanea(crudo);

/** Negocios de la instantánea. */
export function empresasDeInstantanea(): readonly EmpresaInstantanea[] {
  return instantanea.empresas;
}

/** Respuestas de un negocio (nuevo arreglo en cada llamada). */
export function respuestasDeEmpresa(
  empresaId: number,
): readonly RespuestaInstantanea[] {
  return instantanea.respuestas.filter((r) => r.empresa_id === empresaId);
}

/** Fecha de la instantánea en formato es-CL ("18-11-2026") o `null`. */
export function fechaInstantanea(): string | null {
  if (instantanea.generadoEn === null) return null;
  const fecha = new Date(instantanea.generadoEn);
  if (Number.isNaN(fecha.getTime())) return instantanea.generadoEn;
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(fecha);
}
