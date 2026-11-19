"use client";

/**
 * Reseñas del negocio seleccionado, leídas de la instantánea local de
 * datos de prueba (`src/data/local-snapshot.json`).
 *
 * - Reacciona a `empresaId`: cambiar el selector cambia la lista.
 * - Etiqueta obligatoria siempre visible mientras la sección exista:
 *   "Datos de prueba locales · instantánea del {fecha} · no son clientes
 *   reales". Sin claims de clientes reales ni de "tiempo real".
 * - Instantánea inválida (`valida: false`): el contenido del módulo se
 *   oculta y queda solo el mensaje "No hay datos locales disponibles.".
 * - Lista `<ul>`/`<li>` semántica: dentro de cada ítem no hay controles
 *   interactivos anidados. Orden: más reciente primero por `fecha`+`hora`.
 * - Filtro único de lado del cliente (sin volver a consultar datos):
 *   Todas / Con comentario / Con alerta. El conteo visible se anuncia
 *   con `role="status"`.
 * - Alerta: etiqueta "Requiere atención" con ícono + texto (el color
 *   nunca es el único canal).
 * - Lenguaje visual de las tarjetas del panel: superficie blanca, borde
 *   #D9C0A0, radio 8, sin sombra.
 */
import { useMemo, useState } from "react";
import { resumenEmpresa, formatearFechaCL } from "@/lib/panel/calculos";
import type { RespuestaInstantanea } from "@/lib/panel/instantanea";
import {
  instantanea,
  respuestasDeEmpresa,
  fechaInstantanea,
} from "@/lib/panel/instantanea";

type FiltroResenas = "todas" | "comentario" | "alerta";

const OPCIONES_FILTRO: readonly { valor: FiltroResenas; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "comentario", etiqueta: "Con comentario" },
  { valor: "alerta", etiqueta: "Con alerta" },
];

function tieneComentario(r: RespuestaInstantanea): boolean {
  return typeof r.p5_comentario === "string" && r.p5_comentario.trim() !== "";
}

function tieneAlerta(r: RespuestaInstantanea): boolean {
  return typeof r.alerta === "string" && r.alerta.trim() !== "";
}

/** Más reciente primero: `fecha` ("YYYY-MM-DD") + `hora` comparadas como texto. */
function masRecientePrimero(a: RespuestaInstantanea, b: RespuestaInstantanea) {
  return `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`);
}

