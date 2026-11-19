/// <reference types="vitest/globals" />
import {
  resumenEmpresa,
  redondear1,
  formatear1,
  formatearMedia,
  formatearFechaCL,
  formatearDiaMes,
  type RespuestaResumen,
} from "@/lib/panel/calculos";

/* ── Filas sintéticas con la forma del snapshot (p1_nps, p2_csat, …) ──────── */

/** Fila válida mínima, sobrescribible por campo. */
function fila(parcial: Partial<RespuestaResumen> = {}): RespuestaResumen {
  return {
    p1_nps: 9,
    p2_csat: 5,
    p3_atributo: 4,
    p4_atributo: 5,
    p5_comentario: "Buen servicio",
    alerta: "",
    tipo_comentario: "Felicitación",
    ...parcial,
  };
}

/* ── resumenEmpresa con filas sintéticas ──────────────────────────────────── */

describe("resumenEmpresa con filas sintéticas", () => {
  it("13 promotores, 2 pasivos y 0 detractores → recomendación neta 86,7", () => {
    const filas: RespuestaResumen[] = [
      ...Array.from({ length: 13 }, () => fila({ p1_nps: 9 })),
      ...Array.from({ length: 2 }, () => fila({ p1_nps: 7 })),
    ];
    const r = resumenEmpresa(filas);
    expect(r.total).toBe(15);
    expect(r.promotores).toBe(13);
    expect(r.pasivos).toBe(2);
    expect(r.detractores).toBe(0);
    expect(r.nps).toBe(86.7); // 13/15 − 0/15 = 86,666… → 86,7
  });

  it("empate promotores/detractores → recomendación neta 0 real", () => {
    const filas: RespuestaResumen[] = [
      ...Array.from({ length: 5 }, () => fila({ p1_nps: 9 })),
      ...Array.from({ length: 5 }, () => fila({ p1_nps: 7 })),
      ...Array.from({ length: 5 }, () => fila({ p1_nps: 0 })),
    ];
    const r = resumenEmpresa(filas);
    expect(r.nps).toBe(0);
    expect(r.mediaP1).toBe(5.3); // (9×5 + 7×5 + 0×5) / 15 = 80 / 15 = 5,333… → 5,3
  });

  it("distribución de 11 casillas que suma el total", () => {
    const filas: RespuestaResumen[] = [
      fila({ p1_nps: 8 }),
      fila({ p1_nps: 9 }),
      fila({ p1_nps: 9 }),
      fila({ p1_nps: 10 }),
      fila({ p1_nps: 10 }),
    ];
    const r = resumenEmpresa(filas);
    expect(r.distribucion).toHaveLength(11);
    expect(r.distribucion.reduce((a, b) => a + b, 0)).toBe(5);
    expect(r.distribucion[10]).toBe(2);
    expect(r.distribucion[9]).toBe(2);
    expect(r.distribucion[8]).toBe(1);
  });

  it("comentarios, alertas y tipos contados por fila", () => {
    const filas: RespuestaResumen[] = [
      fila({ p5_comentario: "Excelente", tipo_comentario: "Felicitación" }),
      fila({ p5_comentario: null, tipo_comentario: "Sin comentario" }),
      fila({ p5_comentario: null, tipo_comentario: "Sin comentario" }),
      fila({ p5_comentario: "Lento", alerta: "nota baja", tipo_comentario: "Reclamo" }),
    ];
    const r = resumenEmpresa(filas);
    expect(r.conComentario).toBe(2);
    expect(r.conAlerta).toBe(1);
    expect(r.porTipoComentario.get("Sin comentario")).toBe(2);
    expect(r.porTipoComentario.get("Felicitación")).toBe(1);
    expect(r.porTipoComentario.get("Reclamo")).toBe(1);
  });
});

/* ── Guard de cero respuestas ─────────────────────────────────────────────── */

describe("resumenEmpresa sin respuestas", () => {
  it("cero respuestas: medias y recomendación neta null, nunca 0 disfrazado", () => {
    const r = resumenEmpresa([]);
    expect(r.total).toBe(0);
    expect(r.mediaP1).toBeNull();
    expect(r.mediaP2).toBeNull();
    expect(r.mediaP3).toBeNull();
    expect(r.mediaP4).toBeNull();
    expect(r.nps).toBeNull();
    expect(r.promotores).toBe(0);
    expect(r.pasivos).toBe(0);
    expect(r.detractores).toBe(0);
    expect(r.conComentario).toBe(0);
    expect(r.conAlerta).toBe(0);
    expect(r.distribucion).toHaveLength(11);
    expect(r.distribucion.every((n) => n === 0)).toBe(true);
    expect(r.porTipoComentario.size).toBe(0);
  });
});

/* ── Helpers ──────────────────────────────────────────────────────────────── */

describe("redondear1, formatear1 y formatearMedia", () => {
  it("redondea a un decimal", () => {
    expect(redondear1(86.666666)).toBe(86.7);
    expect(redondear1(7.066666)).toBe(7.1);
    expect(redondear1(8.866666)).toBe(8.9);
    expect(redondear1(-20)).toBe(-20);
    expect(redondear1(0)).toBe(0);
  });

  it("formatea con coma decimal (es-CL)", () => {
    expect(formatear1(9.3)).toBe("9,3");
    expect(formatear1(-20)).toBe("-20,0");
    expect(formatear1(0)).toBe("0,0");
    expect(formatear1(86.7)).toBe("86,7");
  });

  it("formatea medias con hasta dos decimales (8.05 no se pierde)", () => {
    expect(formatearMedia(8.05)).toBe("8,05");
    expect(formatearMedia(8.1)).toBe("8,1");
    expect(formatearMedia(7.65)).toBe("7,65");
    expect(formatearMedia(3.75)).toBe("3,75");
    expect(formatearMedia(-20)).toBe("-20,0");
  });
});

/* ── Fechas es-CL ─────────────────────────────────────────────────────────── */

describe("formatearFechaCL y formatearDiaMes", () => {
  it("convierte YYYY-MM-DD a dd-mm-yyyy sin depender de la zona horaria", () => {
    expect(formatearFechaCL("2026-10-31")).toBe("31-10-2026");
    expect(formatearFechaCL("2026-01-05")).toBe("05-01-2026");
    expect(formatearFechaCL("2025-12-31")).toBe("31-12-2025");
  });

  it("formatearFechaCL devuelve tal cual las entradas que no calzan", () => {
    expect(formatearFechaCL("18-11-2026")).toBe("18-11-2026");
    expect(formatearFechaCL("2026-10-31T18:19:00")).toBe("2026-10-31T18:19:00");
    expect(formatearFechaCL("")).toBe("");
  });

  it("formatearDiaMes convierte a dd-mm para los rótulos del gráfico", () => {
    expect(formatearDiaMes("2026-10-19")).toBe("19-10");
    expect(formatearDiaMes("2026-10-31")).toBe("31-10");
    expect(formatearDiaMes("no-fecha")).toBe("no-fecha");
  });
});
