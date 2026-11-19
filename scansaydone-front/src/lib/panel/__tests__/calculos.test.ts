/// <reference types="vitest/globals" />
import {
  resumenEmpresa,
  redondear1,
  formatear1,
  formatearFechaCL,
} from "@/lib/panel/calculos";
import { respuestasDeEmpresa } from "@/lib/panel/instantanea";

/* ── Instantánea real: los cuatro negocios ────────────────────────────────── */

describe("resumenEmpresa con la instantánea real", () => {
  it("empresa 1: 15 respuestas, media 9,3, 13 promotores, recomendación neta 86,7", () => {
    const r = resumenEmpresa(respuestasDeEmpresa(1));
    expect(r.total).toBe(15);
    expect(r.mediaP1).toBe(9.3); // 140/15 = 9,333…
    expect(r.promotores).toBe(13);
    expect(r.pasivos).toBe(2);
    expect(r.detractores).toBe(0);
    expect(r.nps).toBe(86.7); // 13/15 − 0/15 = 86,666… → 86,7
  });

  it("empresa 2: media 7,0 y recomendación neta 0 (empate real, no falso)", () => {
    const r = resumenEmpresa(respuestasDeEmpresa(2));
    expect(r.total).toBe(15);
    expect(r.mediaP1).toBe(7.0); // 105/15
    expect(r.promotores).toBe(5);
    expect(r.pasivos).toBe(5);
    expect(r.detractores).toBe(5);
    expect(r.nps).toBe(0);
  });

  it("empresa 3: media 7,1 (7,066…), 0 promotores, recomendación neta -20", () => {
    const r = resumenEmpresa(respuestasDeEmpresa(3));
    expect(r.total).toBe(15);
    expect(r.mediaP1).toBe(7.1); // 106/15 = 7,066… → 7,1
    expect(r.promotores).toBe(0);
    expect(r.pasivos).toBe(12);
    expect(r.detractores).toBe(3);
    expect(r.nps).toBe(-20);
  });

  it("empresa 4: media 8,9 (8,866…), recomendación neta 80", () => {
    const r = resumenEmpresa(respuestasDeEmpresa(4));
    expect(r.total).toBe(15);
    expect(r.mediaP1).toBe(8.9); // 133/15 = 8,866… → 8,9
    expect(r.promotores).toBe(13);
    expect(r.pasivos).toBe(1);
    expect(r.detractores).toBe(1);
    expect(r.nps).toBe(80);
  });

  it("la distribución tiene 11 casillas y suma el total en cada empresa", () => {
    for (const id of [1, 2, 3, 4]) {
      const r = resumenEmpresa(respuestasDeEmpresa(id));
      expect(r.distribucion).toHaveLength(11);
      const suma = r.distribucion.reduce((a, b) => a + b, 0);
      expect(suma).toBe(r.total);
    }
  });

  it("empresa 1: distribución 8→2, 9→6, 10→7; 10 con comentario, 0 con alerta", () => {
    const r = resumenEmpresa(respuestasDeEmpresa(1));
    expect(r.distribucion[8]).toBe(2);
    expect(r.distribucion[9]).toBe(6);
    expect(r.distribucion[10]).toBe(7);
    expect(r.conComentario).toBe(10);
    expect(r.conAlerta).toBe(0);
    expect(r.mediaP2).toBe(4.7); // 70/15 = 4,666…
    expect(r.mediaP3).toBe(4.4); // 66/15
    expect(r.mediaP4).toBe(4.6); // 69/15
  });

  it("empresa 1: tipos de comentario contados en mapa", () => {
    const r = resumenEmpresa(respuestasDeEmpresa(1));
    expect(r.porTipoComentario.get("Felicitación")).toBe(8);
    expect(r.porTipoComentario.get("Sin comentario")).toBe(5);
    expect(r.porTipoComentario.get("Sugerencia / mixto")).toBe(2);
  });

  it("empresa 2 y 3: alertas contadas (5 y 3)", () => {
    expect(resumenEmpresa(respuestasDeEmpresa(2)).conAlerta).toBe(5);
    expect(resumenEmpresa(respuestasDeEmpresa(3)).conAlerta).toBe(3);
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

describe("redondear1 y formatear1", () => {
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
});

/* ── Fecha es-CL (dd-mm-yyyy) ─────────────────────────────────────────────── */

describe("formatearFechaCL", () => {
  it("convierte YYYY-MM-DD a dd-mm-yyyy sin depender de la zona horaria", () => {
    expect(formatearFechaCL("2026-11-18")).toBe("18-11-2026");
    expect(formatearFechaCL("2026-01-05")).toBe("05-01-2026");
    expect(formatearFechaCL("2025-12-31")).toBe("31-12-2025");
  });

  it("devuelve tal cual las entradas que no calzan con el patrón", () => {
    expect(formatearFechaCL("18-11-2026")).toBe("18-11-2026");
    expect(formatearFechaCL("2026-11-18T23:20:25")).toBe("2026-11-18T23:20:25");
    expect(formatearFechaCL("")).toBe("");
  });
});
