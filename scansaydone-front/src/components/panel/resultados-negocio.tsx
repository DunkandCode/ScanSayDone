"use client";

/**
 * Resultados del negocio seleccionado, leídos del servicio:
 * `GET /api/v1/empresas/{empresa_id}/panel`.
 *
 * - Reacciona a `empresaId`: cambiar el selector vuelve a consultar.
 *   Patrón de `encuesta-definida.tsx` (AbortController + resultado por
 *   id; el estado de carga se deriva comparando ids, sin setState
 *   síncrono en el efecto).
 * - Todas las cifras salen de `agregado` (son los números oficiales del
 *   negocio): recomendación neta, media nota 1, promotores/pasivos/
 *   detractores, satisfacción, p3/p4 con la etiqueta que define la API,
 *   alertas y comentarios por tipo. La distribución usa
 *   `distribucion_p1` (11 barras).
 * - Estados honestos: cargando, «No encontramos este negocio.» (404),
 *   «No se pudo consultar el servicio.» (5xx / red / respuesta ilegible)
 *   y «Sin respuestas registradas…» — siempre SIN cifras inventadas.
 * - Etiqueta obligatoria siempre visible mientras la sección exista.
 */
import { useEffect, useState } from "react";
import { obtenerPanelEmpresa, type PanelEmpresaDatos } from "@/lib/api/panel";
import { formatear1, formatearMedia } from "@/lib/panel/calculos";
import { ETIQUETA_SIMULADOS } from "@/lib/panel/etiqueta";

type DatoResultados =
  | { tipo: "ok"; panel: PanelEmpresaDatos }
  | { tipo: "no-encontrada" }
  | { tipo: "sin-respuestas" }
  | { tipo: "fallo" };

export function ResultadosNegocio({ empresaId }: { empresaId: number | null }) {
  // Resultado por id: la carga se deriva comparando el id guardado con
  // el actual (sin setState síncrono en el efecto).
  const [resultado, setResultado] = useState<{
    id: number;
    dato: DatoResultados;
  } | null>(null);

  useEffect(() => {
    if (empresaId === null) return;
    const controller = new AbortController();
    obtenerPanelEmpresa(empresaId, controller.signal).then((res) => {
      // Consulta abortada (cambio de id o desmonte): el estado lo
      // escribe la consulta vigente, no esta.
      if (controller.signal.aborted) return;
      if (res.estado === "ok") {
        const sinRespuestas = res.panel.agregado.respuestas === 0;
        setResultado({
          id: empresaId,
          dato: sinRespuestas
            ? { tipo: "sin-respuestas" }
            : { tipo: "ok", panel: res.panel },
        });
      } else if (res.estado === "no-encontrada") {
        setResultado({ id: empresaId, dato: { tipo: "no-encontrada" } });
      } else {
        // no-disponible | error
        setResultado({ id: empresaId, dato: { tipo: "fallo" } });
      }
    });
    return () => controller.abort();
  }, [empresaId]);

  if (empresaId === null) return null;

  // Vigente: si el guardado es de otro id (o aún no hay), la consulta
  // del id actual sigue en curso.
  const vigente =
    resultado !== null && resultado.id === empresaId ? resultado.dato : null;

  return (
    <section aria-labelledby="resultados-title" className="mt-6 lg:mt-8">
      <h2
        id="resultados-title"
        className="flex items-center gap-[10px] font-ui text-[16px] font-bold text-text-primary lg:text-[18px]"
      >
        <span
          aria-hidden="true"
          className="inline-block h-[16px] w-[3px] shrink-0 rounded-[1px] bg-border-mid"
        />
        Resultados de este negocio
      </h2>

      {/* Etiqueta obligatoria: origen de los datos, siempre visible. */}
      <p className="mt-2 font-ui text-[13px] text-text-secondary">
        {ETIQUETA_SIMULADOS}
      </p>

      {vigente === null && (
        <p role="status" className="mt-4 font-ui text-[14px] text-text-secondary">
          Consultando los resultados del servicio…
        </p>
      )}

      {vigente?.tipo === "no-encontrada" && (
        <p className="mt-4 font-ui text-[14px] text-text-secondary">
          No encontramos este negocio.
        </p>
      )}

      {vigente?.tipo === "fallo" && (
        <p role="status" className="mt-4 font-ui text-[14px] text-text-secondary">
          No se pudo consultar el servicio.
        </p>
      )}

      {vigente?.tipo === "sin-respuestas" && (
        <p className="mt-4 font-ui text-[14px] text-text-secondary">
          Sin respuestas registradas para este negocio.
        </p>
      )}

      {vigente?.tipo === "ok" && <Tarjetas panel={vigente.panel} />}
    </section>
  );
}

/* ── Tarjetas del negocio (fase ok) ───────────────────────────────────────── */

