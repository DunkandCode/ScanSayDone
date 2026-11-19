/// <reference types="vitest/globals" />
import { validarPanel, type PuntoSerieDiaria, type RespuestaPanel } from "@/lib/api/panel";
import {
  agregarSerieDiaria,
  contarPorBloqueHorario,
  esMuestraMinima,
  MUESTRA_MINIMA,
  contarResenas,
} from "@/lib/panel/global";
import { formatearDiaMes } from "@/lib/panel/calculos";
import { IDS_FIXTURE, payloadPanelReal } from "@/test/fixtures/panel";

/* ── Gráfico por día: fusión de las series de los 4 negocios ──────────────── */

describe("agregarSerieDiaria", () => {
  it("fusiona las series reales en 13 días ordenados, sin rellenar huecos", () => {
    const series: PuntoSerieDiaria[][] = IDS_FIXTURE.map((id) => {
      const panel = validarPanel(payloadPanelReal(id));
      if (panel === null) throw new Error("fixture inválido");
      return [...panel.agregado.serie_diaria];
    });

    const fusion = agregarSerieDiaria(series);

    // 19 al 31 de octubre: 13 fechas, de la más antigua a la más reciente.
    expect(fusion).toHaveLength(13);
    expect(fusion[0].fecha).toBe("2026-10-19");
    expect(fusion.at(-1)!.fecha).toBe("2026-10-31");

    // Conteos verificados contra el servicio local (suma de las 4 series).
    expect(fusion.map((p) => p.respuestas)).toEqual([4, 5, 7, 5, 8, 5, 4, 8, 9, 5, 10, 4, 6]);

    // La fusión suma el total de respuestas de los 4 negocios.
    const total = fusion.reduce((acum, p) => acum + p.respuestas, 0);
    expect(total).toBe(80);
  });

  it("series vacías → lista vacía (sin barras inventadas)", () => {
    expect(agregarSerieDiaria([])).toEqual([]);
    expect(agregarSerieDiaria([[], []])).toEqual([]);
  });

  it("suma las respuestas de la misma fecha entre negocios", () => {
    const punto = (fecha: string, respuestas: number): PuntoSerieDiaria => ({
      fecha,
      respuestas,
      suma_p1: respuestas * 8,
      media_p1: 8,
    });
    expect(
      agregarSerieDiaria([
        [punto("2026-10-19", 2), punto("2026-10-21", 1)],
        [punto("2026-10-19", 3), punto("2026-10-20", 1)],
      ]),
    ).toEqual([
      { fecha: "2026-10-19", respuestas: 5 },
      { fecha: "2026-10-20", respuestas: 1 },
      { fecha: "2026-10-21", respuestas: 1 },
    ]);
  });
});

/* ── Gráfico por momento del día ──────────────────────────────────────────── */

describe("contarPorBloqueHorario y esMuestraMinima", () => {
  it("empresa 1 del fixture: 2 Mañana / 17 Tarde / 1 Noche", () => {
    const panel = validarPanel(payloadPanelReal(1));
    if (panel === null) throw new Error("fixture inválido");
    const conteo = contarPorBloqueHorario(panel.respuestas);

    // Conteos verificados contra el servicio local.
    expect(conteo).toEqual({ manana: 2, tarde: 17, noche: 1 });
    expect(conteo.manana + conteo.tarde + conteo.noche).toBe(20);
  });

  it("los cuatro negocios juntos: 15 / 63 / 2", () => {
    const filas: RespuestaPanel[] = IDS_FIXTURE.flatMap((id) => {
      const panel = validarPanel(payloadPanelReal(id));
      if (panel === null) throw new Error("fixture inválido");
      return [...panel.respuestas];
    });
    expect(contarPorBloqueHorario(filas)).toEqual({ manana: 15, tarde: 63, noche: 2 });
  });

  it("muestra mínima: <5 respuestas se marca, 5 o más no", () => {
    expect(MUESTRA_MINIMA).toBe(5);
    expect(esMuestraMinima(0)).toBe(true);
    expect(esMuestraMinima(1)).toBe(true); // Noche de la empresa 1
    expect(esMuestraMinima(2)).toBe(true); // Mañana de la empresa 1
    expect(esMuestraMinima(4)).toBe(true);
    expect(esMuestraMinima(5)).toBe(false);
    expect(esMuestraMinima(17)).toBe(false);
  });

  it("bloques desconocidos se ignoran (defensivo, sin categorías nuevas)", () => {
    const fila = {
      encuesta_id: 1,
      fecha: "2026-10-20",
      hora: "12:00:00",
      p1_nps: 8,
      p2_csat: 4,
      p3_atributo: 4,
      p4_atributo: 4,
      p5_comentario: null,
      categoria_nps: "Pasivo",
      alerta: false,
      tipo_comentario: "Sin comentario",
      bloque_horario: "Madrugada",
    } as unknown as RespuestaPanel;
    expect(contarPorBloqueHorario([fila])).toEqual({ manana: 0, tarde: 0, noche: 0 });
  });
});

/* ── Conteo de reseñas ────────────────────────────────────────────────────── */

describe("contarResenas", () => {
  it("cuenta total, con comentario y con alerta (alerta es boolean)", () => {
    const base = {
      encuesta_id: 1,
      fecha: "2026-10-20",
      hora: "12:00:00",
      p1_nps: 8,
      p2_csat: 4,
      p3_atributo: 4,
      p4_atributo: 4,
      categoria_nps: "Pasivo",
      tipo_comentario: "Sugerencia",
      bloque_horario: "Tarde",
    };
    const filas = [
      { ...base, p5_comentario: "Buen servicio.", alerta: false },
      { ...base, p5_comentario: null, alerta: true },
      { ...base, p5_comentario: "  ", alerta: true },
    ] as unknown as RespuestaPanel[];

    expect(contarResenas(filas)).toEqual({ total: 3, conComentario: 1, conAlerta: 2 });
  });
});

/* ── Rótulo dd-mm del gráfico por día ─────────────────────────────────────── */

describe("formatearDiaMes", () => {
  it("convierte YYYY-MM-DD a dd-mm", () => {
    expect(formatearDiaMes("2026-10-19")).toBe("19-10");
    expect(formatearDiaMes("2026-10-31")).toBe("31-10");
    expect(formatearDiaMes("2026-01-05")).toBe("05-01");
  });

  it("devuelve tal cual las entradas que no calzan con el patrón", () => {
    expect(formatearDiaMes("19-10-2026")).toBe("19-10-2026");
    expect(formatearDiaMes("")).toBe("");
  });
});
