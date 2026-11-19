"use client";

/**
 * Resultados del negocio seleccionado, calculados desde la instantánea
 * local de datos de prueba (`src/data/local-snapshot.json`).
 *
 * - Reacciona a `empresaId`: cambiar el selector cambia los números.
 * - Etiqueta obligatoria siempre visible mientras la sección exista:
 *   "Datos de prueba locales · instantánea del {fecha} · no son clientes
 *   reales". Sin claims de clientes reales ni de "tiempo real".
 * - Instantánea inválida (`valida: false`): la sección se oculta y los
 *   bloques DEMO del panel quedan intactos.
 * - Negocio sin respuestas: mensaje explícito, no ceros disfrazados.
 * - Lenguaje visual de las tarjetas del panel (mismas constantes que el
 *   resumen: filete #8A6F55, borde #D9C0A0, tonos por rango de nota).
 */
import { useMemo } from "react";
import { resumenEmpresa, formatear1 } from "@/lib/panel/calculos";
import {
  instantanea,
  empresasDeInstantanea,
  respuestasDeEmpresa,
  fechaInstantanea,
} from "@/lib/panel/instantanea";

export function ResultadosNegocio({ empresaId }: { empresaId: number | null }) {
  const fecha = useMemo(() => fechaInstantanea(), []);
  const empresa = useMemo(
    () =>
      empresaId === null
        ? undefined
        : empresasDeInstantanea().find((e) => e.empresa_id === empresaId),
    [empresaId],
  );
  const resumen = useMemo(
    () =>
      empresaId === null ? null : resumenEmpresa(respuestasDeEmpresa(empresaId)),
    [empresaId],
  );

  // Instantánea inválida: la sección entera se oculta (los bloques DEMO
  // del panel siguen igual). Sin id todavía: nada que mostrar.
  if (!instantanea.valida || empresaId === null) return null;

  const sinDatos = resumen === null || resumen.total === 0;

  return (
    <section aria-labelledby="resultados-title" className="mt-6 lg:mt-8">
      <h2
        id="resultados-title"
        className="flex items-center gap-[10px] font-ui text-[16px] font-bold text-text-primary xs:text-[16px] lg:text-[18px]"
      >
        <span
          aria-hidden="true"
          className="inline-block shrink-0 rounded-[1px]"
          style={{ width: 3, height: 16, background: "#8A6F55" }}
        />
        Resultados de este negocio
      </h2>

      {/* Etiqueta obligatoria: origen de los datos, siempre visible. */}
      <p className="mt-2 font-ui text-[13px] text-text-secondary">
        Datos de prueba locales · instantánea del {fecha} · no son clientes
        reales
      </p>

      {sinDatos ? (
        <p className="mt-4 font-ui text-[14px] text-text-secondary">
          Sin respuestas registradas para este negocio.
        </p>
      ) : (
        <>
          {/* Cuatro cifras del resumen */}
          <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
            <Cifra
              label="Respuestas"
              value={String(resumen!.total)}
              detail="en la instantánea local"
            />
            <Cifra
              label="Media nota 1"
              value={
                resumen!.mediaP1 === null ? "—" : formatear1(resumen!.mediaP1)
              }
              detail="de la 0 a la 10"
            />
            <Cifra
              label="Promotores"
              value={String(resumen!.promotores)}
              detail="notas 9 y 10"
            />
            <Cifra
              label="Recomendación neta"
              value={resumen!.nps === null ? "—" : formatear1(resumen!.nps)}
              detail="va de -100 a 100"
            />
          </div>

          {/* Distribución + medias por pregunta */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DistribucionNotas distribucion={resumen!.distribucion} />

            <div
              className="rounded-[8px] border p-4 xs:p-5"
              style={{ background: "#FFFFFF", borderColor: "#D9C0A0" }}
            >
              <h3 className="font-ui text-[14px] font-bold text-text-primary">
                Medias por pregunta
              </h3>
              <dl className="mt-3 flex flex-col gap-2">
                <MediaPregunta
                  etiqueta="Satisfacción general"
                  escala="de la 1 a la 5"
                  valor={resumen!.mediaP2}
                />
                <MediaPregunta
                  etiqueta={empresa?.p3_label ?? "Pregunta 3"}
                  escala="de la 1 a la 5"
                  valor={resumen!.mediaP3}
                />
                <MediaPregunta
                  etiqueta={empresa?.p4_label ?? "Pregunta 4"}
                  escala="de la 1 a la 5"
                  valor={resumen!.mediaP4}
                />
              </dl>
              <p className="mt-4 font-ui text-[13px] text-text-secondary">
                {resumen!.conComentario} con comentario · {resumen!.conAlerta}{" "}
                con alerta
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* ── Cifra (lenguaje de tarjeta del panel, sin medallón) ──────────────────── */

function Cifra({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[8px] border p-4"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, color-mix(in srgb, #F0D8BD 24%, #FFFFFF) 100%)",
        borderTop: "3px solid #8A6F55",
        borderColor: "#D9C0A0",
      }}
    >
      <p className="font-ui text-[13px] font-semibold text-text-secondary">
        {label}
      </p>
      <p className="mt-1 font-display text-[32px] leading-none tabular-nums text-text-primary">
        {value}
      </p>
      <p className="mt-2 font-ui text-[12px] text-text-secondary">{detail}</p>
    </div>
  );
}

/* ── Distribución 0–10 (lista compacta, tonos por rango) ──────────────────── */

/** Tonos por rango de nota: 0-6 / 7-8 / 9-10. */
function tonoNota(nota: number): string {
  if (nota <= 6) return "#8A6F55";
  if (nota <= 8) return "color-mix(in srgb, #1A181B 20%, #8A6F55)";
  return "color-mix(in srgb, #1A181B 40%, #8A6F55)";
}

function DistribucionNotas({ distribucion }: { distribucion: readonly number[] }) {
  const max = Math.max(...distribucion, 1);
  return (
    <div
      className="rounded-[8px] border p-4 xs:p-5"
      style={{ background: "#FFFFFF", borderColor: "#D9C0A0" }}
    >
      <h3 className="font-ui text-[14px] font-bold text-text-primary">
        Cómo se repartieron las notas
      </h3>
      <ul
        className="mt-3 flex flex-col gap-1.5"
        aria-label="Cantidad de respuestas por nota, de la 0 a la 10"
      >
        {distribucion.map((count, nota) => (
          <li key={nota} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-right font-ui text-[13px] tabular-nums text-text-secondary">
              {nota}
            </span>
            <div className="h-[18px] min-w-0 flex-1" aria-hidden="true">
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${(count / max) * 100}%`,
                  background: tonoNota(nota),
                }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-ui text-[12px] tabular-nums text-text-secondary">
              {count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Media de una pregunta (fila compacta) ────────────────────────────────── */

function MediaPregunta({
  etiqueta,
  escala,
  valor,
}: {
  etiqueta: string;
  escala: string;
  valor: number | null;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 font-ui text-[13px] text-text-secondary">
        {etiqueta}{" "}
        <span className="text-[12px]">({escala})</span>
      </dt>
      <dd className="shrink-0 font-ui text-[16px] font-semibold tabular-nums text-text-primary">
        {valor === null ? "—" : formatear1(valor)}
      </dd>
    </div>
  );
}
