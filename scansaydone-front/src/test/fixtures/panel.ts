/**
 * Fixture de pruebas: panel de los 4 negocios del servicio local,
 * con los números reales verificados contra la API el 2026-11-19
 * (80 respuestas, 19–31 de octubre de 2026).
 *
 * Cada negocio se genera con:
 * - su distribución 0–10 real (de ahí salen las notas de las filas),
 * - su serie por día real (de ahí salen las fechas de las filas),
 * - sus conteos por momento del día reales (2/17/1 · 3/17/0 · 5/14/1 · 5/15/0),
 * - sus conteos de comentarios y alertas reales.
 *
 * Los agregados (medias, recomendación neta, satisfacción, p3/p4) se
 * copian tal cual del servicio: son los números oficiales que la UI
 * muestra sin recalcular.
 */

interface ConfigEmpresa {
  id: number;
  nombre: string;
  rubro: string;
  /** 11 cantidades, índice 0..10 = nota. */
  dist: readonly number[];
  /** [fecha "YYYY-MM-DD", respuestas ese día]. */
  serie: readonly (readonly [string, number])[];
  /** [Mañana, Tarde, Noche]. */
  bloques: readonly [number, number, number];
  nps: number;
  mediaP1: number;
  csat: number;
  mediaP2: number;
  p3: { etiqueta: string; media: number; top_box: number };
  p4: { etiqueta: string; media: number; top_box: number };
  alertas: number;
  comentarios: { felicitacion: number; reclamo: number; sugerencia: number; sin_comentario: number };
}

const EMPRESAS: readonly ConfigEmpresa[] = [
  {
    id: 1,
    nombre: "Minimarket Don Lucho",
    rubro: "Minimarket / almacén de barrio",
    dist: [0, 0, 1, 0, 1, 1, 2, 1, 4, 1, 9],
    serie: [
      ["2026-10-19", 1],
      ["2026-10-20", 2],
      ["2026-10-21", 1],
      ["2026-10-23", 1],
      ["2026-10-25", 2],
      ["2026-10-26", 5],
      ["2026-10-27", 3],
      ["2026-10-28", 2],
      ["2026-10-29", 1],
      ["2026-10-30", 1],
      ["2026-10-31", 1],
    ],
    bloques: [2, 17, 1],
    nps: 25,
    mediaP1: 8.05,
    csat: 70,
    mediaP2: 3.85,
    p3: { etiqueta: "Surtido y disponibilidad", media: 3.75, top_box: 70 },
    p4: { etiqueta: "Calidad de la atención", media: 4.05, top_box: 75 },
    alertas: 5,
    comentarios: { felicitacion: 10, reclamo: 4, sugerencia: 3, sin_comentario: 3 },
  },
  {
    id: 2,
    nombre: "Café Rincón Andino",
    rubro: "Cafetería / restaurante",
    dist: [0, 0, 0, 0, 0, 3, 2, 1, 4, 3, 7],
    serie: [
      ["2026-10-19", 1],
      ["2026-10-20", 2],
      ["2026-10-21", 1],
      ["2026-10-22", 1],
      ["2026-10-23", 2],
      ["2026-10-24", 3],
      ["2026-10-28", 2],
      ["2026-10-29", 5],
      ["2026-10-30", 2],
      ["2026-10-31", 1],
    ],
    bloques: [3, 17, 0],
    nps: 25,
    mediaP1: 8.15,
    csat: 70,
    mediaP2: 4.15,
    p3: { etiqueta: "Calidad del producto", media: 3.75, top_box: 70 },
    p4: { etiqueta: "Tiempo de servicio", media: 4.1, top_box: 85 },
    alertas: 5,
    comentarios: { felicitacion: 9, reclamo: 3, sugerencia: 3, sin_comentario: 5 },
  },
  {
    id: 3,
    nombre: "Peluquería Estilo Sur",
    rubro: "Peluquería / centro de estética",
    dist: [0, 0, 0, 0, 1, 1, 1, 3, 1, 3, 10],
    serie: [
      ["2026-10-19", 1],
      ["2026-10-20", 1],
      ["2026-10-21", 3],
      ["2026-10-22", 1],
      ["2026-10-23", 5],
      ["2026-10-24", 1],
      ["2026-10-26", 1],
      ["2026-10-27", 2],
      ["2026-10-28", 1],
      ["2026-10-29", 3],
      ["2026-10-31", 1],
    ],
    bloques: [5, 14, 1],
    nps: 50,
    mediaP1: 8.55,
    csat: 70,
    mediaP2: 4.05,
    p3: { etiqueta: "Calidad técnica del servicio", media: 4.25, top_box: 80 },
    p4: { etiqueta: "Comunicación y personalización", media: 4.05, top_box: 85 },
    alertas: 3,
    comentarios: { felicitacion: 12, reclamo: 3, sugerencia: 2, sin_comentario: 3 },
  },
  {
    id: 4,
    nombre: "Cosmos Accesorios",
    rubro: "Emprendimiento de venta online",
    dist: [0, 0, 0, 1, 1, 1, 5, 0, 3, 3, 6],
    serie: [
      ["2026-10-19", 1],
      ["2026-10-21", 2],
      ["2026-10-22", 3],
      ["2026-10-24", 1],
      ["2026-10-25", 2],
      ["2026-10-26", 2],
      ["2026-10-27", 4],
      ["2026-10-29", 1],
      ["2026-10-30", 1],
      ["2026-10-31", 3],
    ],
    bloques: [5, 15, 0],
    nps: 5,
    mediaP1: 7.65,
    csat: 65,
    mediaP2: 3.75,
    p3: { etiqueta: "Calidad y expectativa del producto", media: 3.75, top_box: 60 },
    p4: { etiqueta: "Cumplimiento logístico", media: 3.75, top_box: 60 },
    alertas: 8,
    comentarios: { felicitacion: 10, reclamo: 7, sugerencia: 0, sin_comentario: 3 },
  },
];