export function ResenasNegocio({ empresaId }: { empresaId: number | null }) {
  const [filtro, setFiltro] = useState<FiltroResenas>("todas");
  const fecha = useMemo(() => fechaInstantanea(), []);

  const respuestas = useMemo(
    () => (empresaId === null ? [] : respuestasDeEmpresa(empresaId)),
    [empresaId],
  );
  const resumen = useMemo(() => resumenEmpresa(respuestas), [respuestas]);

  const visibles = useMemo(() => {
    const ordenadas = [...respuestas].sort(masRecientePrimero);
    if (filtro === "comentario") return ordenadas.filter(tieneComentario);
    if (filtro === "alerta") return ordenadas.filter(tieneAlerta);
    return ordenadas;
  }, [respuestas, filtro]);

  // Instantánea inválida: el contenido del módulo se oculta y queda solo
  // el mensaje explícito. Sin id todavía: nada que mostrar.
  if (!instantanea.valida) {
    return (
      <p className="mt-6 font-ui text-[14px] text-text-secondary">
        No hay datos locales disponibles.
      </p>
    );
  }
  if (empresaId === null) return null;

  return (
    <section aria-labelledby="resenas-title" className="mt-6 lg:mt-8">
      <h2
        id="resenas-title"
        className="flex items-center gap-[10px] font-ui text-[16px] font-bold text-text-primary lg:text-[18px]"
      >
        <span
          aria-hidden="true"
          className="inline-block shrink-0 rounded-[1px]"
          style={{ width: 3, height: 16, background: "#8A6F55" }}
        />
        Reseñas de este negocio
      </h2>

      {/* Etiqueta obligatoria: origen de los datos, siempre visible. */}
      <p className="mt-2 font-ui text-[13px] text-text-secondary">
        Datos de prueba locales · instantánea del {fecha} · no son clientes
        reales
      </p>

      {resumen.total === 0 ? (
        <p className="mt-4 font-ui text-[14px] text-text-secondary">
          Sin respuestas registradas para este negocio.
        </p>
      ) : (
        <>
          {/* Resumen del negocio: total, con comentario, con alerta. */}
          <p className="mt-4 font-ui text-[14px] text-text-primary">
            {resumen.total} {resumen.total === 1 ? "reseña" : "reseñas"} ·{" "}
            {resumen.conComentario} con comentario · {resumen.conAlerta} con
            alerta
          </p>

          {/* Filtro único, de lado del cliente (sin volver a pedir datos). */}
          <div className="mt-4 w-full max-w-[320px]">
            <label
              htmlFor="filtro-resenas"
              className="block font-ui text-[13px] font-semibold text-text-secondary"
            >
              Filtrar reseñas
            </label>
            <div className="relative mt-1">
              <select
                id="filtro-resenas"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value as FiltroResenas)}
                className="h-[44px] w-full appearance-none rounded-[6px] border border-border-mid bg-surface-default pl-3 pr-10 font-ui text-[14px] text-text-primary hover:border-text-primary focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary"
              >
                {OPCIONES_FILTRO.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.etiqueta}
                  </option>
                ))}
              </select>
              {/* Chevron propio (sin flecha del navegador). */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-primary"
              >
                <polyline points="4,7.5 10,13 16,7.5" />
              </svg>
            </div>
          </div>

          {/* Conteo visible, anunciado a lectores de pantalla. */}
          <p role="status" className="mt-3 font-ui text-[13px] text-text-secondary">
            Mostrando {visibles.length} de {resumen.total}{" "}
            {resumen.total === 1 ? "reseña" : "reseñas"}
          </p>

          {visibles.length === 0 ? (
            <p className="mt-4 font-ui text-[14px] text-text-secondary">
              No hay reseñas con ese filtro.
            </p>
          ) : (
            <ul
              aria-label="Reseñas del negocio, de la más reciente a la más antigua"
              className="mt-4 flex flex-col gap-3"
            >
              {visibles.map((r, indice) => (
                <li
                  key={`${r.fecha}-${r.hora}-${indice}`}
                  className="min-w-0 rounded-[8px] border p-4"
                  style={{ background: "#FFFFFF", borderColor: "#D9C0A0" }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="shrink-0 rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-1 font-ui text-[13px] font-semibold tabular-nums text-text-primary">
                      {r.p1_nps} / 10
                    </span>

                    {tieneAlerta(r) && <EtiquetaAlerta />}

                    {/* Etiqueta neutra del tipo de comentario. Cuando no hay
                        comentario y el tipo es justamente "Sin comentario",
                        la etiqueta sería redundante con el texto del ítem. */}
                    {r.tipo_comentario.trim() !== "" &&
                      !(r.tipo_comentario === "Sin comentario" && !tieneComentario(r)) && (
                        <span className="min-w-0 break-words rounded-[4px] border border-border-subtle px-2 py-1 font-ui text-[12px] text-text-secondary">
                          {r.tipo_comentario}
                        </span>
                      )}

                    <span className="ml-auto shrink-0 font-ui text-[13px] tabular-nums text-text-secondary">
                      {formatearFechaCL(r.fecha)}
                    </span>
                  </div>

                  <p className="mt-3 min-w-0 break-words font-ui text-[14px] text-text-primary">
                    {tieneComentario(r) ? (
                      r.p5_comentario
                    ) : (
                      <span className="text-text-secondary">Sin comentario</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

/* ── Etiqueta de alerta: ícono + texto, nunca solo color ──────────────────── */

function EtiquetaAlerta() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[4px] border px-2 py-1 font-ui text-[12px] font-semibold"
      style={{
        color: "#A82E39",
        borderColor: "#A82E39",
        background: "color-mix(in srgb, #A82E39 8%, #FFFFFF)",
      }}
    >
      {/* Ícono de advertencia propio (sin dependencias). */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M10 3.5 2.5 16.5h15L10 3.5Z" />
        <line x1="10" y1="8.5" x2="10" y2="12" />
        <circle cx="10" cy="14.4" r="0.5" fill="currentColor" stroke="none" />
      </svg>
      Requiere atención
    </span>
  );
}
