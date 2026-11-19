"use client";

/**
 * Resumen del panel para el negocio de la sesión: una sola consulta al
 * servicio (`obtenerPanelEmpresa(empresaId)`) más los gráficos por día y
 * por momento del día.
 *
 * - Las cuatro cifras (respuestas, media, recomendación neta y alertas)
 *   son los números oficiales del `agregado` de esa empresa: no se
 *   recalculan ni se promedian con otros negocios. Con login por empresa
 *   ya no existe el resumen global agrupado ni la tabla de 4 negocios.
 * - Gráfico por día: la serie diaria propia del negocio (sin rellenar
 *   huecos con ceros inventados).
 * - Gráfico por momento: conteo en cliente de `bloque_horario`; los
 *   bloques con menos de 5 respuestas llevan la nota «muestra mínima».
 * - Estados honestos: si el servicio no se puede consultar, se muestra
 *   «No se pudo consultar el servicio.» SIN cifras.
 */
import { useEffect, useState } from "react";
import { obtenerPanelEmpresa, type PanelEmpresaDatos } from "@/lib/api/panel";
import { formatear1, formatearDiaMes, formatearMedia } from "@/lib/panel/calculos";
import {
  contarPorBloqueHorario,
  esMuestraMinima,
  type ConteoBloques,
  type PuntoDia,
} from "@/lib/panel/global";
import { ETIQUETA_SIMULADOS } from "@/lib/panel/etiqueta";

type EstadoResumen =
  | { fase: "cargando" }
  | { fase: "sin-servicio" }
  | {
      fase: "ok";
      panel: PanelEmpresaDatos;
      serie: readonly PuntoDia[];
      bloques: ConteoBloques;
    };

/** Serie del negocio como puntos del gráfico por día. */
function serieDelPanel(panel: PanelEmpresaDatos): PuntoDia[] {
  return panel.agregado.serie_diaria.map((punto) => ({
    fecha: punto.fecha,
    respuestas: punto.respuestas,
  }));
}

/** Distribución 0–10 reindexada desde `distribucion_p1` (defensiva). */
function distribucionDelPanel(panel: PanelEmpresaDatos): number[] {
  const dist = new Array<number>(11).fill(0);
  for (const fila of panel.agregado.distribucion_p1) {
    if (fila.nota >= 0 && fila.nota <= 10) dist[fila.nota] = fila.cantidad;
  }
  return dist;
}

export function ResumenEmpresa({ empresaId }: { empresaId: number }) {
  const [estado, setEstado] = useState<EstadoResumen>({ fase: "cargando" });

  useEffect(() => {
    const controller = new AbortController();
    let activo = true;

    (async () => {
      const resultado = await obtenerPanelEmpresa(empresaId, controller.signal);
      if (!activo) return;

      // Con sesión de una empresa concreta, cualquier fallo (404, 5xx,
      // red o payload ilegible) se reporta igual: sin cifras.
      if (resultado.estado !== "ok") {
        setEstado({ fase: "sin-servicio" });
        return;
      }

      setEstado({
        fase: "ok",
        panel: resultado.panel,
        serie: serieDelPanel(resultado.panel),
        bloques: contarPorBloqueHorario(resultado.panel.respuestas),
      });
    })();

    return () => {
      activo = false;
      controller.abort();
    };
  }, [empresaId]);

  return (
    <>
      <h1 className="font-display text-[32px] uppercase leading-none text-text-primary lg:text-[40px]">
        Resumen
      </h1>

      {/* Etiqueta obligatoria: origen de los datos, siempre visible. */}
      <p className="mt-2 font-ui text-[13px] text-text-secondary">{ETIQUETA_SIMULADOS}</p>

      {estado.fase === "cargando" && (
        <p role="status" className="mt-4 font-ui text-[14px] text-text-secondary">
          Consultando el servicio…
        </p>
      )}

      {estado.fase === "sin-servicio" && (
        <p role="status" className="mt-4 font-ui text-[14px] text-text-secondary">
          No se pudo consultar el servicio.
        </p>
      )}

      {estado.fase === "ok" && (
        <ResumenDatos
          panel={estado.panel}
          serie={estado.serie}
          bloques={estado.bloques}
        />
      )}
    </>
  );
}

