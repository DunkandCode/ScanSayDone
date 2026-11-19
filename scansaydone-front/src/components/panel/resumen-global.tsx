"use client";

/**
 * Resumen global del panel: 4 consultas al servicio (una por negocio) con
 * `Promise.allSettled`, más los gráficos por día y por momento del día.
 *
 * - La lista de negocios sale de `listarEmpresas()` (sondeo de encuestas,
 *   cacheado 60 s); por cada id se consulta `obtenerPanelEmpresa`.
 * - Los totales se calculan DESDE LAS FILAS (`resumenGlobalDesdePaneles`):
 *   la recomendación neta general nunca es el promedio de las de cada
 *   negocio. La tabla usa los números oficiales de cada `agregado`.
 * - Gráfico por día: fusión de las series de los negocios consultados
 *   (13 días del 19 al 31 de octubre, sin rellenar huecos).
 * - Gráfico por momento: conteo en cliente de `bloque_horario`; los
 *   bloques con menos de 5 respuestas llevan la nota «muestra mínima».
 * - Estados honestos: si el servicio no se puede consultar, se muestra
 *   «No se pudo consultar el servicio.» SIN cifras. Si fallan algunos
 *   negocios (pero no todos), se muestran los que sí llegaron y una nota
 *   con la cantidad que falló.
 */
import { useEffect, useState } from "react";
import { obtenerPanelEmpresa, type PanelEmpresaDatos } from "@/lib/api/panel";
import { listarEmpresas } from "@/lib/api/empresas";
import { formatear1, formatearDiaMes, formatearMedia } from "@/lib/panel/calculos";
import {
  agregarSerieDiaria,
  contarPorBloqueHorario,
  esMuestraMinima,
  resumenGlobalDesdePaneles,
  type ConteoBloques,
  type FilaNegocioGlobal,
  type PuntoDia,
  type ResumenGlobal,
} from "@/lib/panel/global";
import { ETIQUETA_SIMULADOS } from "@/lib/panel/etiqueta";

type EstadoResumen =
  | { fase: "cargando" }
  | { fase: "sin-servicio" }
  | { fase: "sin-negocios" }
  | {
      fase: "ok";
      datos: ResumenGlobal;
      serie: readonly PuntoDia[];
      bloques: ConteoBloques;
      fallidos: number;
    };

export function ResumenGlobal() {
  const [estado, setEstado] = useState<EstadoResumen>({ fase: "cargando" });

  useEffect(() => {
    const controller = new AbortController();
    let activo = true;

    (async () => {
      const lista = await listarEmpresas();
      if (!activo) return;

      if (lista.estado !== "ok") {
        // vacio | no-disponible | error: sin lista no hay qué consultar.
        // La distinción la muestra el selector de las otras pestañas;
        // aquí basta el estado honesto sin cifras.
        setEstado({ fase: lista.estado === "vacio" ? "sin-negocios" : "sin-servicio" });
        return;
      }

      const ids = lista.empresas.map((e) => e.empresaId);
      const resultados = await Promise.allSettled(
        ids.map((id) => obtenerPanelEmpresa(id, controller.signal)),
      );
      if (!activo) return;

      const paneles: PanelEmpresaDatos[] = [];
      let fallidos = 0;
      for (const resultado of resultados) {
        if (resultado.status === "fulfilled" && resultado.value.estado === "ok") {
          paneles.push(resultado.value.panel);
        } else {
          fallidos += 1;
        }
      }

      if (paneles.length === 0) {
        setEstado({ fase: "sin-servicio" });
        return;
      }

      const filas = paneles.flatMap((p) => p.respuestas);
      setEstado({
        fase: "ok",
        datos: resumenGlobalDesdePaneles(paneles),
        serie: agregarSerieDiaria(paneles.map((p) => p.agregado.serie_diaria)),
        bloques: contarPorBloqueHorario(filas),
        fallidos,
      });
    })();

    return () => {
      activo = false;
      controller.abort();
    };
    // Solo al montar: los negocios del servicio no cambian sin recargar.
  }, []);

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

      {estado.fase === "sin-negocios" && (
        <p role="status" className="mt-4 font-ui text-[14px] text-text-secondary">
          El servicio responde, pero no hay negocios cargados.
        </p>
      )}

      {estado.fase === "ok" && (
        <ResumenDatos
          datos={estado.datos}
          serie={estado.serie}
          bloques={estado.bloques}
          fallidos={estado.fallidos}
        />
      )}
    </>
  );
}

