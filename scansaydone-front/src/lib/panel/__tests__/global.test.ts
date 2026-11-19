/// <reference types="vitest/globals" />
import { validarPanel, type PanelEmpresaDatos } from "@/lib/api/panel";
import { resumenGlobalDesdePaneles } from "@/lib/panel/global";
import { IDS_FIXTURE, payloadPanelReal } from "@/test/fixtures/panel";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/** Panel mínimo a partir de una lista de notas p1 (lo demás da igual). */
function panelDesdeNotas(empresaId: number, notas: readonly number[]): PanelEmpresaDatos {
  const promotores = notas.filter((n) => n >= 9).length;
  const detractores = notas.filter((n) => n <= 6).length;
  const total = notas.length;
  const nps = total === 0 ? null : ((promotores - detractores) / total) * 100;

  const payload = {
    empresa: {
      empresa_id: empresaId,
      nombre_negocio: `Negocio ${empresaId}`,
      rubro: "Rubro de prueba",
    },
    agregado: {
      respuestas: total,
      desde: null,
      hasta: null,
      nps,
      promotores,
      pasivos: total - promotores - detractores,
      detractores,
      notas_8_a_10: notas.filter((n) => n >= 8).length,
      media_p1: total === 0 ? null : notas.reduce((a, b) => a + b, 0) / total,
      csat: null,
      media_p2: null,
      p3: { etiqueta: "Atributo tres", media: null, top_box: null },
      p4: { etiqueta: "Atributo cuatro", media: null, top_box: null },
      alertas: 0,
      comentarios: { felicitacion: 0, reclamo: 0, sugerencia: 0, sin_comentario: 0 },
      distribucion_p1: [],
      serie_diaria: [],
    },
    respuestas: notas.map((nota, i) => ({
      encuesta_id: i + 1,
      fecha: "2026-10-20",
      hora: `12:0${i}:00`,
      p1_nps: nota,
      p2_csat: 4,
      p3_atributo: 4,
      p4_atributo: 4,
      p5_comentario: null,
      categoria_nps: nota >= 9 ? "Promotor" : nota >= 7 ? "Pasivo" : "Detractor",
      alerta: false,
      tipo_comentario: "Sin comentario",
      bloque_horario: "Tarde",
    })),
  };

  const panel = validarPanel(payload);
  if (panel === null) throw new Error("payload de prueba inválido");
  return panel;
}

/* ── Caso divergente: agrupar ≠ promediar ─────────────────────────────────── */

describe("recomendación neta general: contar desde filas, no promediar", () => {
  it("dos empresas con distinta cantidad de respuestas: −40,0 agrupado ≠ 22,2 promediado", () => {
    // Empresa A: 1 respuesta con nota 10 → 1 promotor, 0 detractores.
    //   Su recomendación neta: (1 − 0) / 1 × 100 = 100,0.
    const empresaA = panelDesdeNotas(1, [10]);
    // Empresa B: 9 respuestas [9, 9, 0×7] → 2 promotores, 7 detractores.
    //   Su recomendación neta: (2 − 7) / 9 × 100 = −55,555… → −55,6.
    const empresaB = panelDesdeNotas(2, [9, 9, 0, 0, 0, 0, 0, 0, 0]);

    const resumen = resumenGlobalDesdePaneles([empresaA, empresaB]);

    // ESPERADO (agrupado desde filas): Σpromotores = 3, Σdetractores = 7,
    // Σrespuestas = 10 → (3 − 7) / 10 × 100 = −40,0.
    expect(resumen.recomendacionNetaGeneral).toBe(-40);

    // Por qué difieren: el promedio simple de las recomendaciones netas
    // de cada empresa sería (100,0 + (−55,6)) / 2 = 22,2, que reflota la
    // opinión de la empresa con UNA respuesta al mismo peso que la de
    // nueve. Contar desde las filas pesa cada respuesta por igual y da
    // el −40,0 real. Assert explícito de que NO es el promedio:
    const npsA = 100; // (1 − 0) / 1
    const npsB = -55.6; // (2 − 7) / 9, redondeado a un decimal
    const promedioSimple = Math.round(((npsA + npsB) / 2) * 10) / 10; // 22,2
    expect(promedioSimple).toBe(22.2);
    expect(resumen.recomendacionNetaGeneral).not.toBe(promedioSimple);
    expect(resumen.recomendacionNetaGeneral).toBe(-40);
  });
});

/* ── Caso real: los 4 negocios del servicio local ─────────────────────────── */

describe("resumenGlobalDesdePaneles con el fixture real (4 negocios)", () => {
  const paneles = IDS_FIXTURE.map(
    (id) => validarPanel(payloadPanelReal(id))!,
  );
  const resumen = resumenGlobalDesdePaneles(paneles);

  it("totales: 80 respuestas, media general 8,1, recomendación neta general 26,3", () => {
    // Σp1 = 161 + 163 + 171 + 153 = 648 → 648 / 80 = 8,1 exacto.
    expect(resumen.totalRespuestas).toBe(80);
    expect(resumen.mediaGeneral).toBe(8.1);
    // Σpromotores = 42 (10+10+13+9), Σdetractores = 21 (5+5+3+8)
    // → (42 − 21) / 80 × 100 = 26,25 → 26,3 con un decimal.
    expect(resumen.recomendacionNetaGeneral).toBe(26.3);
  });

  it("distribución global: suma posición a posición de las 4 empresas (11 barras)", () => {
    expect(resumen.distribucion).toHaveLength(11);
    expect([...resumen.distribucion]).toEqual([0, 0, 1, 1, 3, 6, 10, 5, 12, 10, 32]);
    const suma = resumen.distribucion.reduce((a, b) => a + b, 0);
    expect(suma).toBe(80);
  });

  it("tabla por negocio: recomendación neta 25 / 25 / 50 / 5 y sus promotores/detractores", () => {
    expect(resumen.filas).toHaveLength(4);
    const porId = new Map(resumen.filas.map((f) => [f.empresaId, f]));
    expect(porId.get(1)?.recomendacionNeta).toBe(25);
    expect(porId.get(2)?.recomendacionNeta).toBe(25);
    expect(porId.get(3)?.recomendacionNeta).toBe(50);
    expect(porId.get(4)?.recomendacionNeta).toBe(5);
    expect(porId.get(3)?.promotores).toBe(13);
    expect(porId.get(4)?.detractores).toBe(8);
    expect(porId.get(1)?.mediaP1).toBe(8.05);
  });

  it("sin paneles: totales null, nunca 0 disfrazado", () => {
    const vacio = resumenGlobalDesdePaneles([]);
    expect(vacio.totalRespuestas).toBe(0);
    expect(vacio.mediaGeneral).toBeNull();
    expect(vacio.recomendacionNetaGeneral).toBeNull();
    expect(vacio.filas).toEqual([]);
  });
});