// ── Datos del resumen (fase ok) ────────────────────────────────────────────

function ResumenDatos({
  panel,
  serie,
  bloques,
}: {
  panel: PanelEmpresaDatos;
  serie: readonly PuntoDia[];
  bloques: ConteoBloques;
}) {
  const a = panel.agregado;
  return (
    <>
      {/* Cuatro cifras del negocio (números oficiales del agregado) */}
      <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <Cifra
          label="Respuestas"
          value={String(a.respuestas)}
          detail="entre el 19 y el 31 de octubre"
        />
        <Cifra
          label="Media"
          value={a.media_p1 === null ? "—" : formatearMedia(a.media_p1)}
          detail="nota 1, de la 0 a la 10"
        />
        <Cifra
          label="Recomendación neta"
          value={a.nps === null ? "—" : formatear1(a.nps)}
          detail="va de -100 a 100"
        />
        <Cifra
          label="Requiere atención"
          value={String(a.alertas)}
          detail={a.alertas === 1 ? "respuesta por revisar" : "respuestas por revisar"}
        />
      </div>

      {/* Gráfico por día */}
      <section aria-labelledby="resumen-dia" className="mt-6 lg:mt-8">
        <TituloSeccion id="resumen-dia">Respuestas por día</TituloSeccion>
        <GraficoPorDia serie={serie} />
      </section>

      {/* Distribución + momento del día */}
      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 lg:flex-[2]">
          <TituloSeccion id="resumen-distribucion">
            Distribución de las notas
          </TituloSeccion>
          <DistribucionNotas distribucion={distribucionDelPanel(panel)} />
        </div>
        <div className="min-w-0 flex-1 lg:flex-[1]">
          <TituloSeccion id="resumen-momento">Por momento del día</TituloSeccion>
          <GraficoPorMomento bloques={bloques} />
        </div>
      </div>
    </>
  );
}

/* ── Título de sección con filete vertical (lenguaje del panel) ───────────── */

