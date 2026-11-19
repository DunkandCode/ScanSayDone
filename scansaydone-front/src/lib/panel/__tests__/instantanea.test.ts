/// <reference types="vitest/globals" />
import {
  instantanea,
  validarInstantanea,
  empresasDeInstantanea,
  respuestasDeEmpresa,
  fechaInstantanea,
  type RespuestaInstantanea,
} from "@/lib/panel/instantanea";

/* ── Instantánea real ─────────────────────────────────────────────────────── */

describe("instantánea local", () => {
  it("es válida y trae 4 negocios y 60 respuestas", () => {
    expect(instantanea.valida).toBe(true);
    expect(instantanea.empresas).toHaveLength(4);
    expect(instantanea.respuestas).toHaveLength(60);
  });

  it("cada negocio tiene 15 respuestas; ids desconocidos no tienen nada", () => {
    for (const id of [1, 2, 3, 4]) {
      expect(respuestasDeEmpresa(id)).toHaveLength(15);
    }
    expect(respuestasDeEmpresa(999)).toEqual([]);
  });

  it("expone los negocios con sus etiquetas p3/p4", () => {
    const empresas = empresasDeInstantanea();
    const e1 = empresas.find((e) => e.empresa_id === 1);
    expect(e1?.p3_label).toBe("Surtido y disponibilidad");
    expect(e1?.p4_label).toBe("Calidad de la atención");
    const e4 = empresas.find((e) => e.empresa_id === 4);
    expect(e4?.p4_label).toBe("Cumplimiento logístico");
  });

  it("formatea la fecha de generación en es-CL", () => {
    // generado_en "2026-11-18T23:20:25" → "18-11-2026".
    expect(fechaInstantanea()).toBe("18-11-2026");
  });
});

/* ── Validación defensiva: forma incorrecta → instantánea vacía ──────────── */

/** Respuesta válida mínima para mutar en cada caso. */
function respuestaValida(): Record<string, unknown> {
  return {
    empresa_id: 1,
    p1_nps: 9,
    p2_csat: 5,
    p3_atributo: 4,
    p4_atributo: 5,
    p5_comentario: "Buen servicio",
    fecha: "2026-11-18",
    hora: "23:19:05.000000",
    categoria_nps: "Promotor",
    alerta: "",
    tipo_comentario: "Felicitación",
    bloque_horario: "Noche",
    dia_semana: "Miércoles",
    semana_anio: 47,
    anio: 2026,
    mes_nombre: "Noviembre",
  };
}

function snapshotValido(): Record<string, unknown> {
  return {
    generado_en: "2026-11-18T23:20:25",
    fuente: "dev-local.db (SQLite local)",
    empresas: [
      {
        empresa_id: 1,
        nombre_negocio: "Minimarket Don Lucho",
        rubro_id: 1,
        rubro: "Minimarket / almacén de barrio",
        p3_label: "Surtido y disponibilidad",
        p4_label: "Calidad de la atención",
      },
    ],
    respuestas: [respuestaValida()],
  };
}

describe("validarInstantanea (defensivo)", () => {
  it("acepta un payload con la forma correcta", () => {
    const r = validarInstantanea(snapshotValido());
    expect(r.valida).toBe(true);
    expect(r.empresas).toHaveLength(1);
    expect(r.respuestas).toHaveLength(1);
  });

  it("rechaza null, arreglos y strings", () => {
    expect(validarInstantanea(null).valida).toBe(false);
    expect(validarInstantanea([]).valida).toBe(false);
    expect(validarInstantanea("snapshot").valida).toBe(false);
  });

  it("rechaza falta de generado_en o fuente", () => {
    const s1 = snapshotValido();
    delete s1.generado_en;
    expect(validarInstantanea(s1).valida).toBe(false);

    const s2 = snapshotValido();
    s2.fuente = "";
    expect(validarInstantanea(s2).valida).toBe(false);
  });

  it("rechaza empresa con p3_label faltante", () => {
    const s = snapshotValido();
    delete (s.empresas as Record<string, unknown>[])[0].p3_label;
    expect(validarInstantanea(s).valida).toBe(false);
  });

  it("rechaza respuesta con nota fuera de 0..10", () => {
    const s = snapshotValido();
    (s.respuestas as Record<string, unknown>[])[0].p1_nps = 11;
    expect(validarInstantanea(s).valida).toBe(false);
  });

  it("rechaza respuesta con p1_nps string o comentario numérico", () => {
    const s1 = snapshotValido();
    (s1.respuestas as Record<string, unknown>[])[0].p1_nps = "9";
    expect(validarInstantanea(s1).valida).toBe(false);

    const s2 = snapshotValido();
    (s2.respuestas as Record<string, unknown>[])[0].p5_comentario = 123;
    expect(validarInstantanea(s2).valida).toBe(false);
  });

  it("la instantánea vacía no rompe: sin empresas ni respuestas", () => {
    const r = validarInstantanea({ generado_en: "x", fuente: "y", empresas: [], respuestas: [] });
    expect(r.valida).toBe(true);
    expect(r.empresas).toEqual([]);
    expect(r.respuestas).toEqual([]);
  });
});

/* ── Compatibilidad estructural con calculos ──────────────────────────────── */

describe("compatibilidad con resumenEmpresa", () => {
  it("las respuestas de la instantánea sirven directo en resumenEmpresa", async () => {
    const { resumenEmpresa } = await import("@/lib/panel/calculos");
    const respuestas: readonly RespuestaInstantanea[] = respuestasDeEmpresa(1);
    const r = resumenEmpresa(respuestas);
    expect(r.total).toBe(15);
  });
});