/** Tipo de comentario en el orden en que se asignan a las filas. */
interface TipoComentario {
  etiqueta: string;
  texto: string | null;
}

const TIPOS: readonly TipoComentario[] = [
  { etiqueta: "Felicitación", texto: "Muy buena atención, volveré." },
  { etiqueta: "Reclamo", texto: "Demoró demasiado en atenderme." },
  { etiqueta: "Sugerencia", texto: "Podrían ampliar el horario de atención." },
  { etiqueta: "Sin comentario", texto: null },
];

interface FilaInterna {
  fecha: string;
  hora: string;
  p1_nps: number;
  bloque: string;
}

/**
 * Genera las filas de un negocio: notas desde la distribución, fechas
 * desde la serie (una fecha repetida según su conteo) y bloques según
 * los conteos reales [Mañana, Tarde, Noche]. Orden ascendente por
 * fecha+hora (la API entrega la más reciente primero; el fixture se
 * invierte al final).
 */
function filasDe(config: ConfigEmpresa): FilaInterna[] {
  // Fechas expandidas: cada fecha de la serie repetida su conteo.
  const fechas: string[] = [];
  for (const [fecha, cantidad] of config.serie) {
    for (let i = 0; i < cantidad; i++) fechas.push(fecha);
  }

  // Bloques expandidos en el orden fijo Mañana → Tarde → Noche.
  const bloques: string[] = [];
  const [manana, tarde, noche] = config.bloques;
  for (let i = 0; i < manana; i++) bloques.push("Mañana");
  for (let i = 0; i < tarde; i++) bloques.push("Tarde");
  for (let i = 0; i < noche; i++) bloques.push("Noche");

  // Notas desde la distribución (ascendente: primero las notas bajas).
  const notas: number[] = [];
  config.dist.forEach((cantidad, nota) => {
    for (let i = 0; i < cantidad; i++) notas.push(nota);
  });

  // Hora por bloque (dentro del rango del producto: 6–11 / 12–19 / 20–5).
  const horaDe = (bloque: string, indice: number): string => {
    const minuto = String(10 + indice).padStart(2, "0");
    if (bloque === "Mañana") return `09:${minuto}:00`;
    if (bloque === "Noche") return `20:${minuto}:00`;
    return `15:${minuto}:00`;
  };

  return fechas.map((fecha, i) => {
    const bloque = bloques[i] ?? "Tarde";
    return { fecha, hora: horaDe(bloque, i), p1_nps: notas[i] ?? 8, bloque };
  });
}