// ── Datos del resumen (fase ok) ────────────────────────────────────────────

function ResumenDatos({
  datos,
  serie,
  bloques,
  fallidos,
}: {
  datos: ResumenGlobal;
  serie: readonly PuntoDia[];
  bloques: ConteoBloques;
  fallidos: number;
}) {
  return (
    <>
      {/* Cuatro cifras generales */}
      <div className="mt-4 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <Cifra
          label="Respuestas"
          value={String(datos.totalRespuestas)}
          detail="entre el 19 y el 31 de octubre"
        />
        <Cifra
          label="Media general"
          value={
            datos.mediaGeneral === null ? "—" : formatearMedia(datos.mediaGeneral)
          }
          detail="nota 1, de la 0 a la 10"
        />
        <Cifra
          label="Negocios"
          value={String(datos.filas.length)}
          detail="consultados en el servicio"
        />
        <Cifra
          label="Recomendación neta general"
          value={
            datos.recomendacionNetaGeneral === null
              ? "—"
              : formatear1(datos.recomendacionNetaGeneral)
          }
          detail="va de -100 a 100"
        />
      </div>

      {/* Gráfico por día: conteo diario fusionado */}
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
          <DistribucionNotas distribucion={datos.distribucion} />
        </div>
        <div className="min-w-0 flex-1 lg:flex-[1]">
          <TituloSeccion id="resumen-momento">
            Respuestas por momento del día
          </TituloSeccion>
          <GraficoPorMomento bloques={bloques} />
        </div>
      </div>

      {/* Tabla por negocio (orden fijo por id, sin ordenamiento) */}
      <section aria-labelledby="resumen-tabla" className="mt-6 lg:mt-8">
        <TituloSeccion id="resumen-tabla">Resumen por negocio</TituloSeccion>
        <TablaNegocios filas={datos.filas} />
        {fallidos > 0 && (
          <p role="status" className="mt-3 font-ui text-[13px] text-text-secondary">
            No se pudo consultar {fallidos} {fallidos === 1 ? "negocio" : "negocios"}.
          </p>
        )}
      </section>
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

/* ── Barras: tonos por rango (mismos que el resto del panel) ──────────────── */

function tonoBarra(): string {
  return "#8A6F55";
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
  const max = Math.max(...serie.map((p) => p.respuestas), 1);
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-1.5"
        aria-label="Cantidad de respuestas por día, de la más antigua a la más reciente"
      >
        {serie.map((punto) => {
          const dia = formatearDiaMes(punto.fecha);
          return (
            <li
              key={punto.fecha}
              aria-label={`${dia}: ${punto.respuestas} ${punto.respuestas === 1 ? "respuesta" : "respuestas"}`}
              className="flex items-center gap-3"
            >
              <span className="w-10 shrink-0 text-right font-ui text-[13px] tabular-nums text-text-secondary">
                {dia}
              </span>
              <div className="h-[18px] min-w-0 flex-1" aria-hidden="true">
                <div
                  className="h-full rounded-[2px]"
                  style={{
                    width: `${(punto.respuestas / max) * 100}%`,
                    background: tonoBarra(),
                  }}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-ui text-[12px] tabular-nums text-text-secondary">
                {punto.respuestas}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Distribución 0–10 (filas horizontales, tonos por rango) ──────────────── */

function tonoNota(nota: number): string {
  if (nota <= 6) return "#8A6F55";
  if (nota <= 8) return "color-mix(in srgb, #1A181B 20%, #8A6F55)";
  return "color-mix(in srgb, #1A181B 40%, #8A6F55)";
}

function DistribucionNotas({ distribucion }: { distribucion: readonly number[] }) {
  const max = Math.max(...distribucion, 1);
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-1.5"
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

/* ── Gráfico por momento del día (3 barras + muestra mínima) ──────────────── */

function GraficoPorMomento({ bloques }: { bloques: ConteoBloques }) {
  const filas = [
    { etiqueta: "Mañana", rango: "de 6 a 11", conteo: bloques.manana },
    { etiqueta: "Tarde", rango: "de 12 a 19", conteo: bloques.tarde },
    { etiqueta: "Noche", rango: "de 20 a 5", conteo: bloques.noche },
  ];
  const max = Math.max(...filas.map((f) => f.conteo), 1);
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-4 xs:p-5">
      <ul
        className="flex flex-col gap-2.5"
        aria-label="Cantidad de respuestas por momento del día"
      >
        {filas.map((fila) => (
          <li
            key={fila.etiqueta}
            aria-label={`${fila.etiqueta} (${fila.rango}): ${fila.conteo} ${fila.conteo === 1 ? "respuesta" : "respuestas"}`}
            className="flex items-center gap-3"
          >
            <span className="w-14 shrink-0 font-ui text-[13px] font-semibold text-text-primary">
              {fila.etiqueta}
            </span>
            <div className="h-[18px] min-w-0 flex-1" aria-hidden="true">
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${(fila.conteo / max) * 100}%`,
                  background: tonoBarra(),
                }}
              />
            </div>
            <span className="shrink-0 font-ui text-[12px] tabular-nums text-text-secondary">
              {fila.conteo}
              {esMuestraMinima(fila.conteo) && (
                <span className="ml-2 rounded-[4px] border border-border-mid px-1.5 py-0.5 text-[11px]">
                  muestra mínima
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-ui text-[12px] text-text-secondary">
        Mañana de 6 a 11 · Tarde de 12 a 19 · Noche de 20 a 5. Los bloques
        con menos de 5 respuestas se marcan como muestra mínima.
      </p>
    </div>
  );
}

/* ── Tabla por negocio: apilada en móvil (375), tabla real desde md ───────── */

function TablaNegocios({
  filas,
}: {
  filas: readonly FilaNegocioGlobal[];
}) {
  return (
    <div className="mt-3 rounded-[8px] border border-border-subtle bg-surface-default p-2 md:p-4">
      <table className="w-full border-collapse font-ui text-[14px] text-text-primary">
        <caption className="sr-only">
          Resumen por negocio: respuestas, media, promotores, detractores y
          recomendación neta
        </caption>
        <thead className="hidden md:table-header-group">
          <tr className="text-left">
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-[13px] font-semibold text-text-secondary"
            >
              Empresa
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-[13px] font-semibold text-text-secondary"
            >
              Rubro
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Respuestas
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Media
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Promotores
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Detractores
            </th>
            <th
              scope="col"
              className="border-b border-border-mid px-3 py-2 text-right text-[13px] font-semibold text-text-secondary"
            >
              Recomendación neta
            </th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr
              key={fila.empresaId}
              className="block border-b border-border-subtle last:border-b-0 md:table-row md:border-b"
            >
              <th
                scope="row"
                className="block px-3 pb-1 pt-3 text-left font-semibold text-text-primary md:table-cell md:px-3 md:py-2 md:font-medium"
              >
                {fila.nombre}
              </th>
              <Celda etiqueta="Rubro">{fila.rubro}</Celda>
              <Celda etiqueta="Respuestas" numerica>
                {String(fila.respuestas)}
              </Celda>
              <Celda etiqueta="Media" numerica>
                {fila.mediaP1 === null ? "—" : formatearMedia(fila.mediaP1)}
              </Celda>
              <Celda etiqueta="Promotores" numerica>
                {String(fila.promotores)}
              </Celda>
              <Celda etiqueta="Detractores" numerica>
                {String(fila.detractores)}
              </Celda>
              <Celda etiqueta="Recomendación neta" numerica>
                {fila.recomendacionNeta === null
                  ? "—"
                  : formatear1(fila.recomendacionNeta)}
              </Celda>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Celda({
  etiqueta,
  numerica = false,
  children,
}: {
  etiqueta: string;
  numerica?: boolean;
  children: React.ReactNode;
}) {
  return (
    <td
      className={`block px-3 pb-1 pt-0.5 text-text-primary md:table-cell md:px-3 md:py-2 ${
        numerica ? "tabular-nums md:text-right" : ""
      }`}
    >
      {/* En móvil cada celda se apila con su etiqueta visible. */}
      <span className="mr-2 text-text-secondary md:hidden">{etiqueta}:</span>
      {children}
    </td>
  );
}
