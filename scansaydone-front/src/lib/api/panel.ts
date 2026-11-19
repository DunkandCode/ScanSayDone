/**
 * Cliente del endpoint de lectura del panel:
 * `GET /api/v1/empresas/{empresa_id}/panel`
 *
 * Espejo de `src/lib/api/encuesta.ts` (mismo contrato de estados):
 * - URL relativa (`/api/v1/...`) + base opcional de `src/lib/config/api.ts`.
 * - Timeout de 5 s con `AbortController`; se puede pasar un `signal` externo.
 * - La función nunca rechaza: todo sale por la unión discriminada
 *   `ResultadoPanel`:
 *   - 404 → `no-encontrada`.
 *   - 5xx → `no-disponible` (el upstream falló; incluye el 500 del proxy de
 *     `next dev` con el backend caído).
 *   - Otro 4xx → `error`.
 *   - Error de red o timeout → `no-disponible`.
 *   - 200 sin `Content-Type: application/json` o payload inválido → `error`.
 * - Validación defensiva con `unknown` + type guards (sin `any`).
 * - `creado_en` NO se tipa ni se usa: en el SQLite local viene sin zona y en
 *   hora de Chile; el orden y las fechas usan `fecha` + `hora`.
 */
import { apiConfig } from "@/lib/config/api";

// ── Tipos del contrato ──────────────────────────────────────────────────────

export interface EmpresaPanel {
  empresa_id: number;
  nombre_negocio: string;
  rubro: string;
}

/** Fila de la distribución 0–10: `{ nota, cantidad }`. */
export interface FilaDistribucionP1 {
  nota: number;
  cantidad: number;
}

/** Punto de la serie por día de un negocio. */
export interface PuntoSerieDiaria {
  /** "YYYY-MM-DD". */
  fecha: string;
  respuestas: number;
  suma_p1: number;
  media_p1: number | null;
}

export interface ComentariosPorTipo {
  felicitacion: number;
  reclamo: number;
  sugerencia: number;
  sin_comentario: number;
}

/** Medias de p3/p4 con la etiqueta que define la API por negocio. */
export interface PreguntaAtributo {
  etiqueta: string;
  media: number | null;
  top_box: number | null;
}

export interface AgregadoPanel {
  respuestas: number;
  desde: string | null;
  hasta: string | null;
  /** Promotores % − detractores %. `null` sin respuestas. */
  nps: number | null;
  promotores: number;
  pasivos: number;
  detractores: number;
  notas_8_a_10: number;
  media_p1: number | null;
  /** % de respuestas conformes en la pregunta 2 (nota 4 o 5). */
  csat: number | null;
  media_p2: number | null;
  p3: PreguntaAtributo;
  p4: PreguntaAtributo;
  alertas: number;
  comentarios: ComentariosPorTipo;
  distribucion_p1: readonly FilaDistribucionP1[];
  serie_diaria: readonly PuntoSerieDiaria[];
}

/** Una respuesta individual (sin `creado_en`). */
export interface RespuestaPanel {
  encuesta_id: number;
  /** "YYYY-MM-DD". */
  fecha: string;
  /** "HH:MM:SS". */
  hora: string;
  p1_nps: number;
  p2_csat: number | null;
  p3_atributo: number | null;
  p4_atributo: number | null;
  p5_comentario: string | null;
  categoria_nps: string;
  alerta: boolean;
  tipo_comentario: string;
  bloque_horario: string;
}

export interface PanelEmpresaDatos {
  empresa: EmpresaPanel;
  agregado: AgregadoPanel;
  respuestas: readonly RespuestaPanel[];
}

// ── Resultado discriminado ──────────────────────────────────────────────────

export type ResultadoPanel =
  | { estado: "ok"; panel: PanelEmpresaDatos }
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

function esTextoONulo(valor: unknown): valor is string | null {
  return valor === null || esTexto(valor);
}

function esNumero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
}

function esNumeroONulo(valor: unknown): valor is number | null {
  return valor === null || esNumero(valor);
}

function esEnteroNoNegativo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 0;
}

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

function esNota(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor >= 0 && valor <= 10;
}

function esComentario(valor: unknown): valor is string | null {
  return valor === null || esTexto(valor);
}

function esFecha(valor: unknown): valor is string {
  return esTextoNoVacio(valor) && /^\d{4}-\d{2}-\d{2}$/.test(valor.trim());
}

function esDistribucion(valor: unknown): valor is FilaDistribucionP1 {
  return esObjeto(valor) && esNota(valor.nota) && esEnteroNoNegativo(valor.cantidad);
}