function TituloSeccion({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="flex items-center gap-[10px] font-ui text-[16px] font-bold text-text-primary lg:text-[18px]"
    >
      <span
        aria-hidden="true"
        className="inline-block h-[16px] w-[3px] shrink-0 rounded-[1px] bg-border-mid"
      />
      {children}
    </h2>
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

/* ── Barras: tono único del panel (sin resaltar rangos) ──────────────────── */

function tonoBarra(): string {
  return "#8A6F55";
}

/* ── Fila de barra: patrón único para los tres gráficos ─────────────────────
 * [etiqueta fija] [pista flexible] [valor fijo]. La etiqueta nunca se parte
 * (`whitespace-nowrap` + `tabular-nums`); la barra interior mide sobre el
 * máximo del conjunto (si el máximo es 0, todas quedan en 0, sin dividir
 * por cero); el valor comparte tamaño tipográfico con la etiqueta. La fila
 * mide 20 px en los tres gráficos, con bordes izquierdos alineados.
 */

function FilaBarra({
  ariaLabel,
  claseEtiqueta,
  conteo,
  etiqueta,
  max,
  nota,
}: {
  ariaLabel: string;
  /** Ancho y alineación de la etiqueta: `w-14 text-right`, el MISMO valor
   *  en los tres gráficos, para que las barras compartan el mismo origen
   *  izquierdo (la columna de etiqueta es fija; el contenido no la ensancha). */
  claseEtiqueta: string;
  conteo: number;
  etiqueta: string;
  max: number;
  /** Nota opcional DEBAJO de la fila (elemento aparte del conteo). */
  nota?: React.ReactNode;
}) {
  const ancho = max > 0 ? (conteo / max) * 100 : 0;
  return (
    <li aria-label={ariaLabel} className="flex flex-col">
      <div className="flex items-center gap-2">
        <span
          className={`shrink-0 whitespace-nowrap font-ui text-[13px] tabular-nums text-text-secondary ${claseEtiqueta}`}
        >
          {etiqueta}
        </span>
        <div className="h-[20px] min-w-0 flex-1" aria-hidden="true">
          <div
            className="h-full rounded-[2px]"
            style={{ width: `${ancho}%`, background: tonoBarra() }}
          />
        </div>
        <span className="min-w-[28px] shrink-0 text-right font-ui text-[13px] tabular-nums text-text-secondary sm:min-w-[36px]">
          {conteo}
        </span>
      </div>
      {nota}
    </li>
  );
}

/* ── Gráfico por día (filas horizontales, conteo visible) ─────────────────── */

function GraficoPorDia({ serie }: { serie: readonly PuntoDia[] }) {
  if (serie.length === 0) {
    return (
      <p className="mt-3 font-ui text-[14px] text-text-secondary">
        Sin respuestas por día.
      </p>
    );
  }
  const max = Math.max(...serie.map((p) => p.respuestas));
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-1.5"
        aria-label="Cantidad de respuestas por día, de la más antigua a la más reciente"
      >
        {serie.map((punto) => {
          const dia = formatearDiaMes(punto.fecha);
          return (
            <FilaBarra
              key={punto.fecha}
              ariaLabel={`${dia}: ${punto.respuestas} ${punto.respuestas === 1 ? "respuesta" : "respuestas"}`}
              claseEtiqueta="w-14 text-right"
              conteo={punto.respuestas}
              etiqueta={dia}
              max={max}
            />
          );
        })}
      </ul>
    </div>
  );
}

/* ── Distribución 0–10 (mismas filas; sin resaltar rangos) ────────────────── */

function DistribucionNotas({ distribucion }: { distribucion: readonly number[] }) {
  const max = Math.max(...distribucion);
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-1.5"
        aria-label="Cantidad de respuestas por nota, de la 0 a la 10"
      >
        {distribucion.map((count, nota) => (
          <FilaBarra
            key={nota}
            ariaLabel={`Nota ${nota}: ${count} ${count === 1 ? "respuesta" : "respuestas"}`}
            claseEtiqueta="w-14 text-right"
            conteo={count}
            etiqueta={String(nota)}
            max={max}
          />
        ))}
      </ul>
    </div>
  );
}

/* ── Gráfico por momento del día (3 barras + muestra mínima) ──────────────── */

function GraficoPorMomento({ bloques }: { bloques: ConteoBloques }) {
  const filas = [
    { etiqueta: "Mañana", rango: "de 6 a 11", conteo: bloques.manana },
    { etiqueta: "Tarde", rango: "de 12 a 19", conteo: bloques.tarde },
    { etiqueta: "Noche", rango: "de 20 a 5", conteo: bloques.noche },
  ];
  const max = Math.max(...filas.map((f) => f.conteo));
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-2.5"
        aria-label="Cantidad de respuestas por momento del día"
      >
        {filas.map((fila) => (
          <FilaBarra
            key={fila.etiqueta}
            ariaLabel={`${fila.etiqueta} (${fila.rango}): ${fila.conteo} ${fila.conteo === 1 ? "respuesta" : "respuestas"}`}
            claseEtiqueta="w-14 text-right"
            conteo={fila.conteo}
            etiqueta={fila.etiqueta}
            max={max}
            nota={
              esMuestraMinima(fila.conteo) ? (
                /* Nota debajo de la fila, en un elemento aparte del conteo:
                 * nunca se superpone al número. */
                <p className="mt-1 font-ui text-[12px] text-text-secondary">
                  <span className="inline-block rounded-[4px] border border-border-mid px-1.5 py-0.5 text-[11px]">
                    muestra mínima
                  </span>
                </p>
              ) : undefined
            }
          />
        ))}
      </ul>
      <p className="mt-4 font-ui text-[12px] text-text-secondary">
        Mañana de 6 a 11 · Tarde de 12 a 19 · Noche de 20 a 5. Los bloques
        con menos de 5 respuestas se marcan como muestra mínima.
      </p>
    </div>
  );
}