/** Construye el payload crudo (lo que devuelve `res.json()` del panel). */
export function payloadPanelReal(empresaId: number): Record<string, unknown> {
  const config = EMPRESAS.find((e) => e.id === empresaId);
  if (!config) throw new Error(`Fixture sin empresa ${empresaId}`);

  const filas = filasDe(config);
  const total = filas.length;

  // Tipos de comentario en el orden de TIPOS, respetando los conteos.
  const colaTipos: TipoComentario[] = [];
  const claves: readonly [keyof ConfigEmpresa["comentarios"], number][] = [
    ["felicitacion", 0],
    ["reclamo", 1],
    ["sugerencia", 2],
    ["sin_comentario", 3],
  ];
  for (const [clave, indiceTipo] of claves) {
    for (let i = 0; i < config.comentarios[clave]; i++) {
      colaTipos.push(TIPOS[indiceTipo]);
    }
  }

  // La primera `alertas` filas con nota ≤ 6 llevan alerta (si alcanzan;
  // el resto se marca desde el inicio para completar el conteo).
  const indicesConAlerta = new Set<number>();
  let marcadas = 0;
  for (let i = 0; i < total && marcadas < config.alertas; i++) {
    if (filas[i].p1_nps <= 6) {
      indicesConAlerta.add(i);
      marcadas++;
    }
  }
  for (let i = 0; i < total && marcadas < config.alertas; i++) {
    if (!indicesConAlerta.has(i)) {
      indicesConAlerta.add(i);
      marcadas++;
    }
  }

  // Más reciente primero (la API ordena así): invertir el orden ascendente.
  const respuestas = filas
    .map((fila, i) => {
      const tipo = colaTipos[i] ?? TIPOS[3];
      const categoria =
        fila.p1_nps >= 9 ? "Promotor" : fila.p1_nps >= 7 ? "Pasivo" : "Detractor";
      return {
        encuesta_id: 1000 - i,
        fecha: fila.fecha,
        hora: fila.hora,
        // creado_en existe en la API pero el cliente NO lo usa: se omite
        // a propósito (viene sin zona en el SQLite local).
        p1_nps: fila.p1_nps,
        p2_csat: fila.p1_nps >= 8 ? 4 : 3,
        p3_atributo: 4,
        p4_atributo: 4,
        p5_comentario: tipo.texto,
        categoria_nps: categoria,
        alerta: indicesConAlerta.has(i),
        tipo_comentario: tipo.etiqueta,
        bloque_horario: fila.bloque,
      };
    })
    .reverse();

  return {
    empresa: {
      empresa_id: config.id,
      nombre_negocio: config.nombre,
      rubro: config.rubro,
    },
    agregado: {
      respuestas: total,
      desde: "2026-10-19",
      hasta: "2026-10-31",
      nps: config.nps,
      promotores: config.dist[9] + config.dist[10],
      pasivos: config.dist[7] + config.dist[8],
      detractores: config.dist
        .slice(0, 7)
        .reduce((acum, cantidad) => acum + cantidad, 0),
      notas_8_a_10: config.dist[8] + config.dist[9] + config.dist[10],
      media_p1: config.mediaP1,
      csat: config.csat,
      media_p2: config.mediaP2,
      p3: config.p3,
      p4: config.p4,
      alertas: config.alertas,
      comentarios: config.comentarios,
      distribucion_p1: config.dist.map((cantidad, nota) => ({ nota, cantidad })),
      serie_diaria: config.serie.map(([fecha, cantidad]) => ({
        fecha,
        respuestas: cantidad,
        suma_p1: cantidad * 8,
        media_p1: 8,
      })),
    },
    respuestas,
  };
}

/** Ids del fixture (los mismos negocios sembrados en el servicio local). */
export const IDS_FIXTURE = [1, 2, 3, 4] as const;

/** Nombre del negocio en el fixture (útil para assert de la tabla). */
export function nombreFixture(empresaId: number): string {
  const config = EMPRESAS.find((e) => e.id === empresaId);
  if (!config) throw new Error(`Fixture sin empresa ${empresaId}`);
  return config.nombre;
}

/**
 * Fila de respuesta suelta para pruebas de reseñas: valores por defecto
 * válidos, sobrescribibles por campo.
 */
export function filaRespuestaPanel(
  parcial: Partial<{
    encuesta_id: number;
    fecha: string;
    hora: string;
    p1_nps: number;
    p5_comentario: string | null;
    categoria_nps: string;
    alerta: boolean;
    tipo_comentario: string;
    bloque_horario: string;
  }> = {},
): Record<string, unknown> {
  // Destructuring con defaults: SOLO aplica cuando la clave es
  // `undefined`. Un `p5_comentario: null` explícito se respeta como
  // null (con `??` un null caería al default y fabricaría comentarios).
  const {
    encuesta_id = 1,
    fecha = "2026-10-30",
    hora = "16:00:00",
    p1_nps = 8,
    p5_comentario = "Buen servicio.",
    categoria_nps = "Pasivo",
    alerta = false,
    tipo_comentario = "Sugerencia",
    bloque_horario = "Tarde",
  } = parcial;
  return {
    encuesta_id,
    fecha,
    hora,
    p1_nps,
    p2_csat: 4,
    p3_atributo: 4,
    p4_atributo: 4,
    p5_comentario,
    categoria_nps,
    alerta,
    tipo_comentario,
    bloque_horario,
  };
}

/**
 * Payload de panel mínimo con las respuestas indicadas (agregado
 * coherente de poca importancia: las pruebas de reseñas solo miran la
 * lista).
 */
export function payloadPanelConRespuestas(
  empresaId: number,
  respuestas: Record<string, unknown>[],
): Record<string, unknown> {
  const base = payloadPanelReal(1);
  const agregado = base.agregado as Record<string, unknown>;
  return {
    ...base,
    empresa: {
      empresa_id: empresaId,
      nombre_negocio: `Negocio ${empresaId}`,
      rubro: "Rubro de prueba",
    },
    agregado: {
      ...agregado,
      respuestas: respuestas.length,
      serie_diaria: [],
      distribucion_p1: [],
    },
    respuestas,
  };
}