function Tarjetas({ panel }: { panel: PanelEmpresaDatos }) {
  const a = panel.agregado;
  return (
    <>
      {/* Cuatro cifras principales */}
      <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <Cifra
          label="Recomendación neta"
          value={a.nps === null ? "—" : formatear1(a.nps)}
          detail="va de -100 a 100"
        />
        <Cifra
          label="Media"
          value={a.media_p1 === null ? "—" : formatearMedia(a.media_p1)}
          detail="nota 1, de la 0 a la 10"
        />
        <Cifra
          label="Satisfacción"
          value={a.csat === null ? "—" : `${formatear1(a.csat)} %`}
          detail="% respondieron 4 o 5"
        />
        <Cifra
          label="Requiere atención"
          value={String(a.alertas)}
          detail={
            a.alertas === 1 ? "respuesta por revisar" : "respuestas por revisar"
          }
        />
      </div>

      {/* Clasificación + atributos + comentarios */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
          <h3 className="font-ui text-[14px] font-bold text-text-primary">
            Cómo se repartieron las respuestas
          </h3>
          <dl className="mt-3 flex flex-col gap-2">
            <Valor etiqueta="Promotores" detalle="notas 9 y 10">
              {String(a.promotores)}
            </Valor>
            <Valor etiqueta="Pasivos" detalle="notas 7 y 8">
              {String(a.pasivos)}
            </Valor>
            <Valor etiqueta="Detractores" detalle="notas de la 0 a la 6">
              {String(a.detractores)}
            </Valor>
          </dl>
          <p className="mt-4 font-ui text-[13px] text-text-secondary">
            Comentarios: {a.comentarios.felicitacion} felicitaciones ·{" "}
            {a.comentarios.reclamo} reclamos · {a.comentarios.sugerencia}{" "}
            sugerencias · {a.comentarios.sin_comentario} sin comentario
          </p>
        </div>

        <div className="rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
          <h3 className="font-ui text-[14px] font-bold text-text-primary">
            Atributos del negocio
          </h3>
          <dl className="mt-3 flex flex-col gap-2">
            <Atributo
              etiqueta={a.p3.etiqueta}
              media={a.p3.media}
              topBox={a.p3.top_box}
            />
            <Atributo
              etiqueta={a.p4.etiqueta}
              media={a.p4.media}
              topBox={a.p4.top_box}
            />
          </dl>
          <p className="mt-4 font-ui text-[12px] text-text-secondary">
            Media de la 1 a la 5 y porcentaje que respondió 4 o 5.
          </p>
        </div>
      </div>

      {/* Distribución de este negocio */}
      <DistribucionNotas distribucion={a.distribucion_p1} />
    </>
  );
}

/* ── Cifra (tarjeta del panel: 1 px de borde, sin sombra) ─────────────────── */

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
    <div className="rounded-[8px] border border-border-subtle bg-surface-default p-4">
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

/* ── Fila etiqueta/valor compacta ─────────────────────────────────────────── */

function Valor({
  etiqueta,
  detalle,
  children,
}: {
  etiqueta: string;
  detalle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 font-ui text-[13px] text-text-secondary">
        {etiqueta} <span className="text-[12px]">({detalle})</span>
      </dt>
      <dd className="shrink-0 font-ui text-[16px] font-semibold tabular-nums text-text-primary">
        {children}
      </dd>
    </div>
  );
}

/* ── Atributo p3/p4: etiqueta de la API + media + porcentaje alto ─────────── */

function Atributo({
  etiqueta,
  media,
  topBox,
}: {
  etiqueta: string;
  media: number | null;
  topBox: number | null;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 font-ui text-[13px] text-text-secondary">
        {etiqueta}
      </dt>
      <dd className="shrink-0 font-ui text-[14px] font-semibold tabular-nums text-text-primary">
        {media === null ? "—" : formatearMedia(media)}
        {topBox !== null && (
          <span className="ml-2 font-normal text-text-secondary">
            · {formatear1(topBox)} % respondieron 4 o 5
          </span>
        )}
      </dd>
    </div>
  );
}

/* ── Distribución 0–10 (filas horizontales, tonos por rango) ──────────────── */

/** Tonos por rango de nota: 0-6 / 7-8 / 9-10. */
function tonoNota(nota: number): string {
  if (nota <= 6) return "#8A6F55";
  if (nota <= 8) return "color-mix(in srgb, #1A181B 20%, #8A6F55)";
  return "color-mix(in srgb, #1A181B 40%, #8A6F55)";
}

function DistribucionNotas({
  distribucion,
}: {
  distribucion: readonly { nota: number; cantidad: number }[];
}) {
  if (distribucion.length === 0) {
    return (
      <p className="mt-4 font-ui text-[14px] text-text-secondary">
        Sin distribución de notas.
      </p>
    );
  }
  const max = Math.max(...distribucion.map((d) => d.cantidad), 1);
  return (
    <div className="mt-4 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <h3 className="font-ui text-[14px] font-bold text-text-primary">
        Cómo se repartieron las notas
      </h3>
      <ul
        className="mt-3 flex flex-col gap-1.5"
        aria-label="Cantidad de respuestas por nota, de la 0 a la 10"
      >
        {distribucion.map((fila) => (
          <li key={fila.nota} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-right font-ui text-[13px] tabular-nums text-text-secondary">
              {fila.nota}
            </span>
            <div className="h-[18px] min-w-0 flex-1" aria-hidden="true">
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${(fila.cantidad / max) * 100}%`,
                  background: tonoNota(fila.nota),
                }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-ui text-[12px] tabular-nums text-text-secondary">
              {fila.cantidad}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