function esPuntoSerie(valor: unknown): valor is PuntoSerieDiaria {
  return (
    esObjeto(valor) &&
    esFecha(valor.fecha) &&
    esEnteroNoNegativo(valor.respuestas) &&
    esNumero(valor.suma_p1) &&
    esNumeroONulo(valor.media_p1)
  );
}

function esPreguntaAtributo(valor: unknown): valor is PreguntaAtributo {
  return (
    esObjeto(valor) &&
    esTextoNoVacio(valor.etiqueta) &&
    esNumeroONulo(valor.media) &&
    esNumeroONulo(valor.top_box)
  );
}

function esComentariosPorTipo(valor: unknown): valor is ComentariosPorTipo {
  return (
    esObjeto(valor) &&
    esEnteroNoNegativo(valor.felicitacion) &&
    esEnteroNoNegativo(valor.reclamo) &&
    esEnteroNoNegativo(valor.sugerencia) &&
    esEnteroNoNegativo(valor.sin_comentario)
  );
}

function esRespuestaPanel(valor: unknown): valor is RespuestaPanel {
  return (
    esObjeto(valor) &&
    esEnteroPositivo(valor.encuesta_id) &&
    esFecha(valor.fecha) &&
    esTexto(valor.hora) &&
    esNota(valor.p1_nps) &&
    esNumeroONulo(valor.p2_csat) &&
    esNumeroONulo(valor.p3_atributo) &&
    esNumeroONulo(valor.p4_atributo) &&
    esComentario(valor.p5_comentario) &&
    esTexto(valor.categoria_nps) &&
    typeof valor.alerta === "boolean" &&
    esTexto(valor.tipo_comentario) &&
    esTexto(valor.bloque_horario)
  );
}

function esAgregado(valor: unknown): valor is AgregadoPanel {
  if (!esObjeto(valor)) return false;
  return (
    esEnteroNoNegativo(valor.respuestas) &&
    esTextoONulo(valor.desde) &&
    esTextoONulo(valor.hasta) &&
    esNumeroONulo(valor.nps) &&
    esEnteroNoNegativo(valor.promotores) &&
    esEnteroNoNegativo(valor.pasivos) &&
    esEnteroNoNegativo(valor.detractores) &&
    esEnteroNoNegativo(valor.notas_8_a_10) &&
    esNumeroONulo(valor.media_p1) &&
    esNumeroONulo(valor.csat) &&
    esNumeroONulo(valor.media_p2) &&
    esPreguntaAtributo(valor.p3) &&
    esPreguntaAtributo(valor.p4) &&
    esEnteroNoNegativo(valor.alertas) &&
    esComentariosPorTipo(valor.comentarios) &&
    Array.isArray(valor.distribucion_p1) &&
    valor.distribucion_p1.every(esDistribucion) &&
    Array.isArray(valor.serie_diaria) &&
    valor.serie_diaria.every(esPuntoSerie)
  );
}

/**
 * Valida la forma del payload completo. Exportada para pruebas.
 * Ante cualquier campo faltante o con tipo incorrecto devuelve `null`
 * (contrato todo-o-nada, mismo criterio que la instantánea original);
 * nunca lanza.
 */
export function validarPanel(payload: unknown): PanelEmpresaDatos | null {
  if (!esObjeto(payload)) return null;

  const { empresa, agregado, respuestas } = payload;
  if (!esObjeto(empresa)) return null;
  if (!esEnteroPositivo(empresa.empresa_id)) return null;
  if (!esTextoNoVacio(empresa.nombre_negocio)) return null;
  if (!esTexto(empresa.rubro)) return null;

  if (!esAgregado(agregado)) return null;
  if (!Array.isArray(respuestas) || !respuestas.every(esRespuestaPanel)) {
    return null;
  }

  return {
    empresa: {
      empresa_id: empresa.empresa_id,
      nombre_negocio: empresa.nombre_negocio,
      rubro: empresa.rubro,
    },
    agregado,
    respuestas,
  };
}

// ── Función pública ─────────────────────────────────────────────────────────

export async function obtenerPanelEmpresa(
  empresaId: number,
  signal?: AbortSignal,
): Promise<ResultadoPanel> {
  const url = `${apiConfig.baseUrl}/api/v1/empresas/${empresaId}/panel`;

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
    // Todo 5xx es un fallo del upstream (backend caído, proxy sin destino):
    // no un panel válido ni un 404.
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

    const panel = validarPanel(payload);
    if (panel === null) return { estado: "error" };
    return { estado: "ok", panel };
  } catch {
    // AbortError (timeout o signal externo) y errores de red (TypeError):
    // en ambos casos no se pudo consultar el servicio.
    return { estado: "no-disponible" };
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener("abort", onAbortExterno);
  }
}
